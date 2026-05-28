import fsp from 'fs/promises';
import path from 'path';

// ============================================================================
// Environment Variable Loader (no external dependencies required)
// ============================================================================

/**
 * Loads environment variables from a .env file
 * Supports Next.js env file conventions
 * @param {string} filePath - Path to .env file
 */
const loadEnvFile = async (filePath) => {
  try {
    const content = await fsp.readFile(filePath, 'utf8');
    
    content.split('\n').forEach((line) => {
      // Skip empty lines and comments
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      // Parse KEY=VALUE format
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) return;
      
      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Only set if not already defined in process.env
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    });
  } catch {}
};

/**
 * Loads environment variables from .env files
 * Follows Next.js priority order:
 * - .env.local (highest priority, not committed to git)
 * - .env.development.local (if NODE_ENV=development)
 * - .env.production.local (if NODE_ENV=production)
 * - .env.development / .env.production (based on NODE_ENV)
 * - .env (lowest priority)
 */
const loadEnvironment = async () => {
  const rootDir = process.cwd();
  await loadEnvFile(path.join(rootDir, '.env'));
};

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_OUTPUT_DIR = 'src/i18n/locales';
const DEFAULT_TIMEOUT_MS = 10000;
const PRIMARY_LANGUAGE = 'en';

/**
 * Gets configuration from environment variables
 * Must be called after loadEnvironment()
 */
const getConfig = () => ({
  sourceUrl: process.env.TX_SOURCE_URL,
  outputDir: path.resolve(process.cwd(), process.env.TX_OUTPUT_DIR || DEFAULT_OUTPUT_DIR),
  timeoutMs: Number(process.env.TX_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
});

// ============================================================================
// Validation
// ============================================================================

/**
 * Validates required environment variables
 * @param {object} config - Configuration object
 * @throws {Error} If required configuration is missing or invalid
 */
const validateConfig = (config) => {
  if (!config.sourceUrl) {
    throw new Error(
      'TX_SOURCE_URL environment variable is required.\n' +
      'Add it to .env or .env.local file:\n' +
      '  TX_SOURCE_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
    );
  }

  if (isNaN(config.timeoutMs) || config.timeoutMs <= 0) {
    throw new Error('TX_TIMEOUT_MS must be a positive number');
  }
};

// ============================================================================
// File System Utilities
// ============================================================================

/**
 * Ensures a directory exists, creating it recursively if needed
 * @param {string} dir - Directory path
 */
const ensureDir = async (dir) => {
  await fsp.mkdir(dir, { recursive: true });
};

/**
 * Writes an object to a JSON file with pretty formatting
 * @param {string} filePath - Path to the output file
 * @param {object} obj - Object to write
 */
const writeJson = async (filePath, obj) => {
  const json = JSON.stringify(obj, null, 2);
  await fsp.writeFile(filePath, json, 'utf8');
};

/**
 * Sorts an object by its keys alphabetically
 * @param {object} obj - Object to sort
 * @returns {object} New object with sorted keys
 */
const sortObjectByKeys = (obj) =>
  Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

// ============================================================================
// Data Normalization
// ============================================================================

/**
 * Checks if the payload is already in the object format
 * @param {any} data - Raw data to check
 * @returns {boolean} True if data is in object format
 */
const isObjectFormat = (data) => {
  if (typeof data !== 'object' || Array.isArray(data) || !data) {
    return false;
  }
  
  return Object.keys(data).every(
    (key) => typeof data[key] === 'object' && !Array.isArray(data[key])
  );
};

/**
 * Extracts 2D array from various response formats
 * @param {any} raw - Raw response data
 * @returns {Array[]|null} 2D array or null if not found
 */
const extract2DArray = (raw) => {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.rows)) return raw.rows;
  if (Array.isArray(raw)) return raw;
  return null;
};

/**
 * Converts 2D array format to object format
 * @param {Array[]} arrayData - 2D array with headers in first row
 * @returns {object} Object with language keys
 */
const convertArrayToObject = (arrayData) => {
  const [headerRow, ...dataRows] = arrayData;
  
  // Parse and validate headers
  const headers = headerRow.map((header) => String(header || '').trim());
  
  if (headers.length === 0) {
    throw new Error('Header row is empty');
  }
  
  // Find primary language column (default: "en")
  const primaryIndex = headers.findIndex(
    (header) => header.toLowerCase() === PRIMARY_LANGUAGE
  );
  
  if (primaryIndex === -1) {
    throw new Error(`Primary language column "${PRIMARY_LANGUAGE}" not found in header`);
  }

  // Initialize language objects
  const result = {};
  headers.forEach((lang) => {
    if (lang) {
      result[lang] = {};
    }
  });

  // Process each row
  dataRows.forEach((row) => {
    const cells = Array.isArray(row) ? row : [];
    const key = String(cells[primaryIndex] ?? '').trim();
    
    // Skip rows without a key
    if (!key) return;
    
    // Map values to each language
    headers.forEach((lang, columnIndex) => {
      if (!lang) return;
      
      const cellValue = cells[columnIndex];
      const value = cellValue == null ? '' : String(cellValue);
      
      result[lang][key] = value;
    });
  });

  return result;
};

/**
 * Normalizes raw API response to standard format
 * @param {any} raw - Raw API response
 * @returns {object} Normalized object with language keys
 * @throws {Error} If response format is invalid
 */
const normalizeResponse = (raw) => {
  if (!raw) {
    throw new Error('Empty response from API');
  }

  // Case 1: Already in object format
  if (isObjectFormat(raw)) {
    return raw;
  }

  // Case 2: 2D array format
  const arrayData = extract2DArray(raw);
  
  if (!arrayData) {
    throw new Error(
      'Unsupported response format. Expected either:\n' +
      '  1. Object format: { en: { key: "value" }, de: { ... } }\n' +
      '  2. Array format: [["en", "de"], ["hello", "hallo"]]'
    );
  }

  return convertArrayToObject(arrayData);
};

// ============================================================================
// Main Logic
// ============================================================================

/**
 * Fetches translations from the configured source URL
 * @param {object} config - Configuration object
 * @returns {Promise<object>} Normalized translation data
 */
const fetchTranslations = async (config) => {
  console.log('📥 Fetching translations from:', config.sourceUrl);
  console.log(`⏱️  Timeout: ${config.timeoutMs}ms\n`);

  const response = await fetch(config.sourceUrl, {
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return normalizeResponse(data);
};

/**
 * Writes translation files for each language
 * @param {object} config - Configuration object
 * @param {object} translations - Normalized translations object
 * @returns {Promise<{fileCount: number, keyCount: number}>} Statistics
 */
const writeTranslationFiles = async (config, translations) => {
  await ensureDir(config.outputDir);

  let fileCount = 0;
  let keyCount = 0;

  for (const language of Object.keys(translations).sort()) {
    const translationMap = sortObjectByKeys(translations[language] || {});
    const filePath = path.join(config.outputDir, `${language}.json`);
    
    await writeJson(filePath, translationMap);
    
    const keyTotal = Object.keys(translationMap).length;
    const relativePath = path.relative(process.cwd(), filePath);
    
    fileCount++;
    keyCount += keyTotal;
    
    console.log(`  ✅ ${relativePath} (${keyTotal} keys)`);
  }

  return { fileCount, keyCount };
};

/**
 * Main execution function
 */
const main = async () => {
  const startTime = Date.now();

  // Load environment variables from .env files
  await loadEnvironment();

  // Get configuration
  const config = getConfig();

  // Validate configuration
  validateConfig(config);

  // Fetch and normalize translations
  const translations = await fetchTranslations(config);

  // Write translation files
  const { fileCount, keyCount } = await writeTranslationFiles(config, translations);

  // Print summary
  const duration = Date.now() - startTime;
  console.log(`\n✨ Done! Generated ${fileCount} files with ${keyCount} total keys in ${duration}ms`);
};

// ============================================================================
// Entry Point
// ============================================================================

main().catch((error) => {
  console.error('\n❌ Translation sync failed:');
  console.error(error?.message || error);
  process.exit(1);
});
