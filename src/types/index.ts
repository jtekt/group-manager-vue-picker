export interface GroupItem {
  _id: string;
  name?: string;
  avatar_src?: string;
  [key: string]: unknown;
}

export interface User {
  _id: string;
  display_name?: string;
  name_kanji?: string;
  name?: string;
  full_name?: string;
  username?: string;
  name_romaji?: string;
  email_address?: string;
  avatar_src?: string;
  role?: string;
  [key: string]: unknown;
}
