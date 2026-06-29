
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = "" }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 ${className}`}>
        <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          Image Placeholder<br/>{alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`rounded-xl object-cover shadow-lg ${className}`}
    />
  );
}
