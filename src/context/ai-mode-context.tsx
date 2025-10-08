"use client";

import React, { createContext, useContext, useState } from "react";

type Mode = "chat" | "agentic";

interface AiModeContextValue {
  selectedMode: Mode;
  setSelectedMode: (m: Mode) => void;
}

const AiModeContext = createContext<AiModeContextValue | undefined>(undefined);

export const AiModeProvider = ({ children, initialMode = "chat",}: 
{
  children: React.ReactNode;
  initialMode?: Mode;
}) => {
  const getInitialMode = (): Mode => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('aiMode');
        if (stored === 'chat' || stored === 'agentic') return stored;
      }
    } catch (e) {
      // ignore
    }
    return initialMode;
  };

  const [selectedMode, _setSelectedMode] = useState<Mode>(getInitialMode);

  const setSelectedMode = (m: Mode) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aiMode', m);
      }
    } catch (e) {
      // ignore storage errors
    }
    _setSelectedMode(m);
  };

  return (
    <AiModeContext.Provider value={{ selectedMode, setSelectedMode }}>
      {children}
    </AiModeContext.Provider>
  );
};

export const useAiMode = () => {
  const ctx = useContext(AiModeContext);
  if (!ctx) {
    throw new Error("useAiMode must be used within AiModeProvider");
  }
  return ctx;
};

export default AiModeContext;
