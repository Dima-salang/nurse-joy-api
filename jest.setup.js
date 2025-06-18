// Set NODE_ENV for tests
process.env.NODE_ENV = 'test';

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables
process.env.AGORA_APP_ID = 'test-app-id';
process.env.AGORA_APP_CERTIFICATE = 'test-app-certificate'; 