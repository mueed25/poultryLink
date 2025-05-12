import React, { createContext, useContext, useState, useCallback } from 'react';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
  message: string | null;
  type: SnackbarType | null;
  visible: boolean;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<SnackbarType | null>(null);
  const [visible, setVisible] = useState(false);

  const showSnackbar = useCallback((message: string, type: SnackbarType = 'info') => {
    setMessage(message);
    setType(type);
    setVisible(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 300);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar, message, type, visible }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}; 