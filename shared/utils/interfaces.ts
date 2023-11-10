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
  mixedIncome: boolean;
  affordabilityTerm: number;
  priorityAmi?: number;
  unhoused?: boolean;
  marketRate?: boolean;
};

export type Program = {
  name: string;
  criteria: ProgramCriteria;
  description: string;
  link?: string;
};
