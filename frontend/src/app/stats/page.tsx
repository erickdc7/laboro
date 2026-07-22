"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Briefcase,
    Cpu,
    Wifi,
    Building2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import {
    fetchSummary,
    fetchTopTechnologies,
    fetchModality,
    fetchJobsPerDay,
    fetchTopCompanies,
} from "@/lib/api";

const MODALITY_COLORS: Record<string, string> = {
    remote: "#10b981",
    "on-site": "#4f46e5",
    hybrid: "#f59e0b",
    unknown: "#9ca3af",
};

const MODALITY_LABELS: Record<string, string> = {
    remote: "Remoto",
    "on-site": "Presencial",
    hybrid: "Híbrido",
    unknown: "Sin especificar",
};

interface ChartCardProps {
    title: string;
    subtitle: string;
    isLoading: boolean;
    children: React.ReactNode;
}

function ChartCard({ title, subtitle, isLoading, children }: ChartCardProps) {
    return (
        <Card className="p-5">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">{subtitle}</p>
            {isLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
                children
            )}
        </Card>
    );
}

export default function StatsPage() {
    const { data: summary, isLoading: summaryLoading } = useQuery({
        queryKey: ["summary"],
        queryFn: fetchSummary,
    });

    const { data: technologies, isLoading: techLoading } = useQuery({
        queryKey: ["top-technologies"],
        queryFn: fetchTopTechnologies,
    });

    const { data: modality, isLoading: modalityLoading } = useQuery({
        queryKey: ["modality"],
        queryFn: fetchModality,
    });

    const { data: jobsPerDay, isLoading: jobsPerDayLoading } = useQuery({
        queryKey: ["jobs-per-day"],
        queryFn: fetchJobsPerDay,
    });

    const { data: companies, isLoading: companiesLoading } = useQuery({
        queryKey: ["top-companies"],
        queryFn: fetchTopCompanies,
    });

    const remotePercentage = modality
        ? modality.find((m: { modality: string; percentage: number }) =>
            m.modality === "remote"
        )?.percentage ?? 0
        : 0;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">
                    Estadísticas del mercado
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Radiografía del empleo tech en Perú, actualizada diariamente.
                </p>
            </div>

            {/* StatCards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {summaryLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            label="Empleos activos"
                            value={summary?.total_jobs ?? 0}
                            hint="Total vigente"
                            icon={Briefcase}
                        />
                        <StatCard
                            label="Tech más demandada"
                            value={summary?.top_technology ?? "—"}
                            hint="Por número de vacantes"
                            icon={Cpu}
                        />
                        <StatCard
                            label="Ofertas remotas"
                            value={`${remotePercentage}%`}
                            hint="Del total de vacantes"
                            icon={Wifi}
                        />
                        <StatCard
                            label="Empresa top"
                            value={companies?.[0]?.company ?? "—"}
                            hint="La que más contrata"
                            icon={Building2}
                        />
                    </>
                )}
            </div>

            {/* Gráficas — fila 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top tecnologías */}
                <ChartCard
                    title="Top tecnologías"
                    subtitle="Tecnologías más solicitadas"
                    isLoading={techLoading}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={technologies}
                            layout="vertical"
                            margin={{ left: 16, right: 16 }}
                        >
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis
                                type="category"
                                dataKey="technology"
                                tick={{ fontSize: 11 }}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                }}
                            />
                            <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Distribución por modalidad */}
                <ChartCard
                    title="Distribución por modalidad"
                    subtitle="Remoto, presencial e híbrido"
                    isLoading={modalityLoading}
                >
                    <div className="flex items-center gap-6">
                        <ResponsiveContainer width="60%" height={240}>
                            <PieChart>
                                <Pie
                                    data={modality}
                                    dataKey="count"
                                    nameKey="modality"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                >
                                    {modality?.map(
                                        (entry: { modality: string; count: number }) => (
                                            <Cell
                                                key={entry.modality}
                                                fill={
                                                    MODALITY_COLORS[entry.modality] ??
                                                    MODALITY_COLORS.unknown
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        fontSize: 12,
                                        borderRadius: 8,
                                        border: "1px solid var(--border)",
                                    }}
                                    formatter={(value, name) => [
                                        value,
                                        MODALITY_LABELS[name as string] ?? name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="flex flex-col gap-2">
                            {modality?.map(
                                (entry: {
                                    modality: string;
                                    count: number;
                                    percentage: number;
                                }) => (
                                    <div
                                        key={entry.modality}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    MODALITY_COLORS[entry.modality] ??
                                                    MODALITY_COLORS.unknown,
                                            }}
                                        />
                                        <span className="text-sm text-foreground">
                                            {MODALITY_LABELS[entry.modality] ?? entry.modality}
                                        </span>
                                        <span className="text-sm font-mono font-semibold text-foreground ml-auto">
                                            {entry.count}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Gráficas — fila 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nuevos empleos por día */}
                <ChartCard
                    title="Nuevos empleos por día"
                    subtitle="Últimos 30 días"
                    isLoading={jobsPerDayLoading}
                >
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart
                            data={jobsPerDay}
                            margin={{ left: 0, right: 16 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10 }}
                                tickFormatter={(val) =>
                                    new Date(val).toLocaleDateString("es-PE", {
                                        day: "numeric",
                                        month: "short",
                                    })
                                }
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                }}
                                labelFormatter={(val) =>
                                    new Date(val).toLocaleDateString("es-PE", {
                                        day: "numeric",
                                        month: "long",
                                    })
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="var(--chart-1)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Empresas que más publican */}
                <ChartCard
                    title="Empresas que más publican"
                    subtitle="Top 6 por número de vacantes"
                    isLoading={companiesLoading}
                >
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart
                            data={companies?.slice(0, 6)}
                            margin={{ left: 0, right: 16 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="company"
                                tick={{ fontSize: 10 }}
                                tickFormatter={(val) =>
                                    val.length > 10 ? val.slice(0, 10) + "…" : val
                                }
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                }}
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--chart-1)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}