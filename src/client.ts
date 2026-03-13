import { BASE_URLS } from "./constants.js";
import { BluexpressApiError, BluexpressConfigError, BluexpressValidationError } from "./errors.js";
import {
  geolocationRequestSchema,
  geolocationResponseSchema,
  logWebhookRequestSchema,
  logWebhookResponseSchema,
  orderWebhookPayloadSchema,
  orderWebhookResponseSchema,
  pricingRequestSchema,
  pricingResponseSchema,
  updateIntegrationCredentialsRequestSchema,
  updateIntegrationCredentialsResponseSchema,
  validateIntegrationStatusRequestSchema,
  validateIntegrationStatusResponseSchema
} from "./schemas.js";
import type {
  BluexClientConfig,
  GeolocationRequest,
  GeolocationResponse,
  LogWebhookRequest,
  LogWebhookResponse,
  OrderWebhookPayload,
  OrderWebhookResponse,
  PricingRequest,
  PricingResponse,
  UpdateIntegrationCredentialsRequest,
  UpdateIntegrationCredentialsResponse,
  ValidateIntegrationStatusRequest,
  ValidateIntegrationStatusResponse
} from "./types.js";
import type { z } from "zod";

interface RequestOptions {
  method: "GET" | "POST" | "PUT";
  path: string;
  body?: unknown;
  timeoutMs?: number;
  extraHeaders?: Record<string, string>;
}

export class BluexpressClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly accountName: string | undefined;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(config: BluexClientConfig) {
    this.validateConfig(config);

    const environment = config.environment ?? "production";
    this.baseUrl = config.baseUrl ?? BASE_URLS[environment];
    this.apiKey = config.apiKey;
    this.accountName = config.accountName;
    this.fetchImpl = config.fetchImpl ?? globalThis.fetch;
    this.timeoutMs = config.timeoutMs ?? 30_000;

    if (!this.fetchImpl) {
      throw new BluexpressConfigError(
        "No hay fetch disponible. Usa Node 18+ o inyecta fetchImpl en la configuracion."
      );
    }
  }

  async getPricing(input: PricingRequest): Promise<PricingResponse> {
    const payload = this.validateInput(
      pricingRequestSchema,
      {
        ...input,
        domain: input.domain ?? this.accountName
      },
      "/eplin/pricing/v1"
    );

    return this.request<PricingResponse>(
      {
        method: "POST",
        path: "/eplin/pricing/v1",
        body: {
          from: payload.from,
          to: payload.to,
          serviceType: payload.serviceType,
          domain: payload.domain,
          datosProducto: {
            producto: "P",
            familiaProducto: payload.familiaProducto,
            bultos: payload.bultos
          }
        },
        extraHeaders: {
          price: String(payload.declaredValue)
        }
      },
      pricingResponseSchema
    );
  }

  async getGeolocation(input: GeolocationRequest): Promise<GeolocationResponse> {
    const payload = this.validateInput(
      geolocationRequestSchema,
      {
        ...input,
        type: input.type ?? "woocommerce",
        shop: input.shop ?? this.accountName
      },
      "/api/ecommerce/comunas/v1/bxgeo"
    );

    const path = payload.isPudo
      ? "/api/ecommerce/comunas/v1/bxgeo/v2"
      : "/api/ecommerce/comunas/v1/bxgeo";

    return this.request<GeolocationResponse>(
      {
        method: "POST",
        path,
        body: {
          address: payload.address,
          type: payload.type,
          shop: payload.shop,
          regionCode: payload.regionCode,
          agencyId: payload.agencyId ?? ""
        }
      },
      geolocationResponseSchema
    );
  }

  async validateIntegrationStatus(
    input: ValidateIntegrationStatusRequest = {}
  ): Promise<ValidateIntegrationStatusResponse> {
    const payload = this.validateInput(
      validateIntegrationStatusRequestSchema,
      {
        ecommerce: input.ecommerce ?? "Woocommerce",
        accountName: input.accountName ?? this.accountName
      },
      "/api/ecommerce/token/v1/ecommerce/integration-status"
    );

    return this.request<ValidateIntegrationStatusResponse>(
      {
        method: "POST",
        path: "/api/ecommerce/token/v1/ecommerce/integration-status",
        body: payload
      },
      validateIntegrationStatusResponseSchema
    );
  }

  async updateIntegrationCredentials(
    input: UpdateIntegrationCredentialsRequest
  ): Promise<UpdateIntegrationCredentialsResponse> {
    const payload = this.validateInput(
      updateIntegrationCredentialsRequestSchema,
      {
        ...input,
        ecommerce: input.ecommerce ?? "Woocommerce",
        accountName: input.accountName ?? this.accountName
      },
      "/api/ecommerce/token/v1/ecommerce/update-tokens"
    );

    return this.request<UpdateIntegrationCredentialsResponse>(
      {
        method: "POST",
        path: "/api/ecommerce/token/v1/ecommerce/update-tokens",
        body: {
          storeId: payload.storeId,
          ecommerce: payload.ecommerce,
          credentials: {
            accessToken: payload.credentials.clientKey,
            secretKey: payload.credentials.clientSecret,
            accountName: payload.accountName
          }
        }
      },
      updateIntegrationCredentialsResponseSchema
    );
  }

  async sendOrderWebhook(payload: OrderWebhookPayload): Promise<OrderWebhookResponse> {
    this.validateInput(orderWebhookPayloadSchema, payload, "/api/integr/woocommerce-wh/v1/order");

    return this.request<OrderWebhookResponse>(
      {
        method: "POST",
        path: "/api/integr/woocommerce-wh/v1/order",
        body: payload
      },
      orderWebhookResponseSchema
    );
  }

  async sendLogWebhook(payload: LogWebhookRequest): Promise<LogWebhookResponse> {
    const parsed = this.validateInput(
      logWebhookRequestSchema,
      payload,
      "/api/ecommerce/custom/logs/v1"
    );

    return this.request<LogWebhookResponse>(
      {
        method: "POST",
        path: "/api/ecommerce/custom/logs/v1",
        body: parsed
      },
      logWebhookResponseSchema
    );
  }

  private validateConfig(config: BluexClientConfig): void {
    if (!config.apiKey) {
      throw new BluexpressConfigError("Falta apiKey en la configuracion.");
    }

    if (config.baseUrl) {
      try {
        new URL(config.baseUrl);
      } catch {
        throw new BluexpressConfigError("baseUrl no es una URL valida.");
      }
    }
  }

  private validateInput<TSchema extends z.ZodTypeAny>(
    schema: TSchema,
    value: unknown,
    endpoint: string
  ): z.infer<TSchema> {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      throw new BluexpressValidationError("Payload no cumple contrato esperado", {
        endpoint,
        issues: parsed.error.issues
      });
    }
    return parsed.data;
  }

  private async request<T>(opts: RequestOptions, schema?: z.ZodTypeAny): Promise<T> {
    const controller = new AbortController();
    const timeoutMs = opts.timeoutMs ?? this.timeoutMs;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const endpoint = new URL(opts.path, this.baseUrl).toString();

    try {
      const init: RequestInit = {
        method: opts.method,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          ...(opts.extraHeaders ?? {})
        }
      };

      if (opts.body !== undefined) {
        init.body = JSON.stringify(opts.body);
      }

      const response = await this.fetchImpl(endpoint, init);
      const text = await response.text();
      const json = text.length ? (JSON.parse(text) as unknown) : {};

      if (!response.ok) {
        const message =
          typeof json === "object" && json !== null && "message" in json
            ? String((json as { message?: unknown }).message)
            : response.statusText;

        throw new BluexpressApiError(`BlueX API error: ${message}`, {
          httpStatus: response.status,
          endpoint,
          body: json
        });
      }

      if (schema) {
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
          throw new BluexpressValidationError("Respuesta de BlueX no cumple contrato esperado", {
            endpoint,
            issues: parsed.error.issues
          });
        }
        return parsed.data as T;
      }

      return json as T;
    } catch (error) {
      if (error instanceof BluexpressApiError || error instanceof BluexpressValidationError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new BluexpressApiError(`BlueX API timeout after ${timeoutMs}ms`, {
          httpStatus: 408,
          endpoint,
          body: null
        });
      }

      throw new BluexpressApiError("BlueX API request failed", {
        httpStatus: 500,
        endpoint,
        body: error
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}
