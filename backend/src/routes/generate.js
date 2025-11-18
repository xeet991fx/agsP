import express from 'express';
import { generatePost } from '../services/geminiService.js';
import { generatePostWithOpenRouter } from '../services/openrouterService.js';
import { logError, logInfo } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/generate
 * Generate an X post using Gemini API with built-in system prompt
 */
router.post('/', async (req, res) => {
  try {
    const { userInput, customConfig, provider = 'openrouter' } = req.body;

    // Validation
    if (!userInput || !userInput.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'Please provide your topic or idea'
      });
    }

    logInfo('Generating post', {
      userInputLength: userInput.trim().length,
      provider
    });

    // Choose provider (OpenRouter by default for free models)
    let result;
    if (provider === 'gemini') {
      result = await generatePost({
        userInput: userInput.trim(),
        customConfig
      });
    } else {
      // Use OpenRouter with free models by default
      result = await generatePostWithOpenRouter({
        userInput: userInput.trim()
      });
    }

    // Check if output exceeds X's character limit
    const exceedsLimit = result.text.length > 280;

    res.json({
      success: true,
      data: {
        text: result.text,
        characterCount: result.text.length,
        exceedsLimit,
        metadata: result.metadata
      }
    });
  } catch (error) {
    logError('POST /api/generate', error);

    // Handle specific error types
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'API Configuration Error',
        message: 'Gemini API key is not configured. Please check server settings.'
      });
    }

    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: 'You\'ve reached the API rate limit. Free tier allows 25 requests/day. Please try again later.'
      });
    }

    if (error.message.includes('safety')) {
      return res.status(400).json({
        success: false,
        error: 'Content Blocked',
        message: 'The content was blocked by safety filters. Please try a different topic.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Generation Failed',
      message: error.message || 'Failed to generate post. Please try again.'
    });
  }
});

export default router;
