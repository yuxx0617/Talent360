export interface MenuList {
  label: string;
  icon?: string;
  link?: string;
  children?: MenuList[];
}

export interface LoginInfo {
  account: string;
  password: string;
}

export interface announceList {
  id: number;
  type: string;
  title:string;
  content:string;
  updateTime:Date;
  isStar:boolean;
}
