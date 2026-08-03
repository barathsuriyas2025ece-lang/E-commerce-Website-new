import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="glass-panel overflow-hidden flex flex-col justify-between bg-white border border-slate-200 rounded-2xl animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-200/80 w-full" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3 bg-white">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-4/5" />
        <div className="h-3 bg-slate-200 rounded w-2/5" />
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="h-5 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>
        <div className="h-9 bg-slate-200 rounded-xl w-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
