"use client";

import { useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Camera, MapPin, Send, CheckCircle2, Clock, Truck as TruckIcon, Circle } from "lucide-react";
import { wasteTypes } from "@/lib/mock";
import { useRequestsStore } from "@/lib/store/useRequestsStore";
import { useUserLocation } from "@/lib/geolocation/useUserLocation";
import { CollectionRequest } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { officialChannels } from "@/lib/mock/officialChannels";

const SPECIAL_WASTE_IDS = ["moveis", "madeira", "poda", "entulho", "eletronicos"];

const STATUS_STEPS: { key: CollectionRequest["status"]; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "recebida", label: "Solicitação recebida", icon: CheckCircle2 },
  { key: "agendada", label: "Agendada", icon: Clock },
  { key: "a_caminho", label: "Equipe a caminho", icon: TruckIcon },
  { key: "concluida", label: "Coleta concluída", icon: CheckCircle2 },
];

function statusIndex(status: CollectionRequest["status"]) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function RequestTracker({ request }: { request: CollectionRequest }) {
  const idx = statusIndex(request.status);
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--color-text)]">Protocolo {request.protocol}</p>
      </div>
      <div className="mt-4 flex flex-col gap-0">
        {STATUS_STEPS.map((step, i) => {
          const Icon = step.icon;
          const active = i <= idx;
          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    active ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {active ? <Icon size={14} /> : <Circle size={10} />}
                </span>
                {i < STATUS_STEPS.length - 1 && (
                  <span className={`w-0.5 flex-1 ${i < idx ? "bg-[var(--color-brand)]" : "bg-[var(--color-border)]"}`} style={{ minHeight: 24 }} />
                )}
              </div>
              <div className="pb-5">
                <p className={`text-sm font-medium ${active ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10.5px] text-[var(--color-text-muted)]">
        Status simulado para fins de demonstração — atualiza automaticamente nos próximos segundos.
      </p>
    </Card>
  );
}

export function SpecialRequestFlow() {
  const requests = useRequestsStore((s) => s.requests);
  const createRequest = useRequestsStore((s) => s.createRequest);
  const { position, requestLocation } = useUserLocation();

  const [wasteTypeId, setWasteTypeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const materials = useMemo(() => wasteTypes.filter((w) => SPECIAL_WASTE_IDS.includes(w.id)), []);
  const lastRequest = requests.find((r) => r.id === lastRequestId);

  const canSubmit = Boolean(wasteTypeId) && quantity.trim().length > 0 && address.trim().length > 0;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!canSubmit || !wasteTypeId) return;
    const req = createRequest({
      wasteTypeId,
      quantityDescription: quantity.trim(),
      photoDataUrl,
      address: address.trim(),
      location: position,
    });
    setLastRequestId(req.id);
  }

  if (lastRequest) {
    return (
      <div className="flex flex-col gap-4">
        <RequestTracker request={lastRequest} />
        <Button
          variant="outline"
          onClick={() => {
            setLastRequestId(null);
            setWasteTypeId(null);
            setQuantity("");
            setAddress("");
            setPhotoDataUrl(undefined);
          }}
        >
          Fazer nova solicitação
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          1. Selecione o material
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {materials.map((m) => {
            const IconCmp =
              (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[m.icon] ?? Icons.Trash2;
            const selected = wasteTypeId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setWasteTypeId(m.id)}
                className={`flex items-center gap-2.5 rounded-2xl border px-3 py-3 text-left transition-colors ${
                  selected
                    ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                <IconCmp size={17} />
                <span className="text-xs font-medium text-[var(--color-text)]">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          2. Quantidade / descrição
        </p>
        <textarea
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Ex.: 1 sofá de 2 lugares e 3 sacos de galhos"
          rows={2}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          3. Foto (opcional)
        </p>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] p-3.5 text-left hover:bg-[var(--color-surface-muted)]"
        >
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoDataUrl} alt="Foto anexada" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
              <Camera size={18} />
            </span>
          )}
          <span className="text-xs text-[var(--color-text-muted)]">
            {photoDataUrl ? "Foto anexada — toque para trocar" : "Adicionar uma foto ajuda a equipe a se preparar"}
          </span>
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          4. Endereço de coleta
        </p>
        <div className="flex gap-2">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua, número, bairro"
            className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
          />
          <button
            onClick={requestLocation}
            aria-label="Usar minha localização"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] text-[var(--color-brand)] hover:bg-[var(--color-surface-muted)]"
          >
            <MapPin size={18} />
          </button>
        </div>
        {position && (
          <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
            Localização atual capturada ({position.lat.toFixed(4)}, {position.lng.toFixed(4)})
          </p>
        )}
      </div>

      <Button fullWidth size="lg" disabled={!canSubmit} onClick={handleSubmit}>
        <Send size={17} /> Enviar solicitação
      </Button>

      <div className="rounded-2xl border border-[var(--color-border)] p-4">
        <p className="mb-2 text-xs font-semibold text-[var(--color-text)]">
          Prefere solicitar diretamente com a Prefeitura?
        </p>
        <div className="flex flex-col gap-1.5">
          {officialChannels
            .filter((c) => c.label.includes("Cata"))
            .map((c) => (
              <a key={c.label} href={c.href} className="text-xs text-[var(--color-brand-dark)] underline">
                {c.label}: {c.value}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
