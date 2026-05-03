import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import GoldCursor from '../cursor/GoldCursor';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <GoldCursor />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}