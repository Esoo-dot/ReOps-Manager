'use client';

import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import type {
  ListOperationsRecordsParams,
  OperationsRecord,
  OperationsRecordInput,
  OperationsRecordUpdate,
  OperationsSummary,
} from './types';

const RECORDS_URL = '/api/operations/records';
const SUMMARY_URL = '/api/operations/summary';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed with ${response.status}`);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}

function useQuery<T>(key: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(key, (url: string) => request<T>(url));
  return { data, error, isLoading, isError: Boolean(error), refetch: () => mutate() };
}

type MutateCallbacks<R> = { onSuccess?: (result: R) => void; onError?: (error: Error) => void };

function useMutation<V, R>(run: (variables: V) => Promise<R>) {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(
    (variables: V, callbacks?: MutateCallbacks<R>) => {
      setIsPending(true);
      run(variables)
        .then(result => callbacks?.onSuccess?.(result))
        .catch((error: Error) => callbacks?.onError?.(error))
        .finally(() => setIsPending(false));
    },
    [run],
  );
  return { mutate, isPending };
}

export function useListOperationsRecords(params?: ListOperationsRecordsParams) {
  return useQuery<OperationsRecord[]>(params?.kind ? `${RECORDS_URL}?kind=${params.kind}` : RECORDS_URL);
}

export function useGetOperationsSummary() {
  return useQuery<OperationsSummary>(SUMMARY_URL);
}

const createRecord = ({ data }: { data: OperationsRecordInput }) =>
  request<OperationsRecord>(RECORDS_URL, { method: 'POST', body: JSON.stringify(data) });
const updateRecord = ({ id, data }: { id: number; data: OperationsRecordUpdate }) =>
  request<OperationsRecord>(`${RECORDS_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
const deleteRecord = ({ id }: { id: number }) => request<void>(`${RECORDS_URL}/${id}`, { method: 'DELETE' });

export const useCreateOperationsRecord = () => useMutation(createRecord);
export const useUpdateOperationsRecord = () => useMutation(updateRecord);
export const useDeleteOperationsRecord = () => useMutation(deleteRecord);

export function useRefreshData() {
  const { mutate } = useSWRConfig();
  return useCallback(
    () => mutate((key: unknown) => typeof key === 'string' && key.startsWith('/api/operations/')),
    [mutate],
  );
}
