import type { HTMLAttributes } from 'react';
import { TableLevelContext } from './TableLevelContext';

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <TableLevelContext.Provider value={{ variant: 'head' }}>
            <thead
                {...props}
                style={{
                    display: 'table-header-group',
                    ...props.style,
                }}
            />
        </TableLevelContext.Provider>
    );
}