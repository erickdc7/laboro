"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    MapPin,
    Banknote,
    Calendar,
    Building2,
    ExternalLink,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModalityBadge } from "@/components/shared/modality-badge";
import { TechBadge } from "@/components/shared/tech-badge";
import { JobCard } from "@/components/shared/job-card";
import { fetchJob, fetchJobs } from "@/lib/api";

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
    description: string | null;
    technologies: JobTechnology[];
    source_id: number;
    url_original: string;
}

const SOURCE_LABELS: Record<number, { label: string; abbr: string; color: string }> = {
    1: { label: "Computrabajo", abbr: "CT", color: "#e65c1c" },
    2: { label: "Bumeran", abbr: "BU", color: "#5b21b6" },
};

function formatSalary(min: number | null, max: number | null): string | null {
    if (!min && !max) return null;
    if (min && max) return `S/ ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde S/ ${min.toLocaleString()}`;
    return null;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: job, isLoading } = useQuery<Job>({
        queryKey: ["job", id],
        queryFn: () => fetchJob(id),
    });

    const { data: similarData } = useQuery({
        queryKey: ["jobs", "similar", job?.technologies[0]?.technology],
        queryFn: () =>
            fetchJobs({
                stack: job?.technologies[0]?.technology ?? "",
                per_page: "3",
            }),
        enabled: !!job?.technologies[0]?.technology,
    });

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="flex gap-8">
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                    <Skeleton className="w-72 h-96 rounded-xl flex-shrink-0" />
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Empleo no encontrado
                </h2>
                <p className="text-muted-foreground mb-6">
                    Este empleo ya no está disponible o fue eliminado.
                </p>
                <Button onClick={() => router.push("/jobs")}>
                    Ver todos los empleos
                </Button>
            </div>
        );
    }

    const salary = formatSalary(job.salary_min, job.salary_max);
    const source = SOURCE_LABELS[job.source_id];
    const similarJobs = similarData?.data?.filter(
        (j: Job) => j.id !== job.id
    ).slice(0, 3) ?? [];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/jobs">Empleos</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-xs">
                            {job.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex gap-8 items-start">
                {/* Columna izquierda — contenido principal */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                        {job.modality && <ModalityBadge modality={job.modality} />}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
                        {job.title}
                    </h1>

                    {job.company && (
                        <p className="text-base text-muted-foreground mt-1">
                            {job.company}
                        </p>
                    )}

                    {/* Badges de tecnología */}
                    {job.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {job.technologies.map((tech) => (
                                <TechBadge key={tech.id} technology={tech.technology} />
                            ))}
                        </div>
                    )}

                    <Separator className="my-7" />

                    {/* Descripción */}
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-3">
                            Descripción del puesto
                        </h2>
                        {job.description ? (
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border p-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    La descripción completa está disponible en el portal de
                                    origen.
                                </p>
                                <a
                                    href={job.url_original}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline mt-2 inline-block"
                                >
                                    Ver oferta completa →
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Empleos similares */}
                    {similarJobs.length > 0 && (
                        <div className="mt-12">
                            <Separator className="mb-7" />
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Empleos similares
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {similarJobs.map((similarJob: Job) => (
                                    <JobCard key={similarJob.id} job={similarJob} variant="grid" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Columna derecha — panel lateral */}
                <div className="w-72 flex-shrink-0">
                    <Card className="p-5 sticky top-20">
                        <h3 className="text-sm font-semibold text-foreground mb-4">
                            Detalles del empleo
                        </h3>

                        <div className="space-y-3">
                            {job.location && (
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Ubicación</p>
                                        <p className="text-sm text-foreground">{job.location}</p>
                                    </div>
                                </div>
                            )}

                            {job.modality && (
                                <div className="flex items-start gap-2.5">
                                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Modalidad</p>
                                        <ModalityBadge modality={job.modality} />
                                    </div>
                                </div>
                            )}

                            {salary && (
                                <div className="flex items-start gap-2.5">
                                    <Banknote className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Salario</p>
                                        <p className="text-sm text-foreground font-medium">
                                            {salary}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {job.company && (
                                <div className="flex items-start gap-2.5">
                                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Empresa</p>
                                        <p className="text-sm text-foreground">{job.company}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-2.5">
                                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Publicado</p>
                                    <p className="text-sm text-foreground">
                                        {formatDate(job.scraped_at)}
                                    </p>
                                </div>
                            </div>

                            {source && (
                                <div className="flex items-start gap-2.5">
                                    <span
                                        className="w-4 h-4 rounded-sm flex items-center justify-center text-white font-mono font-bold text-xs flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: source.color }}
                                    >
                                        {source.abbr}
                                    </span>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Fuente</p>
                                        <p className="text-sm text-foreground">{source.label}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator className="my-4" />

                        <a
                            href={job.url_original}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Ver oferta original
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                            onClick={() => router.back()}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver a empleos
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}