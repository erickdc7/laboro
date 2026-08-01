"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    MapPin,
    Wallet,
    Building2,
    Calendar,
    Radar,
    ExternalLink,
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
import { TechBadge } from "@/components/shared/tech-badge";
import { SourceLogo } from "@/components/shared/source-logo";
import { JobCard } from "@/components/shared/job-card";
import { fetchJob, fetchJobs } from "@/lib/api";
import { isNew } from "@/lib/time";
import type { Job } from "@/types/job";

const MODALITY_LABELS: Record<string, string> = {
    remote: "Remoto",
    "on-site": "Presencial",
    hybrid: "Híbrido",
};

function formatSalary(min: number | null, max: number | null): string | null {
    if (!min && !max) return null;
    if (min && max) return `S/ ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde S/ ${min.toLocaleString()}`;
    return null;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function DataRow({
    icon: Icon,
    label,
    children,
}: {
    icon: typeof MapPin;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4" /> {label}
            </span>
            <span className="text-right text-sm font-medium text-foreground">
                {children}
            </span>
        </div>
    );
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
                per_page: "4",
            }),
        enabled: !!job?.technologies[0]?.technology,
    });

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                    Empleo no encontrado
                </h2>
                <p className="mb-6 text-muted-foreground">
                    Este empleo ya no está disponible o fue eliminado.
                </p>
                <Button onClick={() => router.push("/jobs")}>
                    Ver todos los empleos
                </Button>
            </div>
        );
    }

    const salary = formatSalary(job.salary_min, job.salary_max);
    const sourceKey = job.source_name?.toLowerCase() as
        | "computrabajo"
        | "bumeran"
        | undefined;
    const similarJobs =
        similarData?.data?.filter((j: Job) => j.id !== job.id).slice(0, 3) ?? [];

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <Breadcrumb className="mb-5">
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
                        <BreadcrumbPage className="max-w-[200px] truncate">
                            {job.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                {/* Contenido principal */}
                <div className="min-w-0">
                    {isNew(job.scraped_at) && (
                        <span className="inline-block rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                            Nuevo
                        </span>
                    )}
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                        {job.title}
                    </h1>
                    {job.company && (
                        <p className="mt-1 text-base text-muted-foreground">
                            {job.company}
                        </p>
                    )}

                    {job.technologies.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5">
                            {job.technologies.map((tech) => (
                                <TechBadge key={tech.id} technology={tech.technology} />
                            ))}
                        </div>
                    )}

                    <Separator className="my-7" />

                    <h2 className="text-lg font-semibold text-foreground">
                        Descripción del puesto
                    </h2>
                    {job.description ? (
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                            {job.description}
                        </p>
                    ) : (
                        <div className="mt-3 rounded-xl border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                La descripción completa está disponible en el portal de origen.
                            </p>
                            <a
                                href={job.url_original}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-sm text-primary hover:underline"
                            >
                                Ver oferta completa →
                            </a>
                        </div>
                    )}
                </div>

                {/* Panel lateral */}
                <aside>
                    <Card className="sticky top-20 gap-0 border-border p-5">
                        <h3 className="text-sm font-semibold text-foreground">
                            Datos del empleo
                        </h3>
                        <div className="mt-2 divide-y divide-border">
                            {job.location && (
                                <DataRow icon={MapPin} label="Ubicación">
                                    {job.location}
                                </DataRow>
                            )}
                            {job.modality && (
                                <DataRow icon={Building2} label="Modalidad">
                                    {MODALITY_LABELS[job.modality] ?? job.modality}
                                </DataRow>
                            )}
                            {salary && (
                                <DataRow icon={Wallet} label="Salario">
                                    {salary}
                                </DataRow>
                            )}
                            {job.company && (
                                <DataRow icon={Building2} label="Empresa">
                                    {job.company}
                                </DataRow>
                            )}
                            <DataRow icon={Calendar} label="Publicado">
                                {formatDate(job.scraped_at)}
                            </DataRow>
                            {sourceKey && (
                                <div className="flex items-center justify-between gap-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                        <Radar className="size-4" /> Fuente
                                    </span>
                                    <SourceLogo source={sourceKey} />
                                </div>
                            )}
                        </div>

                        <Button
                            className="mt-4 w-full"
                            size="lg"
                            render={
                                <a
                                    href={job.url_original}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            }
                        >
                            Ver oferta original <ExternalLink className="size-4" />
                        </Button>
                        {job.source_name && (
                            <p className="mt-2 text-center text-xs text-muted-foreground">
                                Serás redirigido a {job.source_name}
                            </p>
                        )}
                    </Card>
                </aside>
            </div>

            {/* Empleos similares — ancho completo */}
            {similarJobs.length > 0 && (
                <section className="mt-14">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Empleos similares
                    </h2>
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {similarJobs.map((similarJob: Job) => (
                            <JobCard key={similarJob.id} job={similarJob} variant="grid" />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}