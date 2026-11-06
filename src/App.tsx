/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { InstallBanner } from './components/InstallBanner';
import { TimelineTab } from './components/TimelineTab';
import { CalendarTab } from './components/CalendarTab';
import { MedicationsTab } from './components/MedicationsTab';
import { DocumentsTab } from './components/DocumentsTab';
import { GuidaTab } from './components/GuidaTab';
import { MealsTab } from './components/MealsTab';

const MainContent: React.FC = () => {
  const { profile, currentView, activeTab } = useApp();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'login') {
    return <Login />;
  }

  if (!profile || !profile.isOnboarded) {
    return <Login />;
  }

  return (
    <div className="w-full min-h-screen bg-[#E8F0FE] flex flex-col relative overflow-x-hidden">
      <InstallBanner />
      <Sidebar />

      {/* Main Content Area (with left margin on desktop to accommodate fixed sidebar) */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen pb-24 md:pb-8">
        <main className="flex-1 w-full">
          {activeTab === 'timeline' && <TimelineTab />}
          {activeTab === 'calendario' && <CalendarTab />}
          {activeTab === 'farmaci' && <MedicationsTab />}
          {activeTab === 'pasti' && <MealsTab />}
          {activeTab === 'documenti' && <DocumentsTab />}
          {activeTab === 'guida' && <GuidaTab />}
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile only) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="w-full min-h-screen bg-[#E8F0FE] flex flex-col relative font-sans">
        <ToastContainer />
        <MainContent />
      </div>
    </AppProvider>
  );
}
