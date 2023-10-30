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
