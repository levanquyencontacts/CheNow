"use client"
import { createContext } from 'react';

export type TableLevelContextValue = {
    variant?: 'head' | 'body' | 'footer';
};

export const TableLevelContext = createContext<TableLevelContextValue>({});