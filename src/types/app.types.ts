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

// only returned from createToken api call
export interface TokenWithToken extends Token {
  token: string;
}

export interface Session {
  id: string;
  created_at: string;
  expires_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  subject: string;
  audience: string;
  created_at: string;
}
