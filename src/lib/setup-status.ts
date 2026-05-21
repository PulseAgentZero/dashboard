import type { OrgProfile } from "@/types/org";
import type { ConnectionResponse } from "@/types/connections";
import type { SchemaMapping } from "@/types/schema-mapping";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";

export function hasBusinessContext(org: OrgProfile | null | undefined): boolean {
  return Boolean(org?.business_context?.trim());
}

export function hasConnection(connections: ConnectionResponse[] | undefined): boolean {
  return Boolean(connections?.length);
}

function isHealthyConnection(c: ConnectionResponse) {
  const s = c.status?.toLowerCase();
  return s === "active" || s === "connected";
}

/** At least one mapping for an active SQL-capable connection. */
export function hasSchemaMapping(
  mappings: SchemaMapping[] | undefined,
  connections: ConnectionResponse[] | undefined,
): boolean {
  if (!mappings?.length || !connections?.length) return false;

  const mappableConnIds = new Set(
    connections
      .filter((c) => isHealthyConnection(c) && supportsEntityMapping(c.connector_type))
      .map((c) => c.id),
  );

  return mappings.some(
    (m) =>
      mappableConnIds.has(m.connection_id) &&
      Boolean(m.entity_table?.trim()) &&
      Boolean(m.entity_id_col?.trim()),
  );
}

export function needsSchemaMapping(
  mappings: SchemaMapping[] | undefined,
  connections: ConnectionResponse[] | undefined,
): boolean {
  if (!connections?.some((c) => isHealthyConnection(c) && supportsEntityMapping(c.connector_type))) {
    return false;
  }
  return !hasSchemaMapping(mappings, connections);
}

export function isSetupIncomplete(
  org: OrgProfile | null | undefined,
  connections: ConnectionResponse[] | undefined,
  mappings?: SchemaMapping[] | undefined,
): boolean {
  return (
    !hasBusinessContext(org) ||
    !hasConnection(connections) ||
    needsSchemaMapping(mappings, connections)
  );
}
