'use client';

import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import CartDrawer from '../CartDrawer';

export interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="atarax-client-layout">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="atarax-main-content">
        {children}
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ClientLayout;
