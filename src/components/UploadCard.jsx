import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

export default function UploadCard({
  isLoading,
  error,
  onClearError,
  previewUrl,
  setPreviewUrl,
  selectedFile,
  onFileSelected,
  onAnalyzeClick,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        if (onClearError) onClearError();
        if (onFileSelected) onFileSelected(null, 'Please select an image file (JPG, PNG, or WEBP).');
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return url;
      });
      if (onFileSelected) onFileSelected(file);
    },
    [onFileSelected, onClearError, setPreviewUrl]
  );

  const onDrop = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onFileChange = (e) => {
    if (isLoading) return;
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const openFilePicker = () => {
    document.getElementById('image-input-hidden-spa')?.click();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="absolute -inset-4 bg-cyan-300/20 blur-3xl opacity-20 rounded-[2rem] pointer-events-none" />
      <div className="absolute -inset-2 bg-indigo-300/20 blur-xl opacity-20 rounded-3xl pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative glass-panel rounded-3xl p-8 sm:p-12"
      >
        <div className="mb-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-3">
            Analyze Your Image
          </h2>
          <p className="text-slate-300/80 text-center text-sm sm:text-base">
            Drag, drop, or browse to verify image authenticity with enterprise-grade AI forensics.
          </p>
        </div>

        <div
          className={`rounded-2xl border-2 border-dashed px-6 py-12 sm:py-16 transition-all duration-300
            ${isDragging ? 'border-purple-300 bg-purple-500/10 shadow-lg shadow-purple-500/20' : 'border-purple-400/30 hover:border-purple-400/50 bg-slate-950/40 hover:bg-slate-950/50'}
            ${isLoading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={isLoading ? undefined : openFilePicker}
        >
          <input
            id="image-input-hidden-spa"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-14 w-14 rounded-full border-3 border-purple-300/30 border-t-purple-300 animate-spin shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
              <p className="mt-5 text-sm text-slate-200 font-medium">Analyzing image with AI forensics...</p>
              <p className="mt-1 text-xs text-slate-400">This typically takes 2-5 seconds</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-100 mb-3 text-lg">
                <span className="font-bold">Drop here</span> or{' '}
                <span className="text-purple-300 font-semibold">browse</span>
              </p>
              <p className="text-sm text-slate-400 mb-7 font-medium">JPG, PNG, WEBP • Max 50MB</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openFilePicker();
                  }}
                  className="px-6 py-3 rounded-full bg-slate-700/50 hover:bg-slate-600/60 text-white font-semibold text-sm border border-slate-500/30 transition-all"
                >
                  Browse Image
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: selectedFile ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!selectedFile || isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAnalyzeClick) onAnalyzeClick();
                  }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Run Analysis
                </motion.button>
              </div>
            </div>
          )}

          {!isLoading && !previewUrl && (
            <p className="text-center text-xs text-slate-400 mt-6">
              Your file stays local until you run analysis.
            </p>
          )}

          {previewUrl && !isLoading && (
            <div
              className="mt-8 w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden border border-slate-100/20 bg-slate-950/45"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-500/12 border border-rose-400/40 px-5 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 5.5H2v9h16v-9zM1 4a1 1 0 011-1h16a1 1 0 011 1v11a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" clipRule="evenodd"/></svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-300">Verification Failed</p>
              <p className="text-sm text-rose-200/90 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}
