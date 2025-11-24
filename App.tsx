import React, { useState, useEffect, useCallback } from 'react';
import { REGIONS, APP_TITLE, APP_SUBTITLE } from './constants';
import { RegionSelector } from './components/RegionSelector';
import { NewsCard } from './components/NewsCard';
import { LoadingState } from './components/LoadingState';
import { fetchMicroLEDNews } from './services/geminiService';
import { NewsData, Region } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [manualKeyInput, setManualKeyInput] = useState('');
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

  // Check for API Key on mount (Local Storage or Window.aistudio)
  useEffect(() => {
    const checkApiKey = async () => {
      // 1. Check Local Storage
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        setApiKey(storedKey);
        return;
      }

      // 2. Check AI Studio environment (fallback)
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          // If we are in AI Studio environment, we might rely on the internal injection
          // But our service now expects a string. For AI Studio specific preview logic,
          // we usually can't extract the key string. 
          // However, for this Vercel deployment request, we prioritize the manual input flow.
          // If you strictly need AI Studio wrapper support, logic would differ.
          // For now, we ask the user to input key if not in localStorage.
        }
      }
    };
    checkApiKey();
  }, []);

  const handleSaveKey = () => {
    if (manualKeyInput.trim().length > 0) {
      localStorage.setItem('gemini_api_key', manualKeyInput.trim());
      setApiKey(manualKeyInput.trim());
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setNewsData({
      USA: null,
      Europe: null,
      Japan: null,
      Korea: null,
      China: null,
      Taiwan: null
    });
  };

  const loadNews = useCallback(async (region: Region) => {
    if (!apiKey) return;
    
    // If we already have data for this region, don't refetch automatically
    if (newsData[region]) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchMicroLEDNews(apiKey, region);
      setNewsData(prev => ({
        ...prev,
        [region]: data
      }));
    } catch (err: any) {
      console.error(err);
      setError("Unable to retrieve news. Please check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  }, [newsData, apiKey]);

  // Initial load when region changes, but only if we have a key
  useEffect(() => {
    if (apiKey) {
      loadNews(selectedRegion);
    }
  }, [selectedRegion, apiKey, loadNews]); 

  const handleRefresh = () => {
    if (!apiKey) return;
    setLoading(true);
    fetchMicroLEDNews(apiKey, selectedRegion)
      .then(data => {
        setNewsData(prev => ({ ...prev, [selectedRegion]: data }));
        setLoading(false);
      })
      .catch((err: any) => {
        setError("Refresh failed.");
        setLoading(false);
      });
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
               </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{APP_TITLE}</h1>
            <p className="text-blue-100 text-sm">Authentication Required</p>
          </div>
          <div className="p-8">
            <p className="text-slate-600 text-center mb-6 leading-relaxed text-sm">
              Please enter your Gemini API Key to access real-time market intelligence.
              The key is stored locally in your browser.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-xs font-medium text-slate-500 mb-1 uppercase">API Key</label>
                <input 
                  type="password" 
                  id="apiKey"
                  value={manualKeyInput}
                  onChange={(e) => setManualKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
                />
              </div>

              <button
                onClick={handleSaveKey}
                disabled={!manualKeyInput}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span>Access Dashboard</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Don't have a key?{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                  Get one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
             <div className="flex items-center space-x-2">
               {/* Refresh Button */}
               {!loading && newsData[selectedRegion] && (
                 <button 
                   onClick={handleRefresh}
                   className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                   aria-label="Refresh News"
                   title="Refresh News"
                 >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                 </button>
               )}
               {/* Logout Button */}
               <button 
                 onClick={handleClearKey}
                 className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/10"
                 aria-label="Remove API Key"
                 title="Remove API Key"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
               </button>
             </div>
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
               <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 inline-block shadow-sm">
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