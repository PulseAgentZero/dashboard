"use client";

import { Database } from "lucide-react";
import { getConnectorLogo } from "@/lib/connectors/registry";
import { useState } from "react";

type Props = {
  connectorType: string;
  size?: number;
  className?: string;
  /**
   * `dashboard` — always black (default for connections UI).
   * `docs` — black in light docs; inverts to white when `html.docs-dark` (docs dark mode).
   */
  variant?: "dashboard" | "docs";
};

export function ConnectorIcon({
  connectorType,
  size = 24,
  className = "",
  variant = "dashboard",
}: Props) {
  const [failed, setFailed] = useState(false);
  const src = getConnectorLogo(connectorType);

  const colorClass =
    variant === "docs" ? "dark:invert" : "";

  if (failed) {
    return (
      <div
        className={`grid shrink-0 place-items-center rounded-lg bg-slate-100 ${className}`}
        style={{ width: size + 8, height: size + 8 }}
      >
        <Database size={size * 0.65} className="text-slate-500" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand logos
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 object-contain ${colorClass} ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
