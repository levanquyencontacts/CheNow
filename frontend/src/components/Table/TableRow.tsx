import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLTableRowElement> & {
    hover?: boolean;
    selected?: boolean;
};

export function TableRow({ hover, selected, style, ...props }: Props) {
    return (
        <tr
            {...props}
            style={{
                display: 'table-row',
                backgroundColor: selected ? 'rgba(25, 118, 210, 0.08)' : undefined,
                cursor: hover ? 'pointer' : undefined,
                ...style,
            }}
            onMouseEnter={(e) => {
                if (hover && !selected) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                }
                props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                if (hover && !selected) {
                    e.currentTarget.style.backgroundColor = '';
                }
                props.onMouseLeave?.(e);
            }}
        />
    );
}