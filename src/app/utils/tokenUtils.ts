/**
 * Token utilities for handling JWT tokens and debugging auto-logout issues
 */

export interface TokenData {
  access: string | null;
  refresh: string | null;
  user: any;
}

export const getStoredTokens = (): TokenData => {
  if (typeof window === 'undefined') {
    return { access: null, refresh: null, user: null };
  }

  try {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return { access, refresh, user };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return { access: null, refresh: null, user: null };
  }
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
};

export const debugTokenStatus = (): void => {
  const tokens = getStoredTokens();
  console.group('🔍 Token Debug Information');
  
  console.log('📦 Stored Tokens:', {
    hasAccess: !!tokens.access,
    hasRefresh: !!tokens.refresh,
    hasUser: !!tokens.user,
  });

  if (tokens.access) {
    const accessExpired = isTokenExpired(tokens.access);
    const accessExpTime = getTokenExpirationTime(tokens.access);
    console.log('🔑 Access Token:', {
      expired: accessExpired,
      expiresAt: accessExpTime?.toLocaleString(),
      timeUntilExpiry: accessExpTime ? Math.max(0, accessExpTime.getTime() - Date.now()) / 1000 / 60 : 0 + ' minutes'
    });
  }

  if (tokens.refresh) {
    const refreshExpired = isTokenExpired(tokens.refresh);
    const refreshExpTime = getTokenExpirationTime(tokens.refresh);
    console.log('🔄 Refresh Token:', {
      expired: refreshExpired,
      expiresAt: refreshExpTime?.toLocaleString(),
      timeUntilExpiry: refreshExpTime ? Math.max(0, refreshExpTime.getTime() - Date.now()) / 1000 / 60 : 0 + ' minutes'
    });
  }

  if (tokens.user) {
    console.log('👤 User Data:', {
      id: tokens.user.id,
      email: tokens.user.email,
      role: tokens.user.role,
      accountStatus: tokens.user.account_status,
    });
  }

  console.groupEnd();
};

export const clearAllTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
  
  // Notify other tabs
  window.dispatchEvent(new CustomEvent('logout'));
  
  console.log('🧹 All tokens cleared');
};

// Auto-logout detection utilities
const logoutReasonTracking = {
  lastRefreshAttempt: null as Date | null,
  refreshFailureCount: 0,
  networkErrors: 0,
  tokenRotationFailures: 0,
};

export const trackLogoutReason = (reason: string, details?: any): void => {
  console.warn('🚪 Auto-logout detected:', reason, details);
  
  switch (reason) {
    case 'refresh_failed':
      logoutReasonTracking.refreshFailureCount++;
      logoutReasonTracking.lastRefreshAttempt = new Date();
      break;
    case 'network_error':
      logoutReasonTracking.networkErrors++;
      break;
    case 'token_rotation_failed':
      logoutReasonTracking.tokenRotationFailures++;
      break;
  }
  
  console.table(logoutReasonTracking);
};

export const getLogoutAnalysis = (): any => {
  return {
    ...logoutReasonTracking,
    tokens: getStoredTokens(),
    timestamp: new Date().toISOString(),
  };
};
