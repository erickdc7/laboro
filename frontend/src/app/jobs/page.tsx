import { Suspense } from "react";
import { JobsFilters } from "@/components/shared/jobs-filters";
import { JobsList } from "@/components/shared/jobs-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">
                    Empleos tech en Perú
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Ofertas actualizadas diariamente desde Computrabajo y Bumeran.
                </p>
            </div>

            <div className="flex gap-8">
                <Suspense fallback={<Skeleton className="w-64 h-screen rounded-xl" />}>
                    <JobsFilters />
                </Suspense>

                <Suspense
                    fallback={
                        <div className="flex-1 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-40 rounded-xl" />
                            ))}
                        </div>
                    }
                >
                    <JobsList />
                </Suspense>
            </div>
        </div>
    );
}