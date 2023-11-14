export interface LabelType {
  name: string;
  color: string;
  description?: string;
}

export interface FilterType {
  title: string;
  desc: string;
  labels: LabelType[];
}

export type ProgramCriteria = {
  amiRange: [number, number];
  adaRange: [number, number];
  unhoused: boolean;
  firstTimeHomebuyers?: boolean;
  mixedIncome: boolean;
  affordabilityTerm: [number, number];
  constructionStartDate?: Date;
  dateOfOccupancyRequired?: Date;
};

export type Program = {
  name: string;
  level?: string;
  criteria: ProgramCriteria;
  description: string;
  link?: string;
};
