# @bluexpress/sdk

SDK **no oficial** de Node.js/TypeScript para integrar BlueX en cualquier sistema (no dependiente de WooCommerce), construido mediante ingeniería inversa del plugin oficial **BlueX for WooCommerce** `3.1.6`.

## Disclaimer

- Este proyecto no es un producto oficial de BlueX.
- Los contratos fueron inferidos desde el comportamiento/código del plugin oficial de WooCommerce.
- BlueX puede cambiar endpoints, payloads o reglas sin previo aviso.

## Alcance del SDK

Este SDK cubre los endpoints observados en el cliente API del plugin oficial:

- `POST /eplin/pricing/v1`
- `POST /api/ecommerce/comunas/v1/bxgeo`
- `POST /api/ecommerce/comunas/v1/bxgeo/v2`
- `POST /api/ecommerce/token/v1/ecommerce/integration-status`
- `POST /api/ecommerce/token/v1/ecommerce/update-tokens`
- `POST /api/integr/woocommerce-wh/v1/order`
- `POST /api/ecommerce/custom/logs/v1`

## Requisitos

- Node.js `>= 18`
- API Key de BlueX (`x-api-key`)

## Instalación

```bash
npm install @bluexpress/sdk
```

## Variables de entorno sugeridas

```bash
BLUEXPRESS_ENV=qa
BLUEXPRESS_API_KEY=...
BLUEXPRESS_ACCOUNT_NAME=https://tu-tienda.com/
```

## Entornos

- `production` -> `https://eplin.api.blue.cl`
- `qa` -> `https://eplin.api.qa.blue.cl`
- `dev` -> `https://eplin.api.dev.blue.cl`

También puedes forzar `baseUrl` manualmente.

## Configuración

```ts
import { BluexpressClient } from "@bluexpress/sdk";

const client = new BluexpressClient({
  environment: "qa",
  apiKey: process.env.BLUEXPRESS_API_KEY!,
  accountName: process.env.BLUEXPRESS_ACCOUNT_NAME
});
```

## Qué hace cada función

- `getPricing(...)`: cotiza envío (`pricing`) con bultos, origen/destino, servicio y valor declarado.
- `getGeolocation(...)`: resuelve códigos geográficos para comuna (`bxgeo`), con modo PUDO opcional.
- `validateIntegrationStatus(...)`: revisa estado de integración ecommerce.
- `updateIntegrationCredentials(...)`: actualiza credenciales de integración (`accessToken/secretKey`).
- `sendOrderWebhook(...)`: envía payload de orden al webhook de BlueX.
- `sendLogWebhook(...)`: reporta errores al endpoint de logs.

## Header de autenticación

Todas las llamadas usan:

- `x-api-key: <tu-api-key>`

En `getPricing`, además se envía:

- `price: <declaredValue>`

## Ejemplo de cotización

```ts
const pricing = await client.getPricing({
  from: { country: "CL", district: "SCL" },
  to: { country: "CL", state: "13", district: "PRO" },
  serviceType: "EX",
  bultos: [
    {
      largo: 10,
      ancho: 10,
      alto: 10,
      sku: "SKU-001",
      pesoFisico: 1,
      cantidad: 1
    }
  ],
  declaredValue: 10000,
  familiaProducto: "PAQU"
});

console.log(pricing);
```

## Errores

- `BluexpressConfigError`: configuración inválida del cliente.
- `BluexpressApiError`: error HTTP/red/timeout.
- `BluexpressValidationError`: request o response fuera de contrato.

## Validación de contrato

El SDK valida en runtime con `zod`:

- payload de entrada
- respuesta de salida

## Testing

El proyecto separa pruebas en 3 niveles:

- Unit tests: lógica del cliente con `fetch` mockeado.
- Contract tests: validación de schemas `zod` con fixtures.
- Integration tests: llamadas reales a BlueX (se ejecutan solo con env vars).

Comandos:

```bash
npm run test:unit
npm run test:contract
npm run test:integration
npm test
```

Para habilitar integration tests reales, define:

```bash
BLUEXPRESS_API_KEY=...
BLUEXPRESS_ENV=qa
# opcional:
# BLUEXPRESS_BASE_URL=https://eplin.api.qa.blue.cl
# BLUEXPRESS_ACCOUNT_NAME=https://tu-tienda.com/
```

Sin esas variables, la suite de integración se salta automáticamente.

## Documentación ampliada

- Contratos observados: [docs/contracts.md](/Users/joseandradez/dev/experimentos/bluexpress_sdk/docs/contracts.md)
- Entornos y autenticación: [docs/auth-and-environments.md](/Users/joseandradez/dev/experimentos/bluexpress_sdk/docs/auth-and-environments.md)
- Workflows y ejemplos: [docs/methods-and-workflows.md](/Users/joseandradez/dev/experimentos/bluexpress_sdk/docs/methods-and-workflows.md)

## Desarrollo

```bash
npm install
npm run build
npm test
```

## Licencia

MIT. Ver [LICENSE](/Users/joseandradez/dev/experimentos/bluexpress_sdk/LICENSE).
