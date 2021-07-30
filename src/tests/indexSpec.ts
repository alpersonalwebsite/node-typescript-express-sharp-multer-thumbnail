import path from 'path';
import request from 'superagent';
import app from '../index';
import { minimumWidth, minimumHeight } from '../utilities/image';

const baseURL = 'http://localhost:5000';

app;

describe('Test /api/images endpoint', () => {
  it('gets 200 for GET /api/images?filename=integration&width=100&height=100', async () => {
    const response = await request.get(
      `${baseURL}/api/images?filename=integration&width=100&height=100'`
    );

    expect(response.status).toBe(200);
  });
  it('gets 400 for GET /api/images?filename=integration without width and height defaulting to default width and height', async () => {
    try {
      await request.get(`${baseURL}/api/images?filename=integration`);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 400 for GET /api/images?filename=integration&width=lala&height=100 with wrong WIDTH data type', async () => {
    try {
      await request.get(
        `${baseURL}/api/images?filename=integration&width=lala&height=100 `
      );
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 400 for GET /api/images?filename=integration&width=100height=lala with wrong HEIGHT data type', async () => {
    try {
      await request.get(
        `${baseURL}/api/images?filename=integration&width=lala&height=100 `
      );
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 400 for GET /api/images?filename=integration&width=10height=100 if WIDTH is LESS than the MIN allowed value', async () => {
    const lessThanMinWidth = minimumWidth - 10;
    try {
      await request.get(
        `${baseURL}/api/images?filename=integration&width=${lessThanMinWidth}&height=100`
      );
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 400 for GET /api/images?filename=integration&width=100height=10 if HEIGHT is LESS than the MIN allowed value', async () => {
    const lessThanMinWidth = minimumHeight - 10;
    try {
      await request.get(
        `${baseURL}/api/images?filename=integration&width=${lessThanMinWidth}&height=100`
      );
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 400 for GET /api/images/', async () => {
    try {
      await request.get(`${baseURL}/api/images/`);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 404 for GET /api/images/hi', async () => {
    try {
      await request.get(`${baseURL}/api/images/hi`);
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });
  it('gets 400 for POST /api/images without an image', async () => {
    try {
      await request.post(`${baseURL}/api/images`);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
  it('gets 415 for POST /api/images with the WRONG image type', async () => {
    const imageToUploadPath = `${path.resolve()}/images/integration.png`;
    try {
      await request
        .post(`${baseURL}/api/images`)
        .attach('recfile', imageToUploadPath);
    } catch (err) {
      expect(err.status).toBe(415);
    }
  });
  it('gets 200 for POST /api/images with the RIGHT image type', async () => {
    const imageToUploadPath = `${path.resolve()}/images/integration.jpg`;
    const response = await request
      .post(`${baseURL}/api/images`)
      .attach('recfile', imageToUploadPath);

    expect(response.status).toBe(201);
  });
});
