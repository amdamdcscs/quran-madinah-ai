// Utility functions for Arabic text processing

/**
 * Removes Arabic diacritics (tashkeel) from text for search normalization
 */
export const removeDiacritics = (text: string): string => {
  // Arabic diacritics Unicode ranges
  const diacriticsRegex = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
  return text.replace(diacriticsRegex, '');
};

/**
 * Normalizes Arabic text for search by:
 * 1. Removing diacritics
 * 2. Normalizing different forms of the same letter
 * 3. Trimming whitespace
 */
export const normalizeArabicForSearch = (text: string): string => {
  let normalized = removeDiacritics(text);
  
  // Normalize different forms of Alef
  normalized = normalized.replace(/[آأإٱ]/g, 'ا');
  
  // Normalize different forms of Teh Marbuta and Heh
  normalized = normalized.replace(/[ةه]/g, 'ه');
  
  // Normalize different forms of Yeh
  normalized = normalized.replace(/[يىئ]/g, 'ي');
  
  // Normalize Hamza
  normalized = normalized.replace(/[ؤء]/g, 'و');
  
  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
};

/**
 * Highlights search term in Arabic text while preserving original formatting
 */
export const highlightArabicText = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;
  
  const normalizedText = normalizeArabicForSearch(text);
  const normalizedSearchTerm = normalizeArabicForSearch(searchTerm);
  
  // Find all matches in normalized text
  const matches: Array<{start: number, end: number}> = [];
  let index = 0;
  
  while (index < normalizedText.length) {
    const matchIndex = normalizedText.indexOf(normalizedSearchTerm, index);
    if (matchIndex === -1) break;
    
    matches.push({
      start: matchIndex,
      end: matchIndex + normalizedSearchTerm.length
    });
    index = matchIndex + 1;
  }
  
  if (matches.length === 0) return text;
  
  // Map positions back to original text (accounting for diacritics)
  let result = '';
  let originalIndex = 0;
  let normalizedIndex = 0;
  let currentMatch = 0;
  
  while (originalIndex < text.length && normalizedIndex < normalizedText.length) {
    const originalChar = text[originalIndex];
    const normalizedChar = normalizedText[normalizedIndex];
    
    // Check if we're at the start of a match
    if (currentMatch < matches.length && normalizedIndex === matches[currentMatch].start) {
      result += '<mark class="bg-yellow-300 text-yellow-900 px-1 rounded">';
    }
    
    result += originalChar;
    
    // Check if we're at the end of a match
    if (currentMatch < matches.length && normalizedIndex === matches[currentMatch].end - 1) {
      result += '</mark>';
      currentMatch++;
    }
    
    // Only advance normalized index if current char contributes to normalized text
    if (removeDiacritics(originalChar) === normalizedChar) {
      normalizedIndex++;
    }
    
    originalIndex++;
  }
  
  // Add remaining characters
  while (originalIndex < text.length) {
    result += text[originalIndex];
    originalIndex++;
  }
  
  return result;
};