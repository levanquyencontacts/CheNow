"use client";

import React, {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/common/assets/icons";
import { Key, type Override } from "@/common/shared";
import { clsx } from "../utils";
import { ModalContext, useInModal } from "./ModalContext";

type IllustrationElement = ReactElement<{ size?: number }>;
type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = Override<
  HTMLAttributes<HTMLDivElement>,
  {
    children?: ReactNode;
    closeTitle: string;
    illustration?: IllustrationElement;
    onClose: () => void;
    size?: ModalSize;
  }
>;

type ModalSlotProps = HTMLAttributes<HTMLDivElement>;

const containerSizeClass: Record<ModalSize, string> = {
  sm: "min-h-[350px] max-w-[450px]",
  md: "h-[450px] max-w-[600px]",
  lg: "h-[600px] max-w-[800px]",
  xl: "h-[750px] max-w-[1000px]",
};

const closeButtonPositionClass: Record<ModalSize, string> = {
  sm: "right-3.5 top-3.5",
  md: "right-5 top-5",
  lg: "right-6 top-6",
  xl: "right-7 top-7",
};

function BottomButtons({ className, ...props }: ModalSlotProps) {
  return <div className={clsx("mt-5 flex gap-2.5", className)} {...props} />;
}

function TopRightButtons({ className, ...props }: ModalSlotProps) {
  return (
    <BottomButtons
      className={clsx("absolute right-5 top-5 z-10 m-0", className)}
      {...props}
    />
  );
}

function TopLeftButtons({ className, ...props }: ModalSlotProps) {
  return (
    <BottomButtons
      className={clsx("absolute left-5 top-5 z-10 m-0", className)}
      {...props}
    />
  );
}

function Title({ className, ...props }: ModalSlotProps) {
  return (
    <div
      className={clsx(
        "mb-2.5 flex min-h-10 items-center text-lg font-semibold text-[#143d2a]",
        className,
      )}
      {...props}
    />
  );
}

function SectionTitle({
  className,
  color,
  size = "lg",
  ...props
}: ModalSlotProps & { size?: "sm" | "md" | "lg"; color?: string }) {
  void color;

  const sizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <div
      className={clsx(
        "min-h-5 uppercase text-[#6f6256]",
        sizeClass,
        className,
      )}
      {...props}
    />
  );
}

const Modal: React.FC<ModalProps> & {
  BottomButtons: typeof BottomButtons;
  SectionTitle: typeof SectionTitle;
  Title: typeof Title;
  TopLeftButtons: typeof TopLeftButtons;
  TopRightButtons: typeof TopRightButtons;
} = ({
  children,
  className,
  closeTitle,
  illustration,
  onClose,
  size,
  ...rest
}: ModalProps) => {
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const modalSizeClass = size
    ? containerSizeClass[size]
    : "max-h-[85vh] max-w-[800px]";
  const closePositionClass = size
    ? closeButtonPositionClass[size]
    : "right-3 top-3";

  useEffect(() => {
    const node = document.createElement("div");
    node.setAttribute("id", "modal-root");
    document.body.appendChild(node);
    setPortalNode(node);

    return () => {
      document.body.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === Key.Escape) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const stopEventPropagation = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  if (!portalNode) {
    return null;
  }

  return createPortal(
    <ModalContext.Provider value={true}>
      <div
        aria-modal="true"
        className="fixed inset-0 z-1800 flex items-center justify-center bg-black/50 p-5"
        onClick={onClose}
        role="dialog"
      >
        <div
          className={clsx(
            "relative flex w-full flex-col overflow-hidden rounded-2xl bg-[#fff8f1] shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
            modalSizeClass,
            className,
          )}
          onClick={stopEventPropagation}
          {...rest}
        >
          <button
            aria-label={closeTitle}
            className={clsx(
              "absolute z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#6f6256] transition hover:bg-[#eadfd4] hover:text-[#143d2a]",
              closePositionClass,
            )}
            onClick={onClose}
            title={closeTitle}
            type="button"
          >
            <CloseIcon aria-hidden="true" size={18} />
          </button>

          {illustration === undefined ? (
            <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-[#fff8f1]">
              {children}
            </div>
          ) : (
            <div className="grid bg-white md:grid-cols-[1fr_2fr]">
              <div className="flex justify-end p-8 pr-10">
                {React.cloneElement(illustration, { size: 220 })}
              </div>
              <div className="flex min-w-120 flex-col overflow-y-auto border-l border-[#eadfd4] bg-white p-10">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalContext.Provider>,
    portalNode,
  );
};

Modal.BottomButtons = BottomButtons;
Modal.TopRightButtons = TopRightButtons;
Modal.TopLeftButtons = TopLeftButtons;
Modal.Title = Title;
Modal.SectionTitle = SectionTitle;

export { Modal, useInModal };
