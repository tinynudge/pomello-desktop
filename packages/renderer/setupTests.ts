import '@testing-library/jest-dom/vitest';
import { mockServer } from './src/__fixtures__/mockServer';

const togglePopover = (element: HTMLElement) => {
  /* @ts-expect-error jsdom does not support Popover API yet, so we need to hack it */
  element.open = !element.open;

  const toggleEvent = new Event('beforetoggle');
  /* @ts-expect-error jsdom does not support ToggleEvent yet */
  toggleEvent.newState = element.open ? 'open' : 'closed';

  element.dispatchEvent(toggleEvent);
};

// For some reason, `vite-plugin-solid` is causing this setup file to be
// executed two times. I don't know why, but it is related to these lines:
// https://github.com/solidjs/vite-plugin-solid/blob/873f4cec4db1dcffac9d909191cf828a9902a418/src/index.ts#L220-L224
// Adding a short-circuit here to prevent multiple event listeners.
if (!process.env.DID_RUN) {
  document.body.addEventListener('click', ({ target }) => {
    const popoverId = target instanceof HTMLElement && target.getAttribute('popovertarget');
    const popover = popoverId ? document.getElementById(popoverId) : null;

    if (popover) {
      togglePopover(popover);
    }
  });

  process.env.DID_RUN = 'true';
}

global.HTMLElement.prototype.hidePopover = function () {
  togglePopover(this);
};
global.HTMLElement.prototype.showPopover = function () {
  togglePopover(this);
};

global.HTMLMediaElement.prototype.load = () => {};
global.HTMLMediaElement.prototype.pause = () => {};
global.HTMLMediaElement.prototype.play = async () => {};

global.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
global.HTMLDialogElement.prototype.close = function () {
  this.dispatchEvent(new Event('close'));

  this.open = false;
};

global.scrollTo = () => {};

global.Element.prototype.scrollIntoView = () => {};

global.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
      this
    );
  }

  unobserve() {}

  disconnect() {}
};

const svgTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
global.SVGTextElement = svgTextElement.constructor as typeof SVGTextElement;
global.SVGTextElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 }) as DOMRect;

beforeAll(() => {
  mockServer.listen();
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
