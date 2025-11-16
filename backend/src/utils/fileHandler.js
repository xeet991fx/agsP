import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_FILE = path.join(__dirname, '../../data/systemPrompts.json');

/**
 * Read system prompts from JSON file
 * @returns {Promise<Object>} Prompts data
 */
export async function readPrompts() {
  try {
    const data = await fs.readFile(PROMPTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with default structure
    if (error.code === 'ENOENT') {
      const defaultData = { prompts: [] };
      await writePrompts(defaultData);
      return defaultData;
    }
    throw error;
  }
}

/**
 * Write system prompts to JSON file
 * @param {Object} data - Prompts data to write
 * @returns {Promise<void>}
 */
export async function writePrompts(data) {
  try {
    await fs.writeFile(PROMPTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write prompts file: ${error.message}`);
  }
}

/**
 * Ensure data directory exists
 * @returns {Promise<void>}
 */
export async function ensureDataDir() {
  const dataDir = path.join(__dirname, '../../data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}
