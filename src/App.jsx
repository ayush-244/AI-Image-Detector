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
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  // Simple debug hook to confirm the React app is mounted and rendering.
  console.log('AI Image Detector dashboard mounted');

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Clean up object URLs to avoid memory leaks when a new image is uploaded
  // or when the component is unmounted.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
    };
  }, [previewUrl, originalImageUrl]);

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
      const message =
        e?.message ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Something went wrong while analyzing the image. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasResult = !!result;

  return (
    <div className="min-h-screen bg-background text-white flex">
      <Sidebar
        active={activePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(id) => {
          setActivePage(id);
          setIsSidebarOpen(false);
        }}
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

