export type BluexEnvironment = "production" | "qa" | "dev";

export interface BluexClientConfig {
  apiKey: string;
  environment?: BluexEnvironment;
  /**
   * Si se define, tiene prioridad por sobre environment.
   * Ej: https://eplin.api.qa.blue.cl
   */
  baseUrl?: string;
  /**
   * Cuenta ecommerce, en el plugin corresponde a home_url() + '/'.
   */
  accountName?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface PricingLocation {
  country: "CL" | string;
  district: string;
  state?: string;
}

export interface PricingBulto {
  largo: number;
  ancho: number;
  alto: number;
  sku: string;
  pesoFisico: number;
  cantidad: number;
}

export interface PricingRequest {
  from: PricingLocation;
  to: PricingLocation;
  serviceType: string;
  bultos: PricingBulto[];
  declaredValue: number;
  familiaProducto: "PAQU" | "PUDO" | string;
  /**
   * En el plugin se envía como 'domain' (normalmente home_url + '/').
   */
  domain?: string;
}

export interface PricingResponseData {
  total?: number;
  promiseDay?: number | string;
  nameService?: string;
  isShipmentFree?: boolean;
  [key: string]: unknown;
}

export interface PricingResponse {
  code?: string;
  message?: string;
  data?: PricingResponseData;
  [key: string]: unknown;
}

export interface GeolocationRequest {
  address: string;
  regionCode: string;
  agencyId?: string;
  /**
   * true => endpoint /bxgeo/v2, false => /bxgeo
   */
  isPudo?: boolean;
  /**
   * En plugin: 'woocommerce'
   */
  type?: string;
  /**
   * En plugin se envía como 'shop' (normalmente home_url + '/').
   */
  shop?: string;
}

export interface GeolocationPickupInfo {
  agency_name?: string;
  [key: string]: unknown;
}

export interface GeolocationResponse {
  porcentageDeExito?: string;
  regionCode?: string;
  cidadeName?: string;
  cidadeCode?: string;
  districtCode?: string;
  pickupInfo?: GeolocationPickupInfo;
  [key: string]: unknown;
}

export interface ValidateIntegrationStatusRequest {
  ecommerce?: string;
  accountName?: string;
}

export interface ValidateIntegrationStatusResponse {
  activeIntegration?: boolean;
  storeId?: string;
  message?: string;
  [key: string]: unknown;
}

export interface UpdateIntegrationCredentialsRequest {
  storeId: string;
  ecommerce?: string;
  credentials: {
    clientKey: string;
    clientSecret: string;
  };
  accountName?: string;
}

export interface UpdateIntegrationCredentialsResponse {
  activeIntegration?: boolean;
  storeId?: string;
  message?: string;
  [key: string]: unknown;
}

export type OrderWebhookPayload = Record<string, unknown>;

export type OrderWebhookResponse = Record<string, unknown>;

export interface LogWebhookRequest {
  error: string;
  order: Record<string, unknown>;
}

export type LogWebhookResponse = Record<string, unknown>;
