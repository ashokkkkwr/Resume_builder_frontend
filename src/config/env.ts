
export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Resume Builder',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  MAX_WORK_EXPERIENCES: parseInt(import.meta.env.VITE_MAX_WORK_EXPERIENCES || '10'),
  MAX_EDUCATION_ENTRIES: parseInt(import.meta.env.VITE_MAX_EDUCATION_ENTRIES || '5'),
  MAX_SKILLS: parseInt(import.meta.env.VITE_MAX_SKILLS || '50'),
  MAX_SUMMARY_LENGTH: parseInt(import.meta.env.VITE_MAX_SUMMARY_LENGTH || '500'),
  
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx').split(','),
  
  ENABLE_PDF_EXPORT: import.meta.env.VITE_ENABLE_PDF_EXPORT === 'true',
  ENABLE_TEMPLATE_SELECTION: import.meta.env.VITE_ENABLE_TEMPLATE_SELECTION === 'true',
  ENABLE_AUTO_SAVE: import.meta.env.VITE_ENABLE_AUTO_SAVE === 'true',
  AUTO_SAVE_INTERVAL: parseInt(import.meta.env.VITE_AUTO_SAVE_INTERVAL || '30000'),
  
  ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'),
  
  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'modern',
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;
export type EnvConfig = typeof env;

export const validateEnv = () => {
  const requiredVars = [
    'VITE_API_BASE_URL',
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
  }
  
  return missingVars.length === 0;
};
if (env.IS_DEVELOPMENT) {
  validateEnv();
}