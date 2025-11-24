import React, { useState, useEffect, useCallback } from 'react';
import { REGIONS, APP_TITLE, APP_SUBTITLE } from './constants';
import { RegionSelector } from './components/RegionSelector';
import { NewsCard } from './components/NewsCard';
import { LoadingState } from './components/LoadingState';
import { fetchMicroLEDNews } from './services/geminiService';
import { NewsData, Region } from './types';

function App() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('USA');
  const [newsData, setNewsData] = useState<Record<Region, NewsData | null>>({
    USA: null,
    Europe: null,
    Japan: null,
    Korea: null,
    China: null,
    Taiwan: null
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (region: Region) => {
    // If we already have data for this region, don't refetch automatically
    // But in a real "news" app, you might want a refresh button. 
    // For this demo, caching in state is good UX.
    if (newsData[region]) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchMicroLEDNews(region);
      setNewsData(prev => ({
        ...prev,
        [region]: data
      }));
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve news at this moment. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [newsData]);

  // Initial load
  useEffect(() => {
    loadNews(selectedRegion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion]); // Only re-run when region selection changes

  const handleRefresh = () => {
    // Force refresh by clearing current data for region then calling load
    setNewsData(prev => ({ ...prev, [selectedRegion]: null }));
    // The effect will handle the fetch because selectedRegion didn't change but the data became null? 
    // No, the effect depends on selectedRegion. We need to explicitly call loadNews after state update, 
    // or just call loadNews directly after clearing local variable equivalent.
    // Easier way: just call fetch and update.
    setLoading(true);
    fetchMicroLEDNews(selectedRegion)
      .then(data => {
        setNewsData(prev => ({ ...prev, [selectedRegion]: data }));
        setLoading(false);
      })
      .catch(() => {
        setError("Refresh failed.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      <header className="bg-slate-900 text-white pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
             </div>
             {/* Mobile-friendly Refresh Button */}
             {!loading && newsData[selectedRegion] && (
               <button 
                 onClick={handleRefresh}
                 className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                 aria-label="Refresh News"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
               </button>
             )}
          </div>
          <p className="text-slate-400 ml-13 max-w-lg">{APP_SUBTITLE}</p>
        </div>
      </header>

      {/* Main Content Area - Shifted up to overlap header */}
      <main className="flex-1 flex flex-col -mt-8">
        <RegionSelector 
          selectedRegion={selectedRegion} 
          onSelectRegion={setSelectedRegion} 
          isLoading={loading}
        />

        <div className="flex-1 w-full bg-slate-50">
          {error ? (
             <div className="max-w-4xl mx-auto mt-12 px-4 text-center">
               <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 inline-block">
                 <p className="font-medium">{error}</p>
                 <button 
                   onClick={() => window.location.reload()}
                   className="mt-2 text-sm underline hover:text-red-800"
                 >
                   Reload Application
                 </button>
               </div>
             </div>
          ) : loading ? (
            <LoadingState />
          ) : newsData[selectedRegion] ? (
            <NewsCard 
              data={newsData[selectedRegion]!} 
              region={selectedRegion} 
            />
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_TITLE}. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
