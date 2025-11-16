import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Sparkles } from 'lucide-react';
import PromptSelector from '../components/PromptSelector';
import PostGenerator from '../components/PostGenerator';
import { promptsAPI, generationAPI } from '../services/api';

const Home = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoadingPrompts(true);
      const response = await promptsAPI.getAll();
      setPrompts(response.data || []);

      // Auto-select first prompt if available
      if (response.data?.length > 0 && !selectedPromptId) {
        setSelectedPromptId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const handleGenerate = async (data) => {
    setLoading(true);
    try {
      const response = await generationAPI.generatePost(data);
      return response;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-x-blue to-blue-600 p-2 rounded-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">X Post Generator</h1>
                <p className="text-sm text-gray-400">Powered by Gemini 2.5 Pro</p>
              </div>
            </div>
            <Link
              to="/prompts"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Manage Prompts</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loadingPrompts ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Loading prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="card text-center py-12">
            <Sparkles size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Welcome to X Post Generator!</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Get started by creating your first system prompt. This will define how the AI generates your X posts.
            </p>
            <Link to="/prompts" className="btn-primary inline-flex items-center gap-2">
              <Settings size={20} />
              <span>Create Your First Prompt</span>
            </Link>
          </div>
        ) : (
          <div className="card space-y-8">
            {/* Prompt Selector */}
            <PromptSelector
              prompts={prompts}
              selectedId={selectedPromptId}
              onSelect={setSelectedPromptId}
            />

            {/* Post Generator */}
            <PostGenerator
              selectedPromptId={selectedPromptId}
              onGenerate={handleGenerate}
              loading={loading}
            />
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-100 mb-2">💡 Quality Tips</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use detailed, specific system prompts</li>
              <li>• Experiment with different temperature settings</li>
              <li>• Provide clear context in your input</li>
              <li>• Edit and refine generated posts</li>
            </ul>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-100 mb-2">⚡ Quick Facts</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• X character limit: 280</li>
              <li>• Free tier: 25 requests/day</li>
              <li>• Click "Regenerate" for variations</li>
              <li>• Edit before copying to clipboard</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
