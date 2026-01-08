'use client';

import { useQuery } from '@tanstack/react-query';

export interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  repo: string;
  __v: number;
}

export interface AllEipsResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

const fetchAllEipsData = async (): Promise<AllEipsResponse> => {
  const response = await fetch('/api/new/all');
  if (!response.ok) {
    throw new Error('Failed to fetch EIPs data');
  }

  return response.json();
};

export const useAllEipsData = () => {
  const { data, isLoading, error } = useQuery<AllEipsResponse>({
    queryKey: ['all-eips-data'],
    queryFn: fetchAllEipsData,
    staleTime: 5 * 60 * 1000,
  });

  return { data, isLoading, error };
};
