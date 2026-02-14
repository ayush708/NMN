/**
 * Slug Generator Utility
 * Create URL-friendly slugs from strings
 */

/**
 * Generate slug from string
 * @param {String} text - Input text
 * @returns {String} URL-friendly slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Generate unique slug with timestamp
 * @param {String} text - Input text
 * @returns {String} Unique slug
 */
const generateUniqueSlug = (text) => {
  const slug = generateSlug(text);
  const timestamp = Date.now();
  return `${slug}-${timestamp}`;
};

module.exports = {
  generateSlug,
  generateUniqueSlug
};
