import React from 'react';
import { cn } from "@/lib/utils";

interface ThumbprintAreaProps {
  side: 'left' | 'right';
  isPlaced: boolean;
  onToggle: () => void;
}

const ThumbprintArea = ({ side, isPlaced, onToggle }: ThumbprintAreaProps) => {
  return (
    <div 
      onClick={onToggle}
      className={cn(
        "absolute bottom-5 cursor-pointer transition-all duration-300",
        side === 'left' ? "left-[60px]" : "right-[60px]"
      )}
    >
      <div className={cn(
        "relative w-16 h-16 rounded-full",
        "bg-purple-900/80 transition-all duration-500",
        "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
        isPlaced ? "opacity-100 scale-105" : "opacity-50 scale-100"
      )}>
        <div className={cn(
          "absolute inset-0 rounded-full",
          "border border-purple-400/30",
          "animate-pulse"
        )} />
        
        <div className={cn(
          "absolute -top-8 left-1/2 -translate-x-1/2",
          "whitespace-nowrap text-sm text-purple-200/80",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}>
          Optional: Place {side} thumb here
        </div>
      </div>
    </div>
  );
};

export default ThumbprintArea;