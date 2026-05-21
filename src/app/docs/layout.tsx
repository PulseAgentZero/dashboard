import { DocsShell } from "@/components/docs/docs-shell";
import { DocsThemeInit } from "@/components/docs/docs-theme-init";
import { DocsThemeProvider } from "@/components/docs/docs-theme-provider";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DocsThemeInit />
      <DocsThemeProvider>
        <DocsShell>{children}</DocsShell>
      </DocsThemeProvider>
    </>
  );
}
