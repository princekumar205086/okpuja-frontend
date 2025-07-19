import axios from 'axios';

// Test refresh token endpoint
export const testRefreshEndpoint = async (refreshToken: string) => {
  console.log('🧪 Testing refresh token endpoint...');
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.okpuja.com/api';
  
  try {
    console.log('📤 Sending request to:', `${API_BASE_URL}/auth/refresh/`);
    console.log('📤 With refresh token:', refreshToken.substring(0, 50) + '...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
      refresh: refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ Refresh successful!');
    console.log('📥 Response data:', response.data);
    
    return {
      success: true,
      data: response.data,
      hasNewRefreshToken: !!response.data.refresh,
    };
    
  } catch (error: any) {
    console.error('❌ Refresh failed!');
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    
    return {
      success: false,
      error: {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      },
    };
  }
};

// Test if tokens are in the correct format
export const validateTokenFormat = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Token does not have 3 parts' };
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    return {
      valid: true,
      payload,
      expired: payload.exp < currentTime,
      expiresAt: new Date(payload.exp * 1000),
      timeToExpiry: Math.max(0, payload.exp - currentTime),
    };
  } catch (error) {
    return { valid: false, reason: 'Invalid token format', error };
  }
};

// Test login endpoint
export const testLoginEndpoint = async (email: string, password: string) => {
  console.log('🧪 Testing login endpoint...');
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.okpuja.com/api';
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ Login successful!');
    console.log('📥 Response data:', {
      ...response.data,
      access: response.data.access?.substring(0, 50) + '...',
      refresh: response.data.refresh?.substring(0, 50) + '...',
    });
    
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error: any) {
    console.error('❌ Login failed!');
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    return {
      success: false,
      error: {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      },
    };
  }
};
