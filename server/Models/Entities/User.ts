export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  avatar: string;
  position: string;
  role: 'user' | 'admin';
}
