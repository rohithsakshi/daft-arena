import { fetchApi } from './api.client';
export interface LoginDto {
  email: string;
  password?: string;
}

export const AuthService = {
  login: async (data: LoginDto) => {
    return fetchApi<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return fetchApi<{ data: any }>('/auth/me'); // Assuming an endpoint to fetch current user profile/permissions exists
  }
};
