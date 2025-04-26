
export type CompanyData = {
  name: string;
  description: string;
  website?: string;
  patents?: string;
  techCategory: string[];
  stage: string;
  teamSize: string;
  foundedYear: string;
};

export type ProjectData = {
  title: string;
  description: string;
  techSpecs: string;
  budget: string;
  timeline: string;
  interests: string[];
};

export type FormData = {
  company: CompanyData;
  project: ProjectData;
};
