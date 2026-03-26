import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LocalityRisk, Alert, Incident, LocalitySearchResult } from '@/backend';

export function useLocalityRisks() {
  const { actor, isFetching } = useActor();

  return useQuery<LocalityRisk[]>({
    queryKey: ['localityRisks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLocalityRisks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchLocality(locality: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LocalityRisk | null>({
    queryKey: ['locality', locality],
    queryFn: async () => {
      if (!actor || !locality) return null;
      return actor.searchLocality(locality);
    },
    enabled: !!actor && !isFetching && !!locality,
  });
}

export function useLocalitySearchResults(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LocalitySearchResult[]>({
    queryKey: ['localitySearchResults', searchText],
    queryFn: async () => {
      if (!actor || !searchText || searchText.length === 0) return [];
      return actor.getLocalitySearchResults(searchText);
    },
    enabled: !!actor && !isFetching && !!searchText && searchText.length > 0,
  });
}

export function useAlerts() {
  const { actor, isFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncidentTrends() {
  const { actor, isFetching } = useActor();

  return useQuery<[string, bigint][]>({
    queryKey: ['incidentTrends'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncidentTrends('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncidentTypeDistribution() {
  const { actor, isFetching } = useActor();

  return useQuery<[string, bigint][]>({
    queryKey: ['incidentTypeDistribution'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncidentTypeDistribution();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePeakIncidentHours() {
  const { actor, isFetching } = useActor();

  return useQuery<[bigint, bigint][]>({
    queryKey: ['peakIncidentHours'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPeakIncidentHours('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAboutInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    dataSource: string;
    riskCalculationMethod: string;
    privacyStatement: string;
  }>({
    queryKey: ['aboutInfo'],
    queryFn: async () => {
      if (!actor)
        return {
          dataSource: '',
          riskCalculationMethod: '',
          privacyStatement: '',
        };
      return actor.getAboutInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitializeSampleData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.initializeSampleData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localityRisks'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
