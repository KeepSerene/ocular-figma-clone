"use client";

import { useEffect } from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

type ModalVariant = "info" | "success" | "danger";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  variant?: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const variantConfig = {
  info: {
    icon: Info,
    iconClass: "text-primary",
    iconBgClass: "bg-primary/10",
    confirmClass: "btn-primary",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    iconBgClass: "bg-emerald-400/10",
    confirmClass:
      "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700",
  },
  danger: {
    icon: AlertTriangle,
    iconClass: "text-destructive",
    iconBgClass: "bg-destructive/10",
    confirmClass: "btn-destructive",
  },
} as const;

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  const {
    icon: Icon,
    iconClass,
    iconBgClass,
    confirmClass,
  } = variantConfig[variant];

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <section className="border-border bg-card relative z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl">
        <div className="p-6">
          {/* Icon + title */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
              >
                <Icon className={`size-4 ${iconClass}`} strokeWidth={1.75} />
              </div>

              <h2
                id="modal-title"
                className="text-foreground text-sm font-semibold"
              >
                {title}
              </h2>
            </div>

            <p
              id="modal-description"
              className="text-muted-foreground text-sm leading-relaxed"
            >
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-outline btn-sm"
            >
              {cancelText}
            </button>

            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`btn btn-sm ${confirmClass}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
