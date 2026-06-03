import type { HTMLAttributes } from 'react';

export function TableContainer(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            style={{
                width: '100%',
                overflowX: 'auto',
                ...props.style,
            }}
        />
    );
}