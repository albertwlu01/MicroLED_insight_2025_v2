import React from 'react';
import { REGIONS } from '../constants';
import { Region } from '../types';

interface RegionSelectorProps {
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  isLoading: boolean;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onSelectRegion, isLoading }) => {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex space-x-2 py-4 overflow-x-auto no-scrollbar items-center">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion === region.id;
            return (
              <button
                key={region.id}
                onClick={() => onSelectRegion(region.id)}
                disabled={isLoading && isSelected}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${isSelected 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 transform scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }
                  ${isLoading && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="text-lg" role="img" aria-label={region.label}>{region.flag}</span>
                <span>{region.label}</span>
                {isSelected && isLoading && (
                  <span className="absolute right-2 top-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
