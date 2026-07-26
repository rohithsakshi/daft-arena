'use client';
import React, { useEffect, useState } from 'react';

export function OrgDashboard({ orgId }: { orgId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium">Teams</h3>
        <p className="text-3xl font-bold text-white mt-2">0</p>
      </div>
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium">Members</h3>
        <p className="text-3xl font-bold text-white mt-2">0</p>
      </div>
    </div>
  );
}
