
export type AssetType = 'text' | 'image' | 'video' | 'audio' | 'pitch';

export interface ContentAsset {
  id: string;
  type: AssetType;
  title: string;
  content: string; // Text content, image/video URL, or base64 audio
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
}

export interface Campaign {
  id: string;
  name: string;
  seed: string;
  assets: ContentAsset[];
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  status: string;
  color: string;
  link?: string;
  github?: string;
  folderId?: string; // Reference to a folder
}

export interface FolderItem {
  id: string;
  title: string;
  link: string;
  type: 'link' | 'file' | 'github';
}

export interface ProjectFolder {
  id: string;
  name: string;
  icon: string; // Icon name string
  items: FolderItem[];
}

export interface ProfileData {
  avatar?: string; // base64
  resumeName?: string;
  resumeData?: string; // base64
  biography?: string;
  brandStatement?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  projects?: Project[];
  folders?: ProjectFolder[];
}

export enum AppSection {
  DASHBOARD = 'dashboard',
  STUDIO = 'studio',
  LIVE_COACH = 'live_coach',
  GALLERY = 'gallery',
  SETTINGS = 'settings',
  HELP = 'help',
  PORTFOLIO = 'portfolio'
}
