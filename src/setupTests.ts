import "@testing-library/jest-dom";

// jsdom does not implement matchMedia, which antd's responsive components use.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom (Jest 27) has no MessageChannel; @rc-component/form uses it to batch updates.
if (typeof (globalThis as any).MessageChannel === "undefined") {
  class MessageChannelPolyfill {
    port1: { onmessage: ((event: unknown) => void) | null } = { onmessage: null };
    port2 = {
      postMessage: (data: unknown) => {
        setTimeout(() => this.port1.onmessage?.({ data }), 0);
      },
    };
  }
  (globalThis as any).MessageChannel = MessageChannelPolyfill;
}

// jsdom has no ResizeObserver; antd's auto-sizing TextArea observes its own size.
if (typeof (globalThis as any).ResizeObserver === "undefined") {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom's selector engine (nwsapi) throws on some of antd's CSS-in-JS rules while computing
// styles; the auto-sizing TextArea calls getComputedStyle on every render. Fall back to an
// empty style only when jsdom throws, so every other call behaves as before.
const jsdomGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = ((elt: Element, pseudo?: string | null) => {
  try {
    return jsdomGetComputedStyle(elt, pseudo);
  } catch {
    return { getPropertyValue: () => "" } as unknown as CSSStyleDeclaration;
  }
}) as typeof window.getComputedStyle;
