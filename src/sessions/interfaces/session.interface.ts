export interface Session {
  id?: string;
  userId: string;
  userName: string;
  email: string;
  loginTime: string;
  logoutTime?: string | null;
  duration?: string | null;
  isActive: boolean;
}