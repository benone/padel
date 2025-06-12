// API Request/Response Logger
import { PadelClubApi, OpenAPI } from '../api';
import type { OpenAPIConfig } from '../api';

// Custom logging wrapper for API requests
class LoggingPadelClubApi extends PadelClubApi {
  constructor(config?: Partial<OpenAPIConfig>) {
    super(config);
    
    // Override the request method to add logging
    const originalRequest = this.request.request.bind(this.request);
    
    this.request.request = async (options: any) => {
      const startTime = Date.now();
      const fullUrl = `${OpenAPI.BASE}${options.url}`;
      
      // Debug: Network environment information
      console.log('🔧 DEBUG - Network Environment:', {
        'platform': require('react-native').Platform.OS,
        'userAgent': global.navigator?.userAgent || 'N/A',
        'isWeb': typeof window !== 'undefined',
        'isSimulator': require('react-native').Platform.OS === 'ios' && require('react-native').Platform.isPad === false,
        'networkState': global.navigator?.onLine || 'unknown'
      });
      
      // Debug: Log configuration and request details
      console.log('🔧 DEBUG - API Configuration:', {
        'OpenAPI.BASE': OpenAPI.BASE,
        'options.url': options.url,
        'fullUrl': fullUrl,
        'typeof OpenAPI.BASE': typeof OpenAPI.BASE,
        'typeof options.url': typeof options.url,
        'process.env.API_BASE_URL': process.env.API_BASE_URL,
        'NODE_ENV': process.env.NODE_ENV
      });
      
      // Debug: Test network connectivity to the base URL
      try {
        console.log('🔧 DEBUG - Testing base URL connectivity...');
        const testResponse = await fetch(OpenAPI.BASE, { 
          method: 'HEAD',
          timeout: 5000
        });
        console.log('🔧 DEBUG - Base URL test result:', {
          status: testResponse.status,
          ok: testResponse.ok,
          headers: Object.fromEntries(testResponse.headers.entries())
        });
      } catch (testError) {
        console.log('🔧 DEBUG - Base URL test failed:', {
          error: testError.message,
          name: testError.constructor.name,
          stack: testError.stack
        });
      }
      
      const headers = await this.buildHeaders(options);
      
      console.log('📤 API REQUEST:', {
        method: options.method || 'GET',
        url: fullUrl,
        headers: headers,
        body: options.body,
        query: options.query,
        path: options.path,
        timestamp: new Date().toISOString(),
        requestInit: {
          method: options.method || 'GET',
          headers: headers,
          body: options.body
        }
      });
      
      // Debug: Check if URL contains unresolved placeholders and fix them
      let correctedUrl = fullUrl;
      if (fullUrl.includes('{id}') && options.id) {
        correctedUrl = fullUrl.replace('{id}', options.id);
        console.log('🔧 DEBUG - Fixed URL placeholder:', {
          original: fullUrl,
          corrected: correctedUrl,
          optionsId: options.id
        });
      }

      // Debug: Manual fetch test
      try {
        console.log('🔧 DEBUG - Manual fetch test...');
        const manualResponse = await fetch(correctedUrl, {
          method: options.method || 'GET',
          headers: headers,
          body: options.body
        });
        console.log('🔧 DEBUG - Manual fetch result:', {
          status: manualResponse.status,
          ok: manualResponse.ok,
          statusText: manualResponse.statusText,
          headers: Object.fromEntries(manualResponse.headers.entries())
        });
        
        if (manualResponse.ok) {
          const responseText = await manualResponse.text();
          const truncatedResponse = responseText.length > 500 ? 
            responseText.substring(0, 500) + '...[truncated]' : 
            responseText;
          console.log('🔧 DEBUG - Manual response body (first 500 chars):', truncatedResponse);
          
          // Return the manual response data
          const data = responseText ? JSON.parse(responseText) : null;
          console.log('🔧 DEBUG - Manual fetch returning data, bypassing original request');
          return data;
        } else {
          console.log('🔧 DEBUG - Manual fetch returned error status:', manualResponse.status);
          // Don't return data for non-200 responses, let it fall through to original request
        }
        
      } catch (manualError) {
        console.log('🔧 DEBUG - Manual fetch failed:', {
          error: manualError.message,
          name: manualError.constructor.name,
          stack: manualError.stack,
          cause: manualError.cause,
          errno: manualError.errno,
          syscall: manualError.syscall
        });
      }
      
      try {
        const response = await originalRequest(options);
        const duration = Date.now() - startTime;
        
        console.log('📥 API RESPONSE SUCCESS:', {
          url: fullUrl,
          status: 'success',
          duration: `${duration}ms`,
          data: response,
          timestamp: new Date().toISOString()
        });
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        // Debug: Log detailed error information
        console.log('🔧 DEBUG - Error Details:', {
          'error': error,
          'error.constructor.name': error?.constructor?.name,
          'error.message': error?.message,
          'error.status': error?.status,
          'error.url': error?.url,
          'fullUrl': fullUrl,
          'originalError': JSON.stringify(error, Object.getOwnPropertyNames(error)),
          'errorType': typeof error,
          'isNetworkError': error?.message?.includes?.('Network'),
          'isTimeoutError': error?.message?.includes?.('timeout'),
          'isCORSError': error?.message?.includes?.('CORS')
        });
        
        console.log('📥 API RESPONSE ERROR:', {
          url: fullUrl,
          status: 'error',
          duration: `${duration}ms`,
          error: {
            name: error?.constructor?.name || 'Unknown',
            message: error?.message || 'Unknown error',
            status: error?.status,
            statusText: error?.statusText,
            body: error?.body,
            stack: error?.stack,
            fullErrorObject: error
          },
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }
    };
  }
  
  private async buildHeaders(options: any): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      ...OpenAPI.HEADERS
    };
    
    // Add authorization header if token is available
    if (OpenAPI.TOKEN) {
      const token = typeof OpenAPI.TOKEN === 'function' 
        ? await OpenAPI.TOKEN(options) 
        : OpenAPI.TOKEN;
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Add custom headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    return headers;
  }
}

export { LoggingPadelClubApi };