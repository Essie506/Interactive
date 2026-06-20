/**
 * =============================================================================
 * 🚧 DEVELOPMENT MODE CONFIGURATION
 * =============================================================================
 * 
 * This file controls whether the app runs in "editing/preview" mode or
 * "production" mode.
 * 
 * 🔧 FOR PRODUCTION DEPLOYMENT:
 * 1. Set DEV_MODE to `false`
 * 2. This will:
 *    - Enable authentication (require login)
 *    - Use real database data instead of demo data
 *    - Hide the Table of Contents page
 * 
 * =============================================================================
 */

// ⚠️ CHANGE THIS TO `false` BEFORE PUBLISHING!
export const DEV_MODE = true;

// Show demo data instead of fetching from database
export const USE_DEMO_DATA = DEV_MODE;

// Skip authentication checks
export const SKIP_AUTH = DEV_MODE;
