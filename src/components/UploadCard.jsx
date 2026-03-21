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
      <div className="absolute -inset-4 bg-cyan-400/20 blur-3xl opacity-20 rounded-[2rem] pointer-events-none" />
      <div className="absolute -inset-2 bg-cyan-500/10 blur-xl opacity-10 rounded-3xl pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-lg shadow-cyan-500/20 border border-white/10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Upload Image for Analysis
        </h2>
        <p className="text-gray-400 text-center text-sm sm:text-base mb-8">
          Drop an image below or browse. Then run analysis with one click.
        </p>

        <div
          className={`rounded-xl border-2 border-dashed px-6 py-10 sm:py-14 transition-all duration-300
            ${isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/20 hover:border-white/30 bg-black/20'}
            ${isLoading ? 'pointer-events-none opacity-80' : 'cursor-pointer'}`}
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
              <div className="h-12 w-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin shadow-[0_0_24px_rgba(34,211,238,0.4)]" />
              <p className="mt-4 text-sm text-gray-400">Analyzing image…</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-2">
                <span className="font-semibold text-white">Drag &amp; drop</span> or{' '}
                <span className="text-cyan-400">browse</span>
              </p>
              <p className="text-xs text-gray-500 mb-6">JPG, PNG, WEBP</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openFilePicker();
                  }}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10"
                >
                  Choose file
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
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black font-semibold text-sm shadow-lg shadow-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyze
                </motion.button>
              </div>
            </div>
          )}

          {!isLoading && !previewUrl && (
            <p className="text-center text-xs text-gray-500 mt-6">
              Upload an image to begin analysis
            </p>
          )}

          {previewUrl && !isLoading && (
            <div
              className="mt-8 w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40"
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
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/40 px-4 py-3 flex items-start">
            <span className="text-xs font-semibold text-red-400 mt-0.5">Error</span>
            <p className="ml-3 text-sm text-red-100">{error}</p>
          </div>
        )}
      </motion.section>
    </div>
  );
}
