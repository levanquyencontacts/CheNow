"use client"
import { createContext } from 'react';

export type TableContextValue = {
    padding?: 'normal' | 'checkbox' | 'none';
    size?: 'small' | 'medium';
    stickyHeader?: boolean;
};

export const TableContext = createContext<TableContextValue>({});