import test from 'node:test';
import assert from 'node:assert/strict';
import { BluexpressClient, BluexpressValidationError } from '../../dist/index.js';

test('getPricing usa endpoint y headers esperados', async () => {
  let calledUrl = '';
  let calledHeaders = {};

  const client = new BluexpressClient({
    environment: 'qa',
    apiKey: 'bluex-key',
    accountName: 'https://shop.example.com/',
    fetchImpl: async (input, init) => {
      calledUrl = String(input);
      calledHeaders = init?.headers ?? {};
      return new Response(
        JSON.stringify({
          code: '00',
          data: { total: 1990, promiseDay: 1, nameService: 'Express', isShipmentFree: false }
        }),
        { status: 200 }
      );
    }
  });

  const res = await client.getPricing({
    from: { country: 'CL', district: 'SCL' },
    to: { country: 'CL', state: '13', district: 'PRO' },
    serviceType: 'EX',
    bultos: [{ largo: 10, ancho: 10, alto: 10, sku: 'SKU1', pesoFisico: 1, cantidad: 1 }],
    declaredValue: 10000,
    familiaProducto: 'PAQU'
  });

  assert.equal(calledUrl, 'https://eplin.api.qa.blue.cl/eplin/pricing/v1');
  assert.equal(calledHeaders['x-api-key'], 'bluex-key');
  assert.equal(calledHeaders['price'], '10000');
  assert.equal(res.code, '00');
  assert.equal(res.data?.total, 1990);
});

test('getPricing falla con BluexpressValidationError si request es invalido', async () => {
  const client = new BluexpressClient({
    apiKey: 'bluex-key',
    accountName: 'https://shop.example.com/',
    fetchImpl: async () => new Response(JSON.stringify({ code: '00', data: {} }), { status: 200 })
  });

  await assert.rejects(
    () =>
      client.getPricing({
        from: { country: 'CL', district: 'SCL' },
        to: { country: 'CL', state: '13', district: 'PRO' },
        serviceType: 'EX',
        bultos: [{ largo: 10, ancho: 10, alto: 10, sku: 'SKU1', pesoFisico: 1, cantidad: 1 }],
        declaredValue: -1,
        familiaProducto: 'PAQU'
      }),
    (error) => error instanceof BluexpressValidationError
  );
});

test('getGeolocation cambia endpoint a /v2 cuando isPudo=true', async () => {
  let calledUrl = '';

  const client = new BluexpressClient({
    environment: 'production',
    apiKey: 'bluex-key',
    accountName: 'https://shop.example.com/',
    fetchImpl: async (input) => {
      calledUrl = String(input);
      return new Response(JSON.stringify({ districtCode: 'PRO', regionCode: '13' }), { status: 200 });
    }
  });

  await client.getGeolocation({ address: 'Providencia', regionCode: '13', isPudo: true });

  assert.equal(calledUrl, 'https://eplin.api.blue.cl/api/ecommerce/comunas/v1/bxgeo/v2');
});
