import { Platform } from 'react-native';

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  details: {
    baseUrl: string;
    endpoint: string;
    method: string;
    status?: number;
    statusText?: string;
    responseTime: number;
    timestamp: string;
  };
  response?: any;
}

export async function testBackendConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Get the base URL - prioritize current window location for web
  let baseUrl: string;
  if (typeof window !== 'undefined' && window.location) {
    baseUrl = `${window.location.protocol}//${window.location.host}`;
    console.log('[ConnectionTest] Using current window location:', baseUrl);
  } else if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    console.log('[ConnectionTest] Using env variable:', baseUrl);
  } else {
    baseUrl = 'http://localhost:3000';
    console.log('[ConnectionTest] Using localhost fallback:', baseUrl);
  }
  
  const endpoint = `${baseUrl}/api`;
  
  try {
    console.log('[ConnectionTest] Testing backend connection to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add timeout for web
      ...(Platform.OS === 'web' && {
        signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
      })
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log('[ConnectionTest] Response status:', response.status, response.statusText);
    
    let responseData;
    try {
      responseData = await response.json();
      console.log('[ConnectionTest] Response data:', responseData);
    } catch (e) {
      console.warn('[ConnectionTest] Failed to parse response as JSON:', e);
      responseData = { error: 'Failed to parse response' };
    }
    
    const result: ConnectionTestResult = {
      success: response.ok,
      details: {
        baseUrl,
        endpoint,
        method: 'GET',
        status: response.status,
        statusText: response.statusText,
        responseTime,
        timestamp
      },
      response: responseData
    };
    
    if (!response.ok) {
      result.error = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    return result;
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('[ConnectionTest] Connection failed:', error);
    
    return {
      success: false,
      error: error.message || String(error),
      details: {
        baseUrl,
        endpoint,
        method: 'GET',
        responseTime,
        timestamp
      }
    };
  }
}

export async function testTRPCConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Get the base URL - prioritize current window location for web
  let baseUrl: string;
  if (typeof window !== 'undefined' && window.location) {
    baseUrl = `${window.location.protocol}//${window.location.host}`;
    console.log('[ConnectionTest] Using current window location for tRPC:', baseUrl);
  } else if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    console.log('[ConnectionTest] Using env variable for tRPC:', baseUrl);
  } else {
    baseUrl = 'http://localhost:3000';
    console.log('[ConnectionTest] Using localhost fallback for tRPC:', baseUrl);
  }
  
  const endpoint = `${baseUrl}/api/trpc/example.hiQuery`;
  
  try {
    console.log('[ConnectionTest] Testing tRPC connection to:', endpoint);
    
    // For tRPC query, we need to pass parameters as URL query params
    const queryParams = new URLSearchParams({
      input: JSON.stringify({ name: 'Connection Test' })
    });
    const fullEndpoint = `${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(fullEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add timeout for web
      ...(Platform.OS === 'web' && {
        signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
      })
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log('[ConnectionTest] tRPC Response status:', response.status, response.statusText);
    
    let responseData;
    try {
      responseData = await response.json();
      console.log('[ConnectionTest] tRPC Response data:', responseData);
    } catch (e) {
      console.warn('[ConnectionTest] Failed to parse tRPC response as JSON:', e);
      responseData = { error: 'Failed to parse response' };
    }
    
    const result: ConnectionTestResult = {
      success: response.ok,
      details: {
        baseUrl,
        endpoint,
        method: 'GET',
        status: response.status,
        statusText: response.statusText,
        responseTime,
        timestamp
      },
      response: responseData
    };
    
    if (!response.ok) {
      result.error = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    return result;
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('[ConnectionTest] tRPC Connection failed:', error);
    
    return {
      success: false,
      error: error.message || String(error),
      details: {
        baseUrl,
        endpoint,
        method: 'GET',
        responseTime,
        timestamp
      }
    };
  }
}