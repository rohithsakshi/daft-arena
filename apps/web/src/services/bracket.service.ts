import { fetchApi } from './api.client';
import { IBracket } from '../modules/brackets/models/Bracket';

export const BracketServiceAPI = {
  createBracket: async (data: any): Promise<IBracket> => {
    const res = await fetchApi<{ success: boolean; data: IBracket }>('/brackets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  getBracketsByEvent: async (eventId: string): Promise<IBracket[]> => {
    const res = await fetchApi<{ success: boolean; data: IBracket[] }>(`/brackets?eventId=${eventId}`);
    return res.data;
  },
  
  getBracket: async (bracketId: string): Promise<IBracket> => {
    const res = await fetchApi<{ success: boolean; data: IBracket }>(`/brackets/${bracketId}`);
    return res.data;
  },
  
  archiveBracket: async (bracketId: string): Promise<void> => {
    await fetchApi(`/brackets/${bracketId}`, {
      method: 'DELETE',
    });
  }
};
