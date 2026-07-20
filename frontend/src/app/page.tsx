"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Globe, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { JobCard } from "@/components/shared/job-card";
import { fetchSummary, fetchJobs } from "@/lib/api";

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

export default function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", "latest"],
    queryFn: () => fetchJobs({ per_page: "6" }),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Actualizado en tiempo real
        </div>

        <h1 className="text-5xl font-semibold text-foreground leading-tight max-w-xl">
          Todos los empleos tech del Perú,{" "}
          <span className="text-primary">en un solo lugar.</span>
        </h1>

        <p className="mt-4 text-base text-muted-foreground max-w-lg">
          Laboro centraliza las ofertas de los principales portales peruanos.
          Filtra por tecnología, modalidad y ciudad — sin abrir diez pestañas.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <Button onClick={() => window.location.href = "/jobs"} size="lg">
            <Link href="/jobs">
              Explorar empleos →
            </Link>
          </Button>
          <Button onClick={() => window.location.href = "/stats"} variant="outline" size="lg">
            <Link href="/stats">Ver estadísticas</Link>
          </Button>
        </div>
      </section>

      {/* StatCards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-14">
        {summaryLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Empleos activos"
              value={summary?.total_jobs ?? 0}
              hint="Ofertas vigentes"
              icon={Briefcase}
            />
            <StatCard
              label="Fuentes"
              value={summary?.total_sources ?? 0}
              hint="Computrabajo · Bumeran"
              icon={Globe}
            />
            <StatCard
              label="Empresas"
              value={summary?.total_companies ?? 0}
              hint="Contratando ahora"
              icon={Building2}
            />
          </>
        )}
      </section>

      {/* Últimas ofertas */}
      <section className="py-14 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Últimas ofertas
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Las publicaciones más recientes de la semana.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-sm text-primary hover:underline font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {jobsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobsData?.data?.map((job: Job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Dato de la semana */}
      {summary && (
        <section className="py-14 border-t border-border">
          <div className="rounded-xl bg-foreground text-background p-8 flex items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-background/60 mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                Dato de la semana
              </div>
              <h2 className="text-xl font-semibold leading-snug max-w-sm">
                <span className="text-primary">
                  {summary.top_technology}
                </span>{" "}
                es la tecnología más demandada, presente en{" "}
                <span className="text-primary">
                  {summary.total_jobs}
                </span>{" "}
                ofertas activas.
              </h2>
              <p className="text-sm text-background/60 mt-3">
                Datos actualizados diariamente desde Computrabajo y Bumeran.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <Button onClick={() => window.location.href = "/stats"} variant="secondary" size="sm">
                <Link href="/stats">Ver mercado →</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="pb-14" />
    </div>
  );
}