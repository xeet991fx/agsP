import express from 'express';
import { generatePost } from '../services/geminiService.js';
import { getPromptById } from '../services/promptService.js';
import { logError, logInfo } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/generate-post
 * Generate an X post using Gemini API
 */
router.post('/', async (req, res) => {
  try {
    const { systemPromptId, userInput, customConfig } = req.body;

    // Validation
    if (!systemPromptId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'systemPromptId is required'
      });
    }

    if (!userInput || !userInput.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'userInput is required'
      });
    }

    // Get system prompt from storage
    const systemPrompt = await getPromptById(systemPromptId);

    if (!systemPrompt) {
      return res.status(404).json({
        success: false,
        error: 'System prompt not found',
        message: `No prompt found with ID: ${systemPromptId}`
      });
    }

    logInfo('Generating post', {
      promptId: systemPromptId,
      promptName: systemPrompt.name,
      userInputLength: userInput.trim().length
    });

    // Merge prompt config with any custom overrides
    const modelConfig = customConfig
      ? { ...systemPrompt.modelConfig, ...customConfig }
      : systemPrompt.modelConfig;

    // Generate post using Gemini API
    const result = await generatePost({
      systemPrompt: systemPrompt.promptText,
      userInput: userInput.trim(),
      modelConfig,
      promptId: systemPromptId
    });

    // Check if output exceeds X's character limit
    const exceedsLimit = result.text.length > 280;

    res.json({
      success: true,
      data: {
        text: result.text,
        characterCount: result.text.length,
        exceedsLimit,
        metadata: {
          ...result.metadata,
          promptUsed: {
            id: systemPrompt.id,
            name: systemPrompt.name
          },
          modelConfig
        }
      }
    });
  } catch (error) {
    logError('POST /api/generate-post', error);

    // Handle specific error types
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'API Configuration Error',
        message: error.message
      });
    }

    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: error.message
      });
    }

    if (error.message.includes('safety')) {
      return res.status(400).json({
        success: false,
        error: 'Content Blocked',
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Generation Failed',
      message: error.message
    });
  }
});

export default router;
