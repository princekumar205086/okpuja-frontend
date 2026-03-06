import { useState, useCallback } from "react";
import { authService } from "@/lib/services";
import { handleApiError } from "@/lib/api/errorHandler";
import type { UserProfile, LoginRequest, CheckRoleResponse } from "@/types";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authService.getProfile();
      setProfile(data);
      return data;
    } catch (err) {
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (values: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(values);
      setProfile(data);
      return data;
    } catch (err) {
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, fetch, update };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (values: LoginRequest) => {
    setLoading(true);
    try {
      return await authService.loginAndStore(values);
    } catch (err) {
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading };
}

export function useCheckRole() {
  const [role, setRole] = useState<CheckRoleResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authService.checkRole();
      setRole(data);
      return data;
    } catch (err) {
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { role, loading, check };
}
