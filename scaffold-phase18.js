const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname);
const srcDir = path.join(__dirname, 'apps', 'web', 'src');

const files = {
  // DEVOPS & CI/CD
  'Dockerfile': `FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
`,
  'docker-compose.yml': `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=\${MONGODB_URI}
      - JWT_SECRET=\${JWT_SECRET}
    restart: always
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
`,
  'ecosystem.config.js': `module.exports = {
  apps: [{
    name: 'daft-arena-web',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' }
  }]
};
`,
  '.env.production.example': `NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/daft_arena_prod
JWT_SECRET=your_super_secret_jwt_key
NEXT_PUBLIC_API_URL=https://api.daftarena.com
`,
  '.github/workflows/ci.yml': `name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm tsc --noEmit
      - run: pnpm build
`,

  // ERROR BOUNDARIES
  'apps/web/src/app/not-found.tsx': `import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">404 - Not Found</h1>
          <p className="text-muted-foreground">The resource you requested could not be found.</p>
        </div>
        <Link href="/" className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
`,
  'apps/web/src/app/error.tsx': `'use client';
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">We've logged the error and are looking into it.</p>
        </div>
        <button onClick={reset} className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}
`,

  // STORAGE ABSTRACTION
  'apps/web/src/lib/storage/IStorageProvider.ts': `export interface IStorageProvider {
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
  getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string>;
}
`,
  'apps/web/src/lib/storage/DefaultStorageProvider.ts': `import { IStorageProvider } from './IStorageProvider';

export class DefaultStorageProvider implements IStorageProvider {
  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    return \`https://storage.daftarena.com/mock/\${fileName}\`;
  }
  async deleteFile(fileUrl: string): Promise<boolean> {
    return true;
  }
  async getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string> {
    return \`\${fileUrl}?signed=true\`;
  }
}
`,

  // OBSERVABILITY & SECURITY
  'apps/web/src/lib/observability/logger.ts': `export const logger = {
  info: (msg: string, meta?: any) => console.log(JSON.stringify({ level: 'info', msg, meta, timestamp: new Date().toISOString() })),
  warn: (msg: string, meta?: any) => console.warn(JSON.stringify({ level: 'warn', msg, meta, timestamp: new Date().toISOString() })),
  error: (msg: string, error?: any, meta?: any) => console.error(JSON.stringify({ level: 'error', msg, error: error?.message, meta, timestamp: new Date().toISOString() }))
};
`,
  'apps/web/src/lib/security/rateLimit.ts': `import { NextResponse } from 'next/server';

const requestCounts = new Map<string, { count: number, resetTime: number }>();

export function rateLimit(ip: string, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count++;
  return true;
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(rootDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filePath);
}
