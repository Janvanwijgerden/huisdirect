// src/lib/valuation/test-valuation.ts

import { calculateHuisDirectValuation } from "./huisdirect-valuation-v1";

const result = calculateHuisDirectValuation({
  source_living_area: 112,
  source_plot_area: 220,
  source_build_year: 1998,
  source_property_type: "tussenwoning",
  source_energy_label: "A",
  source_woz_value: 430000,
  source_city: "Giessenburg",
  source_postal_code: "3381",
  features: {
    outdoor: {
      garden: {
        hasGarden: true,
        orientation: "zuidwest",
      },
    },
    extras: {
      solarPanels: true,
      airco: false,
    },
    garage: {
      hasGarage: true,
    },
    storage: {
      hasStorage: true,
    },
    general: {
      condition: "goed",
    },
  },
});

console.log(JSON.stringify(result, null, 2));