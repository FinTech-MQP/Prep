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

export interface Listing {
  name: string | null;
  desc: string | null;
  address: string | null;
  parcelID: string | null;
  images: string[] | null;
  labels: string[] | null;
}
