"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const TECHNOLOGIES = [
    "React", "Next.js", "TypeScript", "JavaScript",
    "Vue", "Angular", "Node.js", "Python",
    "Django", "FastAPI", "Java", "Go",
    "PHP", "Laravel", "Ruby", "Rust",
    ".NET", "C#", "Docker", "Kubernetes",
    "AWS", "PostgreSQL", "MongoDB", "GraphQL",
    "Tailwind", "Flutter", "Kotlin", "Swift",
];

const MODALITIES = [
    { value: "remote", label: "Remoto" },
    { value: "on-site", label: "Presencial" },
    { value: "hybrid", label: "Híbrido" },
];

const CITIES = ["Lima", "Arequipa", "Trujillo", "Remoto"];

const SOURCES = [
    { value: "computrabajo", label: "Computrabajo" },
    { value: "bumeran", label: "Bumeran" },
];

const DATE_OPTIONS = [
    { value: "", label: "Todas" },
    { value: "1", label: "Últimas 24h" },
    { value: "7", label: "Últimos 7 días" },
    { value: "30", label: "Últimos 30 días" },
];

interface JobsFiltersProps {
    activeCount?: number;
}

export function JobsFilters({ activeCount = 0 }: JobsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page");
            router.push(`/jobs?${params.toString()}`);
        },
        [router, searchParams]
    );

    const clearFilters = () => {
        router.push("/jobs");
    };

    const currentSearch = searchParams.get("search") ?? "";
    const currentModality = searchParams.get("modality") ?? "";
    const currentCity = searchParams.get("city") ?? "";
    const currentSource = searchParams.get("source") ?? "";
    const currentStack = searchParams.get("stack") ?? "";

    return (
        <aside className="w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
                {/* Búsqueda */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar cargo o empresa..."
                        className="pl-9"
                        defaultValue={currentSearch}
                        onChange={(e) => {
                            const val = e.target.value;
                            const params = new URLSearchParams(searchParams.toString());
                            if (val) {
                                params.set("search", val);
                            } else {
                                params.delete("search");
                            }
                            params.delete("page");
                            router.push(`/jobs?${params.toString()}`);
                        }}
                    />
                </div>

                {/* Tecnología */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                        Tecnología
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {TECHNOLOGIES.map((tech) => {
                            const isActive = currentStack === tech;
                            return (
                                <button
                                    key={tech}
                                    onClick={() => updateParam("stack", isActive ? "" : tech)}
                                    className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                        }`}
                                >
                                    {tech}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Modalidad */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                        Modalidad
                    </p>
                    <div className="space-y-2">
                        {MODALITIES.map((m) => (
                            <label
                                key={m.value}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Checkbox
                                    checked={currentModality === m.value}
                                    onCheckedChange={(checked) =>
                                        updateParam("modality", checked ? m.value : "")
                                    }
                                />
                                <span className="text-sm text-foreground">{m.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Ciudad */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                        Ciudad
                    </p>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={currentCity === ""}
                                onCheckedChange={() => updateParam("city", "")}
                            />
                            <span className="text-sm text-foreground">Todas</span>
                        </label>
                        {CITIES.map((city) => (
                            <label
                                key={city}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Checkbox
                                    checked={currentCity === city}
                                    onCheckedChange={(checked) =>
                                        updateParam("city", checked ? city : "")
                                    }
                                />
                                <span className="text-sm text-foreground">{city}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Fuente */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                        Fuente
                    </p>
                    <div className="space-y-2">
                        {SOURCES.map((s) => (
                            <label
                                key={s.value}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Checkbox
                                    checked={currentSource === s.value}
                                    onCheckedChange={(checked) =>
                                        updateParam("source", checked ? s.value : "")
                                    }
                                />
                                <span className="text-sm text-foreground">{s.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Fecha */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                        Fecha de publicación
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {DATE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${(searchParams.get("days") ?? "") === opt.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/40"
                                    }`}
                                onClick={() => updateParam("days", opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Limpiar filtros */}
                {activeCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={clearFilters}
                    >
                        Limpiar filtros ({activeCount})
                    </Button>
                )}
            </div>
        </aside>
    );
}