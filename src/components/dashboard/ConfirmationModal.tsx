"use client";

import { useEffect } from "react";

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
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    info: "bg-black text-white hover:bg-black/90 focus-visible:bg-black/90 focus-visible:outline-none",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:bg-emerald-700 focus-visible:outline-none",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:bg-red-700 focus-visible:outline-none",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      {/* Backdrop click */}
      <div
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
        className="absolute inset-0"
      />

      {/* Modal */}
      <section className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        {/* Title */}
        <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        {/* Description */}
        <p id="modal-description" className="mt-2 text-sm text-gray-600">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none disabled:opacity-50"
          >
            {cancelText}
          </button>

          {/* Confirm */}
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 ${variantStyles[variant]}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
