import React, { useState } from 'react';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';

const PromptManager = ({ prompts, onEdit, onDelete, onCreate }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await onDelete(id);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete prompt:', error);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">System Prompts</h2>
          <p className="text-gray-400 mt-1">
            Manage your AI prompt templates for generating high-quality X posts
          </p>
        </div>
        <button
          onClick={onCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Prompts List */}
      {prompts.length === 0 ? (
        <div className="card text-center py-12">
          <AlertCircle size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Prompts Found</h3>
          <p className="text-gray-400 mb-6">
            Create your first system prompt to start generating amazing X posts
          </p>
          <button onClick={onCreate} className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            <span>Create Your First Prompt</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="card hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {prompt.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {prompt.promptText}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Temp: {prompt.modelConfig?.temperature || 0.7}</span>
                    <span>Max Tokens: {prompt.modelConfig?.maxOutputTokens || 500}</span>
                    <span>Top P: {prompt.modelConfig?.topP || 0.95}</span>
                    <span>Top K: {prompt.modelConfig?.topK || 40}</span>
                  </div>

                  <div className="flex gap-2 mt-3 text-xs text-gray-600">
                    <span>Created: {new Date(prompt.createdAt).toLocaleDateString()}</span>
                    {prompt.updatedAt !== prompt.createdAt && (
                      <span>• Updated: {new Date(prompt.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(prompt)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                    title="Edit prompt"
                  >
                    <Edit size={20} className="text-gray-400 group-hover:text-x-blue" />
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className={`p-2 rounded-lg transition-colors group ${
                      deleteConfirm === prompt.id
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'hover:bg-gray-800'
                    }`}
                    title={deleteConfirm === prompt.id ? 'Click again to confirm' : 'Delete prompt'}
                  >
                    <Trash2
                      size={20}
                      className={
                        deleteConfirm === prompt.id
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-red-500'
                      }
                    />
                  </button>
                </div>
              </div>

              {deleteConfirm === prompt.id && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-sm text-red-300">
                  Click delete again to confirm deletion
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptManager;
