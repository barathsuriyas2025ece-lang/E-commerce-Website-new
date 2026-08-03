import React from 'react';

const SkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel p-4 animate-pulse space-y-4">
          <div className="aspect-square bg-slate-800 rounded-lg w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-8 bg-slate-800 rounded w-full pt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
