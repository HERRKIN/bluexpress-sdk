import test from 'node:test';
import assert from 'node:assert/strict';
import { BluexpressClient, BluexpressApiError } from '../../dist/index.js';

const hasIntegrationEnv =
  Boolean(process.env.BLUEXPRESS_API_KEY) &&
  (Boolean(process.env.BLUEXPRESS_ENV) || Boolean(process.env.BLUEXPRESS_BASE_URL));

const client = hasIntegrationEnv
  ? new BluexpressClient({
      apiKey: process.env.BLUEXPRESS_API_KEY,
      environment: process.env.BLUEXPRESS_ENV,
      baseUrl: process.env.BLUEXPRESS_BASE_URL,
      accountName: process.env.BLUEXPRESS_ACCOUNT_NAME
    })
  : null;

test(
  'integration: validateIntegrationStatus responde objeto o error API controlado',
  { skip: !hasIntegrationEnv },
  async () => {
    try {
      const response = await client.validateIntegrationStatus();
      assert.equal(typeof response, 'object');
    } catch (error) {
      assert.equal(error instanceof BluexpressApiError, true);
      assert.equal(typeof error.httpStatus, 'number');
      assert.equal(typeof error.endpoint, 'string');
    }
  }
);

if (!hasIntegrationEnv) {
  test('integration: skipped (faltan env vars)', { skip: true }, () => {});
}
