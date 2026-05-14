// src/lib/cadastre/test-pdok-parcel.ts

import { lookupParcelByRdCoordinates } from "./parcel-lookup";

async function main() {
  // Deze waarden vullen we straks met echte BAG RD-coördinaten.
  const rdX = Number(process.argv[2]);
  const rdY = Number(process.argv[3]);

  if (!Number.isFinite(rdX) || !Number.isFinite(rdY)) {
    console.log("Gebruik:");
    console.log("npx tsx src/lib/cadastre/test-pdok-parcel.ts <rdX> <rdY>");
    process.exit(1);
  }

  const result = await lookupParcelByRdCoordinates(rdX, rdY);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});