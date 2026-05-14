"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  FileText,
  Globe,
  Home,
  Info,
  MapPin,
  Ruler,
  Save,
  Sparkles,
} from "lucide-react";
import { updateDraftListing } from "../../lib/actions/listings";
import PaymentModal from "../payments/PaymentModal";

type Props = {
  listing: any;
  publishAction: () => Promise<{ error?: string } | void>;
  children: React.ReactNode;
};

type ListingFeatures = {
  general: {
    condition: string;
    availability: string;
    constructionType: string;
    maintenanceInside: string;
    maintenanceOutside: string;
  };
  layout: {
    rooms: string;
    bedrooms: string;
    bathrooms: string;
    toilets: string;
    floors: string;
    hasAttic: boolean;
    hasBasement: boolean;
    hasStorage: boolean;
    storageType: string;
  };
  areas: {
    livingArea: string;
    plotSize: string;
    volume: string;
  };
  outdoor: {
    garden: {
      hasGarden: boolean;
      type: string;
      orientation: string;
      size: string;
      hasBackEntrance: boolean;
      hasGardenHouse: boolean;
      hasVeranda: boolean;
    };
    balcony: {
      hasBalcony: boolean;
      count: string;
      orientation: string;
      size: string;
    };
    roofTerrace: {
      hasRoofTerrace: boolean;
      orientation: string;
      size: string;
    };
  };
  parking: {
    type: string[];
    spaces: string;
    hasPrivateParking: boolean;
    hasDriveway: boolean;
    hasCarport: boolean;
    parkingPermitNeeded: boolean;
  };
  garage: {
    hasGarage: boolean;
    type: string;
    capacity: string;
    area: string;
    hasElectricDoor: boolean;
  };
  energy: {
    label: string;
    insulation: string[];
    heating: string[];
    hotWater: string[];
    solarPanels: boolean;
    solarPanelCount: string;
    solarPanelOwnership: string;
    heatPump: boolean;
    hybridHeatPump: boolean;
    floorHeating: boolean;
    airco: boolean;
    gasFree: boolean;
    boilerYear: string;
  };
  vve: {
    hasVve: boolean;
    monthlyCosts: string;
    active: boolean;
    reserveFund: string;
    hasMjop: boolean;
    chamberOfCommerce: boolean;
    hasLift: boolean;
    locatedOnFloor: string;
    totalBuildingFloors: string;
    hasSharedBicycleStorage: boolean;
    hasSharedGarden: boolean;
  };
  kitchen: {
    type: string;
    condition: string;
    induction: boolean;
    gasCooking: boolean;
    dishwasher: boolean;
    oven: boolean;
    fridge: boolean;
    freezer: boolean;
    quooker: boolean;
    kitchenIsland: boolean;
  };
  bathroom: {
    hasBath: boolean;
    walkInShower: boolean;
    doubleSink: boolean;
    secondBathroom: boolean;
    bathroomRenovationYear: string;
  };
  comfort: {
    fireplace: boolean;
    woodStove: boolean;
    swimmingPool: boolean;
    sauna: boolean;
    jacuzzi: boolean;
    homeOffice: boolean;
    walkInCloset: boolean;
    laundryRoom: boolean;
    fiberInternet: boolean;
    alarm: boolean;
    cameraSecurity: boolean;
    smartHome: boolean;
  };
  accessibility: {
    singleFloorLiving: boolean;
    wheelchairAccessible: boolean;
    wideDoors: boolean;
    noThresholds: boolean;
    bedroomOnGroundFloor: boolean;
    bathroomOnGroundFloor: boolean;
  };
  location: {
    type: string;
    nearby: string[];
    waterfront: boolean;
    freeView: boolean;
    quietLocation: boolean;
    childFriendly: boolean;
    nearPublicTransport: boolean;
    nearShops: boolean;
    nearSchools: boolean;
    nearHighway: boolean;
    nearForest: boolean;
  };
  legal: {
    hasErfpacht: boolean;
    erfpachtBoughtOff: boolean;
    erfpachtEndDate: string;
    erfpachtYearlyCosts: string;
    isMonument: boolean;
    monumentType: string;
    asbestosKnown: boolean;
    foundationReportAvailable: boolean;
    soilReportAvailable: boolean;
  };
  marketing: {
    favoritePlace: string;
    idealFor: string;
    sellingPoints: string;
    attentionPoints: string;
  };
};

const defaultFeatures: ListingFeatures = {
  general: {
    condition: "",
    availability: "",
    constructionType: "",
    maintenanceInside: "",
    maintenanceOutside: "",
  },
  layout: {
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    floors: "",
    hasAttic: false,
    hasBasement: false,
    hasStorage: false,
    storageType: "",
  },
  areas: {
    livingArea: "",
    plotSize: "",
    volume: "",
  },
  outdoor: {
    garden: {
      hasGarden: false,
      type: "",
      orientation: "",
      size: "",
      hasBackEntrance: false,
      hasGardenHouse: false,
      hasVeranda: false,
    },
    balcony: {
      hasBalcony: false,
      count: "",
      orientation: "",
      size: "",
    },
    roofTerrace: {
      hasRoofTerrace: false,
      orientation: "",
      size: "",
    },
  },
  parking: {
    type: [],
    spaces: "",
    hasPrivateParking: false,
    hasDriveway: false,
    hasCarport: false,
    parkingPermitNeeded: false,
  },
  garage: {
    hasGarage: false,
    type: "",
    capacity: "",
    area: "",
    hasElectricDoor: false,
  },
  energy: {
    label: "",
    insulation: [],
    heating: [],
    hotWater: [],
    solarPanels: false,
    solarPanelCount: "",
    solarPanelOwnership: "",
    heatPump: false,
    hybridHeatPump: false,
    floorHeating: false,
    airco: false,
    gasFree: false,
    boilerYear: "",
  },
  vve: {
    hasVve: false,
    monthlyCosts: "",
    active: false,
    reserveFund: "",
    hasMjop: false,
    chamberOfCommerce: false,
    hasLift: false,
    locatedOnFloor: "",
    totalBuildingFloors: "",
    hasSharedBicycleStorage: false,
    hasSharedGarden: false,
  },
  kitchen: {
    type: "",
    condition: "",
    induction: false,
    gasCooking: false,
    dishwasher: false,
    oven: false,
    fridge: false,
    freezer: false,
    quooker: false,
    kitchenIsland: false,
  },
  bathroom: {
    hasBath: false,
    walkInShower: false,
    doubleSink: false,
    secondBathroom: false,
    bathroomRenovationYear: "",
  },
  comfort: {
    fireplace: false,
    woodStove: false,
    swimmingPool: false,
    sauna: false,
    jacuzzi: false,
    homeOffice: false,
    walkInCloset: false,
    laundryRoom: false,
    fiberInternet: false,
    alarm: false,
    cameraSecurity: false,
    smartHome: false,
  },
  accessibility: {
    singleFloorLiving: false,
    wheelchairAccessible: false,
    wideDoors: false,
    noThresholds: false,
    bedroomOnGroundFloor: false,
    bathroomOnGroundFloor: false,
  },
  location: {
    type: "",
    nearby: [],
    waterfront: false,
    freeView: false,
    quietLocation: false,
    childFriendly: false,
    nearPublicTransport: false,
    nearShops: false,
    nearSchools: false,
    nearHighway: false,
    nearForest: false,
  },
  legal: {
    hasErfpacht: false,
    erfpachtBoughtOff: false,
    erfpachtEndDate: "",
    erfpachtYearlyCosts: "",
    isMonument: false,
    monumentType: "",
    asbestosKnown: false,
    foundationReportAvailable: false,
    soilReportAvailable: false,
  },
  marketing: {
    favoritePlace: "",
    idealFor: "",
    sellingPoints: "",
    attentionPoints: "",
  },
};

function asString(value: any) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function asBoolean(value: any) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function normalizeFeatures(input: any): ListingFeatures {
  const base = defaultFeatures;

  return {
    general: {
      condition: input?.general?.condition || "",
      availability: input?.general?.availability || "",
      constructionType: input?.general?.constructionType || "",
      maintenanceInside: input?.general?.maintenanceInside || "",
      maintenanceOutside: input?.general?.maintenanceOutside || "",
    },
    layout: {
      rooms: asString(input?.layout?.rooms),
      bedrooms: asString(input?.layout?.bedrooms),
      bathrooms: asString(input?.layout?.bathrooms),
      toilets: asString(input?.layout?.toilets),
      floors: asString(input?.layout?.floors),
      hasAttic: asBoolean(input?.layout?.hasAttic),
      hasBasement: asBoolean(input?.layout?.hasBasement),
      hasStorage:
        asBoolean(input?.layout?.hasStorage) ||
        asBoolean(input?.storage?.hasStorage),
      storageType: input?.layout?.storageType || input?.storage?.type || "",
    },
    areas: {
      livingArea: asString(input?.areas?.livingArea),
      plotSize: asString(input?.areas?.plotSize),
      volume: asString(input?.areas?.volume),
    },
    outdoor: {
      garden: {
        hasGarden: asBoolean(input?.outdoor?.garden?.hasGarden),
        type: input?.outdoor?.garden?.type || "",
        orientation: input?.outdoor?.garden?.orientation || "",
        size: asString(input?.outdoor?.garden?.size),
        hasBackEntrance: asBoolean(input?.outdoor?.garden?.hasBackEntrance),
        hasGardenHouse: asBoolean(input?.outdoor?.garden?.hasGardenHouse),
        hasVeranda: asBoolean(input?.outdoor?.garden?.hasVeranda),
      },
      balcony: {
        hasBalcony: asBoolean(input?.outdoor?.balcony?.hasBalcony),
        count: asString(input?.outdoor?.balcony?.count),
        orientation: input?.outdoor?.balcony?.orientation || "",
        size: asString(input?.outdoor?.balcony?.size),
      },
      roofTerrace: {
        hasRoofTerrace: asBoolean(input?.outdoor?.roofTerrace?.hasRoofTerrace),
        orientation: input?.outdoor?.roofTerrace?.orientation || "",
        size: asString(input?.outdoor?.roofTerrace?.size),
      },
    },
    parking: {
      type: asArray(input?.parking?.type),
      spaces: asString(input?.parking?.spaces),
      hasPrivateParking: asBoolean(input?.parking?.hasPrivateParking),
      hasDriveway: asBoolean(input?.parking?.hasDriveway),
      hasCarport: asBoolean(input?.parking?.hasCarport),
      parkingPermitNeeded: asBoolean(input?.parking?.parkingPermitNeeded),
    },
    garage: {
      hasGarage: asBoolean(input?.garage?.hasGarage),
      type: input?.garage?.type || "",
      capacity: asString(input?.garage?.capacity),
      area: asString(input?.garage?.area),
      hasElectricDoor: asBoolean(input?.garage?.hasElectricDoor),
    },
    energy: {
      label: input?.energy?.label || "",
      insulation: asArray(input?.energy?.insulation),
      heating: asArray(input?.energy?.heating),
      hotWater: asArray(input?.energy?.hotWater),
      solarPanels:
        asBoolean(input?.energy?.solarPanels) ||
        asBoolean(input?.extras?.solarPanels),
      solarPanelCount: asString(input?.energy?.solarPanelCount),
      solarPanelOwnership: input?.energy?.solarPanelOwnership || "",
      heatPump: asBoolean(input?.energy?.heatPump),
      hybridHeatPump: asBoolean(input?.energy?.hybridHeatPump),
      floorHeating: asBoolean(input?.energy?.floorHeating),
      airco: asBoolean(input?.energy?.airco) || asBoolean(input?.extras?.airco),
      gasFree: asBoolean(input?.energy?.gasFree),
      boilerYear: asString(input?.energy?.boilerYear),
    },
    vve: {
      hasVve: asBoolean(input?.vve?.hasVve),
      monthlyCosts: asString(input?.vve?.monthlyCosts),
      active: asBoolean(input?.vve?.active),
      reserveFund: input?.vve?.reserveFund || "",
      hasMjop: asBoolean(input?.vve?.hasMjop),
      chamberOfCommerce: asBoolean(input?.vve?.chamberOfCommerce),
      hasLift:
        asBoolean(input?.vve?.hasLift) || asBoolean(input?.extras?.elevator),
      locatedOnFloor: asString(input?.vve?.locatedOnFloor),
      totalBuildingFloors: asString(input?.vve?.totalBuildingFloors),
      hasSharedBicycleStorage: asBoolean(input?.vve?.hasSharedBicycleStorage),
      hasSharedGarden: asBoolean(input?.vve?.hasSharedGarden),
    },
    kitchen: {
      type: input?.kitchen?.type || "",
      condition: input?.kitchen?.condition || "",
      induction: asBoolean(input?.kitchen?.induction),
      gasCooking: asBoolean(input?.kitchen?.gasCooking),
      dishwasher: asBoolean(input?.kitchen?.dishwasher),
      oven: asBoolean(input?.kitchen?.oven),
      fridge: asBoolean(input?.kitchen?.fridge),
      freezer: asBoolean(input?.kitchen?.freezer),
      quooker: asBoolean(input?.kitchen?.quooker),
      kitchenIsland: asBoolean(input?.kitchen?.kitchenIsland),
    },
    bathroom: {
      hasBath: asBoolean(input?.bathroom?.hasBath),
      walkInShower: asBoolean(input?.bathroom?.walkInShower),
      doubleSink: asBoolean(input?.bathroom?.doubleSink),
      secondBathroom: asBoolean(input?.bathroom?.secondBathroom),
      bathroomRenovationYear: asString(input?.bathroom?.bathroomRenovationYear),
    },
    comfort: {
      fireplace:
        asBoolean(input?.comfort?.fireplace) ||
        asBoolean(input?.extras?.fireplace),
      woodStove: asBoolean(input?.comfort?.woodStove),
      swimmingPool:
        asBoolean(input?.comfort?.swimmingPool) ||
        asBoolean(input?.extras?.swimmingPool),
      sauna: asBoolean(input?.comfort?.sauna),
      jacuzzi: asBoolean(input?.comfort?.jacuzzi),
      homeOffice: asBoolean(input?.comfort?.homeOffice),
      walkInCloset: asBoolean(input?.comfort?.walkInCloset),
      laundryRoom: asBoolean(input?.comfort?.laundryRoom),
      fiberInternet: asBoolean(input?.comfort?.fiberInternet),
      alarm: asBoolean(input?.comfort?.alarm),
      cameraSecurity: asBoolean(input?.comfort?.cameraSecurity),
      smartHome: asBoolean(input?.comfort?.smartHome),
    },
    accessibility: {
      singleFloorLiving: asBoolean(input?.accessibility?.singleFloorLiving),
      wheelchairAccessible: asBoolean(
        input?.accessibility?.wheelchairAccessible,
      ),
      wideDoors: asBoolean(input?.accessibility?.wideDoors),
      noThresholds: asBoolean(input?.accessibility?.noThresholds),
      bedroomOnGroundFloor: asBoolean(
        input?.accessibility?.bedroomOnGroundFloor,
      ),
      bathroomOnGroundFloor: asBoolean(
        input?.accessibility?.bathroomOnGroundFloor,
      ),
    },
    location: {
      type: input?.location?.type || "",
      nearby: asArray(input?.location?.nearby),
      waterfront: asBoolean(input?.location?.waterfront),
      freeView: asBoolean(input?.location?.freeView),
      quietLocation: asBoolean(input?.location?.quietLocation),
      childFriendly: asBoolean(input?.location?.childFriendly),
      nearPublicTransport: asBoolean(input?.location?.nearPublicTransport),
      nearShops: asBoolean(input?.location?.nearShops),
      nearSchools: asBoolean(input?.location?.nearSchools),
      nearHighway: asBoolean(input?.location?.nearHighway),
      nearForest: asBoolean(input?.location?.nearForest),
    },
    legal: {
      hasErfpacht: asBoolean(input?.legal?.hasErfpacht),
      erfpachtBoughtOff: asBoolean(input?.legal?.erfpachtBoughtOff),
      erfpachtEndDate: input?.legal?.erfpachtEndDate || "",
      erfpachtYearlyCosts: asString(input?.legal?.erfpachtYearlyCosts),
      isMonument: asBoolean(input?.legal?.isMonument),
      monumentType: input?.legal?.monumentType || "",
      asbestosKnown: asBoolean(input?.legal?.asbestosKnown),
      foundationReportAvailable: asBoolean(
        input?.legal?.foundationReportAvailable,
      ),
      soilReportAvailable: asBoolean(input?.legal?.soilReportAvailable),
    },
    marketing: {
      favoritePlace: input?.marketing?.favoritePlace || "",
      idealFor: input?.marketing?.idealFor || "",
      sellingPoints: input?.marketing?.sellingPoints || "",
      attentionPoints: input?.marketing?.attentionPoints || "",
    },
  };
}

function formatPropertyTypeLabel(value: string) {
  switch (value) {
    case "eengezinswoning":
      return "Eengezinswoning";
    case "appartement":
      return "Appartement";
    case "vrijstaande_woning":
      return "Vrijstaande woning";
    case "twee_onder_een_kap":
      return "Twee-onder-een-kap";
    case "hoekwoning":
      return "Hoekwoning";
    case "tussenwoning":
      return "Tussenwoning";
    case "bungalow":
      return "Bungalow";
    default:
      return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function generateListingDescription({
  propertyType,
  city,
  livingArea,
  bedrooms,
  energyLabel,
  yearBuilt,
  plotSize,
  features,
}: {
  propertyType: string;
  city: string;
  livingArea: string;
  bedrooms: string;
  energyLabel: string;
  yearBuilt: string;
  plotSize: string;
  features: ListingFeatures;
}) {
  const typeLabel = propertyType?.trim()
    ? formatPropertyTypeLabel(propertyType)
    : "Woning";
  const cityLabel = city?.trim() || "de omgeving";
  const extras: string[] = [];

  if (features.general.condition) {
    extras.push(
      `De woning is in ${features.general.condition.replaceAll("_", " ")} staat.`,
    );
  }

  if (features.layout.rooms) {
    extras.push(`De woning beschikt over ${features.layout.rooms} kamers.`);
  }

  if (features.layout.bathrooms) {
    extras.push(`${features.layout.bathrooms} badkamer(s) aanwezig.`);
  }

  if (features.outdoor.garden.hasGarden) {
    let gardenText = "Er is een tuin aanwezig";

    if (features.outdoor.garden.orientation) {
      gardenText += ` op het ${features.outdoor.garden.orientation}`;
    }

    if (features.outdoor.garden.size) {
      gardenText += ` van circa ${features.outdoor.garden.size} m²`;
    }

    extras.push(`${gardenText}.`);
  }

  if (features.outdoor.balcony.hasBalcony) {
    extras.push("Er is een balkon aanwezig.");
  }

  if (features.energy.solarPanels) {
    extras.push(
      features.energy.solarPanelCount
        ? `Voorzien van ${features.energy.solarPanelCount} zonnepanelen.`
        : "Voorzien van zonnepanelen.",
    );
  }

  if (features.energy.airco) {
    extras.push("Uitgerust met airconditioning.");
  }

  if (features.comfort.fireplace) {
    extras.push("Sfeervolle open haard aanwezig.");
  }

  if (features.marketing.favoritePlace) {
    extras.push(
      `Een fijne plek in huis is ${features.marketing.favoritePlace}.`,
    );
  }

  const extrasText = extras.length ? `\n\n${extras.join(" ")}` : "";

  return (
    `Deze ${typeLabel.toLowerCase()} in ${cityLabel} biedt een fijne combinatie van ruimte, comfort en praktisch wonen. Met een woonoppervlakte van ${livingArea || "—"} m² en ${bedrooms || "—"} slaapkamers is dit een woning met volop mogelijkheden.

De indeling is logisch en prettig, met voldoende leefruimte en lichtinval om een aangename woonomgeving te creëren.

Ook buiten is het goed toeven. ${plotSize ? `Met een perceel van ${plotSize} m² is er voldoende ruimte voor ontspanning.` : ""}

De woning is gebouwd in ${yearBuilt || "—"} en beschikt over energielabel ${energyLabel || "—"}, wat bijdraagt aan een comfortabel en energiezuinig geheel.

Gelegen in ${cityLabel}, met voorzieningen en bereikbaarheid binnen handbereik.

Kortom: een woning met comfort, ruimte en potentie.` + extrasText
  );
}

export default function ListingFormC({
  listing,
  publishAction,
  children,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const isSavingRef = useRef(false);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstAutosaveRef = useRef(true);

  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [publishError, setPublishError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [titleManuallyEdited, setTitleManuallyEdited] = useState(
    Boolean(listing.title?.trim()),
  );

  const [title, setTitle] = useState(listing.title || "");
  const [propertyType, setPropertyType] = useState(listing.property_type || "");
  const [askingPrice, setAskingPrice] = useState(
    listing.asking_price !== null && listing.asking_price !== undefined
      ? String(listing.asking_price)
      : "",
  );
  const [street, setStreet] = useState(listing.street || "");
  const [city, setCity] = useState(listing.city || "");
  const [livingArea, setLivingArea] = useState(
    listing.living_area !== null && listing.living_area !== undefined
      ? String(listing.living_area)
      : "",
  );
  const [plotSize, setPlotSize] = useState(
    listing.plot_size !== null && listing.plot_size !== undefined
      ? String(listing.plot_size)
      : "",
  );
  const [bedrooms, setBedrooms] = useState(
    listing.bedrooms !== null && listing.bedrooms !== undefined
      ? String(listing.bedrooms)
      : "",
  );
  const [energyLabel, setEnergyLabel] = useState(listing.energy_label || "");
  const [yearBuilt, setYearBuilt] = useState(
    listing.year_built !== null && listing.year_built !== undefined
      ? String(listing.year_built)
      : "",
  );
  const [description, setDescription] = useState(listing.description || "");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [features, setFeatures] = useState<ListingFeatures>(
    normalizeFeatures(listing.features || defaultFeatures),
  );

  useEffect(() => {
    if (titleManuallyEdited) return;
    if (!propertyType.trim() || !city.trim()) return;

    const suggestedTitle = `${formatPropertyTypeLabel(propertyType)} in ${city.trim()}`;
    setTitle(suggestedTitle);
  }, [propertyType, city, titleManuallyEdited]);

  useEffect(() => {
    if (skipFirstAutosaveRef.current) {
      skipFirstAutosaveRef.current = false;
      return;
    }

    if (!formRef.current) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      const formData = new FormData(formRef.current!);
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      startTransition(async () => {
        setSaveStatus("saving");
        setPublishError(null);

        try {
          const res = await updateDraftListing(listing.id, null, formData);

          if (res && res.error) {
            setSaveStatus("error");
            setPublishError(res.error);
          } else {
            setSaveStatus("saved");
            setTimeout(() => {
              setSaveStatus((current) =>
                current === "saved" ? "idle" : current,
              );
            }, 2000);
          }
        } finally {
          isSavingRef.current = false;
        }
      });
    }, 900);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [
    listing.id,
    title,
    propertyType,
    askingPrice,
    street,
    city,
    livingArea,
    plotSize,
    bedrooms,
    energyLabel,
    yearBuilt,
    description,
    features,
  ]);

  const hasTitle = Boolean(title.trim());
  const hasType = Boolean(propertyType.trim());
  const hasPrice = Boolean(askingPrice.trim());
  const hasStreet = Boolean(street.trim());
  const hasCity = Boolean(city.trim());
  const hasDescription = Boolean(description.trim().length > 20);
  const hasImages = Boolean(listing.images?.length > 0);
  const hasLivingArea = Boolean(livingArea.trim());
  const hasBedrooms = Boolean(bedrooms.trim());
  const hasEnergyLabel = Boolean(energyLabel.trim());
  const hasYearBuilt = Boolean(yearBuilt.trim());

  const requiredItems = [
    {
      label: "Basisgegevens",
      helper: "Titel, woningtype en vraagprijs ontbreken nog.",
      done: hasTitle && hasType && hasPrice,
      icon: Home,
    },
    {
      label: "Locatie",
      helper: "Straat en woonplaats ontbreken nog.",
      done: hasStreet && hasCity,
      icon: MapPin,
    },
    {
      label: "Kenmerken",
      helper:
        "Woonoppervlak, slaapkamers, energielabel of bouwjaar ontbreken nog.",
      done: hasLivingArea && hasBedrooms && hasEnergyLabel && hasYearBuilt,
      icon: Ruler,
    },
    {
      label: "Beschrijving",
      helper: "Voeg een korte woningomschrijving toe.",
      done: hasDescription,
      icon: FileText,
    },
    {
      label: "Foto’s",
      helper: "Voeg minimaal één woningfoto toe.",
      done: hasImages,
      icon: Camera,
    },
  ];

  const doneCount = requiredItems.filter((item) => item.done).length;
  const progress = Math.round((doneCount / requiredItems.length) * 100);

  const updateFeature = (
    category: keyof ListingFeatures,
    key: string,
    value: any,
  ) => {
    setFeatures((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const updateNestedFeature = (
    category: keyof ListingFeatures,
    section: string,
    key: string,
    value: any,
  ) => {
    setFeatures((prev) => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [section]: {
          ...(prev as any)[category][section],
          [key]: value,
        },
      },
    }));
  };

  const toggleArrayFeature = (
    category: "energy" | "parking" | "location",
    key: string,
    value: string,
  ) => {
    setFeatures((prev) => {
      const currentValues = ((prev as any)[category][key] || []) as string[];
      const exists = currentValues.includes(value);

      return {
        ...prev,
        [category]: {
          ...(prev as any)[category],
          [key]: exists
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value],
        },
      };
    });
  };

  const handleGenerateDescription = async () => {
    setIsGeneratingDescription(true);

    try {
      const res = await fetch("/api/generate-listing-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyType,
          city,
          livingArea,
          bedrooms,
          energyLabel,
          yearBuilt,
          plotSize,
          features,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "AI generatie mislukt.");
      }

      if (data.text) {
        setDescription(data.text);
      } else {
        setDescription(
          generateListingDescription({
            propertyType,
            city,
            livingArea,
            bedrooms,
            energyLabel,
            yearBuilt,
            plotSize,
            features,
          }),
        );
      }
    } catch (error) {
      console.error("AI fout:", error);
      setDescription(
        generateListingDescription({
          propertyType,
          city,
          livingArea,
          bedrooms,
          energyLabel,
          yearBuilt,
          plotSize,
          features,
        }),
      );
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const isPublish = submitter?.value === "publish";
    const formData = new FormData(formElement);

    if (isPublish) {
      if (!listing.has_paid) {
        setShowPaymentModal(true);
        return;
      }

      if (isSavingRef.current) return;
      isSavingRef.current = true;

      startTransition(async () => {
        setPublishError(null);
        setSaveStatus("saving");

        try {
          const res = await updateDraftListing(listing.id, null, formData);
          if (res && res.error) {
            setSaveStatus("error");
            setPublishError(`Opslaan vóór publicatie mislukt: ${res.error}`);
            return;
          }
          setSaveStatus("saved");
          try {
            await publishAction();
          } catch (err: any) {
            setPublishError(err.message);
          }
        } finally {
          isSavingRef.current = false;
        }
      });
    } else {
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      startTransition(async () => {
        setSaveStatus("saving");
        setPublishError(null);
        try {
          const res = await updateDraftListing(listing.id, null, formData);
          if (res && res.error) {
            setSaveStatus("error");
            setPublishError(res.error);
          } else {
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 3000);
          }
        } finally {
          isSavingRef.current = false;
        }
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  const sectionClass =
    "rounded-3xl border border-stone-200 bg-white p-6 shadow-sm";

  const checkboxClass =
    "flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800";

  const checkInputClass =
    "h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500";

  return (
    <div className="space-y-6">
      {publishError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">
                Indienen lukt nog niet
              </h3>
              <p className="mt-1">{publishError}</p>
            </div>
          </div>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        id="draft-form"
        className="space-y-6"
      >
        {children}
        <input type="hidden" name="features" value={JSON.stringify(features)} />

        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Basisgegevens & locatie
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                De kern van je advertentie. Hoe completer dit is, hoe beter je
                woning gevonden en begrepen wordt.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasTitle && hasType && hasPrice && hasStreet && hasCity
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {hasTitle && hasType && hasPrice && hasStreet && hasCity
                ? "Compleet"
                : "Nog nodig"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-3">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Titel
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleManuallyEdited(true);
                }}
                placeholder="Bijv. Moderne gezinswoning met ruime tuin"
                className={inputClass}
              />
              {!titleManuallyEdited && propertyType.trim() && city.trim() ? (
                <p className="mt-2 text-xs text-emerald-700">
                  Titel wordt automatisch voorgesteld op basis van woningtype en
                  woonplaats.
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="property_type"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Woningtype
              </label>
              <select
                id="property_type"
                name="property_type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={inputClass}
              >
                <option value="">Nog niet gekozen</option>
                <option value="eengezinswoning">Eengezinswoning</option>
                <option value="appartement">Appartement</option>
                <option value="vrijstaande_woning">Vrijstaande woning</option>
                <option value="twee_onder_een_kap">Twee-onder-een-kap</option>
                <option value="hoekwoning">Hoekwoning</option>
                <option value="tussenwoning">Tussenwoning</option>
                <option value="bungalow">Bungalow</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="asking_price"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Vraagprijs (€)
              </label>
              <input
                id="asking_price"
                name="asking_price"
                type="number"
                min="0"
                step="1000"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="Bijv. 450000"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="street"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Straat + huisnummer
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Bijv. De Hoven 12"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Woonplaats / stad
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bijv. Utrecht"
                className={inputClass}
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 md:col-span-2 xl:col-span-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Auto invullen komt hier later op
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    Zodra BAG / Kadaster goed gekoppeld is, kunnen straat,
                    plaats en zoveel mogelijk basisdata automatisch worden
                    voorgesteld of ingevuld.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Kenmerken
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Dit zijn de belangrijkste woningkenmerken die kopers
                vergelijken. Houd dit zo compleet mogelijk.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasLivingArea && hasBedrooms && hasEnergyLabel && hasYearBuilt
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {hasLivingArea && hasBedrooms && hasEnergyLabel && hasYearBuilt
                ? "Sterke basis"
                : "Aanvullen"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="living_area"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Woonoppervlak (m²)
              </label>
              <input
                id="living_area"
                name="living_area"
                type="number"
                value={livingArea}
                onChange={(e) => setLivingArea(e.target.value)}
                placeholder="Bijv. 128"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="plot_size"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Perceel (m²)
              </label>
              <input
                id="plot_size"
                name="plot_size"
                type="number"
                value={plotSize}
                onChange={(e) => setPlotSize(e.target.value)}
                placeholder="Bijv. 265"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="bedrooms"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Slaapkamers
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="Bijv. 4"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="energy_label"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Energielabel
              </label>
              <select
                id="energy_label"
                name="energy_label"
                value={energyLabel}
                onChange={(e) => setEnergyLabel(e.target.value)}
                className={inputClass}
              >
                <option value="">Nog niet gekozen</option>
                <option value="A++++">A++++</option>
                <option value="A+++">A+++</option>
                <option value="A++">A++</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="year_built"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Bouwjaar
              </label>
              <input
                id="year_built"
                name="year_built"
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                placeholder="Bijv. 1998"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Extra kenmerken
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Hoe meer relevante kenmerken je invult, hoe sterker je woning
                overkomt en hoe beter de AI straks een verkoopgerichte
                omschrijving kan schrijven.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Belangrijk
            </span>
          </div>

          <div className="mt-6 space-y-8">
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Algemeen
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Staat van onderhoud
                  </label>
                  <select
                    value={features.general.condition}
                    onChange={(e) =>
                      updateFeature("general", "condition", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Nog niet gekozen</option>
                    <option value="uitstekend">Uitstekend</option>
                    <option value="goed">Goed</option>
                    <option value="redelijk">Redelijk</option>
                    <option value="matig">Matig</option>
                    <option value="te_renoveren">Te renoveren</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Beschikbaarheid
                  </label>
                  <select
                    value={features.general.availability}
                    onChange={(e) =>
                      updateFeature("general", "availability", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Nog niet gekozen</option>
                    <option value="direct">Direct beschikbaar</option>
                    <option value="in_overleg">In overleg</option>
                    <option value="op_termijn">Op termijn</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Soort bouw
                  </label>
                  <select
                    value={features.general.constructionType}
                    onChange={(e) =>
                      updateFeature(
                        "general",
                        "constructionType",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Nog niet gekozen</option>
                    <option value="bestaande_bouw">Bestaande bouw</option>
                    <option value="nieuwbouw">Nieuwbouw</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Indeling
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Aantal kamers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={features.layout.rooms}
                    onChange={(e) =>
                      updateFeature("layout", "rooms", e.target.value)
                    }
                    placeholder="Bijv. 5"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Badkamers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={features.layout.bathrooms}
                    onChange={(e) =>
                      updateFeature("layout", "bathrooms", e.target.value)
                    }
                    placeholder="Bijv. 1"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Toiletten
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={features.layout.toilets}
                    onChange={(e) =>
                      updateFeature("layout", "toilets", e.target.value)
                    }
                    placeholder="Bijv. 2"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Woonlagen
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={features.layout.floors}
                    onChange={(e) =>
                      updateFeature("layout", "floors", e.target.value)
                    }
                    placeholder="Bijv. 2"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Inhoud (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={features.areas.volume}
                    onChange={(e) =>
                      updateFeature("areas", "volume", e.target.value)
                    }
                    placeholder="Bijv. 450"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.layout.hasAttic}
                    onChange={(e) =>
                      updateFeature("layout", "hasAttic", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Zolder
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.layout.hasBasement}
                    onChange={(e) =>
                      updateFeature("layout", "hasBasement", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Kelder
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.layout.hasStorage}
                    onChange={(e) =>
                      updateFeature("layout", "hasStorage", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Berging
                </label>
              </div>

              {features.layout.hasStorage ? (
                <div className="mt-4 max-w-md">
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    Type berging
                  </label>
                  <select
                    value={features.layout.storageType}
                    onChange={(e) =>
                      updateFeature("layout", "storageType", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Nog niet gekozen</option>
                    <option value="inpandig">Inpandig</option>
                    <option value="vrijstaand">Vrijstaand</option>
                    <option value="schuur">Schuur</option>
                    <option value="berging_box">Berging / box</option>
                  </select>
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Buitenruimte
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.outdoor.garden.hasGarden}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "garden",
                        "hasGarden",
                        e.target.checked,
                      )
                    }
                    className={checkInputClass}
                  />
                  Tuin aanwezig
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.outdoor.balcony.hasBalcony}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "balcony",
                        "hasBalcony",
                        e.target.checked,
                      )
                    }
                    className={checkInputClass}
                  />
                  Balkon
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.outdoor.roofTerrace.hasRoofTerrace}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "roofTerrace",
                        "hasRoofTerrace",
                        e.target.checked,
                      )
                    }
                    className={checkInputClass}
                  />
                  Dakterras
                </label>
              </div>

              {features.outdoor.garden.hasGarden ? (
                <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-800">
                      Type tuin
                    </label>
                    <select
                      value={features.outdoor.garden.type}
                      onChange={(e) =>
                        updateNestedFeature(
                          "outdoor",
                          "garden",
                          "type",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">Nog niet gekozen</option>
                      <option value="achtertuin">Achtertuin</option>
                      <option value="voortuin">Voortuin</option>
                      <option value="zijtuin">Zijtuin</option>
                      <option value="tuin_rondom">Tuin rondom</option>
                      <option value="plaats">Plaats</option>
                      <option value="patio">Patio</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-800">
                      Ligging tuin
                    </label>
                    <select
                      value={features.outdoor.garden.orientation}
                      onChange={(e) =>
                        updateNestedFeature(
                          "outdoor",
                          "garden",
                          "orientation",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">Nog niet gekozen</option>
                      <option value="noord">Noord</option>
                      <option value="noordoost">Noordoost</option>
                      <option value="oost">Oost</option>
                      <option value="zuidoost">Zuidoost</option>
                      <option value="zuid">Zuid</option>
                      <option value="zuidwest">Zuidwest</option>
                      <option value="west">West</option>
                      <option value="noordwest">Noordwest</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-800">
                      Tuingrootte (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={features.outdoor.garden.size}
                      onChange={(e) =>
                        updateNestedFeature(
                          "outdoor",
                          "garden",
                          "size",
                          e.target.value,
                        )
                      }
                      placeholder="Bijv. 85"
                      className={inputClass}
                    />
                  </div>
                  <label className={checkboxClass}>
                    <input
                      type="checkbox"
                      checked={features.outdoor.garden.hasBackEntrance}
                      onChange={(e) =>
                        updateNestedFeature(
                          "outdoor",
                          "garden",
                          "hasBackEntrance",
                          e.target.checked,
                        )
                      }
                      className={checkInputClass}
                    />
                    Achterom
                  </label>
                </div>
              ) : null}

              {features.outdoor.balcony.hasBalcony ? (
                <div className="mt-4 grid gap-5 md:grid-cols-3">
                  <input
                    type="number"
                    min="0"
                    value={features.outdoor.balcony.count}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "balcony",
                        "count",
                        e.target.value,
                      )
                    }
                    placeholder="Aantal balkons"
                    className={inputClass}
                  />
                  <select
                    value={features.outdoor.balcony.orientation}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "balcony",
                        "orientation",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Ligging balkon</option>
                    <option value="noord">Noord</option>
                    <option value="oost">Oost</option>
                    <option value="zuid">Zuid</option>
                    <option value="west">West</option>
                    <option value="zuidwest">Zuidwest</option>
                    <option value="zuidoost">Zuidoost</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={features.outdoor.balcony.size}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "balcony",
                        "size",
                        e.target.value,
                      )
                    }
                    placeholder="Balkon m²"
                    className={inputClass}
                  />
                </div>
              ) : null}

              {features.outdoor.roofTerrace.hasRoofTerrace ? (
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <select
                    value={features.outdoor.roofTerrace.orientation}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "roofTerrace",
                        "orientation",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Ligging dakterras</option>
                    <option value="noord">Noord</option>
                    <option value="oost">Oost</option>
                    <option value="zuid">Zuid</option>
                    <option value="west">West</option>
                    <option value="zuidwest">Zuidwest</option>
                    <option value="zuidoost">Zuidoost</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={features.outdoor.roofTerrace.size}
                    onChange={(e) =>
                      updateNestedFeature(
                        "outdoor",
                        "roofTerrace",
                        "size",
                        e.target.value,
                      )
                    }
                    placeholder="Dakterras m²"
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Parkeren & garage
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  "openbaar",
                  "vergunning",
                  "eigen_terrein",
                  "parkeergarage",
                ].map((item) => (
                  <label key={item} className={checkboxClass}>
                    <input
                      type="checkbox"
                      checked={features.parking.type.includes(item)}
                      onChange={() =>
                        toggleArrayFeature("parking", "type", item)
                      }
                      className={checkInputClass}
                    />
                    {item.replaceAll("_", " ")}
                  </label>
                ))}
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <input
                  type="number"
                  min="0"
                  value={features.parking.spaces}
                  onChange={(e) =>
                    updateFeature("parking", "spaces", e.target.value)
                  }
                  placeholder="Aantal parkeerplaatsen"
                  className={inputClass}
                />
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.parking.hasDriveway}
                    onChange={(e) =>
                      updateFeature("parking", "hasDriveway", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Oprit
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.parking.hasCarport}
                    onChange={(e) =>
                      updateFeature("parking", "hasCarport", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Carport
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.garage.hasGarage}
                    onChange={(e) =>
                      updateFeature("garage", "hasGarage", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Garage
                </label>
              </div>

              {features.garage.hasGarage ? (
                <div className="mt-4 grid gap-5 md:grid-cols-3">
                  <select
                    value={features.garage.type}
                    onChange={(e) =>
                      updateFeature("garage", "type", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Type garage</option>
                    <option value="vrijstaand">Vrijstaand</option>
                    <option value="aangebouwd">Aangebouwd</option>
                    <option value="inpandig">Inpandig</option>
                    <option value="garagebox">Garagebox</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={features.garage.capacity}
                    onChange={(e) =>
                      updateFeature("garage", "capacity", e.target.value)
                    }
                    placeholder="Capaciteit auto’s"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="0"
                    value={features.garage.area}
                    onChange={(e) =>
                      updateFeature("garage", "area", e.target.value)
                    }
                    placeholder="Garage m²"
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Energie & duurzaamheid
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.energy.solarPanels}
                    onChange={(e) =>
                      updateFeature("energy", "solarPanels", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Zonnepanelen
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.energy.heatPump}
                    onChange={(e) =>
                      updateFeature("energy", "heatPump", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Warmtepomp
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.energy.hybridHeatPump}
                    onChange={(e) =>
                      updateFeature(
                        "energy",
                        "hybridHeatPump",
                        e.target.checked,
                      )
                    }
                    className={checkInputClass}
                  />
                  Hybride warmtepomp
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.energy.floorHeating}
                    onChange={(e) =>
                      updateFeature("energy", "floorHeating", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Vloerverwarming
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.energy.airco}
                    onChange={(e) =>
                      updateFeature("energy", "airco", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Airco
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.energy.gasFree}
                    onChange={(e) =>
                      updateFeature("energy", "gasFree", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Gasloos
                </label>
              </div>

              {features.energy.solarPanels ? (
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    value={features.energy.solarPanelCount}
                    onChange={(e) =>
                      updateFeature("energy", "solarPanelCount", e.target.value)
                    }
                    placeholder="Aantal zonnepanelen"
                    className={inputClass}
                  />
                  <select
                    value={features.energy.solarPanelOwnership}
                    onChange={(e) =>
                      updateFeature(
                        "energy",
                        "solarPanelOwnership",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Eigendom zonnepanelen</option>
                    <option value="eigendom">Eigendom</option>
                    <option value="huur">Huur</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Appartement & VvE
              </h3>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                Vooral relevant bij appartementen. Vul alleen in wat van
                toepassing is.
              </p>

              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.vve.hasVve}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateFeature("vve", "hasVve", checked);
                      updateFeature("vve", "active", checked);
                    }}
                    className={checkInputClass}
                  />
                  VvE aanwezig
                </label>

                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.vve.hasMjop}
                    onChange={(e) =>
                      updateFeature("vve", "hasMjop", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  <span className="flex items-center gap-2">
                    MJOP aanwezig
                    <span className="group relative inline-flex">
                      <Info className="h-4 w-4 text-stone-400" />
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-72 -translate-x-1/2 rounded-xl border border-stone-200 bg-white p-3 text-xs leading-5 text-stone-600 shadow-lg group-hover:block">
                        MJOP betekent Meerjarenonderhoudsplan. Hierin staat welk
                        onderhoud aan het gebouw de komende jaren wordt verwacht
                        en welke kosten daarbij horen.
                      </span>
                    </span>
                  </span>
                </label>

                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.vve.hasLift}
                    onChange={(e) =>
                      updateFeature("vve", "hasLift", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Lift
                </label>
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <input
                  type="number"
                  min="0"
                  value={features.vve.locatedOnFloor}
                  onChange={(e) =>
                    updateFeature("vve", "locatedOnFloor", e.target.value)
                  }
                  placeholder="Gelegen op verdieping"
                  className={inputClass}
                />
                <input
                  type="number"
                  min="0"
                  value={features.vve.totalBuildingFloors}
                  onChange={(e) =>
                    updateFeature("vve", "totalBuildingFloors", e.target.value)
                  }
                  placeholder="Verdiepingen gebouw"
                  className={inputClass}
                />
                {features.vve.hasVve ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      value={features.vve.monthlyCosts}
                      onChange={(e) =>
                        updateFeature("vve", "monthlyCosts", e.target.value)
                      }
                      placeholder="VvE bijdrage per maand"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={features.vve.reserveFund}
                      onChange={(e) =>
                        updateFeature("vve", "reserveFund", e.target.value)
                      }
                      placeholder="Reservefonds / opmerking"
                      className={inputClass}
                    />
                  </>
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Keuken & badkamer
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <select
                  value={features.kitchen.type}
                  onChange={(e) =>
                    updateFeature("kitchen", "type", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Type keuken</option>
                  <option value="open_keuken">Open keuken</option>
                  <option value="dichte_keuken">Dichte keuken</option>
                  <option value="woonkeuken">Woonkeuken</option>
                </select>
                <select
                  value={features.kitchen.condition}
                  onChange={(e) =>
                    updateFeature("kitchen", "condition", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Staat keuken</option>
                  <option value="nieuw">Nieuw</option>
                  <option value="goed">Goed</option>
                  <option value="gedateerd">Gedateerd</option>
                  <option value="te_vervangen">Te vervangen</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={features.bathroom.bathroomRenovationYear}
                  onChange={(e) =>
                    updateFeature(
                      "bathroom",
                      "bathroomRenovationYear",
                      e.target.value,
                    )
                  }
                  placeholder="Badkamer vernieuwd in"
                  className={inputClass}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  [
                    "Inductie",
                    "kitchen",
                    "induction",
                    features.kitchen.induction,
                  ],
                  [
                    "Vaatwasser",
                    "kitchen",
                    "dishwasher",
                    features.kitchen.dishwasher,
                  ],
                  ["Oven", "kitchen", "oven", features.kitchen.oven],
                  ["Quooker", "kitchen", "quooker", features.kitchen.quooker],
                  [
                    "Kookeiland",
                    "kitchen",
                    "kitchenIsland",
                    features.kitchen.kitchenIsland,
                  ],
                  ["Ligbad", "bathroom", "hasBath", features.bathroom.hasBath],
                  [
                    "Inloopdouche",
                    "bathroom",
                    "walkInShower",
                    features.bathroom.walkInShower,
                  ],
                  [
                    "Dubbele wastafel",
                    "bathroom",
                    "doubleSink",
                    features.bathroom.doubleSink,
                  ],
                ].map(([label, category, key, checked]) => (
                  <label key={String(key)} className={checkboxClass}>
                    <input
                      type="checkbox"
                      checked={Boolean(checked)}
                      onChange={(e) =>
                        updateFeature(
                          category as keyof ListingFeatures,
                          String(key),
                          e.target.checked,
                        )
                      }
                      className={checkInputClass}
                    />
                    {String(label)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Comfort, luxe & toegankelijkheid
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  [
                    "Open haard",
                    "comfort",
                    "fireplace",
                    features.comfort.fireplace,
                  ],
                  [
                    "Houtkachel",
                    "comfort",
                    "woodStove",
                    features.comfort.woodStove,
                  ],
                  [
                    "Zwembad",
                    "comfort",
                    "swimmingPool",
                    features.comfort.swimmingPool,
                  ],
                  ["Sauna", "comfort", "sauna", features.comfort.sauna],
                  ["Jacuzzi", "comfort", "jacuzzi", features.comfort.jacuzzi],
                  [
                    "Kantoorruimte",
                    "comfort",
                    "homeOffice",
                    features.comfort.homeOffice,
                  ],
                  [
                    "Glasvezel",
                    "comfort",
                    "fiberInternet",
                    features.comfort.fiberInternet,
                  ],
                  ["Alarmsysteem", "comfort", "alarm", features.comfort.alarm],
                  [
                    "Domotica",
                    "comfort",
                    "smartHome",
                    features.comfort.smartHome,
                  ],
                  [
                    "Gelijkvloers wonen",
                    "accessibility",
                    "singleFloorLiving",
                    features.accessibility.singleFloorLiving,
                  ],
                  [
                    "Rolstoelvriendelijk",
                    "accessibility",
                    "wheelchairAccessible",
                    features.accessibility.wheelchairAccessible,
                  ],
                  [
                    "Slaapkamer begane grond",
                    "accessibility",
                    "bedroomOnGroundFloor",
                    features.accessibility.bedroomOnGroundFloor,
                  ],
                ].map(([label, category, key, checked]) => (
                  <label key={String(key)} className={checkboxClass}>
                    <input
                      type="checkbox"
                      checked={Boolean(checked)}
                      onChange={(e) =>
                        updateFeature(
                          category as keyof ListingFeatures,
                          String(key),
                          e.target.checked,
                        )
                      }
                      className={checkInputClass}
                    />
                    {String(label)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Ligging & omgeving
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <select
                  value={features.location.type}
                  onChange={(e) =>
                    updateFeature("location", "type", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Type ligging</option>
                  <option value="centrum">Centrum</option>
                  <option value="woonwijk">Woonwijk</option>
                  <option value="landelijk">Landelijk</option>
                  <option value="aan_water">Aan water</option>
                  <option value="vrij_uitzicht">Vrij uitzicht</option>
                </select>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Aan water", "waterfront", features.location.waterfront],
                  ["Vrij uitzicht", "freeView", features.location.freeView],
                  [
                    "Rustige ligging",
                    "quietLocation",
                    features.location.quietLocation,
                  ],
                  [
                    "Kindvriendelijk",
                    "childFriendly",
                    features.location.childFriendly,
                  ],
                  [
                    "Nabij OV",
                    "nearPublicTransport",
                    features.location.nearPublicTransport,
                  ],
                  ["Nabij winkels", "nearShops", features.location.nearShops],
                  [
                    "Nabij scholen",
                    "nearSchools",
                    features.location.nearSchools,
                  ],
                  [
                    "Nabij snelweg",
                    "nearHighway",
                    features.location.nearHighway,
                  ],
                  [
                    "Nabij bos/natuur",
                    "nearForest",
                    features.location.nearForest,
                  ],
                ].map(([label, key, checked]) => (
                  <label key={String(key)} className={checkboxClass}>
                    <input
                      type="checkbox"
                      checked={Boolean(checked)}
                      onChange={(e) =>
                        updateFeature("location", String(key), e.target.checked)
                      }
                      className={checkInputClass}
                    />
                    {String(label)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Juridisch & bijzonderheden
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.legal.hasErfpacht}
                    onChange={(e) =>
                      updateFeature("legal", "hasErfpacht", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Erfpacht
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.legal.isMonument}
                    onChange={(e) =>
                      updateFeature("legal", "isMonument", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Monument
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.legal.asbestosKnown}
                    onChange={(e) =>
                      updateFeature("legal", "asbestosKnown", e.target.checked)
                    }
                    className={checkInputClass}
                  />
                  Asbest bekend
                </label>
                <label className={checkboxClass}>
                  <input
                    type="checkbox"
                    checked={features.legal.foundationReportAvailable}
                    onChange={(e) =>
                      updateFeature(
                        "legal",
                        "foundationReportAvailable",
                        e.target.checked,
                      )
                    }
                    className={checkInputClass}
                  />
                  Funderingsrapport
                </label>
              </div>

              {features.legal.hasErfpacht ? (
                <div className="mt-4 grid gap-5 md:grid-cols-3">
                  <label className={checkboxClass}>
                    <input
                      type="checkbox"
                      checked={features.legal.erfpachtBoughtOff}
                      onChange={(e) =>
                        updateFeature(
                          "legal",
                          "erfpachtBoughtOff",
                          e.target.checked,
                        )
                      }
                      className={checkInputClass}
                    />
                    Erfpacht afgekocht
                  </label>
                  <input
                    type="date"
                    value={features.legal.erfpachtEndDate}
                    onChange={(e) =>
                      updateFeature("legal", "erfpachtEndDate", e.target.value)
                    }
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="0"
                    value={features.legal.erfpachtYearlyCosts}
                    onChange={(e) =>
                      updateFeature(
                        "legal",
                        "erfpachtYearlyCosts",
                        e.target.value,
                      )
                    }
                    placeholder="Canon per jaar"
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
              <h3 className="text-base font-semibold text-stone-900">
                Persoonlijke verkoopkracht
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Dit helpt later bij AI-teksten, social posts en betere
                woningpresentatie.
              </p>
              <div className="mt-4 grid gap-5">
                <input
                  value={features.marketing.favoritePlace}
                  onChange={(e) =>
                    updateFeature("marketing", "favoritePlace", e.target.value)
                  }
                  placeholder="Favoriete plek in huis, bijv. de lichte woonkeuken"
                  className={inputClass}
                />
                <input
                  value={features.marketing.idealFor}
                  onChange={(e) =>
                    updateFeature("marketing", "idealFor", e.target.value)
                  }
                  placeholder="Ideaal voor, bijv. starters, gezin, senioren"
                  className={inputClass}
                />
                <textarea
                  value={features.marketing.sellingPoints}
                  onChange={(e) =>
                    updateFeature("marketing", "sellingPoints", e.target.value)
                  }
                  placeholder="Wat maakt deze woning bijzonder?"
                  className={`${inputClass} min-h-28 resize-y`}
                />
                <textarea
                  value={features.marketing.attentionPoints}
                  onChange={(e) =>
                    updateFeature(
                      "marketing",
                      "attentionPoints",
                      e.target.value,
                    )
                  }
                  placeholder="Zijn er aandachtspunten die je eerlijk wilt benoemen?"
                  className={`${inputClass} min-h-24 resize-y`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Omschrijving
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Laat automatisch een sterke woningomschrijving genereren op
                basis van de gegevens die je al hebt ingevuld.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGeneratingDescription}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isGeneratingDescription
                ? "Genereren..."
                : "Genereer omschrijving"}
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-sm font-medium text-stone-900">
              Slimme hulp voor sneller live zetten
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Deze knop maakt direct een nette basistekst. Daarna kun je hem
              zelf aanpassen.
            </p>
          </div>

          <div className="mt-6">
            <textarea
              id="description"
              name="description"
              rows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Klik op 'Genereer omschrijving' of schrijf hier zelf jouw woningtekst."
              className="w-full resize-y rounded-xl border border-stone-200 p-5 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </section>

        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Opslaan & indienen
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Sla je voortgang op als concept of dien je woning in voor
                controle zodra alles goed staat.
              </p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {progress}% compleet
            </span>
          </div>

          {publishError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {publishError}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="submit"
              name="action"
              value="save"
              disabled={isPending || saveStatus === "saving"}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition disabled:opacity-50 ${
                saveStatus === "saved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : saveStatus === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-stone-200 bg-white text-stone-900 hover:bg-stone-50"
              }`}
            >
              {saveStatus === "saving" ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-400 border-t-transparent" />
              ) : saveStatus === "saved" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : saveStatus === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Save className="h-5 w-5 text-stone-500" />
              )}
              {saveStatus === "saving"
                ? "Opslaan..."
                : saveStatus === "saved"
                  ? "Opgeslagen"
                  : saveStatus === "error"
                    ? "Opslaan mislukt"
                    : "Opslaan als concept"}
            </button>

            <button
              type="submit"
              name="action"
              value="publish"
              disabled={isPending || saveStatus === "saving"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Globe className="h-5 w-5" />
              )}
              {isPending ? "Bezig..." : "Dien woning in"}
            </button>
          </div>

          <p className="mt-4 text-xs text-stone-500">
            Wijzigingen worden automatisch opgeslagen. Na indienen controleren
            we je woning voordat deze live komt.
          </p>
        </section>
      </form>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onStartPayment={async () => {
          setShowPaymentModal(false);
          setPublishError(null);

          try {
            const res = await fetch("/api/stripe/create-checkout-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ listingId: listing.id }),
            });

            const data = await res.json();

            if (!res.ok || !data.url) {
              throw new Error(
                data.error || "Kon Stripe checkout niet starten.",
              );
            }

            window.location.href = data.url;
          } catch (error: any) {
            setPublishError(
              error.message || "Kon Stripe checkout niet starten.",
            );
          }
        }}
      />
    </div>
  );
}
