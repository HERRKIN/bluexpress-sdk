import { z } from "zod";

export const pricingLocationSchema = z.object({
  country: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1).optional()
});

export const pricingBultoSchema = z.object({
  largo: z.number().positive(),
  ancho: z.number().positive(),
  alto: z.number().positive(),
  sku: z.string().min(1),
  pesoFisico: z.number().positive(),
  cantidad: z.number().int().positive()
});

export const pricingRequestSchema = z.object({
  from: pricingLocationSchema,
  to: pricingLocationSchema,
  serviceType: z.string().min(1),
  bultos: z.array(pricingBultoSchema).min(1),
  declaredValue: z.number().nonnegative(),
  familiaProducto: z.string().min(1),
  domain: z.string().url().optional()
});

export const pricingResponseDataSchema = z
  .object({
    total: z.number().optional(),
    promiseDay: z.union([z.number(), z.string()]).optional(),
    nameService: z.string().optional(),
    isShipmentFree: z.boolean().optional()
  })
  .passthrough();

export const pricingResponseSchema = z
  .object({
    code: z.string().optional(),
    message: z.string().optional(),
    data: pricingResponseDataSchema.optional()
  })
  .passthrough();

export const geolocationRequestSchema = z.object({
  address: z.string().min(1),
  regionCode: z.string().min(1),
  agencyId: z.string().optional(),
  isPudo: z.boolean().optional(),
  type: z.string().optional(),
  shop: z.string().url().optional()
});

export const geolocationResponseSchema = z
  .object({
    porcentageDeExito: z.string().optional(),
    regionCode: z.string().optional(),
    cidadeName: z.string().optional(),
    cidadeCode: z.string().optional(),
    districtCode: z.string().optional(),
    pickupInfo: z
      .object({
        agency_name: z.string().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export const validateIntegrationStatusRequestSchema = z.object({
  ecommerce: z.string().optional(),
  accountName: z.string().url().optional()
});

export const validateIntegrationStatusResponseSchema = z
  .object({
    activeIntegration: z.boolean().optional(),
    storeId: z.string().optional(),
    message: z.string().optional()
  })
  .passthrough();

export const updateIntegrationCredentialsRequestSchema = z.object({
  storeId: z.string().min(1),
  ecommerce: z.string().optional(),
  credentials: z.object({
    clientKey: z.string().min(1),
    clientSecret: z.string().min(1)
  }),
  accountName: z.string().url().optional()
});

export const updateIntegrationCredentialsResponseSchema = z
  .object({
    activeIntegration: z.boolean().optional(),
    storeId: z.string().optional(),
    message: z.string().optional()
  })
  .passthrough();

export const orderWebhookPayloadSchema = z.record(z.string(), z.unknown());

export const orderWebhookResponseSchema = z.record(z.string(), z.unknown());

export const logWebhookRequestSchema = z.object({
  error: z.string().min(1),
  order: z.record(z.string(), z.unknown())
});

export const logWebhookResponseSchema = z.record(z.string(), z.unknown());
