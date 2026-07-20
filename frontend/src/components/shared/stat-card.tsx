import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    hint: string;
    icon: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent-foreground" />
                </div>
            </div>
            <p className="mt-3 text-3xl font-mono font-semibold text-foreground">
                {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </Card>
    );
}