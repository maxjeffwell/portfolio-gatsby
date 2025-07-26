// Keyword tracking utilities for SEO monitoring
import { keywordConfig, getPageKeywords } from '../data/keywords';

/**
 * Track keyword performance using Google Analytics events
 * Call this when users land on pages via organic search
 */
export const trackKeywordRanking = (keyword, page, position) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'keyword_ranking', {
      event_category: 'SEO',
      event_label: keyword,
      custom_parameter_1: page,
      custom_parameter_2: position,
      non_interaction: true,
    });
  }
};

/**
 * Track organic search landing pages
 */
export const trackOrganicLanding = (page, referrer) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Check if traffic is from Google search
    if (referrer && referrer.includes('google.com')) {
      window.gtag('event', 'organic_landing', {
        event_category: 'SEO',
        event_label: page,
        custom_parameter_1: 'google_organic',
        non_interaction: true,
      });
    }
  }
};

/**
 * Get Search Console performance data (requires API setup)
 * This is a template for future server-side implementation
 */
export const getSearchConsoleData = async (startDate, endDate) => {
  // This would require Google Search Console API setup on the server side
  // For now, this is a placeholder structure for future implementation
  console.warn('Search Console API integration requires server-side implementation');
  return {
    keywords: [],
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
};

/**
 * Keyword density analyzer for content optimization
 */
export const analyzeKeywordDensity = (content, targetKeywords) => {
  const wordCount = content.toLowerCase().split(/\s+/).length;
  const analysis = {};

  targetKeywords.forEach((keyword) => {
    const keywordRegex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = content.match(keywordRegex) || [];
    const density = (matches.length / wordCount) * 100;

    analysis[keyword] = {
      count: matches.length,
      density: density.toFixed(2),
      recommendation: getDensityRecommendation(density),
    };
  });

  return analysis;
};

/**
 * Get keyword density recommendations
 */
const getDensityRecommendation = (density) => {
  if (density < 0.5) return 'Too low - consider adding more instances';
  if (density > 3.0) return 'Too high - risk of keyword stuffing';
  if (density >= 1.0 && density <= 2.5) return 'Optimal density';
  return 'Good density';
};

/**
 * Generate semantic keywords based on main keyword
 */
export const generateSemanticKeywords = (mainKeyword) => {
  const semanticMap = {
    'react developer': [
      'react programmer',
      'react.js developer',
      'frontend react developer',
      'react application developer',
      'react component developer',
    ],
    'full stack developer': [
      'full-stack programmer',
      'end-to-end developer',
      'complete web developer',
      'frontend backend developer',
      'versatile web programmer',
    ],
    'node.js developer': [
      'nodejs programmer',
      'server-side javascript developer',
      'backend node developer',
      'node.js backend developer',
      'express.js developer',
    ],
    'javascript developer': [
      'js programmer',
      'javascript programmer',
      'es6 developer',
      'modern javascript developer',
      'vanilla javascript developer',
    ],
  };

  return semanticMap[mainKeyword.toLowerCase()] || [];
};

/**
 * Keyword opportunity finder
 * Suggests new keywords based on current content
 */
export const findKeywordOpportunities = (currentKeywords, competitorKeywords) => {
  const opportunities = competitorKeywords.filter((keyword) => !currentKeywords.includes(keyword));

  return opportunities.map((keyword) => ({
    keyword,
    difficulty: estimateKeywordDifficulty(keyword),
    opportunity: calculateOpportunityScore(keyword),
  }));
};

/**
 * Estimate keyword difficulty (simplified)
 */
const estimateKeywordDifficulty = (keyword) => {
  const wordCount = keyword.split(' ').length;
  const commonWords = ['developer', 'programmer', 'web', 'react', 'node'];
  const hasCommonWords = commonWords.some((word) => keyword.includes(word));

  if (wordCount === 1) return 'High';
  if (wordCount >= 4) return 'Low';
  if (hasCommonWords && wordCount === 2) return 'High';
  return 'Medium';
};

/**
 * Calculate opportunity score
 */
const calculateOpportunityScore = (keyword) => {
  // Simplified scoring based on keyword characteristics
  const { length } = keyword;
  const wordCount = keyword.split(' ').length;

  let score = 50; // Base score

  if (wordCount >= 3) score += 20; // Long-tail bonus
  if (length > 20) score += 15; // Specific keyword bonus
  if (keyword.includes('hire') || keyword.includes('freelance')) score += 25; // Intent bonus

  return Math.min(score, 100);
};

/**
 * Track SERP features (Featured snippets, local pack, etc.)
 */
export const trackSERPFeatures = (keyword, features) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'serp_features', {
      event_category: 'SEO',
      event_label: keyword,
      custom_parameter_1: features.join(','),
      non_interaction: true,
    });
  }
};

/**
 * Generate monthly SEO report data
 */
export const generateSEOReport = (data) => {
  return {
    reportDate: new Date().toISOString().split('T')[0],
    keywordPerformance: data.keywords || [],
    organicTraffic: data.traffic || 0,
    averagePosition: data.avgPosition || 0,
    clickThroughRate: data.ctr || 0,
    improvements: [],
    actionItems: [],
  };
};

export default {
  trackKeywordRanking,
  trackOrganicLanding,
  analyzeKeywordDensity,
  generateSemanticKeywords,
  findKeywordOpportunities,
  trackSERPFeatures,
  generateSEOReport,
};
