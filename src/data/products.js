// Data: categories and products for the store

export const categories = [
  { slug: "ardurvis-dzivoklim", name: "Ārdurvis dzīvoklim", group: "Ārdurvis", description: "Metāla ārdurvis dzīvokļiem ar labu skaņas un siltuma izolāciju.", image: "" },
  { slug: "ardurvis-privatmajai", name: "Ārdurvis privātmājai", group: "Ārdurvis", description: "Siltinātas metāla ārdurvis privātmājām un ieejām.", image: "" },
  { slug: "ieksdurvis", name: "Iekšdurvis", group: "Iekšdurvis", description: "Iekšdurvis dzīvojamām telpām dažādās krāsās un faktūrās.", image: "" },
  { slug: "bidamas-durvis", name: "Bīdāmās durvis", group: "Iekšdurvis", description: "Bīdāmās durvis un to sistēmas telpu zonēšanai.", image: "" },
  { slug: "sleptas-durvis", name: "Slēptās durvis", group: "Iekšdurvis", description: "Slēptā (hidden) tipa durvis bez redzamas kārbas.", image: "" }
];

export const products = [
  {
    id: "ard-001",
    name: "Modelis 559-191",
    collection: "ELITE",
    category: "ardurvis-dzivoklim",
    price: 349,
    oldPrice: 429,
    colors: ["Antracīts", "Tumši brūns", "Balts ozols"],
    sizes: ["860 x 2050 mm", "960 x 2050 mm"],
    security: "3. drošības klase",
    isNew: false,
    images: [],
    short: "Metāla durvis dzīvoklim ar pretzādzību furnitūru un siltuma izolāciju.",
    specs: {
      "Biezums": "85 mm",
      "Slēdzenes": "2 slēdzenes, ENO furnitūra",
      "Aizpildījums": "Minerālvate",
      "Atvēršanas virziens": "Pa labi / pa kreisi (izvēlams)"
    }
  },
  {
    id: "ard-002",
    name: "Modelis Triumph T-12",
    collection: "TRIUMPH",
    category: "ardurvis-dzivoklim",
    price: 299,
    oldPrice: null,
    colors: ["Antracīts", "Venge"],
    sizes: ["860 x 2050 mm", "960 x 2050 mm"],
    security: "2. drošības klase",
    isNew: true,
    images: [],
    short: "Praktiskas dzīvokļa durvis ar modernu MDF apdari.",
    specs: { "Biezums": "70 mm", "Slēdzenes": "2 slēdzenes", "Aizpildījums": "Minerālvate" }
  },
  {
    id: "priv-001",
    name: "Modelis Status S-200",
    collection: "STATUS",
    category: "ardurvis-privatmajai",
    price: 690,
    oldPrice: 790,
    colors: ["Tumši pelēks", "Brūns ozols"],
    sizes: ["960 x 2050 mm", "1000 x 2100 mm"],
    security: "4. drošības klase",
    isNew: false,
    images: [],
    short: "Pastiprinātas siltinātas ārdurvis privātmājai (svars līdz 120 kg).",
    specs: { "Biezums": "100 mm", "Termo pārrāvums": "Jā", "Slēdzenes": "3 slēdzenes" }
  },
  {
    id: "priv-002",
    name: "Modelis Trend TR-7",
    collection: "TREND",
    category: "ardurvis-privatmajai",
    price: 520,
    oldPrice: null,
    colors: ["Antracīts", "Zaļš"],
    sizes: ["960 x 2050 mm"],
    security: "3. drošības klase",
    isNew: true,
    images: [],
    short: "Siltinātas ārdurvis ar laikmetīgu dizainu privātmājai.",
    specs: { "Biezums": "90 mm", "Termo pārrāvums": "Jā", "Slēdzenes": "2 slēdzenes" }
  },
  {
    id: "ieks-001",
    name: "Iekšdurvis Nordic 01",
    collection: "STANDART",
    category: "ieksdurvis",
    price: 129,
    oldPrice: 159,
    colors: ["Balts", "Pelēks", "Ozols"],
    sizes: ["600", "700", "800", "900 mm"],
    security: null,
    isNew: false,
    images: [],
    short: "Iekšdurvis ar matētu virsmu dzīvojamām telpām.",
    specs: { "Materiāls": "MDF, ekošpons", "Komplektā": "Vērtne, kārba, apmales" }
  },
  {
    id: "bid-001",
    name: "Bīdāmās Loft 02",
    collection: "TREND",
    category: "bidamas-durvis",
    price: 240,
    oldPrice: null,
    colors: ["Melns", "Ozols"],
    sizes: ["800", "900 mm"],
    security: null,
    isNew: true,
    images: [],
    short: "Bīdāmās durvis ar atklātu sliežu sistēmu.",
    specs: { "Sistēma": "Sienas bīdāmā", "Komplektā": "Sliede, ruļļi" }
  },
  {
    id: "slept-001",
    name: "Slēptās Invisible 01",
    collection: "ELITE",
    category: "sleptas-durvis",
    price: 410,
    oldPrice: null,
    colors: ["Gruntēts (krāsojams)"],
    sizes: ["700", "800 mm"],
    security: null,
    isNew: true,
    images: [],
    short: "Slēptā tipa durvis bez redzamas kārbas, krāsojamas sienas tonī.",
    specs: { "Kārba": "Alumīnija, slēptā", "Vēršanās": "Iekšā / ārā" }
  }
];

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getProductsByCategory(slug) {
  return products.filter((p) => p.category === slug);
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}
