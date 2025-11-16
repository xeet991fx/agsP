import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 btn-secondary ${className}`}
      disabled={!text}
    >
      {copied ? (
        <>
          <Check size={18} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={18} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;
