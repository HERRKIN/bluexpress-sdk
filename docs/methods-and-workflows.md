# Funciones y workflows

## 1) Obtener pricing

Objetivo: calcular costo/plazo para checkout.

```ts
const pricing = await client.getPricing({
  from: { country: "CL", district: "SCL" },
  to: { country: "CL", state: "13", district: "PRO" },
  serviceType: "EX",
  bultos: [
    { largo: 10, ancho: 10, alto: 10, sku: "SKU1", pesoFisico: 1, cantidad: 1 }
  ],
  declaredValue: 10000,
  familiaProducto: "PAQU"
});
```

Campos clave:

- `serviceType`: tipo de servicio (ejemplo usado en plugin: `EX`)
- `familiaProducto`: `PAQU` o `PUDO`
- `bultos`: volumen/peso por paquete

## 2) Resolver geolocalización de comuna

Objetivo: obtener `districtCode` y datos geo a partir de dirección textual.

```ts
const geo = await client.getGeolocation({
  address: "Providencia",
  regionCode: "13",
  isPudo: false
});
```

Para PUDO:

```ts
const geoPudo = await client.getGeolocation({
  address: "Providencia",
  regionCode: "13",
  agencyId: "AGENCY-123",
  isPudo: true
});
```

## 3) Validar integración

Objetivo: saber si la tienda está activamente integrada en BlueX.

```ts
const status = await client.validateIntegrationStatus();
```

Campos esperados:

- `activeIntegration`
- `storeId`
- `message`

## 4) Actualizar credenciales

Objetivo: enviar `clientKey/clientSecret` para activar o refrescar integración.

```ts
const result = await client.updateIntegrationCredentials({
  storeId: "store-123",
  credentials: {
    clientKey: "...",
    clientSecret: "..."
  }
});
```

## 5) Enviar orden vía webhook

Objetivo: replicar el envío de pedidos al endpoint de integración de BlueX.

```ts
await client.sendOrderWebhook({
  id: 1001,
  shipping_lines: "bluex-express",
  line_items: []
});
```

## 6) Enviar log de error

Objetivo: reportar fallas operativas con payload asociado.

```ts
await client.sendLogWebhook({
  error: "Pricing response without data",
  order: { id: 1001, raw: {} }
});
```

## Manejo de errores recomendado

```ts
import {
  BluexpressApiError,
  BluexpressValidationError
} from "@herrkin/bluexpress-sdk";

try {
  const data = await client.getPricing(...);
  return data;
} catch (error) {
  if (error instanceof BluexpressValidationError) {
    console.error("Contract error", { endpoint: error.endpoint, issues: error.issues });
    throw error;
  }

  if (error instanceof BluexpressApiError) {
    console.error("HTTP error", {
      endpoint: error.endpoint,
      status: error.httpStatus,
      body: error.body
    });
    throw error;
  }

  throw error;
}
```
