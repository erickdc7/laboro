import Link from "next/link";
import { MapPin, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModalityBadge } from "./modality-badge";
import { TechBadge } from "./tech-badge";

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

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Hace 1 día";
    return `Hace ${diffDays} días`;
}

function isNew(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    return now.getTime() - date.getTime() < 1000 * 60 * 60 * 24;
}

function formatSalary(min: number | null, max: number | null): string | null {
    if (!min && !max) return null;
    if (min && max) return `S/ ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde S/ ${min.toLocaleString()}`;
    return null;
}

const SOURCE_LABELS: Record<number, { label: string; abbr: string; color: string }> = {
    1: { label: "Computrabajo", abbr: "CT", color: "#e65c1c" },
    2: { label: "Bumeran", abbr: "BU", color: "#5b21b6" },
};

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    const salary = formatSalary(job.salary_min, job.salary_max);
    const dateStr = job.scraped_at;
    const jobIsNew = isNew(dateStr);
    const source = SOURCE_LABELS[job.source_id];
    const maxTechs = 4;
    const visibleTechs = job.technologies.slice(0, maxTechs);
    const extraTechs = job.technologies.length - maxTechs;

    return (
        <Link href={`/jobs/${job.id}`}>
            <Card className="p-5 hover:border-primary/40 hover:shadow-card transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            {job.modality && <ModalityBadge modality={job.modality} />}
                            {jobIsNew && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                                    Nuevo
                                </span>
                            )}
                        </div>

                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {job.title}
                        </h3>

                        {job.company && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {job.company}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {visibleTechs.map((tech) => (
                                <TechBadge key={tech.id} technology={tech.technology} />
                            ))}
                            {extraTechs > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground">
                                    +{extraTechs}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                        {timeAgo(dateStr)}
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                    {job.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                        </span>
                    )}
                    {salary && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Banknote className="w-3 h-3" />
                            {salary}
                        </span>
                    )}
                    {source && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                            <span
                                className="w-5 h-5 rounded-sm flex items-center justify-center text-white font-mono font-bold text-xs"
                                style={{ backgroundColor: source.color }}
                            >
                                {source.abbr}
                            </span>
                            {source.label}
                        </span>
                    )}
                </div>
            </Card>
        </Link>
    );
}