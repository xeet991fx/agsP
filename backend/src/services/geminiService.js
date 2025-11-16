import { GoogleGenerativeAI } from '@google/generative-ai';
import { logGeneration, logError, logInfo } from '../utils/logger.js';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate X post using Gemini API with quality-optimized settings
 * @param {Object} params - Generation parameters
 * @param {string} params.systemPrompt - Full system prompt text
 * @param {string} params.userInput - User's topic/idea
 * @param {Object} params.modelConfig - Model configuration (temperature, etc.)
 * @param {string} params.promptId - ID of the system prompt used
 * @returns {Promise<Object>} Generated post data
 */
export async function generatePost({ systemPrompt, userInput, modelConfig, promptId }) {
  try {
    logInfo('Starting post generation', {
      promptId,
      userInputLength: userInput.length,
      systemPromptLength: systemPrompt.length
    });

    // Use Gemini 2.5 Pro (or experimental version for best quality)
    // Note: Change to "gemini-2.5-pro-exp-03-25" if available for better results
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: modelConfig.temperature || 0.7,
        maxOutputTokens: modelConfig.maxOutputTokens || 500,
        topP: modelConfig.topP || 0.95,
        topK: modelConfig.topK || 40,
      }
    });

    const startTime = Date.now();
    const result = await model.generateContent(userInput);
    const response = result.response;
    const generatedText = response.text();
    const endTime = Date.now();

    logInfo('Generation completed', {
      duration: `${endTime - startTime}ms`,
      outputLength: generatedText.length
    });

    // Log full generation for quality debugging
    await logGeneration({
      promptId,
      systemPrompt,
      userInput,
      modelConfig,
      generatedText,
      duration: endTime - startTime,
      model: "gemini-2.5-pro",
      success: true
    });

    return {
      text: generatedText,
      metadata: {
        model: "gemini-2.5-pro",
        duration: endTime - startTime,
        characterCount: generatedText.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    logError('generatePost', error);

    // Log failed generation attempt
    await logGeneration({
      promptId,
      systemPrompt,
      userInput,
      modelConfig,
      error: error.message,
      success: false
    });

    // Handle specific API errors with user-friendly messages
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY configuration.');
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Free tier allows 25 requests/day. Please try again later.');
    }

    if (error.message?.includes('safety')) {
      throw new Error('Content was blocked by safety filters. Please try a different topic.');
    }

    throw new Error(`Failed to generate post: ${error.message}`);
  }
}

/**
 * Validate Gemini API key
 * @returns {Promise<boolean>} True if API key is valid
 */
export async function validateApiKey() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    await model.generateContent("test");
    return true;
  } catch (error) {
    logError('validateApiKey', error);
    return false;
  }
}
