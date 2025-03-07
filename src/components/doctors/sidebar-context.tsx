'use client';

import React, { createContext, useState, useContext } from 'react';
import {SidebarContextType, SidebarProviderProps} from "@/types/types";

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar(): SidebarContextType {
    const context = useContext(SidebarContext);

    if (context === null) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }

    return context;
}