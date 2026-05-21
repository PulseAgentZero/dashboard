import { QueryEditorPage } from "@/components/studio/query-editor-page";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <QueryEditorPage queryId={id} />;
}
