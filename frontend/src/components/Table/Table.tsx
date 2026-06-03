import type { TableHTMLAttributes } from 'react';
import { useMemo } from 'react';
import { TableContext } from './TableContext';

type Props = TableHTMLAttributes<HTMLTableElement> & {
    padding?: 'normal' | 'checkbox' | 'none';
    size?: 'small' | 'medium';
    stickyHeader?: boolean;
};

export function Table({
    padding = 'normal',
    size = 'medium',
    stickyHeader = false,
    style,
    ...props
}: Props) {
    const contextValue = useMemo(
        () => ({ padding, size, stickyHeader }),
        [padding, size, stickyHeader]
    );

    return (
        <TableContext.Provider value={contextValue}>
            <table
                {...props}
                style={{
                    display: 'table',
                    width: '100%',
                    borderCollapse: stickyHeader ? 'separate' : 'collapse',
                    borderSpacing: 0,
                    ...style,
                }}
            />
        </TableContext.Provider>
    );
}