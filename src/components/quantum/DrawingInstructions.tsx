import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface DrawingInstructionsProps {
  isRunning: boolean;
  resonanceLevel: number;
  thumbsPlaced: { left: boolean; right: boolean };
  language: string;
}

const DrawingInstructions = ({ isRunning, resonanceLevel, thumbsPlaced, language }: DrawingInstructionsProps) => {
  const getInstructionText = () => {
    if (!thumbsPlaced.left || !thumbsPlaced.right) {
      return language === 'en' 
        ? "Place both thumbs on the quantum sensors below"
        : "Coloca ambos pulgares en los sensores cuánticos de abajo";
    }
    if (resonanceLevel < 0.3) {
      return language === 'en'
        ? "Focus your intention on the selected timeline position..."
        : "Concentra tu intención en la posición seleccionada de la línea temporal...";
    }
    if (resonanceLevel < 0.6) {
      return language === 'en'
        ? "Feel the quantum frequencies aligning..."
        : "Siente las frecuencias cuánticas alineándose...";
    }
    if (resonanceLevel < 0.9) {
      return language === 'en'
        ? "Your card is materializing..."
        : "Tu carta se está materializando...";
    }
    return language === 'en' ? "Reading complete!" : "¡Lectura completa!";
  };

  return (
    <AnimatePresence>
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "text-center py-4 px-6 rounded-lg",
            "bg-black/40 backdrop-blur-sm",
            "border border-purple-500/20",
            "shadow-lg shadow-purple-500/10"
          )}
        >
          <motion.p
            key={getInstructionText()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-lg text-purple-100"
          >
            {getInstructionText()}
          </motion.p>
          {isRunning && resonanceLevel > 0 && resonanceLevel < 1 && (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mt-4 text-sm text-purple-300"
            >
              {language === 'en' ? "Resonance Level" : "Nivel de Resonancia"}: {Math.round(resonanceLevel * 100)}%
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrawingInstructions;