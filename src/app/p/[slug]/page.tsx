"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PublicDashboardDisplay } from "@/components/studio/public-dashboard-display";
import { studioPublicApi, PublicApiError } from "@/lib/api/studio-public-api";
import type { PublicDashboard, QueryParamDefinition } from "@/types/studio";

type Props = { params: Promise<{ slug: string }> };

export default function PublicDashboardPage({ params }: Props) {
  const { slug } = use(params);
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
        const data = await studioPublicApi.getDashboardBySlug(slug, filters);
        setDashboard(data);
      } catch (e) {
        setError(e instanceof PublicApiError ? e.message : "Dashboard not found");
      } finally {
        setLoading(false);
      }
    },
    [slug],
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
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error ?? "Not found"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PublicDashboardDisplay
        dashboard={dashboard}
        filterValues={defaultFilters}
        onFilterApply={(values) => {
          const url = new URL(window.location.href);
          Object.keys(values).forEach((k) => {
            if (values[k]) url.searchParams.set(k, values[k]);
            else url.searchParams.delete(k);
          });
          window.history.replaceState({}, "", url.toString());
          void load(values);
        }}
        loading={loading}
        showFooter
      />
    </div>
  );
}
