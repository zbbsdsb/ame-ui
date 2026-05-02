import React from 'react';
import { Separator as PanelResizeHandle } from 'react-resizable-panels';

interface ResizeHandleProps {
  direction?: 'vertical' | 'horizontal';
}

export const ResizeHandle = ({ direction = 'vertical' }: ResizeHandleProps) => (
  <PanelResizeHandle className={`
    ${direction === 'horizontal' ? 'w-[1px] h-full' : 'h-[1px] w-full'} 
    bg-ame-border hover:bg-ame-accent transition-colors duration-150 relative z-50
  `} />
);
