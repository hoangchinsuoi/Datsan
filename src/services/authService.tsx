import { MOCK_USER } from './api';

export const authService = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_USER;
  },
  register: async (userData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...MOCK_USER, ...userData };
  },
  logout: () => {
    // Clear local storage or session
  }
};
