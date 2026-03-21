import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import UploadCard from './components/UploadCard.jsx';
import StatsCards from './components/StatsCards.jsx';
import ConfidenceGraph from './components/ConfidenceGraph.jsx';
import HeatmapViewer from './components/HeatmapViewer.jsx';
import ExplanationPanel from './components/ExplanationPanel.jsx';
import { analyzeImage } from './api.js';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const scrollTo = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleFileSelected = useCallback((file, validationError) => {
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!file) return;
    setError('');
    setResult(null);
    setSelectedFile(file);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const data = await analyzeImage(selectedFile);
      const base = import.meta.env.DEV ? window.location.origin : 'http://127.0.0.1:5000';
      const normalized = {
        ...data,
        heatmap_url:
          data?.heatmap_url && typeof data.heatmap_url === 'string'
            ? data.heatmap_url.startsWith('http')
              ? data.heatmap_url
              : base + (data.heatmap_url.startsWith('/') ? '' : '/') + data.heatmap_url
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
  }, [selectedFile]);

  useEffect(() => {
    if (!result) return;
    const t = requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(t);
  }, [result]);

  const hasResult = !!result;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#111827] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-400/10 blur-3xl opacity-20 rounded-full" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-teal-500/10 blur-3xl opacity-10 rounded-full" />
      </div>

      <Navbar onScrollTo={scrollTo} />

      <main className="relative z-10 pt-28 pb-16">
        <section id="hero" className="px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left order-2 lg:order-1"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Detect Fake Images with{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                    AI
                  </span>
                </h1>
                <p className="mt-5 text-gray-400 text-lg max-w-xl mx-auto lg:mx-0">
                  Enterprise-grade deep learning with explainable heatmaps and AI-powered
                  technical summaries.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollTo('upload')}
                  className="mt-8 inline-flex px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black font-semibold shadow-lg shadow-cyan-500/20"
                >
                  Start analyzing
                </motion.button>
              </motion.div>

              <div className="order-1 lg:order-2 flex justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-cyan-400/30 blur-3xl rounded-full opacity-30" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="relative w-full max-w-sm"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg shadow-cyan-500/20"
                  >
                    <p className="text-xs text-gray-500">Demo</p>
                    <p className="text-2xl font-bold text-cyan-400 mt-1">94.2%</p>
                    <p className="text-sm text-gray-400 mt-2">Confidence preview</p>
                    <div className="mt-4 h-24 rounded-xl bg-black/30 border border-white/5" />
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => scrollTo('upload')}
                        className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollTo('upload')}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-black text-sm font-semibold"
                      >
                        Analyze
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center lg:text-right order-3"
              >
                <h2 className="text-2xl md:text-3xl font-bold">
                  Fast &amp; Secure
                  <br />
                  <span className="text-cyan-400">Detection Platform</span>
                </h2>
                <p className="mt-4 text-gray-400 max-w-md mx-auto lg:ml-auto lg:mr-0">
                  Real-time inference, Grad-CAM visualization, and structured explanations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="upload" className="px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
          <UploadCard
            isLoading={isLoading}
            error={error}
            onClearError={() => setError('')}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            selectedFile={selectedFile}
            onFileSelected={handleFileSelected}
            onAnalyzeClick={handleAnalyze}
          />
        </section>

        <AnimatePresence>
          {hasResult && (
            <motion.section
              ref={resultsRef}
              id="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24"
            >
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-center mb-10"
              >
                Analysis results
              </motion.h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <StatsCards result={result} />
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <ConfidenceGraph
                      realProbability={result?.real_probability}
                      fakeProbability={result?.fake_probability}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <ExplanationPanel
                      explanation={result?.explanation}
                      hasResult={hasResult}
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <HeatmapViewer
                    originalUrl={previewUrl}
                    heatmapUrl={result?.heatmap_url}
                    hasResult={hasResult}
                    isLoading={isLoading}
                  />
                </motion.div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="relative z-10 border-t border-white/10 mt-16 px-4 py-10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
                N
              </span>
              <span>© {new Date().getFullYear()} NextWare AI</span>
            </div>
            <p className="text-center sm:text-right">Image authenticity · Built for production</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
