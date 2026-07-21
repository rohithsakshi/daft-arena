import { fetchApi } from './api.client';
import { ITournamentEvent } from '../modules/tournaments/models/Event';
import { IVenue } from '../modules/tournaments/models/Venue';
import { IPlayingArea } from '../modules/tournaments/models/PlayingArea';
import { IRegistration } from '../modules/tournaments/models/Registration';
import { PaginatedResponse } from '../modules/core/interfaces';
import { RegistrationStatus } from '../modules/core/enums';

export const EventService = {
  listByTournament: (tournamentId: string) => {
    return fetchApi<{ data: ITournamentEvent[] }>(`/tournaments/${tournamentId}/events`);
  },

  getById: (id: string) => {
    return fetchApi<{ data: ITournamentEvent }>(`/events/${id}`);
  },

  create: (tournamentId: string, data: Partial<ITournamentEvent>) => {
    return fetchApi<{ data: ITournamentEvent }>(`/tournaments/${tournamentId}/events`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: Partial<ITournamentEvent>) => {
    return fetchApi<{ data: ITournamentEvent }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (id: string) => {
    return fetchApi<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  }
};

export const VenueService = {
  list: (params?: { page?: number; limit?: number; query?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.query) searchParams.set('query', params.query);
    
    return fetchApi<PaginatedResponse<IVenue>>(`/venues?${searchParams.toString()}`);
  },

  getById: (id: string) => {
    return fetchApi<{ data: IVenue }>(`/venues/${id}`);
  },

  create: (data: Partial<IVenue>) => {
    return fetchApi<{ data: IVenue }>('/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: Partial<IVenue>) => {
    return fetchApi<{ data: IVenue }>(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  listPlayingAreas: (venueId: string) => {
    return fetchApi<PaginatedResponse<IPlayingArea>>(`/venues/${venueId}/playing-areas`);
  },

  createPlayingArea: (venueId: string, data: Partial<IPlayingArea>) => {
    return fetchApi<{ data: IPlayingArea }>(`/venues/${venueId}/playing-areas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

export const RegistrationService = {
  listByEvent: (eventId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    return fetchApi<PaginatedResponse<IRegistration>>(`/events/${eventId}/registrations?${searchParams.toString()}`);
  },

  create: (eventId: string, data: Partial<IRegistration>) => {
    return fetchApi<{ data: IRegistration }>(`/events/${eventId}/registrations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: (id: string, status: RegistrationStatus, reason?: string) => {
    return fetchApi<{ data: IRegistration }>(`/registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }
};
