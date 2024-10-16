export interface User {
  email: string;
  last_login: string;
  uid: string;
}

export interface Token {
  id: string;
  name: string;
  expires_at: string | null;
  created_at: string;
  last_used_at: string | null;
}
