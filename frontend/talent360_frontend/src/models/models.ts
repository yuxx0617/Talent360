export interface MenuList {
  label: string;
  icon?: string;
  link?: string;
  children?: MenuList[];
}

export interface AnnounceList {
  id: number;
  type: string;
  title: string;
  content: string;
  updateTime: Date;
  isStar: boolean;
}

