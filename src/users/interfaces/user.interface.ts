export type Role = 'ADMIN' | 'DEVELOPER' | 'INTERN';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}
