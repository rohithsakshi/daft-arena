import { NextResponse } from 'next/server';

export function withErrorHandler(handler: (...args: any[]) => any) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: {
            message: error.message || 'Internal Server Error',
            code: error.code || 'UNKNOWN_ERROR'
          }
        }, 
        { status: error.status || 500 }
      );
    }
  };
}
