import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="glass-panel overflow-hidden flex flex-col justify-between bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-square shimmer-bg w-full" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3 bg-white flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 shimmer-bg rounded w-1/4" />
          <div className="h-4 shimmer-bg rounded w-4/5" />
          <div className="h-3 shimmer-bg rounded w-2/5" />
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="h-5 shimmer-bg rounded w-1/3" />
          <div className="h-9 shimmer-bg rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

