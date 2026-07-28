import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModalityBadge } from "./modality-badge";
import { TechBadge } from "./tech-badge";
import { SourceLogo } from "./source-logo";

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
}

interface JobCardProps {
    job: Job;
    variant?: "row" | "grid";
}

const SOURCE_MAP: Record<number, { key: "computrabajo" | "bumeran"; label: string }> = {
    1: { key: "computrabajo", label: "Computrabajo" },
    2: { key: "bumeran", label: "Bumeran" },
};

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

export function JobCard({ job, variant = "row" }: JobCardProps) {
    const dateStr = job.scraped_at;
    const jobIsNew = isNew(dateStr);
    const source = SOURCE_MAP[job.source_id];
    const maxTechs = variant === "row" ? 4 : 3;
    const visibleTechs = job.technologies.slice(0, maxTechs);
    const extraTechs = job.technologies.length - maxTechs;

    const techRow = (
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
    );

    if (variant === "grid") {
        return (
            <Link href={`/jobs/${job.id}`}>
                <Card className="p-5 h-full flex flex-col hover:border-primary/40 hover:shadow-card transition-all cursor-pointer group">
                    <div className="flex items-center justify-between gap-2">
                        {job.modality && <ModalityBadge modality={job.modality} />}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {timeAgo(dateStr)}
                        </span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mt-3 line-clamp-2">
                        {job.title}
                    </h3>

                    {job.company && (
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">
                            {job.company}
                        </p>
                    )}

                    {techRow}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        {job.location ? (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {job.location}
                            </span>
                        ) : (
                            <span />
                        )}
                        {source && (
                            <SourceLogo source={source.key} className="h-3.5 w-auto flex-shrink-0" />
                        )}
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Link href={`/jobs/${job.id}`}>
            <Card className="p-5 hover:border-primary/40 hover:shadow-card transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                        </h3>
                        {jobIsNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                                Nuevo
                            </span>
                        )}
                    </div>
                    {job.modality && <ModalityBadge modality={job.modality} />}
                </div>

                {job.company && (
                    <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                )}

                {techRow}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                        {job.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                            </span>
                        )}
                        {source && <SourceLogo source={source.key} />}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(dateStr)}
                    </span>
                </div>
            </Card>
        </Link>
    );
}