import React from 'react';
import { NewsData, Region } from '../types';

interface NewsCardProps {
  data: NewsData;
  region: Region;
}

interface SourceLinkProps {
  title: string;
  url: string;
}

const SourceLink: React.FC<SourceLinkProps> = ({ title, url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors group"
  >
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700">{title}</p>
      <p className="text-xs text-slate-400 truncate">{new URL(url).hostname}</p>
    </div>
    <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  </a>
);

export const NewsCard: React.FC<NewsCardProps> = ({ data, region }) => {
  // Simple formatter to bold key terms or handle markdown-like headers from API
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Basic heuristic to detect headers (often denoted by stars or hash in API text output)
      if (line.trim().startsWith('**') || line.trim().startsWith('##')) {
        return <h3 key={i} className="text-lg font-semibold text-slate-900 mt-6 mb-2">{line.replace(/[*#]/g, '')}</h3>;
      }
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc pl-1 text-slate-700 leading-relaxed mb-2">{line.replace(/^[*|-]\s/, '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-4"></div>;
      }
      return <p key={i} className="text-slate-700 leading-relaxed mb-4">{line.replace(/\*\*/g, '')}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 sm:px-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Market Briefing: {region}</h2>
            <p className="text-blue-200 text-sm">Updated at {data.timestamp}</p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100 border border-blue-500/30">
              Live Search
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
             {formatText(data.summary)}
          </div>
        </div>

        {/* Sources Footer */}
        {data.sources.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-100 p-6 sm:p-8">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Verified Sources
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.sources.map((source, index) => (
                <SourceLink key={index} title={source.title} url={source.url} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};