import '@testing-library/jest-dom';
import * as fc from 'fast-check';

// Global configuration for property tests
fc.configureGlobal({ numRuns: 100 });
