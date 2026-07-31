import { techStyle } from "@/lib/tech-colors";

interface TechBadgeProps {
    technology: string;
}

export function TechBadge({ technology }: TechBadgeProps) {
    const config = techStyle(technology);

    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border"
            style={{
                backgroundColor: config.bg,
                color: config.fg,
                borderColor: config.dot + "40",
            }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.dot }}
            />
            {technology}
        </span>
    );
}