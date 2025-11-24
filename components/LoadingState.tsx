import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-12 bg-slate-100 rounded-lg"></div>
          <div className="h-12 bg-slate-100 rounded-lg"></div>
          <div className="h-12 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
      <div className="text-center mt-4 text-slate-400 text-sm">
        Scanning global news sources...
      </div>
    </div>
  );
};
