"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Last-resort error boundary. Renders when an error escapes the root layout
 * (so we can't rely on `app/layout.tsx` styles, fonts, or providers). Must
 * include its own `<html>`/`<body>` and stick to inline styles.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[entivia] root error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          color: "#0f172a",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: 480, padding: "0 24px", textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#e11d48",
              margin: 0,
            }}
          >
            500 · Critical error
          </p>
          <h1
            style={{
              marginTop: 8,
              fontSize: 30,
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Entivia hit an unexpected error
          </h1>
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              lineHeight: 1.6,
              color: "#475569",
            }}
          >
            Refresh the page or head back home. If this keeps happening, contact{" "}
            <a
              href="mailto:support@entivia.online"
              style={{ color: "#ea580c", textDecoration: "underline" }}
            >
              support@entivia.online
            </a>
            .
          </p>

          {error?.digest && (
            <p
              style={{
                marginTop: 16,
                fontSize: 11,
                color: "#94a3b8",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              }}
            >
              ref · {error.digest}
            </p>
          )}

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#ea580c",
                color: "#fff",
                border: 0,
                borderRadius: 12,
                padding: "10px 18px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: "#fff",
                color: "#334155",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 18px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
