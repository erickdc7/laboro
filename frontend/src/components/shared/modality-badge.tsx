import { Wifi, Building2, Blend } from "lucide-react";

type Modality = "remote" | "on-site" | "hybrid" | string;

const MODALITY_CONFIG: Record<string, {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
}> = {
    remote: {
        label: "Remoto",
        bg: "#e7f6ee",
        text: "#177245",
        border: "#c3e8d3",
        icon: Wifi,
    },
    "on-site": {
        label: "Presencial",
        bg: "#e8eefb",
        text: "#2a4db0",
        border: "#c9d6f5",
        icon: Building2,
    },
    hybrid: {
        label: "Híbrido",
        bg: "#fdf1e0",
        text: "#9a6700",
        border: "#f5dfb2",
        icon: Blend,
    },
};

const FALLBACK = {
    label: "Presencial",
    bg: "#e8eefb",
    text: "#2a4db0",
    border: "#c9d6f5",
    icon: Building2,
};

interface ModalityBadgeProps {
    modality: Modality;
}

export function ModalityBadge({ modality }: ModalityBadgeProps) {
    const config = MODALITY_CONFIG[modality] ?? FALLBACK;
    const Icon = config.icon;

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border"
            style={{
                backgroundColor: config.bg,
                color: config.text,
                borderColor: config.border,
            }}
        >
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}