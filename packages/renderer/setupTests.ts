import '@testing-library/jest-dom';
import fetch from 'node-fetch';
import mockServer from './src/__fixtures__/mockServer';

global.fetch = fetch as typeof global.fetch;

window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.play = async () => {};
window.HTMLMediaElement.prototype.pause = () => {};

beforeAll(() => {
  mockServer.listen();
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
