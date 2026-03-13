# Entornos, autenticación y keys

## ¿Cuántas keys se necesitan?

En la integración BlueX del plugin oficial, se usa una sola key principal en header:

- `x-api-key`

Aquí no hay separación por módulo (`quote`, `coverage`, etc.); se usa una sola `x-api-key`.

## Entornos soportados en SDK

- `production` -> `https://eplin.api.blue.cl`
- `qa` -> `https://eplin.api.qa.blue.cl`
- `dev` -> `https://eplin.api.dev.blue.cl`

Opcionalmente, puedes configurar `baseUrl` manualmente.

## Variables de entorno recomendadas

```bash
BLUEXPRESS_ENV=qa
BLUEXPRESS_API_KEY=tu_key_bluex
BLUEXPRESS_ACCOUNT_NAME=https://tu-tienda.com/
```

## Qué env conviene usar

- Desarrollo local: `qa`
- QA/UAT: `qa`
- Producción: `production`

## Configuración mínima

```ts
import { BluexpressClient } from "@bluexpress/sdk";

const client = new BluexpressClient({
  environment: "qa",
  apiKey: process.env.BLUEXPRESS_API_KEY!,
  accountName: process.env.BLUEXPRESS_ACCOUNT_NAME
});
```

## Cómo se usa la key por endpoint

Todos los métodos usan la misma `apiKey`:

- `getPricing`
- `getGeolocation`
- `validateIntegrationStatus`
- `updateIntegrationCredentials`
- `sendOrderWebhook`
- `sendLogWebhook`

## Header adicional en pricing

`getPricing` incluye:

- `price: <declaredValue>`

Esto replica el comportamiento observado en el plugin.

## Troubleshooting de autenticación

### 401/403

- Revisa `BLUEXPRESS_API_KEY`.
- Verifica que estés apuntando al entorno correcto (`qa` vs `production`).

### 404

- Revisa `baseUrl` / `environment`.
- Revisa endpoint path.

### 200 pero integración inactiva

- `validateIntegrationStatus` puede devolver `activeIntegration: false`.
- No es error HTTP; es estado de negocio.
