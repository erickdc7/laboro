"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building2,
  Radar,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  source_name: string;
}

const FINE_PRINT = ["Actualizado a diario", "Sin registro", "100% gratis"];

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
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(11,11,15,0.06) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Badge tipo terminal */}
            <span className="relative inline-flex rounded-full bg-gradient-to-r from-primary/50 via-primary/15 to-primary/40 p-px shadow-[0_2px_12px_-4px_rgba(79,70,229,0.35)]">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-background px-4 py-1.5 font-mono text-xs">
                <span className="text-muted-foreground/70">~/laboro</span>
                <span className="text-primary">$</span>
                <span className="text-foreground">buscar</span>
                <span className="text-muted-foreground">--pais</span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">
                  pe
                </span>
                <span className="inline-block h-3.5 w-[2px] animate-pulse rounded-full bg-primary" />
              </span>
            </span>

            {/* Titular */}
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Todos los empleos tech del Perú,
              <br className="hidden sm:block" />{" "}
              <span className="text-primary">en un solo lugar.</span>
            </h1>

            {/* Subtítulo */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Laboro centraliza las ofertas de los principales portales peruanos.
              Filtra por tecnología, modalidad y ciudad — sin abrir diez pestañas.
            </p>

            {/* Botones */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/jobs">
                  Explorar empleos <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/stats">Ver estadísticas</Link>
              </Button>
            </div>

            {/* Benefit chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {FINE_PRINT.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* StatCards */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {summaryLoading ? (
              <>
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </>
            ) : (
              <>
                <StatCard
                  icon={Briefcase}
                  label="Empleos activos"
                  value={summary?.total_jobs ?? 0}
                  hint="Ofertas vigentes"
                />
                <StatCard
                  icon={Radar}
                  label="Fuentes"
                  value={summary?.total_sources ?? 0}
                  hint="Computrabajo · Bumeran"
                />
                <StatCard
                  icon={Building2}
                  label="Empresas"
                  value={summary?.total_companies ?? 0}
                  hint="Contratando ahora"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Últimas ofertas */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Últimas ofertas</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Las publicaciones más recientes de la semana.
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>

        {jobsLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobsData?.data?.map((job: Job) => (
              <JobCard key={job.id} job={job} variant="grid" />
            ))}
          </div>
        )}
      </section>

      {/* Dato de la semana */}
      {summary && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Card className="gap-0 overflow-hidden border-border bg-foreground p-8 text-background sm:p-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-background/70">
                  <Sparkles className="size-3.5" /> Dato de la semana
                </span>
                <p className="mt-3 text-2xl font-semibold leading-snug">
                  {summary.top_technology} es la tecnología más demandada,
                  presente en{" "}
                  <span className="text-emerald-400">
                    {summary.top_technology_count}
                  </span>{" "}
                  de {summary.total_jobs} ofertas.
                </p>
                <p className="mt-3 text-sm text-background/60">
                  Además, el {summary.remote_percentage}% de las vacantes tech
                  en Perú ofrecen modalidad remota este mes.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid size-14 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <TrendingUp className="size-7" />
                </div>
                <Button asChild variant="secondary">
                  <Link href="/stats">
                    Ver mercado <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}