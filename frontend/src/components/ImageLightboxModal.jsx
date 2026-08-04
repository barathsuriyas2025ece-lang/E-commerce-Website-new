import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const ImageLightboxModal = ({ images = [], selectedIdx = 0, isOpen, onClose, onSelectIdx }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelectIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === 'ArrowRight') onSelectIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length, onClose, onSelectIdx]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
        aria-label="Close image lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Fullscreen Image Container */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[selectedIdx]}
          alt="Enlarged product view"
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
        />
      </div>

      {/* Next Arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-extrabold tracking-wider">
        {selectedIdx + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightboxModal;
