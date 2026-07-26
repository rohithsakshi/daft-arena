// @ts-nocheck
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db/mongoose';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check if the connection is established and healthy
    const isConnected = mongoose.connection.readyState === 1;
    
    if (isConnected) {
      return NextResponse.json({ 
        status: 'ok', 
        database: 'connected',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        database: 'disconnected',
        readyState: mongoose.connection.readyState
      }, { status: 503 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}
