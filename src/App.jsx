import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { analyzeImage } from './api';
import ExplanationPanel from './components/ExplanationPanel';
import HeatmapViewer from './components/HeatmapViewer';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import UploadCard from './components/UploadCard';

const ConfidenceGraph = lazy(() => import('./components/ConfidenceGraph'));

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [result, setResult] = useState(null);

  const heroRef = useRef(null);
  const uploadRef = useRef(null);
  const resultsRef = useRef(null);

  const onScrollTo = (sectionId) => {
    const map = {
      hero: heroRef,
      upload: uploadRef,
      results: resultsRef,
    };
    map[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const handleFileSelected = (file, customError) => {
    if (customError) {
      setSelectedFile(null);
      setError(customError);
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setError('Please select an image before running analysis.');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    const localUrl = URL.createObjectURL(selectedFile);
    setOriginalImageUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return localUrl;
    });

    try {
      const data = await analyzeImage(selectedFile);
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
      toast.success('Analysis complete! 🎉', {
        description: `${normalized.label} with ${Number(normalized.confidence).toFixed(1)}% confidence`,
      });
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (e) {
      const message =
        e?.message ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Something went wrong while analyzing the image. Please try again.';
      setError(message);
      toast.error('Analysis failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportResults = () => {
    if (!result) {
      toast.error('No results to export');
      return;
    }

    try {
      const exportData = {
        fileName: selectedFile?.name || 'analysis',
        timestamp: new Date().toISOString(),
        prediction: result.label,
        confidence: `${Number(result.confidence).toFixed(1)}%`,
        realProbability: `${(Number(result.real_probability) * 100).toFixed(1)}%`,
        fakeProbability: `${(Number(result.fake_probability) * 100).toFixed(1)}%`,
        inferenceTime: `${result.inference_time_ms}ms`,
        activationStrength: result.activation_strength,
        modelVersion: result.model_version,
        explanation: result.explanation || 'No explanation available',
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `authenticit-analysis-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Results exported!', {
        description: 'JSON file downloaded to your device',
      });
    } catch (error) {
      toast.error('Export failed', { description: error.message });
    }
  };

  const hasResult = Boolean(result);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white relative overflow-x-hidden">
      <Toaster position="top-right" theme="dark" />
      
      <div className="ambient-background" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grain-layer" />
      </div>

      <Navbar onScrollTo={onScrollTo} />

      <main className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <section ref={heroRef} className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm border border-indigo-400/40 dark:border-purple-400/40 bg-indigo-500/10 dark:bg-purple-500/10 text-indigo-600 dark:text-purple-200 tracking-widest font-semibold"
            >
              ✨ Enterprise-Grade Image Authentication
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-7 text-5xl sm:text-7xl font-bold tracking-tight leading-1.2 text-slate-900 dark:text-white"
            >
              Verify Image Authenticity with Precision
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mt-6 text-slate-600 dark:text-slate-300/90 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-light"
            >
              Enterprise-trusted AI platform for detecting manipulated images. Powered by advanced neural networks, interpretable Grad-CAM analysis, and secure API infrastructure. <span className="text-indigo-600 dark:text-purple-300 font-medium">Trusted by digital forensics experts.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              <span className="glass-chip">🚀 Real-time Analysis</span>
              <span className="glass-chip">🔍 Explainable AI (Grad-CAM)</span>
              <span className="glass-chip">📊 Confidence Metrics</span>
              <span className="glass-chip">📝 Automated Insights</span>
            </motion.div>
          </div>
        </section>

        <section ref={uploadRef} className="px-4 sm:px-6 py-4 sm:py-8">
          <UploadCard
            isLoading={isLoading}
            error={error}
            onClearError={() => setError('')}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            selectedFile={selectedFile}
            onFileSelected={handleFileSelected}
            onAnalyzeClick={handleAnalyzeClick}
          />
        </section>

        <section ref={resultsRef} className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            {result && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:bg-gradient-to-r dark:from-purple-200 dark:via-blue-200 dark:to-cyan-200 dark:bg-clip-text dark:text-transparent mb-3">
                      Analysis Results
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300/80 text-sm sm:text-base max-w-2xl">
                      Complete forensic analysis with confidence metrics, explainability evidence, and detailed model insights.
                    </p>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportResults}
                    className="shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-bold shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all"
                  >
                    ⬇️ Export Results
                  </motion.button>
                </div>
              </div>
            )}

            {/* Main Grid Layout */}
            <div className="space-y-10">
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatsCards result={result} />
              </div>

              {/* Charts & Analysis Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Suspense
                    fallback={
                      <div className="glass-panel rounded-3xl p-7 text-sm text-slate-600 dark:text-slate-300 h-96 flex items-center justify-center">
                        Loading confidence analysis...
                      </div>
                    }
                  >
                    <ConfidenceGraph
                      realProbability={result?.real_probability}
                      fakeProbability={result?.fake_probability}
                    />
                  </Suspense>
                </div>
                <ExplanationPanel explanation={result?.explanation} hasResult={hasResult} />
              </div>

              {/* Evidence Visualization */}
              <div>
                <HeatmapViewer
                  originalUrl={originalImageUrl}
                  heatmapUrl={result?.heatmap_url}
                  hasResult={hasResult}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


