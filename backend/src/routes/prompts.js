import express from 'express';
import {
  getAllPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt
} from '../services/promptService.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/prompts
 * Get all system prompts
 */
router.get('/', async (req, res) => {
  try {
    const prompts = await getAllPrompts();
    res.json({
      success: true,
      data: prompts,
      count: prompts.length
    });
  } catch (error) {
    logError('GET /api/prompts', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prompts',
      message: error.message
    });
  }
});

/**
 * GET /api/prompts/:id
 * Get a single prompt by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const prompt = await getPromptById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    res.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    logError('GET /api/prompts/:id', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prompt',
      message: error.message
    });
  }
});

/**
 * POST /api/prompts
 * Create a new system prompt
 */
router.post('/', async (req, res) => {
  try {
    const { name, promptText, modelConfig } = req.body;

    // Validation
    if (!name || !promptText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both name and promptText are required'
      });
    }

    const newPrompt = await createPrompt({ name, promptText, modelConfig });

    res.status(201).json({
      success: true,
      data: newPrompt,
      message: 'Prompt created successfully'
    });
  } catch (error) {
    logError('POST /api/prompts', error);

    if (error.message.includes('required') || error.message.includes('empty')) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create prompt',
      message: error.message
    });
  }
});

/**
 * PUT /api/prompts/:id
 * Update an existing prompt
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, promptText, modelConfig, isActive } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (promptText !== undefined) updates.promptText = promptText;
    if (modelConfig !== undefined) updates.modelConfig = modelConfig;
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedPrompt = await updatePrompt(req.params.id, updates);

    res.json({
      success: true,
      data: updatedPrompt,
      message: 'Prompt updated successfully'
    });
  } catch (error) {
    logError('PUT /api/prompts/:id', error);

    if (error.message === 'Prompt not found') {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    if (error.message.includes('empty')) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update prompt',
      message: error.message
    });
  }
});

/**
 * DELETE /api/prompts/:id
 * Delete a prompt
 */
router.delete('/:id', async (req, res) => {
  try {
    await deletePrompt(req.params.id);

    res.json({
      success: true,
      message: 'Prompt deleted successfully'
    });
  } catch (error) {
    logError('DELETE /api/prompts/:id', error);

    if (error.message === 'Prompt not found') {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    if (error.message.includes('last prompt')) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete last prompt',
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete prompt',
      message: error.message
    });
  }
});

export default router;
