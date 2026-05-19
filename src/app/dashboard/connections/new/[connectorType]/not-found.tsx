import Link from "next/link";

export default function ConnectorNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-lg font-semibold text-slate-900">Connector not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        This connector type is not available in your catalog.
      </p>
      <Link
        href="/dashboard/connections/new"
        className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        Browse all connectors
      </Link>
    </div>
  );
}
