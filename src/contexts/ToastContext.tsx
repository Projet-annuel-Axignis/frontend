import Snackbar, { SnackbarProps } from '@mui/joy/Snackbar';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface ToastContextType {
  showToast: (message: string, color?: SnackbarProps['color']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState<SnackbarProps['color']>('neutral');

  const showToast = useCallback((message: string, severity: SnackbarProps['color'] = 'success') => {
    setMessage(message);
    setColor(severity);
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        autoHideDuration={6000}
        open={open}
        variant="soft"
        color={color}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
        }}
      >
        {message}
      </Snackbar>
    </ToastContext.Provider>
  );
}; 