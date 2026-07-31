"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { techStyle, ALL_TECHNOLOGIES } from "@/lib/tech-colors";

const MODALITIES: { value: string; label: string }[] = [
    { value: "remote", label: "Remoto" },
    { value: "on-site", label: "Presencial" },
    { value: "hybrid", label: "Híbrido" },
];

const CITIES = [
    "San Isidro",
    "Miraflores",
    "Santiago de Surco",
    "San Borja",
    "Magdalena del Mar",
    "La Molina",
    "Lince",
    "San Miguel",
    "Chorrillos",
    "Los Olivos",
    "Arequipa",
    "Trujillo",
];

const SOURCES: { value: string; label: string }[] = [
    { value: "computrabajo", label: "Computrabajo" },
    { value: "bumeran", label: "Bumeran" },
];

const DATE_OPTIONS: { value: string; label: string }[] = [
    { value: "", label: "Todas" },
    { value: "1", label: "Últimas 24h" },
    { value: "3", label: "Últimos 3 días" },
    { value: "7", label: "Últimos 7 días" },
];

export interface Filters {
    query: string;
    stack: string;
    modality: string;
    city: string;
    source: string;
    days: string;
}

export const emptyFilters: Filters = {
    query: "",
    stack: "",
    modality: "",
    city: "",
    source: "",
    days: "",
};

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="py-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
            </h3>
            {children}
        </div>
    );
}

interface FiltersPanelProps {
    filters: Filters;
    onChange: (f: Filters) => void;
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
    const activeCount =
        (filters.stack ? 1 : 0) +
        (filters.modality ? 1 : 0) +
        (filters.source ? 1 : 0) +
        (filters.city ? 1 : 0) +
        (filters.days ? 1 : 0) +
        (filters.query ? 1 : 0);

    return (
        <div className="flex flex-col divide-y divide-border">
            {/* Búsqueda */}
            <div className="pb-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={filters.query}
                        onChange={(e) => onChange({ ...filters, query: e.target.value })}
                        placeholder="Buscar cargo o empresa…"
                        className="pl-9"
                    />
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={() => onChange(emptyFilters)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                        <X className="size-3" /> Limpiar filtros ({activeCount})
                    </button>
                )}
            </div>

            {/* Tecnología — selección única, chip con color propio */}
            <Section title="Tecnología">
                <div className="flex flex-wrap gap-1.5">
                    {ALL_TECHNOLOGIES.map((tech) => {
                        const checked = filters.stack === tech;
                        const s = techStyle(tech);
                        return (
                            <button
                                key={tech}
                                onClick={() =>
                                    onChange({ ...filters, stack: checked ? "" : tech })
                                }
                                className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-all"
                                style={
                                    checked
                                        ? { backgroundColor: s.bg, color: s.fg, borderColor: s.dot }
                                        : {
                                            backgroundColor: "transparent",
                                            color: "var(--muted-foreground)",
                                            borderColor: "var(--border)",
                                        }
                                }
                            >
                                <span
                                    className="size-1.5 rounded-full"
                                    style={{ backgroundColor: checked ? s.dot : "#cbced4" }}
                                />
                                {tech}
                            </button>
                        );
                    })}
                </div>
            </Section>

            {/* Modalidad */}
            <Section title="Modalidad">
                <div className="space-y-2.5">
                    {MODALITIES.map((m) => (
                        <label
                            key={m.value}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <Checkbox
                                checked={filters.modality === m.value}
                                onCheckedChange={() =>
                                    onChange({
                                        ...filters,
                                        modality: filters.modality === m.value ? "" : m.value,
                                    })
                                }
                            />
                            {m.label}
                        </label>
                    ))}
                </div>
            </Section>

            {/* Ciudad */}
            <Section title="Ciudad">
                <div className="space-y-2.5">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                        <Checkbox
                            checked={filters.city === ""}
                            onCheckedChange={() => onChange({ ...filters, city: "" })}
                        />
                        Todas
                    </label>
                    {CITIES.map((c) => (
                        <label
                            key={c}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <Checkbox
                                checked={filters.city === c}
                                onCheckedChange={() =>
                                    onChange({ ...filters, city: filters.city === c ? "" : c })
                                }
                            />
                            {c}
                        </label>
                    ))}
                </div>
            </Section>

            {/* Fuente */}
            <Section title="Fuente">
                <div className="space-y-2.5">
                    {SOURCES.map((src) => (
                        <label
                            key={src.value}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <Checkbox
                                checked={filters.source === src.value}
                                onCheckedChange={() =>
                                    onChange({
                                        ...filters,
                                        source: filters.source === src.value ? "" : src.value,
                                    })
                                }
                            />
                            {src.label}
                        </label>
                    ))}
                </div>
            </Section>

            {/* Fecha de publicación */}
            <Section title="Fecha de publicación">
                <div className="flex flex-wrap gap-1.5">
                    {DATE_OPTIONS.map((opt) => (
                        <Button
                            key={opt.value}
                            size="sm"
                            variant={filters.days === opt.value ? "default" : "outline"}
                            onClick={() => onChange({ ...filters, days: opt.value })}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </Section>
        </div>
    );
}