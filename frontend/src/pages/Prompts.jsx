import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PromptManager from '../components/PromptManager';
import PromptEditor from '../components/PromptEditor';
import { promptsAPI } from '../services/api';

const Prompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const response = await promptsAPI.getAll();
      setPrompts(response.data || []);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPrompt(null);
    setShowEditor(true);
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setShowEditor(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingPrompt) {
        // Update existing prompt
        await promptsAPI.update(editingPrompt.id, data);
      } else {
        // Create new prompt
        await promptsAPI.create(data);
      }
      await loadPrompts();
      setShowEditor(false);
      setEditingPrompt(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await promptsAPI.delete(id);
      await loadPrompts();
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      throw error;
    }
  };

  const handleClose = () => {
    setShowEditor(false);
    setEditingPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-x-blue transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Generator</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Loading prompts...</p>
          </div>
        ) : (
          <PromptManager
            prompts={prompts}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Best Practices */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            📚 Best Practices for High-Quality System Prompts
          </h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div>
              <strong className="text-gray-200">Be Specific:</strong> Define the exact style, tone, and format you want.
              Include examples if possible.
            </div>
            <div>
              <strong className="text-gray-200">Set Context:</strong> Explain the purpose (e.g., "for tech professionals,"
              "casual and humorous," "professional but friendly").
            </div>
            <div>
              <strong className="text-gray-200">Include Constraints:</strong> Specify character limits, hashtag preferences,
              emoji usage, etc.
            </div>
            <div>
              <strong className="text-gray-200">Define Quality:</strong> List what makes a good post (engaging hook,
              clear value, call-to-action, etc.).
            </div>
            <div>
              <strong className="text-gray-200">Iterate:</strong> Test different prompts and model configurations to find
              what works best for your style.
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-200 mb-2">Example System Prompt Structure:</h4>
            <pre className="text-xs text-gray-400 overflow-x-auto">
{`You are an expert X (Twitter) content creator specializing in [YOUR NICHE].

Your goal: Create engaging, authentic posts that [YOUR OBJECTIVE].

Style Guidelines:
- Tone: [professional/casual/witty/educational]
- Voice: [first-person/conversational/authoritative]
- Length: Under 280 characters, optimally 200-260
- Format: [threads/single posts/with emojis/etc.]

Content Rules:
1. Start with a hook that grabs attention
2. Provide clear value or insight
3. End with engagement (question/CTA/thought-provoking statement)
4. Use [X] emojis maximum
5. Include [X] hashtags when relevant

Avoid:
- Clickbait or misleading content
- Overly promotional language
- Generic platitudes

Generate posts that feel natural and authentic, as if written by a real person in this field.`}
            </pre>
          </div>
        </div>
      </main>

      {/* Editor Modal */}
      {showEditor && (
        <PromptEditor
          prompt={editingPrompt}
          onSave={handleSave}
          onClose={handleClose}
          isNew={!editingPrompt}
        />
      )}
    </div>
  );
};

export default Prompts;
