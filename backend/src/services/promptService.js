import { v4 as uuidv4 } from 'uuid';
import { readPrompts, writePrompts } from '../utils/fileHandler.js';

/**
 * Get all system prompts
 * @returns {Promise<Array>} Array of prompts
 */
export async function getAllPrompts() {
  const data = await readPrompts();
  return data.prompts || [];
}

/**
 * Get a single prompt by ID
 * @param {string} id - Prompt ID
 * @returns {Promise<Object|null>} Prompt object or null
 */
export async function getPromptById(id) {
  const prompts = await getAllPrompts();
  return prompts.find(p => p.id === id) || null;
}

/**
 * Create a new system prompt
 * @param {Object} promptData - Prompt data {name, promptText, modelConfig}
 * @returns {Promise<Object>} Created prompt
 */
export async function createPrompt(promptData) {
  const { name, promptText, modelConfig } = promptData;

  // Validation
  if (!name || !name.trim()) {
    throw new Error('Prompt name is required');
  }
  if (!promptText || !promptText.trim()) {
    throw new Error('Prompt text is required');
  }

  const data = await readPrompts();

  const newPrompt = {
    id: uuidv4(),
    name: name.trim(),
    promptText: promptText.trim(),
    modelConfig: modelConfig || {
      temperature: 0.7,
      maxOutputTokens: 500,
      topP: 0.95,
      topK: 40
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };

  data.prompts.push(newPrompt);
  await writePrompts(data);

  return newPrompt;
}

/**
 * Update an existing prompt
 * @param {string} id - Prompt ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated prompt
 */
export async function updatePrompt(id, updates) {
  const data = await readPrompts();
  const promptIndex = data.prompts.findIndex(p => p.id === id);

  if (promptIndex === -1) {
    throw new Error('Prompt not found');
  }

  const prompt = data.prompts[promptIndex];

  // Update fields
  if (updates.name !== undefined) {
    if (!updates.name.trim()) {
      throw new Error('Prompt name cannot be empty');
    }
    prompt.name = updates.name.trim();
  }

  if (updates.promptText !== undefined) {
    if (!updates.promptText.trim()) {
      throw new Error('Prompt text cannot be empty');
    }
    prompt.promptText = updates.promptText.trim();
  }

  if (updates.modelConfig !== undefined) {
    prompt.modelConfig = { ...prompt.modelConfig, ...updates.modelConfig };
  }

  if (updates.isActive !== undefined) {
    prompt.isActive = updates.isActive;
  }

  prompt.updatedAt = new Date().toISOString();

  data.prompts[promptIndex] = prompt;
  await writePrompts(data);

  return prompt;
}

/**
 * Delete a prompt by ID
 * @param {string} id - Prompt ID
 * @returns {Promise<boolean>} Success status
 */
export async function deletePrompt(id) {
  const data = await readPrompts();

  // Prevent deletion if it's the last prompt
  if (data.prompts.length <= 1) {
    throw new Error('Cannot delete the last prompt');
  }

  const initialLength = data.prompts.length;
  data.prompts = data.prompts.filter(p => p.id !== id);

  if (data.prompts.length === initialLength) {
    throw new Error('Prompt not found');
  }

  await writePrompts(data);
  return true;
}
