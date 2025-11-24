export interface Source {
  title: string;
  url: string;
}

export interface NewsData {
  summary: string;
  sources: Source[];
  timestamp: string;
}

export type Region = 'USA' | 'Japan' | 'Europe' | 'Korea' | 'China' | 'Taiwan';

export interface RegionConfig {
  id: Region;
  label: string;
  flag: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}