import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BracketServiceAPI } from '../services/bracket.service';

export function useBrackets(eventId: string) {
  return useQuery({
    queryKey: ['brackets', eventId],
    queryFn: () => BracketServiceAPI.getBracketsByEvent(eventId),
    enabled: !!eventId,
  });
}

export function useBracket(bracketId: string) {
  return useQuery({
    queryKey: ['bracket', bracketId],
    queryFn: () => BracketServiceAPI.getBracket(bracketId),
    enabled: !!bracketId,
  });
}

export function useCreateBracket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => BracketServiceAPI.createBracket(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brackets', data.eventId] });
    },
  });
}

export function useArchiveBracket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bracketId: string) => BracketServiceAPI.archiveBracket(bracketId),
    onSuccess: (_, bracketId) => {
      queryClient.invalidateQueries({ queryKey: ['bracket', bracketId] });
      queryClient.invalidateQueries({ queryKey: ['brackets'] });
    },
  });
}
