import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/ToastContainer';
import { TransactionModal } from '../modals/TransactionModal';
import { PWAInstallBanner } from '../common/PWAInstallBanner';

export const Layout: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-8">
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet context={{ openAddModal: () => setIsAddModalOpen(true) }} />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Mobile PWA Install Floating Banner & Guide Modal */}
      <PWAInstallBanner />

      {/* Global Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
