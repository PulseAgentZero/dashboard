"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cable, Layers, Sparkles, X } from "lucide-react";
import { useOrganization } from "@/hooks/org/use-organization";
import { useConnections } from "@/hooks/connections/use-connections";
import { useSchemaMappings } from "@/hooks/schema-mappings/use-schema-mappings";
import { useCompleteSetup } from "@/hooks/org/use-complete-setup";
import { hasMinRole } from "@/lib/permissions";
import { useAuth } from "@/providers/auth-provider";
import {
  hasBusinessContext,
  hasConnection,
  hasSchemaMapping,
  isSetupIncomplete,
  needsSchemaMapping,
} from "@/lib/setup-status";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";
import { BusinessContextSheet } from "@/components/dashboard/business-context-sheet";

const DISMISS_KEY_PREFIX = "pulse_setup_banner_dismissed";

function dismissKey(orgId: string | undefined) {
  return orgId ? `${DISMISS_KEY_PREFIX}:${orgId}` : DISMISS_KEY_PREFIX;
}

export function SetupBanner() {
  const { user, org: authOrg, isLoading: isAuthLoading } = useAuth();
  const orgQuery = useOrganization();
  const connQuery = useConnections();
  const mappingsQuery = useSchemaMappings();
  const { mutate: completeSetup } = useCompleteSetup();
  const [dismissedOrgId, setDismissedOrgId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const canManageSetup = hasMinRole(user?.role, "manager");

  // Prefer the freshest org payload, but fall back to the one already
  // hydrated by AuthProvider so business-context checks don't wait on a
  // second round-trip after the dashboard mounts.
  const org = orgQuery.data ?? authOrg;
  const connections = connQuery.data;
  const mappings = mappingsQuery.data;

  // Only consider setup state once every underlying query has settled at
  // least once. `isPending` flips to false after success *or* error, so a
  // failed query won't permanently hide the banner — we just stop showing
  // it during the initial load flicker.
  const dataReady =
    !isAuthLoading &&
    !orgQuery.isPending &&
    !connQuery.isPending &&
    !mappingsQuery.isPending;

  const needsContext = !hasBusinessContext(org);
  const needsConn = !hasConnection(connections);
  const needsMapping = needsSchemaMapping(mappings, connections);

  const firstMappableConnection = connections?.find(
    (c) =>
      supportsEntityMapping(c.connector_type) &&
      (c.status === "active" || c.status === "connected"),
  );

  const storedDismissed =
    typeof window !== "undefined" && org?.id
      ? sessionStorage.getItem(dismissKey(org.id)) === "1"
      : false;
  const dismissed = Boolean(
    org?.id && (dismissedOrgId === org.id || storedDismissed),
  );
  const show =
    dataReady && !dismissed && isSetupIncomplete(org, connections, mappings);

  useEffect(() => {
    if (!dataReady) return;
    if (!canManageSetup || !org || org.onboarding_done) return;
    if (
      hasBusinessContext(org) &&
      hasConnection(connections) &&
      hasSchemaMapping(mappings, connections)
    ) {
      completeSetup();
    }
  }, [dataReady, canManageSetup, org, connections, mappings, completeSetup]);

  if (!show) return null;

  function dismiss() {
    if (org?.id) {
      sessionStorage.setItem(dismissKey(org.id), "1");
      setDismissedOrgId(org.id);
    }
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
      <div className="border-b border-zinc-200 bg-white px-4 py-3.5 sm:px-6 relative">
        <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left Side: Context Messaging */}
          <div className="flex min-w-0 items-start gap-3 pr-8 lg:pr-4">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <Sparkles size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">Finish setting up Entivia</p>
              <p className="mt-0.5 text-xs text-zinc-500 leading-normal">{bannerMessage()}</p>
            </div>
          </div>

          {/* Right Side Actions: Forced row layout layout across all formats */}
          <div className="flex flex-row flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
            {canManageSetup && needsContext && (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex-1 sm:flex-initial text-center whitespace-nowrap rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 shadow-xs transition-colors"
              >
                Add business context
              </button>
            )}
            {canManageSetup && needsConn && (
              <Link
                href="/dashboard/connections/new"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Cable size={13} className="text-zinc-400" />
                Connect data
              </Link>
            )}
            {canManageSetup && needsMapping && firstMappableConnection && (
              <Link
                href={`/dashboard/connections/${firstMappableConnection.id}/map`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Layers size={13} className="text-zinc-400" />
                Map your data
              </Link>
            )}
          </div>

          {/* Absolute positioned close button on mobile, clean inline transition for layout on desktop panels */}
          <div className="absolute top-3.5 right-4 lg:relative lg:top-auto lg:right-auto lg:ml-1 shrink-0">
            <button
              type="button"
              onClick={dismiss}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              aria-label="Dismiss for now"
            >
              <X size={14} />
            </button>
          </div>

        </div>
      </div>

      {canManageSetup && (
        <BusinessContextSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSaved={() => {
            if (org?.id) {
              sessionStorage.removeItem(dismissKey(org.id));
            }
            setDismissedOrgId(null);
          }}
        />
      )}
    </>
  );
}