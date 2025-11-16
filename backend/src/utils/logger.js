import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_DIR = path.join(__dirname, '../../logs');
const LOG_GENERATIONS = process.env.LOG_GENERATIONS === 'true';

/**
 * Ensure logs directory exists
 */
async function ensureLogsDir() {
  try {
    await fs.access(LOGS_DIR);
  } catch {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  }
}

/**
 * Log generation request and response for quality debugging
 * @param {Object} logData - Generation data to log
 */
export async function logGeneration(logData) {
  if (!LOG_GENERATIONS) return;

  try {
    await ensureLogsDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(LOGS_DIR, `generation-${timestamp}.json`);

    const logEntry = {
      timestamp: new Date().toISOString(),
      ...logData
    };

    await fs.writeFile(logFile, JSON.stringify(logEntry, null, 2), 'utf-8');
    console.log(`[Logger] Generation logged to: ${logFile}`);
  } catch (error) {
    console.error('[Logger] Failed to log generation:', error.message);
  }
}

/**
 * Log errors for debugging
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
export function logError(context, error) {
  console.error(`[Error in ${context}]:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log info messages
 * @param {string} message - Info message
 * @param {Object} data - Additional data
 */
export function logInfo(message, data = {}) {
  console.log(`[Info] ${message}`, data);
}
