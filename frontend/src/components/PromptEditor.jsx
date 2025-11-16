import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const PromptEditor = ({ prompt, onSave, onClose, isNew = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    promptText: '',
    temperature: 0.7,
    maxOutputTokens: 500,
    topP: 0.95,
    topK: 40
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (prompt) {
      setFormData({
        name: prompt.name || '',
        promptText: prompt.promptText || '',
        temperature: prompt.modelConfig?.temperature || 0.7,
        maxOutputTokens: prompt.modelConfig?.maxOutputTokens || 500,
        topP: prompt.modelConfig?.topP || 0.95,
        topK: prompt.modelConfig?.topK || 40
      });
    }
  }, [prompt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Prompt name is required');
      return;
    }

    if (!formData.promptText.trim()) {
      setError('Prompt text is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: formData.name,
        promptText: formData.promptText,
        modelConfig: {
          temperature: parseFloat(formData.temperature),
          maxOutputTokens: parseInt(formData.maxOutputTokens),
          topP: parseFloat(formData.topP),
          topK: parseInt(formData.topK)
        }
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prompt');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-gray-100">
            {isNew ? 'Create New Prompt' : 'Edit Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-300">{error}</div>
            </div>
          )}

          {/* Prompt Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Prompt Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Professional Tech Post Writer"
              className="input-field"
              required
            />
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              System Prompt *
            </label>
            <textarea
              value={formData.promptText}
              onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
              placeholder="Enter the full system prompt that defines how the AI should generate X posts. Be detailed and specific for best quality results..."
              className="textarea-field h-64 font-mono text-sm"
              required
            />
            <div className="mt-2 text-sm text-gray-400">
              {formData.promptText.length} characters. The more detailed your prompt, the better the quality.
            </div>
          </div>

          {/* Model Configuration */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-200">Model Configuration</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature: {formData.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Lower = more focused, Higher = more creative
                </div>
              </div>

              {/* Max Output Tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Output Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="50"
                  value={formData.maxOutputTokens}
                  onChange={(e) => setFormData({ ...formData, maxOutputTokens: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Top P */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Top P: {formData.topP}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.topP}
                  onChange={(e) => setFormData({ ...formData, topP: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Top K */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Top K
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.topK}
                  onChange={(e) => setFormData({ ...formData, topK: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={saving}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Prompt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptEditor;
