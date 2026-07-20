const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchSummary() {
  const res = await fetch(`${API_URL}/stats/summary`);
  if (!res.ok) throw new Error("Error fetching summary");
  return res.json();
}

export async function fetchJobs(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API_URL}/jobs/${query}`);
  if (!res.ok) throw new Error("Error fetching jobs");
  return res.json();
}

export async function fetchJob(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}`);
  if (!res.ok) throw new Error("Error fetching job");
  return res.json();
}

export async function fetchTopTechnologies() {
  const res = await fetch(`${API_URL}/stats/top-technologies`);
  if (!res.ok) throw new Error("Error fetching technologies");
  return res.json();
}

export async function fetchModality() {
  const res = await fetch(`${API_URL}/stats/modality`);
  if (!res.ok) throw new Error("Error fetching modality");
  return res.json();
}

export async function fetchJobsPerDay() {
  const res = await fetch(`${API_URL}/stats/jobs-per-day`);
  if (!res.ok) throw new Error("Error fetching jobs per day");
  return res.json();
}

export async function fetchTopCompanies() {
  const res = await fetch(`${API_URL}/stats/top-companies`);
  if (!res.ok) throw new Error("Error fetching companies");
  return res.json();
}