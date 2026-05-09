export default function EntityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-2xl font-semibold text-slate-500">Entity Profile</p>
    </div>
  );
}
