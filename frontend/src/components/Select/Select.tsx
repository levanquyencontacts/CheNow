import { ChevronDown } from "lucide-react";
import * as React from "react";
import { clsx } from "../utils";

type SelectOptionItem = {
  disabled: boolean;
  label: React.ReactNode;
  option: React.ReactElement<SelectOptionProps>;
  value: string;
};

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
  placeholder?: string;
  variant?: "standard" | "outlined" | "plain";
}

export interface SelectOptionProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "value"> {
  disabled?: boolean;
  value: string;
}

type SelectComponent = React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<HTMLSelectElement>
> & {
  Option: React.FC<SelectOptionProps>;
};

const SelectOption = ({
  children,
  disabled,
  value,
  ...props
}: SelectOptionProps) => {
  void disabled;
  void value;

  return <span {...props}>{children}</span>;
};

SelectOption.displayName = "Select.Option";

const getOptions = (
  children: React.ReactNode,
  placeholder?: string
): SelectOptionItem[] => {
  const options: SelectOptionItem[] = [];

  if (placeholder) {
    options.push({
      disabled: true,
      label: placeholder,
      option: (
        <SelectOption disabled value="">
          {placeholder}
        </SelectOption>
      ),
      value: "",
    });
  }

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<SelectOptionProps>(child)) {
      return;
    }

    options.push({
      disabled: Boolean(child.props.disabled),
      label: child.props.children,
      option: child,
      value: String(child.props.value),
    });
  });

  return options;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      children,
      className,
      error = false,
      fullWidth = false,
      helperText,
      id,
      label,
      placeholder,
      style,
      variant = "outlined",
      ...props
    },
    ref
  ) => {
    const { defaultValue, disabled, name, onChange, value, ...selectProps } =
      props;
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const listboxId = `${selectId}-listbox`;
    const isPlain = variant === "plain";
    const isControlled = value !== undefined;
    const rootRef = React.useRef<HTMLLabelElement>(null);
    const selectRef = React.useRef<HTMLSelectElement>(null);
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(() =>
      String(defaultValue ?? "")
    );
    const currentValue = String(isControlled ? value : internalValue);
    const options = React.useMemo(
      () => getOptions(children, placeholder),
      [children, placeholder]
    );
    const selectedOption =
      options.find((option) => option.value === currentValue) ??
      options.find((option) => !option.disabled);

    React.useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

    React.useEffect(() => {
      if (!open) {
        return;
      }

      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open]);

    const handleSelect = (nextValue: string) => {
      const nativeSelect = selectRef.current;

      if (!nativeSelect || disabled) {
        return;
      }

      nativeSelect.value = nextValue;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.({
        currentTarget: nativeSelect,
        target: nativeSelect,
      } as React.ChangeEvent<HTMLSelectElement>);
      setOpen(false);
    };

    return (
      <label
        className={clsx("block", fullWidth && "w-full")}
        htmlFor={selectId}
        ref={rootRef}
      >
        {label && (
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
            {label}
          </span>
        )}
        <span
          className={clsx(
            "relative block",
            isPlain && !fullWidth && "inline-block"
          )}
        >
          <select
            aria-hidden="true"
            defaultValue={defaultValue}
            disabled={disabled}
            id={selectId}
            name={name}
            onChange={onChange}
            ref={selectRef}
            tabIndex={-1}
            value={value}
            style={{
              border: 0,
              clip: "rect(0 0 0 0)",
              height: 1,
              margin: -1,
              opacity: 0,
              overflow: "hidden",
              padding: 0,
              pointerEvents: "none",
              position: "absolute",
              whiteSpace: "nowrap",
              width: 1,
            }}
            {...selectProps}
          >
            {options.map((option) => (
              <option
                disabled={option.disabled}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <button
            aria-controls={listboxId}
            aria-expanded={open}
            className={clsx(
              "h-10 cursor-pointer appearance-none bg-[#fffdf9] pl-3 text-left text-sm text-[#3b4139] outline-none transition-colors hover:bg-[#f3e8de] hover:text-[#143d2a] disabled:cursor-not-allowed disabled:opacity-60",
              fullWidth || !isPlain ? "w-full pr-10" : "w-auto pr-5",
              variant === "standard"
                ? "border-0 border-b border-[#c9c2b7] pl-0 hover:border-[#234535] focus:border-[#234535]"
                : isPlain
                  ? "border-0 pl-0 focus:border-0"
                : "rounded-md border border-[#c9c2b7] px-3 hover:border-[#234535] hover:bg-[#fffdf9] focus:border-[#234535]",
              error && "border-red-700",
              className
            )}
            disabled={disabled}
            onClick={() => setOpen((nextOpen) => !nextOpen)}
            style={{
              ...style,
            }}
            type="button"
          >
            <span className="block truncate">{selectedOption?.label}</span>
          </button>
          <ChevronDown
            aria-hidden="true"
            className={clsx(
              "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8579]",
              isPlain && !fullWidth ? "right-0" : "right-3"
            )}
          />
          {open && !disabled && (
            <span
              className={clsx(
                "absolute top-full z-30 max-h-80 min-w-full overflow-y-auto rounded-md border border-[#c2ad9d] bg-[#e8ddd3] p-1 text-sm shadow-lg shadow-[#2a1d12]/10",
                isPlain && !fullWidth ? "right-0 w-max" : "left-0"
              )}
              id={listboxId}
              role="listbox"
            >
              {options.map((option) => (
                <button
                  aria-selected={option.value === currentValue}
                  className={clsx(
                    "block h-8 w-full rounded bg-[#f3e8de] px-4 text-left leading-8 text-[#2d332c] transition-colors",
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-[#c8ad98] hover:text-[#102a1d]",
                    option.value === currentValue &&
                      !option.disabled &&
                      "bg-[#b98f70] font-semibold text-[#102a1d] hover:bg-[#e8ddd3]"
                  )}
                  disabled={option.disabled}
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  type="button"
                >
                  {React.cloneElement(option.option, {
                    className: clsx(
                      "block overflow-hidden text-ellipsis whitespace-nowrap",
                      option.option.props.className
                    ),
                  })}
                </button>
              ))}
            </span>
          )}
        </span>
        {helperText && (
          <span
            className={clsx(
              "mt-2 block text-xs",
              error ? "text-red-700" : "text-[#786f62]"
            )}
          >
            {helperText}
          </span>
        )}
      </label>
    );
  }
) as SelectComponent;

Select.Option = SelectOption;

Select.displayName = "Select";
