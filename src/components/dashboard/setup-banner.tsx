"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cable, Layers, Sparkles, X } from "lucide-react";
import { useOrganization } from "@/hooks/org/use-organization";
import { useConnections } from "@/hooks/connections/use-connections";
import { useSchemaMappings } from "@/hooks/schema-mappings/use-schema-mappings";
import { useCompleteSetup } from "@/hooks/org/use-complete-setup";
import {
  hasBusinessContext,
  hasConnection,
  hasSchemaMapping,
  isSetupIncomplete,
  needsSchemaMapping,
} from "@/lib/setup-status";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";
import { BusinessContextSheet } from "@/components/dashboard/business-context-sheet";

const DISMISS_KEY = "pulse_setup_banner_dismissed";

export function SetupBanner() {
  const { data: org } = useOrganization();
  const { data: connections } = useConnections();
  const { data: mappings } = useSchemaMappings();
  const { mutate: completeSetup } = useCompleteSetup();
  const [dismissed, setDismissed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const needsContext = !hasBusinessContext(org);
  const needsConn = !hasConnection(connections);
  const needsMapping = needsSchemaMapping(mappings, connections);

  const firstMappableConnection = connections?.find(
    (c) =>
      supportsEntityMapping(c.connector_type) &&
      (c.status === "active" || c.status === "connected"),
  );

  const show = !dismissed && isSetupIncomplete(org, connections, mappings);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!org || org.onboarding_done) return;
    if (
      hasBusinessContext(org) &&
      hasConnection(connections) &&
      hasSchemaMapping(mappings, connections)
    ) {
      completeSetup();
    }
  }, [org, connections, mappings, completeSetup]);

  if (!show) return null;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  function bannerMessage() {
    if (needsContext && needsConn) {
      return "Add your business context and connect a data source to start modeling users and generating recommendations.";
    }
    if (needsContext) {
      return "Tell us about your business so recommendations match your goals.";
    }
    if (needsConn) {
      return "Connect a data source so Entivia can read your data.";
    }
    if (needsMapping) {
      return "Your connection is ready. Map which table represents your users or customers so the pipeline can run.";
    }
    return "Finish setting up Entivia.";
  }

  return (
    <>
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Finish setting up Entivia</p>
              <p className="mt-0.5 text-xs text-slate-600">{bannerMessage()}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {needsContext && (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Add business context
              </button>
            )}
            {needsConn && (
              <Link
                href="/dashboard/connections/new"
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Cable size={13} />
                Connect data
              </Link>
            )}
            {needsMapping && firstMappableConnection && (
              <Link
                href={`/dashboard/connections/${firstMappableConnection.id}/map`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Layers size={13} />
                Map your data
              </Link>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/80 hover:text-slate-600"
              aria-label="Dismiss for now"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      <BusinessContextSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={() => {
          sessionStorage.removeItem(DISMISS_KEY);
          setDismissed(false);
        }}
      />
    </>
  );
}
