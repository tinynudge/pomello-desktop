import '@testing-library/jest-dom/vitest';
import { mockServer } from './src/__fixtures__/mockServer';

global.HTMLElement.prototype.hidePopover = () => {};
global.HTMLElement.prototype.showPopover = () => {};

global.HTMLMediaElement.prototype.load = () => {};
global.HTMLMediaElement.prototype.pause = () => {};
global.HTMLMediaElement.prototype.play = async () => {};

global.HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
global.HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

global.scrollTo = () => {};

beforeAll(() => {
  mockServer.listen();
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
