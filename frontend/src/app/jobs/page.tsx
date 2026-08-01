import { Suspense } from "react";
import { JobsPageContent } from "@/components/shared/jobs-page-content";

export default function JobsPage() {
    return (
        <Suspense fallback={null}>
            <JobsPageContent />
        </Suspense>
    );
}