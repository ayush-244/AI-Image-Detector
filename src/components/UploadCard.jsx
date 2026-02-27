import React, { useCallback, useState } from 'react';

export default function UploadCard({ onUpload, isLoading, error, onClearError, previewUrl, setPreviewUrl }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        if (onClearError) {
          onClearError();
        }
        // simple error surfaced via onUpload returning rejection can be handled in parent
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onUpload(file);
    },
    [onUpload, onClearError, setPreviewUrl]
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
  };

  return (
    <section className="bg-card rounded-2xl p-6 shadow-md border border-white/5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Upload image</h2>
          <p className="text-sm text-gray-400 mt-1">
            Drag &amp; drop an image or browse from your device to analyze authenticity.
          </p>
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl border-2 border-dashed px-4 py-6 sm:px-6 sm:py-8 transition-all duration-300 cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-gray-700 hover:border-gray-500 bg-[#020617]/40'
          }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => document.getElementById('image-input-hidden')?.click()}
      >
        <input
          id="image-input-hidden"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-gray-100">Drop image here</span> or{' '}
              <span className="text-blue-400">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, PNG, WEBP. Max size depends on backend limits.
            </p>

            <button
              type="button"
              disabled={isLoading}
              className="mt-4 inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-500 text-sm font-medium text-white shadow-sm shadow-blue-500/30 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('image-input-hidden')?.click();
              }}
            >
              {isLoading && (
                <span className="mr-2 h-4 w-4 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin" />
              )}
              {isLoading ? 'Analyzing...' : 'Upload & analyze'}
            </button>
          </div>

          {previewUrl && (
            <div className="w-full max-w-md sm:max-w-lg aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'auto' }}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/40 px-3 py-2.5 flex items-start">
            <span className="text-xs font-semibold text-red-400 mt-0.5">Error</span>
            <p className="ml-3 text-xs text-red-100">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
}

