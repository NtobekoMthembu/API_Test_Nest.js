export type Role = 'ADMIN' | 'DEVELOPER' | 'INTERN';

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
