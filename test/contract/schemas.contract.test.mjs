import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  geolocationRequestSchema,
  geolocationResponseSchema,
  logWebhookRequestSchema,
  pricingRequestSchema,
  pricingResponseSchema,
  updateIntegrationCredentialsRequestSchema,
  validateIntegrationStatusResponseSchema
} from '../../dist/index.js';

const fixturesPath = path.resolve('test/fixtures/bluex-contract-fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

test('contract: pricing request fixture cumple schema', () => {
  const parsed = pricingRequestSchema.safeParse(fixtures.pricingRequest);
  assert.equal(parsed.success, true);
});

test('contract: pricing response fixture cumple schema', () => {
  const parsed = pricingResponseSchema.safeParse(fixtures.pricingResponse);
  assert.equal(parsed.success, true);
});

test('contract: geolocation request/response fixtures cumplen schema', () => {
  const req = geolocationRequestSchema.safeParse(fixtures.geolocationRequest);
  const res = geolocationResponseSchema.safeParse(fixtures.geolocationResponse);
  assert.equal(req.success, true);
  assert.equal(res.success, true);
});

test('contract: validate integration response fixture cumple schema', () => {
  const parsed = validateIntegrationStatusResponseSchema.safeParse(fixtures.validateIntegrationStatusResponse);
  assert.equal(parsed.success, true);
});

test('contract: update credentials request fixture cumple schema', () => {
  const parsed = updateIntegrationCredentialsRequestSchema.safeParse(fixtures.updateIntegrationCredentialsRequest);
  assert.equal(parsed.success, true);
});

test('contract: log webhook request fixture cumple schema', () => {
  const parsed = logWebhookRequestSchema.safeParse(fixtures.logWebhookRequest);
  assert.equal(parsed.success, true);
});

test('contract: schema rechaza pricing sin bultos', () => {
  const invalid = { ...fixtures.pricingRequest, bultos: [] };
  const parsed = pricingRequestSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});
