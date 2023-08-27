import '@testing-library/jest-dom';
import fetch, { Headers, Request, Response } from 'node-fetch';
import mockServer from './src/__fixtures__/mockServer';

globalThis.fetch = fetch as typeof global.fetch;
globalThis.Headers = Headers;
globalThis.Request = Request as unknown as typeof global.Request;
globalThis.Response = Response as unknown as typeof global.Response;

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
