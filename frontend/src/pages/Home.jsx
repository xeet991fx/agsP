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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 transition-all duration-300">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-30 dark:opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-xl">
              <Twitter size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
            X Post Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered content creation for X (Twitter)
          </p>
        </div>

        {/* Input Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 dark:opacity-30 group-hover:opacity-40 blur-xl transition-all duration-500"></div>
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500 dark:text-blue-400" />
                What do you want to post about?
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your topic, idea, or content... (Press Ctrl/Cmd + Enter to generate)"
                className="w-full bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600/50 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all shadow-inner"
                rows={5}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1.5">
                <span className="text-base">💡</span>
                <span>Tip: Be specific for better results. The AI will craft an engaging X post based on your input.</span>
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !userInput.trim()}
              className="relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl dark:shadow-blue-900/50 transform hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <RefreshCw size={22} className="animate-spin relative z-10" />
                  <span className="relative z-10">Generating amazing content...</span>
                </>
              ) : (
                <>
                  <Sparkles size={22} className="relative z-10" />
                  <span className="relative z-10 text-lg">Generate X Post</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-30 dark:opacity-40 blur-lg"></div>
            <div className="relative bg-red-50/90 dark:bg-red-900/30 backdrop-blur-xl border border-red-200 dark:border-red-700/50 rounded-xl p-4 flex items-start gap-3 animate-in shadow-lg">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 dark:text-red-200 text-sm font-medium">{error}</div>
            </div>
          </div>
        )}

        {/* Generated Post Display */}
        {generatedPost && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 dark:opacity-40 group-hover:opacity-50 dark:group-hover:opacity-50 blur-2xl transition-all duration-700"></div>
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-5 animate-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-2">
                  <Zap size={20} className="text-blue-500 dark:text-blue-400" />
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
            <div className="relative group/preview">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 dark:opacity-40 blur group-hover/preview:opacity-30 dark:group-hover/preview:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-gray-950 to-black dark:from-black dark:to-gray-950 border border-gray-800 dark:border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-black/50">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-60"></div>
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Twitter size={22} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white">Your Post</span>
                      <span className="text-gray-500 text-sm">@yourhandle · now</span>
                    </div>
                    <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                      {generatedPost}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {metadata && (
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
                  {metadata.metadata?.model}
                </span>
                <span>•</span>
                <span>{metadata.metadata?.duration}ms</span>
                {exceedsLimit && (
                  <>
                    <span>•</span>
                    <span className="text-red-500 dark:text-red-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={12} />
                      Exceeds X limit
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="relative flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl dark:shadow-blue-900/30 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {copied ? (
                  <>
                    <Check size={20} className="relative z-10" />
                    <span className="relative z-10">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} className="relative z-10" />
                    <span className="relative z-10">Copy to Clipboard</span>
                  </>
                )}
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-700 backdrop-blur-sm border border-gray-300 dark:border-gray-600/50 text-gray-700 dark:text-gray-200 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 pt-6">
          <div className="relative group/card">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl opacity-0 dark:opacity-20 group-hover/card:opacity-30 dark:group-hover/card:opacity-40 blur-lg transition-opacity"></div>
            <div className="relative bg-blue-50/90 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700/50 rounded-xl p-5 transition-transform hover:-translate-y-1 shadow-lg dark:shadow-blue-900/20">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500 dark:text-blue-400" />
                AI-Powered
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300/90 leading-relaxed">
                Generates authentic, engaging posts using advanced AI models
              </p>
            </div>
          </div>

          <div className="relative group/card">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl opacity-0 dark:opacity-20 group-hover/card:opacity-30 dark:group-hover/card:opacity-40 blur-lg transition-opacity"></div>
            <div className="relative bg-purple-50/90 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-700/50 rounded-xl p-5 transition-transform hover:-translate-y-1 shadow-lg dark:shadow-purple-900/20">
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                <Zap size={18} className="text-purple-500 dark:text-purple-400" />
                Instant Results
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300/90 leading-relaxed">
                Get high-quality posts in seconds, ready to share
              </p>
            </div>
          </div>

          <div className="relative group/card">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl opacity-0 dark:opacity-20 group-hover/card:opacity-30 dark:group-hover/card:opacity-40 blur-lg transition-opacity"></div>
            <div className="relative bg-green-50/90 dark:bg-green-900/20 backdrop-blur-sm border border-green-200 dark:border-green-700/50 rounded-xl p-5 transition-transform hover:-translate-y-1 shadow-lg dark:shadow-green-900/20">
              <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                <Twitter size={18} className="text-green-500 dark:text-green-400" />
                X Optimized
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300/90 leading-relaxed">
                Automatically formatted for X's 280-character limit
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Powered by AI • Built for creators who value quality
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
          <span>Ready to generate</span>
        </div>
      </footer>

    </div>
  );
};

export default Home;
