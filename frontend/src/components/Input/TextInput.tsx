'use client';
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEventHandler,
  type Ref,
  useCallback,
  useRef,
} from "react";
import { Lock } from "lucide-react";
import { Key, Override } from "@/common/shared";
import { clsx } from "../utils";

type InputProps<T> = {
  "aria-labelledby"?: string;
  id?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: T;
};

export type { InputProps };

type TextInputProps = Override<
  Override<InputHTMLAttributes<HTMLInputElement>, InputProps<string>>,
  (
    | {
        readOnly: true;
      }
    | {
        readOnly?: boolean;
      }
  ) & {
    characterLeftLabel?: string;
    invalid?: boolean;
    onSubmit?: () => void;
    placeholder?: string;
    value?: string;
  }
>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      characterLeftLabel,
      className,
      invalid = false,
      onChange,
      onKeyDown,
      onSubmit,
      readOnly = false,
      ...rest
    }: TextInputProps,
    forwardedRef: Ref<HTMLInputElement>,
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const inputRef = forwardedRef ?? internalRef;

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (!readOnly) {
          onChange?.(event);
        }
      },
      [onChange, readOnly],
    );

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      onKeyDown?.(event);

      if (!event.defaultPrevented && event.key === Key.Enter && !readOnly) {
        onSubmit?.();
      }
    };

    return (
      <div className="relative flex w-full flex-col">
        <input
          aria-invalid={invalid}
          className={clsx(
            "h-9 w-full rounded-lg border bg-white px-3 text-sm leading-5 text-[#314032] outline-none transition placeholder:text-[#8e8579]",
            readOnly
              ? "cursor-not-allowed overflow-hidden text-ellipsis bg-[#f3e8de] pr-9"
              : "cursor-auto pr-3",
            invalid
              ? "border-red-700 focus:border-red-700 focus:ring-2 focus:ring-red-500/20"
              : "border-[#d8c8bd] hover:border-[#805533] focus:border-[#143d2a] focus:ring-2 focus:ring-[#805533]/20",
            className,
          )}
          disabled={readOnly}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          ref={inputRef}
          title={rest.value}
          type="text"
          {...rest}
        />
        {readOnly ? (
          <Lock
            aria-hidden="true"
            className="absolute right-3 top-2.5 h-4 w-4 text-[#8e8579]"
          />
        ) : null}
        {characterLeftLabel ? (
          <div className="mt-1 self-end text-xs text-[#8e8579]">
            {characterLeftLabel}
          </div>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export { TextInput };
export type { TextInputProps };
