"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Last-resort error boundary — must include its own html/body and inline styles.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[entivia] root error", error);
  }, [error]);

  const digest = error?.digest;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong · Entivia</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          color: "#0f172a",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Visual panel */}
          <div
            style={{
              flex: "1 1 42%",
              minHeight: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #be123c 0%, #e11d48 35%, #fb7185 70%, #9f1239 100%)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: 24,
                left: 0,
                right: 0,
                textAlign: "center",
                margin: 0,
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              500 · Pipeline interrupted
            </p>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(5rem, 18vw, 9rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              5<span style={{ opacity: 0.35 }}>0</span>0
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              flex: "1 1 58%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
            }}
          >
            <div style={{ maxWidth: 420, width: "100%", textAlign: "left" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                500 · Server error
              </p>
              <h1
                style={{
                  margin: "0 0 12px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 32,
                  lineHeight: 1.15,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Something gave out.
              </h1>
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#475569",
                }}
              >
                The app hit a critical error. Refresh the page or return home. If this
                persists, contact{" "}
                <a
                  href="mailto:support@entivia.online"
                  style={{ color: "#e11d48", textDecoration: "underline" }}
                >
                  support@entivia.online
                </a>
                .
              </p>

              {digest && (
                <p
                  style={{
                    margin: "0 0 24px",
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#f1f5f9",
                    fontSize: 11,
                    color: "#64748b",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  ref · {digest}
                </p>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => reset()}
                  style={{
                    background: "#e11d48",
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
          </div>
        </div>
      </body>
    </html>
  );
}
