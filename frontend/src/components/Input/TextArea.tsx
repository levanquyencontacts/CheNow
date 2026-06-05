'use client';

import React, {
    forwardRef,
    useEffect,
    useRef,
    useImperativeHandle,
} from 'react';

type TextareaAutosizeProps =
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        minRows?: number;
        maxRows?: number;
    };

const TextArea = forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
    (
        {
            minRows = 1,
            maxRows,
            value,
            onChange,
            style,
            ...props
        },
        ref
    ) => {
        const textareaRef = useRef<HTMLTextAreaElement | null>(null);

        useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

        const resizeTextarea = () => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            textarea.style.height = 'auto';

            const computedStyle = window.getComputedStyle(textarea);
            const lineHeight = parseFloat(computedStyle.lineHeight) || 20;

            const minHeight = minRows * lineHeight;
            const maxHeight = maxRows ? maxRows * lineHeight : Infinity;

            const newHeight = Math.min(
                Math.max(textarea.scrollHeight, minHeight),
                maxHeight
            );

            textarea.style.height = `${newHeight}px`;
            textarea.style.overflowY =
                textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
        };

        useEffect(() => {
            resizeTextarea();
        }, [value, minRows, maxRows]);

        useEffect(() => {
            window.addEventListener('resize', resizeTextarea);

            return () => {
                window.removeEventListener('resize', resizeTextarea);
            };
        }, []);

        const handleChange = (
            event: React.ChangeEvent<HTMLTextAreaElement>
        ) => {
            resizeTextarea();
            onChange?.(event);
        };

        return (
            <textarea
                {...props}
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                rows={minRows}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                    ...style,
                }}
            />
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;