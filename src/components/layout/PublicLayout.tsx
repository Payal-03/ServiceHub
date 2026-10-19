import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from '../navbar/TopNavbar';
import { PublicFooter } from './PublicFooter';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <TopNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
