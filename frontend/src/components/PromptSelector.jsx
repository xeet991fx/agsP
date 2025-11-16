import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const PromptSelector = ({ prompts, selectedId, onSelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPrompt = prompts.find(p => p.id === selectedId);

  const handleSelect = (prompt) => {
    onSelect(prompt.id);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        System Prompt
      </label>

      {/* Selected Prompt Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-x-blue transition-colors"
      >
        <div className="flex-1">
          {selectedPrompt ? (
            <div>
              <div className="font-semibold text-gray-100 flex items-center gap-2">
                <Sparkles size={16} className="text-x-blue" />
                {selectedPrompt.name}
              </div>
              <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                {selectedPrompt.promptText}
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Select a prompt...</div>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
            {prompts.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                No prompts available. Create one first!
              </div>
            ) : (
              prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSelect(prompt)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 ${
                    selectedId === prompt.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="font-semibold text-gray-100 flex items-center gap-2">
                    <Sparkles
                      size={14}
                      className={selectedId === prompt.id ? 'text-x-blue' : 'text-gray-500'}
                    />
                    {prompt.name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {prompt.promptText}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>Temp: {prompt.modelConfig?.temperature || 0.7}</span>
                    <span>Tokens: {prompt.modelConfig?.maxOutputTokens || 500}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PromptSelector;
