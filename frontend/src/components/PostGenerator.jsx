import React, { useState } from 'react';
import { Sparkles, RefreshCw, Edit3, AlertCircle } from 'lucide-react';
import CharacterCounter from './CharacterCounter';
import CopyButton from './CopyButton';

const PostGenerator = ({ selectedPromptId, onGenerate, loading }) => {
  const [userInput, setUserInput] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState('');
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState(null);

  const handleGenerate = async () => {
    if (!selectedPromptId) {
      setError('Please select a system prompt first');
      return;
    }

    if (!userInput.trim()) {
      setError('Please enter a topic or idea');
      return;
    }

    setError('');
    setIsEditing(false);

    try {
      const result = await onGenerate({
        systemPromptId: selectedPromptId,
        userInput: userInput.trim()
      });

      setGeneratedPost(result.data.text);
      setEditedPost(result.data.text);
      setMetadata(result.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate post');
      console.error('Generation error:', err);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const displayPost = isEditing ? editedPost : generatedPost;
  const characterCount = displayPost.length;

  return (
    <div className="space-y-6">
      {/* User Input Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          What do you want to post about?
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your topic, idea, or content to transform into an engaging X post..."
          className="textarea-field h-32"
          disabled={loading}
        />
        <div className="mt-2 text-sm text-gray-400">
          Be specific about what you want to communicate. The AI will craft an engaging post based on your input.
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !selectedPromptId || !userInput.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>Generate X Post</span>
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-red-300">{error}</div>
        </div>
      )}

      {/* Generated Post Display */}
      {generatedPost && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-100">Generated Post</h3>
            <CharacterCounter count={characterCount} />
          </div>

          {/* X-Style Preview */}
          <div className="x-post-preview">
            {isEditing ? (
              <textarea
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-base leading-relaxed resize-none"
                rows={6}
                autoFocus
              />
            ) : (
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {displayPost}
              </p>
            )}
          </div>

          {/* Metadata */}
          {metadata && (
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span>Model: {metadata.metadata?.model}</span>
              <span>Duration: {metadata.metadata?.duration}ms</span>
              <span>Prompt: {metadata.metadata?.promptUsed?.name}</span>
              {metadata.exceedsLimit && (
                <span className="text-red-400 font-semibold">⚠️ Exceeds 280 characters</span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <CopyButton text={displayPost} className="flex-1" />

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 btn-secondary"
            >
              <Edit3 size={18} />
              <span>{isEditing ? 'Preview' : 'Edit'}</span>
            </button>

            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="flex items-center gap-2 btn-secondary"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGenerator;
