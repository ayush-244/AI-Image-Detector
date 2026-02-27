import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import UploadCard from './components/UploadCard.jsx';
import StatsCards from './components/StatsCards.jsx';
import ConfidenceGraph from './components/ConfidenceGraph.jsx';
import HeatmapViewer from './components/HeatmapViewer.jsx';
import ExplanationPanel from './components/ExplanationPanel.jsx';
import { analyzeImage } from './api.js';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleUpload = async (file) => {
    if (!file) return;
    setError('');
    setIsLoading(true);
    setResult(null);

    const localUrl = URL.createObjectURL(file);
    setOriginalImageUrl(localUrl);

    try {
      const data = await analyzeImage(file);
      const normalized = {
        ...data,
        heatmap_url:
          data?.heatmap_url && typeof data.heatmap_url === 'string'
            ? data.heatmap_url.startsWith('http')
              ? data.heatmap_url
              : `http://127.0.0.1:5000${data.heatmap_url}`
            : null,
      };
      setResult(normalized);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          'Something went wrong while analyzing the image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasResult = !!result;

  return (
    <div className="min-h-screen bg-background text-white flex">
      <Sidebar
        active="dashboard"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Upload section */}
            <UploadCard
              onUpload={handleUpload}
              isLoading={isLoading}
              error={error}
              onClearError={() => setError('')}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />

            {/* Stats + Graph row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <StatsCards result={result} />
                <ConfidenceGraph
                  realProbability={result?.real_probability}
                  fakeProbability={result?.fake_probability}
                />
              </div>
              <ExplanationPanel
                explanation={result?.explanation}
                hasResult={hasResult}
              />
            </div>

            {/* Heatmap viewer */}
            <HeatmapViewer
              originalUrl={originalImageUrl}
              heatmapUrl={result?.heatmap_url}
              hasResult={hasResult}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

