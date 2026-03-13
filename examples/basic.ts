import { BluexpressClient } from "../src/index.js";

const client = new BluexpressClient({
  environment: (process.env.BLUEXPRESS_ENV as "production" | "qa" | "dev") ?? "qa",
  apiKey: process.env.BLUEXPRESS_API_KEY ?? "",
  accountName: process.env.BLUEXPRESS_ACCOUNT_NAME
});

async function main(): Promise<void> {
  const geo = await client.getGeolocation({
    address: "Providencia",
    regionCode: "13",
    isPudo: false
  });

  console.log("Geolocation:", geo);

  const pricing = await client.getPricing({
    from: { country: "CL", district: "SCL" },
    to: {
      country: "CL",
      state: geo.regionCode ?? "13",
      district: geo.districtCode ?? "PRO"
    },
    serviceType: "EX",
    bultos: [
      {
        largo: 10,
        ancho: 10,
        alto: 10,
        sku: "SKU-TEST-1",
        pesoFisico: 1,
        cantidad: 1
      }
    ],
    declaredValue: 10000,
    familiaProducto: "PAQU"
  });

  console.log("Pricing:", pricing);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
