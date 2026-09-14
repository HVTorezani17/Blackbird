import { PageHeader } from "@/components/layout/PageHeader";
import { SpecialRequestFlow } from "@/components/special/SpecialRequestFlow";

export default function ColetaEspecialPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Coleta especial" subtitle="Móveis, poda, entulho e mais" />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        <SpecialRequestFlow />
      </div>
    </div>
  );
}
