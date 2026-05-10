import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, BrainCircuit, X, MessageSquare, Terminal } from 'lucide-react';
import { useEngineStore } from '../store/useEngineStore';
import { GoogleGenAI, Type } from "@google/genai";
import { nanoid } from 'nanoid';

export const AICopilot = () => {
  const { 
    aiChatHistory, 
    addAiMessage, 
    isAiLoading, 
    setAiLoading,
    workflowNodes,
    addWorkflowNode,
    aiModel,
    setAiModel
  } = useEngineStore();

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiChatHistory]);

  const handleSend = async () => {
    if (!input.trim() || isAiLoading) return;

    const userMsg = { role: 'user' as const, parts: [{ text: input }] };
    addAiMessage(userMsg);
    setInput('');
    setAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const nodeDeclaration = {
        name: "create_node",
        description: "Creates a logic or utility node in the workflow studio canvas.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Technical type code (e.g. MATH_ADD, LOGIC_IF)" },
            name: { type: Type.STRING, description: "Display name of the node" },
            category: { type: Type.STRING, enum: ["LOGIC", "MATH", "ACTION", "SENSOR", "OUTPUT", "AI"] },
            inputs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dataType: { type: Type.STRING, enum: ["SIGNAL", "DATA", "SENSOR", "STREAM"] }
                }
              }
            },
            outputs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dataType: { type: Type.STRING, enum: ["SIGNAL", "DATA", "SENSOR", "STREAM"] }
                }
              }
            },
            data: { type: Type.OBJECT, description: "Configuration parameters for the node" }
          },
          required: ["type", "name", "category", "inputs", "outputs"]
        }
      };

      const response = await ai.models.generateContent({
        model: aiModel === 'gemini-3-flash' ? 'gemini-3-flash-preview' : (aiModel === 'gemini-2.0-pro' ? 'gemini-2.0-pro-exp-02-05' : 'gemini-1.5-flash'),
        contents: [...aiChatHistory, userMsg],
        config: {
          systemInstruction: `You are AMAR Engine Copilot, an expert in procedural workflow design. 
          Current Canvas State: ${workflowNodes.length} nodes exist.
          You can create nodes to help users build automation logic.
          When creating nodes, ensure names are descriptive.`,
          tools: [{ functionDeclarations: [nodeDeclaration] }]
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'create_node') {
            const args: any = call.args;
            addWorkflowNode({
              type: args.type,
              category: args.category as any,
              name: args.name,
              position: { x: 400, y: 300 },
              inputs: args.inputs.map((i: any) => ({ ...i, id: nanoid(), type: 'IN' })),
              outputs: args.outputs.map((o: any) => ({ ...o, id: nanoid(), type: 'OUT' })),
              data: args.data || {}
            });
            addAiMessage({ role: 'model', parts: [{ text: `I've added the **${args.name}** node to your workflow.` }] });
          }
        }
      } else if (response.text) {
        addAiMessage({ role: 'model', parts: [{ text: response.text }] });
      }

    } catch (error) {
      console.error("Gemini Error:", error);
      addAiMessage({ role: 'model', parts: [{ text: "System overload. Failed to process logic request." }] });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ame-bg">
      <div className="px-4 py-2 border-b border-ame-border/30 bg-ame-panel-bg/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-3 h-3 text-ame-accent" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-ame-muted">Core_Neural_Link</span>
        </div>
        <select 
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value as any)}
          className="bg-transparent text-[8px] font-mono text-ame-accent outline-none uppercase cursor-pointer border-l border-ame-border pl-2"
        >
          <option value="gemini-3-flash" className="bg-ame-bg">3-Flash</option>
          <option value="gemini-2.0-pro" className="bg-ame-bg">2.0-Pro</option>
          <option value="gemini-1.5-flash" className="bg-ame-bg">1.5-Flash</option>
        </select>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
      >
        {aiChatHistory.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`
              max-w-[90%] p-3 rounded-sm text-[11px] leading-relaxed font-mono
              ${msg.role === 'user' 
                ? 'bg-ame-accent/10 border border-ame-accent/30 text-ame-accent' 
                : 'bg-ame-panel-bg border border-ame-border text-ame-muted'}
            `}>
              {msg.parts[0].text}
            </div>
            <span className="text-[8px] mt-1 text-ame-muted/50 uppercase font-bold tracking-tighter">
              {msg.role === 'user' ? 'Engineer' : 'AME_SYSTEM_CORE'}
            </span>
          </motion.div>
        ))}
        {isAiLoading && (
          <div className="flex items-center gap-2 text-ame-muted">
            <div className="w-1 h-1 rounded-full bg-ame-accent animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 rounded-full bg-ame-accent animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 rounded-full bg-ame-accent animate-bounce" />
            <span className="text-[9px] font-mono italic">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-ame-border bg-ame-panel-bg/20">
        <div className="flex flex-wrap gap-2 mb-3">
          {['Add safety logic', 'Check connectivity', 'Filter sensor noise'].map(cmd => (
            <button 
              key={cmd}
              onClick={() => setInput(cmd)}
              className="text-[8px] font-mono border border-ame-border px-1.5 py-0.5 text-ame-muted hover:border-ame-accent hover:text-ame-accent transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type command (e.g. 'Add a logic node for collision checking')..."
            className="w-full bg-ame-bg border border-ame-border p-3 pr-10 text-[10px] font-mono text-ame-text 
              outline-none focus:border-ame-accent focus:shadow-[0_0_15px_rgba(167,243,208,0.05)]
              resize-none min-h-[60px] max-h-[120px] transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isAiLoading || !input.trim()}
            className="absolute right-2 bottom-3 p-1.5 text-ame-muted hover:text-ame-accent disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[8px] text-ame-muted/60 font-mono uppercase tracking-tighter">
          <span>Model: Gemini 3 Flash</span>
          <span>Context: 128K</span>
        </div>
      </div>
    </div>
  );
};
