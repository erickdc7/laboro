export interface JobTechnology {
  id: number;
  technology: string;
}

export interface Job {
  id: number;
  title: string;
  company: string | null;
  description: string | null;
  location: string | null;
  modality: string | null;
  salary_min: number | null;
  salary_max: number | null;
  url_original: string;
  source_id: number;
  source_name: string;
  is_active: boolean;
  scraped_at: string;
  published_at: string | null;
  technologies: JobTechnology[];
}