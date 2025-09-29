import { trpcClient } from '@/lib/trpc';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  backendUrl?: string;
  latency?: number;
  error?: string;
}

export async function testBackendConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  
  try {
    // Get the backend URL being used
    const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 
      (typeof window !== 'undefined' && window.location ? 
        `${window.location.protocol}//${window.location.host}` : 
        'http://localhost:3000');
    const backendUrl = `${baseUrl}/api/trpc`;
    
    console.log('[ConnectionTest] Testing connection to:', backendUrl);
    
    // Test basic tRPC connection
    const result = await trpcClient.example.hi.mutate({ name: 'Connection Test' });
    
    const latency = Date.now() - startTime;
    
    if (result?.hello) {
      console.log('[ConnectionTest] Connection successful:', result);
      return {
        success: true,
        message: `Connected successfully! Response: ${result.hello}`,
        backendUrl,
        latency,
      };
    } else {
      console.warn('[ConnectionTest] Unexpected response:', result);
      return {
        success: false,
        message: 'Unexpected response from backend',
        backendUrl,
        latency,
        error: 'Invalid response format',
      };
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error('[ConnectionTest] Connection failed:', error);
    
    return {
      success: false,
      message: `Connection failed: ${errorMessage}`,
      latency,
      error: errorMessage,
    };
  }
}

export async function testAdminConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  
  try {
    console.log('[ConnectionTest] Testing admin dashboard connection...');
    
    // Test admin dashboard stats endpoint
    const stats = await trpcClient.admin.dashboard.getStats.query();
    
    const latency = Date.now() - startTime;
    
    if (stats?.platform) {
      console.log('[ConnectionTest] Admin connection successful');
      return {
        success: true,
        message: `Admin panel connected! Platform has ${stats.platform.activeUsers} active users`,
        latency,
      };
    } else {
      console.warn('[ConnectionTest] Unexpected admin response:', stats);
      return {
        success: false,
        message: 'Admin endpoint returned unexpected data',
        latency,
        error: 'Invalid admin response format',
      };
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error('[ConnectionTest] Admin connection failed:', error);
    
    return {
      success: false,
      message: `Admin connection failed: ${errorMessage}`,
      latency,
      error: errorMessage,
    };
  }
}

export async function runFullConnectionTest(): Promise<{
  backend: ConnectionTestResult;
  admin: ConnectionTestResult;
  overall: boolean;
}> {
  console.log('[ConnectionTest] Running full connection test...');
  
  const [backend, admin] = await Promise.all([
    testBackendConnection(),
    testAdminConnection(),
  ]);
  
  const overall = backend.success && admin.success;
  
  console.log('[ConnectionTest] Full test results:', {
    backend: backend.success ? '✅' : '❌',
    admin: admin.success ? '✅' : '❌',
    overall: overall ? '✅' : '❌',
  });
  
  return {
    backend,
    admin,
    overall,
  };
}
