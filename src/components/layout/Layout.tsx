import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-background overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                <Sidebar expanded={true} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-card border-b border-border shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            💰
                        </div>
                        <span className="font-semibold text-lg tracking-tight">FinDash</span>
                    </div>
                    <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        {/* Hamburger Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-background p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation could go here */}
            </div>
        </div>
    );
}
