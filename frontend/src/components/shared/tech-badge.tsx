const TECH_CONFIG: Record<string, {
    dot: string;
    fg: string;
    bg: string;
}> = {
    "React": { dot: "#61dafb", fg: "#0b7285", bg: "#e7f8fd" },
    "Next.js": { dot: "#111111", fg: "#111111", bg: "#f2f2f3" },
    "TypeScript": { dot: "#3178c6", fg: "#2059a6", bg: "#e8effb" },
    "JavaScript": { dot: "#f7df1e", fg: "#8a6d00", bg: "#fdf7e0" },
    "Vue": { dot: "#42b883", fg: "#2c8560", bg: "#e7f7ef" },
    "Angular": { dot: "#dd0031", fg: "#b30320", bg: "#fdeaec" },
    "Node.js": { dot: "#539e43", fg: "#3c6c2a", bg: "#ecf5e8" },
    "Python": { dot: "#3776ab", fg: "#2b5a86", bg: "#eaf1f8" },
    "Django": { dot: "#092e20", fg: "#0c4b33", bg: "#e6f0ec" },
    "FastAPI": { dot: "#009688", fg: "#00695c", bg: "#e6f4f3" },
    "Java": { dot: "#e76f00", fg: "#a8480a", bg: "#fdefe6" },
    "Go": { dot: "#00add8", fg: "#0b7c99", bg: "#e6f7fb" },
    "PHP": { dot: "#777bb4", fg: "#4b4f97", bg: "#eeeefb" },
    "Laravel": { dot: "#ff2d20", fg: "#b32b1f", bg: "#fdeceb" },
    "Ruby": { dot: "#cc342d", fg: "#a01d17", bg: "#fceceb" },
    "Docker": { dot: "#2496ed", fg: "#1665c0", bg: "#e7f1fd" },
    "Kubernetes": { dot: "#326ce5", fg: "#2647c2", bg: "#e9edfc" },
    "AWS": { dot: "#ff9900", fg: "#a35800", bg: "#fff2e0" },
    "PostgreSQL": { dot: "#4169e1", fg: "#2b4a86", bg: "#e9edf8" },
    "MongoDB": { dot: "#00ed64", fg: "#237a3a", bg: "#e9f6ec" },
    "GraphQL": { dot: "#e10098", fg: "#a3106e", bg: "#fcebf5" },
    "Tailwind": { dot: "#38bdf8", fg: "#0d7490", bg: "#e6f7fb" },
    "Flutter": { dot: "#54c5f8", fg: "#1a6cc0", bg: "#e6f4fd" },
    "Kotlin": { dot: "#7f52ff", fg: "#6a2fb0", bg: "#f2eafb" },
    "Swift": { dot: "#f05138", fg: "#c14e0f", bg: "#fdeee6" },
    "React Native": { dot: "#61dafb", fg: "#0b7285", bg: "#e7f8fd" },
    "Redux": { dot: "#764abc", fg: "#5a3490", bg: "#f0ebfb" },
    "Azure": { dot: "#0078d4", fg: "#005a9e", bg: "#e6f2fc" },
};

const FALLBACK = { dot: "#9ca3af", fg: "#4b4b57", bg: "#f2f2f5" };

interface TechBadgeProps {
    technology: string;
}

export function TechBadge({ technology }: TechBadgeProps) {
    const config = TECH_CONFIG[technology] ?? FALLBACK;

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