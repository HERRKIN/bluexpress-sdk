# @herrkin/bluexpress-sdk

[![npm version](https://img.shields.io/npm/v/%40herrkin%2Fbluexpress-sdk)](https://www.npmjs.com/package/@herrkin/bluexpress-sdk)
[![license](https://img.shields.io/npm/l/%40herrkin%2Fbluexpress-sdk)](./LICENSE)
[![node >=18](https://img.shields.io/badge/node-%3E%3D18-339933)](https://nodejs.org/)
[![tests](https://img.shields.io/badge/tests-unit%20%7C%20contract%20%7C%20integration-blue)](#testing)

SDK **no oficial** de Node.js/TypeScript para integrar BlueX en cualquier sistema (no dependiente de WooCommerce), construido mediante ingeniería inversa del plugin oficial **BlueX for WooCommerce** `3.1.6`.

## Disclaimer

- Este proyecto no es un producto oficial de BlueX.
- Los contratos fueron inferidos desde el comportamiento/código del plugin oficial de WooCommerce.
- BlueX puede cambiar endpoints, payloads o reglas sin previo aviso.

## Quickstart (20 segundos)

1. Instala:

```bash
npm install @herrkin/bluexpress-sdk
```

2. Exporta variables:

```bash
export BLUEXPRESS_ENV=qa
export BLUEXPRESS_API_KEY="tu_key"
export BLUEXPRESS_ACCOUNT_NAME="https://tu-tienda.com/"
```

3. Copia/pega y ejecuta:

```ts
import { BluexpressClient } from "@herrkin/bluexpress-sdk";

const client = new BluexpressClient({
  environment: process.env.BLUEXPRESS_ENV,
  apiKey: process.env.BLUEXPRESS_API_KEY,
  accountName: process.env.BLUEXPRESS_ACCOUNT_NAME
});

const pricing = await client.getPricing({
  from: { country: "CL", district: "SCL" },
  to: { country: "CL", state: "13", district: "PRO" },
  serviceType: "EX",
  bultos: [{ largo: 10, ancho: 10, alto: 10, sku: "SKU-001", pesoFisico: 1, cantidad: 1 }],
  declaredValue: 10000,
  familiaProducto: "PAQU"
});

console.log(pricing);
```

4. Respuesta esperada (shape típico):

```json
{
  "code": "00",
  "message": "OK",
  "data": {
    "total": 1990,
    "promiseDay": 1,
    "nameService": "Express",
    "isShipmentFree": false
  }
}
```

## Cobertura actual

| Capacidad | Estado |
|---|---|
| Pricing | ✅ |
| Geolocation | ✅ |
| Integration status | ✅ |
| Update credentials | ✅ |
| Order webhook | ✅ |
| Log webhook | ✅ |
| Labels | ❌ |
| Tracking operativo completo | ❌ |

## Casos de uso típicos

- Cotizar envío en checkout (`getPricing`).
- Validar integración de tienda (`validateIntegrationStatus`).
- Enviar orden a BlueX (`sendOrderWebhook`).
- Reportar error operativo (`sendLogWebhook`).

## Runtime y compatibilidad

- Node.js `>= 18`
- ESM (`"type": "module"`)
- HTTP con `fetch` nativo
- Runtime dependency: solo `zod`

## Entornos

- `production` -> `https://eplin.api.blue.cl`
- `qa` -> `https://eplin.api.qa.blue.cl`
- `dev` -> `https://eplin.api.dev.blue.cl`

También puedes forzar `baseUrl` manualmente.

## Autenticación

Header requerido en todas las llamadas:

- `x-api-key: <tu-api-key>`

`getPricing` agrega además:

- `price: <declaredValue>`

## API (resumen)

- `getPricing(...)`: cotiza envío (`pricing`) con bultos, origen/destino, servicio y valor declarado.
- `getGeolocation(...)`: resuelve códigos geográficos para comuna (`bxgeo`), con modo PUDO opcional.
- `validateIntegrationStatus(...)`: revisa estado de integración ecommerce.
- `updateIntegrationCredentials(...)`: actualiza credenciales de integración (`accessToken/secretKey`).
- `sendOrderWebhook(...)`: envía payload de orden al webhook de BlueX.
- `sendLogWebhook(...)`: reporta errores al endpoint de logs.

## Limitaciones conocidas

- Basado en contratos inferidos del plugin WooCommerce `3.1.6`.
- Requiere `x-api-key` válida en el entorno target.
- No probado exhaustivamente en producción pública (recomendado validar primero en QA).
- No incluye adapters específicos de framework (NestJS/Express/Next wrappers).
- No implementa flujos de etiquetas ni tracking operacional completo.

## Errores

- `BluexpressConfigError`: configuración inválida del cliente.
- `BluexpressApiError`: error HTTP/red/timeout.
- `BluexpressValidationError`: request o response fuera de contrato.

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

Para habilitar integration tests reales:

```bash
BLUEXPRESS_API_KEY=...
BLUEXPRESS_ENV=qa
# opcional:
# BLUEXPRESS_BASE_URL=https://eplin.api.qa.blue.cl
# BLUEXPRESS_ACCOUNT_NAME=https://tu-tienda.com/
```

Sin esas variables, la suite de integración se salta automáticamente.

## Versionamiento

Se usa **Changesets** para controlar bump de versión/changelog.

```bash
npm run changeset
npm run version-packages
npm run release
```

Si habilitas automation en GitHub, necesitas `NPM_TOKEN` con permisos de publish para `@herrkin/bluexpress-sdk`.

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
