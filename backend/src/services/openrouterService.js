import axios from 'axios';
import { logGeneration, logError, logInfo } from '../utils/logger.js';
import { SYSTEM_PROMPT } from '../config/systemPrompt.js';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

function getOpenRouterApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }
  return apiKey;
}

/**
 * Generate X post using OpenRouter API with free models
 * @param {Object} params - Generation parameters
 * @param {string} params.userInput - User's topic/idea
 * @param {string} params.model - Model to use (default: free model)
 * @returns {Promise<Object>} Generated post data
 */
export async function generatePostWithOpenRouter({ userInput, model = 'openrouter/sherlock-dash-alpha' }) {
  try {
    const apiKey = getOpenRouterApiKey();

    logInfo('Starting OpenRouter post generation', {
      userInputLength: userInput.length,
      model,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey?.substring(0, 10)
    });

    const startTime = Date.now();

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'X Post Generator',
          'Content-Type': 'application/json'
        }
      }
    );

    const endTime = Date.now();
    const generatedText = response.data.choices[0].message.content.trim();

    logInfo('OpenRouter generation completed', {
      duration: `${endTime - startTime}ms`,
      outputLength: generatedText.length
    });

    // Log full generation for quality debugging
    await logGeneration({
      userInput,
      modelConfig: { model },
      generatedText,
      duration: endTime - startTime,
      model: model,
      success: true
    });

    return {
      text: generatedText,
      metadata: {
        model: model,
        duration: endTime - startTime,
        characterCount: generatedText.length,
        timestamp: new Date().toISOString(),
        provider: 'openrouter'
      }
    };
  } catch (error) {
    logError('generatePostWithOpenRouter', error);

    // Log failed generation attempt
    await logGeneration({
      userInput,
      modelConfig: { model },
      error: error.message,
      success: false
    });

    // Handle specific API errors
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenRouter API key. Please check your configuration.');
    }

    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few moments.');
    }

    if (error.response?.status === 402) {
      throw new Error('Insufficient credits. The free tier model may have usage limits.');
    }

    throw new Error(`Failed to generate post: ${error.message}`);
  }
}

/**
 * Available free models on OpenRouter
 */
export const FREE_MODELS = {
  SHERLOCK_DASH: 'openrouter/sherlock-dash-alpha',
  SHERLOCK_THINK: 'openrouter/sherlock-think-alpha',
  KAT_CODER_PRO: 'kwaipilot/kat-coder-pro:free',
  NVIDIA_NEMOTRON: 'nvidia/nemotron-nano-12b-v2-vl:free',
};

export default { generatePostWithOpenRouter, FREE_MODELS };
