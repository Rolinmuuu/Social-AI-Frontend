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
