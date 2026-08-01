import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModalityBadge } from "./modality-badge";
import { TechBadge } from "./tech-badge";
import { SourceLogo } from "./source-logo";
import { timeAgo, isNew } from "@/lib/time";
import type { Job } from "@/types/job";

interface JobCardProps {
    job: Job;
    variant?: "row" | "grid";
}

export function JobCard({ job, variant = "row" }: JobCardProps) {
    const source = job.source_name?.toLowerCase() as "computrabajo" | "bumeran" | undefined;

    if (variant === "grid") {
        const visibleTechs = job.technologies.slice(0, 3);

        return (
            <Link href={`/jobs/${job.id}`} className="block group h-full">
                <Card className="flex h-full flex-col gap-0 border-border p-5 transition-all hover:border-primary/40 hover:shadow-[0_2px_16px_-4px_rgba(79,70,229,0.18)]">
                    <div className="flex items-start justify-between gap-2">
                        {job.modality && <ModalityBadge modality={job.modality} />}
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                            {timeAgo(job.scraped_at)}
                        </span>
                    </div>

                    <h3 className="mt-3 text-base font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
                        {job.title}
                    </h3>
                    {job.company && (
                        <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {visibleTechs.map((tech) => (
                            <TechBadge key={tech.id} technology={tech.technology} />
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                        {job.location ? (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="size-3.5" />
                                {job.location}
                            </span>
                        ) : (
                            <span />
                        )}
                        {source && <SourceLogo source={source} />}
                    </div>
                </Card>
            </Link>
        );
    }

    const visibleTechs = job.technologies.slice(0, 4);
    const extraTechs = job.technologies.length - 4;

    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <Card className="gap-0 border-border p-4 transition-all hover:border-primary/40 hover:shadow-[0_2px_16px_-4px_rgba(79,70,229,0.18)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-medium text-foreground transition-colors group-hover:text-primary">
                                {job.title}
                            </h3>
                            {isNew(job.scraped_at) && (
                                <Badge className="bg-primary text-primary-foreground shadow-sm">
                                    Nuevo
                                </Badge>
                            )}
                        </div>
                        {job.company && (
                            <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {job.modality && <ModalityBadge modality={job.modality} />}
                        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {visibleTechs.map((tech) => (
                        <TechBadge key={tech.id} technology={tech.technology} />
                    ))}
                    {extraTechs > 0 && (
                        <span className="text-xs text-muted-foreground">+{extraTechs}</span>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    {job.location && (
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {job.location}
                        </span>
                    )}
                    {source && <SourceLogo source={source} />}
                    <span className="ml-auto font-mono">{timeAgo(job.scraped_at)}</span>
                </div>
            </Card>
        </Link>
    );
}