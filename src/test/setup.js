import '@testing-library/jest-dom';

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (!globalThis.IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  }

  globalThis.IntersectionObserver = MockIntersectionObserver;
}
