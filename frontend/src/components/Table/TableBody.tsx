import type { HTMLAttributes } from 'react';
import { TableLevelContext } from './TableLevelContext';

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <TableLevelContext.Provider value={{ variant: 'body' }}>
            <tbody
                {...props}
                style={{
                    display: 'table-row-group',
                    ...props.style,
                }}
            />
        </TableLevelContext.Provider>
    );
}