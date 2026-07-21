import { fetchApi } from './api.client';
import { ITournament } from '../modules/tournaments/models/Tournament';
import { PaginatedResponse } from '../modules/core/interfaces';
import { TournamentStatus } from '../modules/core/enums';

export const TournamentService = {
  list: (params?: { page?: number; limit?: number; query?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.query) searchParams.set('query', params.query);
    
    return fetchApi<PaginatedResponse<ITournament>>(`/tournaments?${searchParams.toString()}`);
  },

  getById: (id: string) => {
    return fetchApi<{ data: ITournament }>(`/tournaments/${id}`);
  },

  create: (data: Partial<ITournament>) => {
    return fetchApi<{ data: ITournament }>('/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: Partial<ITournament>) => {
    return fetchApi<{ data: ITournament }>(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changeStatus: (id: string, status: TournamentStatus) => {
    return fetchApi<{ data: ITournament }>(`/tournaments/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  deleteDraft: (id: string) => {
    return fetchApi<{ message: string }>(`/tournaments/${id}`, {
      method: 'DELETE',
    });
  }
};
