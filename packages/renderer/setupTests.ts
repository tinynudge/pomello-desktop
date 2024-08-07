import '@testing-library/jest-dom/vitest';
import { mockServer } from './src/__fixtures__/mockServer';

window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.play = async () => {};
window.scrollTo = () => {};

beforeAll(() => {
  mockServer.listen();
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
