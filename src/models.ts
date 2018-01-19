export type Config = Section[];

export interface Section {
  title: string;
  links: Link[][];
}

export interface Link {
  name: string;
  url: string;
}

export interface LinkId {
  section: string;
  sectionLinks?: string;
  link?: string;
}
