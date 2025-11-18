import { GoogleGenerativeAI } from '@google/generative-ai';
import { logGeneration, logError, logInfo } from '../utils/logger.js';
import { SYSTEM_PROMPT, MODEL_CONFIG } from '../config/systemPrompt.js';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not set. Generation will not work.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate X post using Gemini API with built-in system prompt
 * @param {Object} params - Generation parameters
 * @param {string} params.userInput - User's topic/idea
 * @param {Object} params.customConfig - Optional custom model configuration
 * @returns {Promise<Object>} Generated post data
 */
export async function generatePost({ userInput, customConfig }) {
  try {
    logInfo('Starting post generation', {
      userInputLength: userInput.length
    });

    // Merge default config with any custom overrides
    const modelConfig = customConfig
      ? { ...MODEL_CONFIG, ...customConfig }
      : MODEL_CONFIG;

    // Use Gemini 2.0 Flash (experimental) with built-in system prompt
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: modelConfig
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
      userInput,
      modelConfig,
      generatedText,
      duration: endTime - startTime,
      model: "gemini-2.0-flash-exp",
      success: true
    });

    return {
      text: generatedText,
      metadata: {
        model: "gemini-2.0-flash-exp",
        duration: endTime - startTime,
        characterCount: generatedText.length,
        timestamp: new Date().toISOString(),
        modelConfig
      }
    };
  } catch (error) {
    logError('generatePost', error);

    // Log failed generation attempt
    await logGeneration({
      userInput,
      modelConfig: customConfig || MODEL_CONFIG,
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    await model.generateContent("test");
    return true;
  } catch (error) {
    logError('validateApiKey', error);
    return false;
  }
}
