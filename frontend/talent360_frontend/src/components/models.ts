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
