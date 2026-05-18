"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PublicDashboardDisplay } from "@/components/studio/public-dashboard-display";
import { studioPublicApi, PublicApiError } from "@/lib/api/studio-public-api";
import type { PublicDashboard, QueryParamDefinition } from "@/types/studio";

type Props = { params: Promise<{ token: string }> };

export default function EmbedDashboardPage({ params }: Props) {
  const { token } = use(params);
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<PublicDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const filterValues = useMemo(() => {
    const v: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      v[key] = val;
    });
    return v;
  }, [searchParams]);

  const load = useCallback(
    async (filters: Record<string, string>) => {
      setLoading(true);
      setError(null);
      try {
        const data = await studioPublicApi.getDashboardByEmbedToken(token, filters);
        setDashboard(data);
      } catch (e) {
        setError(
          e instanceof PublicApiError
            ? e.message
            : "This dashboard is no longer available",
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    void load(filterValues);
  }, [load, filterValues]);

  const defaultFilters = useMemo(() => {
    const v: Record<string, string> = { ...filterValues };
    dashboard?.dashboard_params?.forEach((p: QueryParamDefinition) => {
      if (!(p.name in v)) v[p.name] = p.default_value ?? "";
    });
    return v;
  }, [dashboard, filterValues]);

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-slate-500">
        {error ?? "Dashboard unavailable"}
      </div>
    );
  }

  return (
    <PublicDashboardDisplay
      dashboard={dashboard}
      filterValues={defaultFilters}
      onFilterApply={(values) => void load(values)}
      loading={loading}
      minimal
    />
  );
}
