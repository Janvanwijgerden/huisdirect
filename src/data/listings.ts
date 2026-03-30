export type Listing = {
  id: string;
  slug: string; // ✅ NIEUW
  headline: string;
  propertyType: string;
  location: string;
  address: string;
  postalCode: string;
  city: string;
  price: number;
  image: string;
  images: string[];
  yearBuilt: number;
  energyLabel: string;
  plotSize: number;
  description: string;
  rooms: number;
  size: number;
  latitude: number;
  longitude: number;
};

export const listings: Listing[] = [
  {
    id: "1",
    slug: "moderne-villa-gorinchem", // ✅ NIEUW

    headline: "Moderne villa",
    propertyType: "Villa",
    location: "Gorinchem",
    address: "Burgstraat 12",
    postalCode: "4201 AB",
    city: "Gorinchem",
    price: 675000,

    image: "/house1.jpg",
    images: ["/house1.jpg", "/house2.jpg", "/house3.jpg"],

    yearBuilt: 2015,
    energyLabel: "A",
    plotSize: 300,


description:
  "Wonen en sfeer\n\nDeze moderne villa in Gorinchem combineert ruimte, comfort en een hoogwaardige afwerking op een aantrekkelijke manier. De woning is gebouwd in 2015 en heeft een eigentijdse uitstraling met veel lichtinval, een slimme indeling en een verzorgde afwerking. Dankzij de ruime woonkamer, moderne keuken en meerdere volwaardige kamers is dit een huis dat direct een gevoel van rust en kwaliteit geeft. De grote raampartijen zorgen voor een open sfeer en een prettige verbinding met buiten.\n\nRuimte en indeling\n\nDe woning beschikt over een woonoppervlakte van circa 140 m² en staat op een perceel van 300 m². Hierdoor is er niet alleen binnen veel leefruimte, maar ook buiten volop mogelijkheid om te genieten van privacy en comfort. De tuin is ruim genoeg voor een terras, speelruimte of een stijlvolle buiteninrichting en vormt een mooie aanvulling op het moderne karakter van de woning.\n\nBinnen biedt de woning onder andere vijf kamers, waardoor er volop mogelijkheden zijn voor gezinnen, thuiswerken of het creëren van extra hobby- of logeerruimte. De afwerking voelt strak en verzorgd aan, met een moderne basis waar veel kopers direct mee uit de voeten kunnen. Ook op praktisch vlak is deze woning aantrekkelijk, mede dankzij het gunstige bouwjaar en het energielabel A.\n\nLigging\n\nDe ligging in Gorinchem maakt het geheel extra interessant. De woning bevindt zich op een prettige locatie met een goede bereikbaarheid en diverse voorzieningen op korte afstand. Denk aan winkels, scholen, uitvalswegen en recreatiemogelijkheden. Dat maakt deze villa geschikt voor mensen die comfortabel willen wonen op een fijne plek, zonder concessies te doen aan bereikbaarheid en dagelijks gemak.\n\nKortom\n\nEen moderne en instapklare villa met een sterke combinatie van ruimte, uitstraling, comfort en ligging. Een woning die direct overtuigt zodra je binnenkomt.",    rooms: 5,
    size: 140,

    latitude: 51.8294,
    longitude: 4.9741,
  },
];