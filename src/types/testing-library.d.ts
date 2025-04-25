import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface JestAssertion {
      toBeInTheDocument(): void;
      toHaveClass(className: string): void;
    }
  }
} 