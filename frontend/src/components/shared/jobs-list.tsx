"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
    salary_min: number | null;
    salary_max: number | null;
    scraped_at: string;
    published_at: string | null;
    technologies: JobTechnology[];
    source_id: number;
}

interface JobsResponse {
    data: Job[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export function JobsList() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const params: Record<string, string> = {};
    const stack = searchParams.get("stack");
    const modality = searchParams.get("modality");
    const city = searchParams.get("city");
    const source = searchParams.get("source");
    const search = searchParams.get("search");
    const page = searchParams.get("page") ?? "1";

    if (stack) params.stack = stack;
    if (modality) params.modality = modality;
    if (city) params.city = city;
    if (source) params.source = source;
    if (search) params.search = search;
    params.page = page;
    params.per_page = "10";

    const { data, isLoading } = useQuery<JobsResponse>({
        queryKey: ["jobs", params],
        queryFn: () => fetchJobs(params),
    });

    const goToPage = (p: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", String(p));
        router.push(`/jobs?${newParams.toString()}`);
    };

    if (isLoading) {
        return (
            <div className="space-y-3 flex-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
            </div>
        );
    }

    if (!data || data.data.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <SearchX className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                    No encontramos empleos
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Prueba cambiando los filtros o la búsqueda.
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/jobs")}
                >
                    Limpiar filtros
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-4">
                {data.total} empleos encontrados
            </p>

            <div className="space-y-3">
                {data.data.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {data.total_pages > 1 && (
                <div className="mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => goToPage(data.page - 1)}
                                    className={
                                        data.page <= 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                            {Array.from({ length: Math.min(data.total_pages, 5) }).map(
                                (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() => goToPage(pageNum)}
                                                isActive={data.page === pageNum}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => goToPage(data.page + 1)}
                                    className={
                                        data.page >= data.total_pages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}