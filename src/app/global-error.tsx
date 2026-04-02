"use client";

// global-error.tsx catches errors thrown by the root layout itself.
// It replaces the entire document, so it must own <html> and <body>
// and re-import global styles (the root layout is gone at this point).
import "~/styles/globals.css";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100dvh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backgroundColor: "var(--background)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "24rem",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "7rem",
                  height: "7rem",
                  borderRadius: "9999px",
                  filter: "blur(2rem)",
                  opacity: 0.15,
                  backgroundColor: "var(--destructive)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  width: "5rem",
                  height: "5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "1rem",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--muted)",
                }}
              >
                <AlertTriangle
                  size={36}
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
            </div>

            {/* Text */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--destructive)",
                }}
              >
                Critical Error
              </p>

              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                Application failed to load
              </h1>

              <p
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                A critical error occurred. Reload the page or try again.
              </p>

              {error.digest && (
                <p
                  style={{
                    marginTop: "0.25rem",
                    fontFamily: "monospace",
                    fontSize: "0.65rem",
                    color: "var(--muted-foreground)",
                    opacity: 0.5,
                  }}
                >
                  ID: {error.digest}
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              <button
                type="button"
                onClick={reset}
                className="btn btn-primary btn-md"
                style={{ width: "100%" }}
              >
                Try again
              </button>

              <a
                href="/"
                className="btn btn-outline btn-md"
                style={{ width: "100%" }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
