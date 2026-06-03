import type {
    TdHTMLAttributes,
    ThHTMLAttributes,
    CSSProperties,
} from 'react';
import { useContext } from 'react';
import { TableContext } from './TableContext';
import { TableLevelContext } from './TableLevelContext';

type TableCellAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';

type Props = Omit<
    TdHTMLAttributes<HTMLTableCellElement> &
    ThHTMLAttributes<HTMLTableCellElement>,
    'align'
> & {
    component?: 'td' | 'th';
    align?: TableCellAlign;
    padding?: 'normal' | 'checkbox' | 'none';
    size?: 'small' | 'medium';
    variant?: 'head' | 'body' | 'footer';
};

export function TableCell({
    component,
    align = 'inherit',
    padding,
    size,
    variant,
    style,
    ...props
}: Props) {
    const table = useContext(TableContext);
    const level = useContext(TableLevelContext);

    const cellVariant = variant ?? level.variant ?? 'body';
    const Component = component ?? (cellVariant === 'head' ? 'th' : 'td');

    const finalPadding = padding ?? table.padding ?? 'normal';
    const finalSize = size ?? table.size ?? 'medium';

    const textAlign: CSSProperties['textAlign'] =
        align === 'inherit' ? undefined : align;

    return (
        <Component
            {...props}
            style={{
                display: 'table-cell',
                verticalAlign: 'inherit',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                textAlign,
                padding:
                    finalPadding === 'none'
                        ? 0
                        : finalPadding === 'checkbox'
                            ? '0 0 0 4px'
                            : finalSize === 'small'
                                ? '6px 16px'
                                : '16px',
                fontSize: '14px',
                lineHeight: finalSize === 'small' ? 1.43 : 1.5,
                fontWeight: cellVariant === 'head' ? 500 : 400,
                color: 'rgba(0, 0, 0, 0.87)',
                position:
                    table.stickyHeader && cellVariant === 'head' ? 'sticky' : undefined,
                top: table.stickyHeader && cellVariant === 'head' ? 0 : undefined,
                zIndex: table.stickyHeader && cellVariant === 'head' ? 2 : undefined,
                backgroundColor:
                    table.stickyHeader && cellVariant === 'head' ? '#fff' : undefined,
                ...style,
            }}
        />
    );
}