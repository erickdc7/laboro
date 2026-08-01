"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    FiltersPanel,
    emptyFilters,
    type Filters,
} from "@/components/shared/filters-panel";
import { JobCard } from "@/components/shared/job-card";
import { fetchJobs } from "@/lib/api";

interface JobTechnology {
    id: number;
    technology: string;
}

interface Job {
    id: number;
    title: string;
    company: string | null;
    location: string | null;
    modality: string | null;
    scraped_at: string;
    published_at: string | null;
    technologies: JobTechnology[];
    source_id: number;
    source_name: string;
}

interface JobsResponse {
    data: Job[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

const PAGE_SIZE = 10;

const SORT_LABELS: Record<string, string> = {
    recent: "Más recientes",
    salary: "Mayor salario",
};

export function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sheetOpen, setSheetOpen] = useState(false);

    const filters: Filters = {
        query: searchParams.get("search") ?? "",
        stack: searchParams.get("stack") ?? "",
        modality: searchParams.get("modality") ?? "",
        city: searchParams.get("city") ?? "",
        source: searchParams.get("source") ?? "",
        days: searchParams.get("days") ?? "",
    };
    const sort = searchParams.get("sort") ?? "recent";
    const page = Number(searchParams.get("page") ?? "1");

    const updateFilters = (f: Filters) => {
        const params = new URLSearchParams();
        if (f.query) params.set("search", f.query);
        if (f.stack) params.set("stack", f.stack);
        if (f.modality) params.set("modality", f.modality);
        if (f.city) params.set("city", f.city);
        if (f.source) params.set("source", f.source);
        if (f.days) params.set("days", f.days);
        if (sort !== "recent") params.set("sort", sort);
        router.push(`/jobs?${params.toString()}`);
    };

    const updateSort = (newSort: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!newSort || newSort === "recent") {
            params.delete("sort");
        } else {
            params.set("sort", newSort);
        }
        params.delete("page");
        router.push(`/jobs?${params.toString()}`);
    };

    const goToPage = (p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(p));
        router.push(`/jobs?${params.toString()}`);
    };

    const apiParams: Record<string, string> = {
        page: String(page),
        per_page: String(PAGE_SIZE),
        sort,
    };
    if (filters.query) apiParams.search = filters.query;
    if (filters.stack) apiParams.stack = filters.stack;
    if (filters.modality) apiParams.modality = filters.modality;
    if (filters.city) apiParams.city = filters.city;
    if (filters.source) apiParams.source = filters.source;
    if (filters.days) apiParams.days = filters.days;

    const { data, isLoading } = useQuery<JobsResponse>({
        queryKey: ["jobs", apiParams],
        queryFn: () => fetchJobs(apiParams),
    });

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Empleos tech en Perú
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ofertas actualizadas diariamente desde Computrabajo y Bumeran.
                </p>
            </div>

            <div className="flex gap-8">
                {/* Sidebar desktop */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-20 rounded-xl border border-border bg-card px-4 pt-5 pb-2">
                        <FiltersPanel filters={filters} onChange={updateFilters} />
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    {/* Barra de acciones */}
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger
                                render={
                                    <Button variant="outline" size="sm" className="lg:hidden" />
                                }
                            >
                                <SlidersHorizontal className="size-4" /> Filtros
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="w-[88vw] max-w-sm overflow-y-auto p-0"
                            >
                                <SheetHeader className="border-b border-border">
                                    <SheetTitle>Filtros</SheetTitle>
                                </SheetHeader>
                                <div className="px-4">
                                    <FiltersPanel filters={filters} onChange={updateFilters} />
                                </div>
                                <div className="sticky bottom-0 border-t border-border bg-background p-4">
                                    <Button
                                        className="w-full"
                                        onClick={() => setSheetOpen(false)}
                                    >
                                        Ver {data?.total ?? 0} resultados
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <span className="hidden text-sm text-muted-foreground sm:inline">
                            <span className="font-medium text-foreground">
                                {data?.total ?? 0}
                            </span>{" "}
                            {data?.total === 1 ? "empleo encontrado" : "empleos encontrados"}
                        </span>

                        <Select value={sort} onValueChange={updateSort}>
                            <SelectTrigger size="sm" className="ml-auto w-[170px]">
                                <SelectValue>{SORT_LABELS[sort] ?? "Más recientes"}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Más recientes</SelectItem>
                                <SelectItem value="salary">Mayor salario</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Resultados o estado vacío */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-40 rounded-xl" />
                            ))}
                        </div>
                    ) : data && data.data.length > 0 ? (
                        <div className="space-y-3">
                            {data.data.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
                            <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                                <SearchX className="size-6" />
                            </span>
                            <h3 className="mt-4 text-base font-medium">
                                No encontramos ofertas
                            </h3>
                            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                                Prueba ajustando o limpiando los filtros para ver más resultados.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-5"
                                onClick={() => updateFilters(emptyFilters)}
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    )}

                    {/* Paginación — sin límite de páginas mostradas */}
                    {data && data.total_pages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => goToPage(Math.max(1, page - 1))}
                                        className={
                                            page <= 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                                {Array.from({ length: data.total_pages }, (_, i) => i + 1).map(
                                    (n) => (
                                        <PaginationItem key={n}>
                                            <PaginationLink
                                                isActive={n === page}
                                                onClick={() => goToPage(n)}
                                                className="cursor-pointer"
                                            >
                                                {n}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                )}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => goToPage(Math.min(data.total_pages, page + 1))}
                                        className={
                                            page >= data.total_pages
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </div>
    );
}