import { useCallback, useEffect, useState } from "react";
import type { Funko, NewFunko, UpdateFunko } from "@/types";
import * as funkoService from "@/services/funko.service";

/**
 * React hook that wraps the Funko service layer with local state management.
 *
 * All Supabase logic lives in `funko.service.ts` — this hook is a thin React
 * adapter that manages loading/error state and keeps a local cache of funkos.
 */
export function useFunkos() {
  const [funkos, setFunkos] = useState<Funko[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFunkos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await funkoService.fetchAllFunkos();
      setFunkos(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return [] as Funko[];
    } finally {
      setLoading(false);
    }
  }, []);

  const getFunkoById = useCallback(async (id: number) => {
    setError(null);
    try {
      return await funkoService.fetchFunkoById(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    }
  }, []);

  const createFunko = useCallback(async (payload: NewFunko) => {
    setLoading(true);
    setError(null);
    try {
      const created = await funkoService.createFunko(payload);
      setFunkos((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFunko = useCallback(async (id: number, updates: UpdateFunko) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await funkoService.updateFunko(id, updates);
      setFunkos((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFunko = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await funkoService.deleteFunko(id);
      setFunkos((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFunkos();
  }, [fetchFunkos]);

  return {
    funkos,
    loading,
    error,
    fetchFunkos,
    getFunkoById,
    createFunko,
    updateFunko,
    deleteFunko,
  };
}
