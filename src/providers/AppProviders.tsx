import React, { ReactNode } from 'react';
import { CartProvider } from '../context/CartContext';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};

export default AppProviders; 