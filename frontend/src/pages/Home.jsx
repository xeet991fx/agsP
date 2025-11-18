import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Twitter, Check, AlertCircle, Zap } from 'lucide-react';
import { generationAPI } from '../services/api';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('Please enter your topic or idea');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedPost('');
    setMetadata(null);

    try {
      const result = await generationAPI.generatePost(userInput);
      setGeneratedPost(result.data.text);
      setMetadata(result.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPost) return;

    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const characterCount = generatedPost.length;
  const exceedsLimit = characterCount > 280;
  const percentageFilled = Math.min((characterCount / 280) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 transition-colors duration-200"  >

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Input Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              What do you want to post about?
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your topic, idea, or content... (Press Ctrl/Cmd + Enter to generate)"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows={4}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Tip: Be specific for better results. The AI will craft an engaging X post based on your input.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !userInput.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Generating amazing content...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate X Post</span>
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-red-700 dark:text-red-300 text-sm">{error}</div>
          </div>
        )}

        {/* Generated Post Display */}
        {generatedPost && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Zap size={18} className="text-blue-500" />
                Generated Post
              </h3>

              {/* Character Counter */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg className="transform -rotate-90 w-12 h-12">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentageFilled / 100)}`}
                      className={`transition-all duration-300 ${
                        exceedsLimit
                          ? 'text-red-500'
                          : percentageFilled > 90
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-semibold ${
                      exceedsLimit
                        ? 'text-red-600 dark:text-red-400'
                        : percentageFilled > 90
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {characterCount}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className={`font-semibold ${
                    exceedsLimit
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {characterCount} / 280
                  </div>
                  {exceedsLimit && (
                    <div className="text-xs text-red-500">Over limit!</div>
                  )}
                </div>
              </div>
            </div>

            {/* X-Style Preview */}
            <div className="bg-gray-950 dark:bg-black border border-gray-800 dark:border-gray-900 rounded-2xl p-5 shadow-inner">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Twitter size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">Your Post</span>
                    <span className="text-gray-500 text-sm">@yourhandle · now</span>
                  </div>
                  <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                    {generatedPost}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {metadata && (
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                <span>Model: {metadata.metadata?.model}</span>
                <span>•</span>
                <span>Generated in {metadata.metadata?.duration}ms</span>
                {exceedsLimit && (
                  <>
                    <span>•</span>
                    <span className="text-red-500 font-semibold">⚠️ Exceeds X character limit</span>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 pt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              AI-Powered
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Generates authentic, engaging posts using Gemini 2.5 Pro
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Zap size={16} />
              Instant Results
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              Get high-quality posts in seconds, ready to share
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
              <Twitter size={16} />
              X Optimized
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Automatically formatted for X's 280-character limit
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Home;
