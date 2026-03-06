import { useState, useCallback } from "react";
import { eventService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { Event } from "@/types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (params?: Record<string, string | number>) => {
    setLoading(true);
    try {
      const { data } = await eventService.list(params);
      setEvents(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, fetch };
}

export function useFeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await eventService.getFeatured();
      setEvents(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, fetch };
}

export function useEventDetail() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const { data } = await eventService.getBySlug(slug);
      setEvent(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { event, loading, fetch };
}
