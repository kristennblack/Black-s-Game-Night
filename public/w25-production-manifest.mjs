export const W25_HOME_PRODUCTION = Object.freeze({
  "buy-with-game-night-tokens-everyday-basics-kristen-s-cozy-lodge-": {
    sku:"W25-C01", label:"Kristen's Cozy Lodge Reading Chair", model:"/models/w25/w25-cognac-lodge-reading-chair.glb", kind:"room", thumb:"/catalog-review/w25-production-thumbs/chair.png", interaction:"sit", scale:1, camera:{distance:2.65,targetY:.68}, productionStatus:"Production Asset"
  },
  "buy-with-game-night-tokens-rustic-cabin-live-edge-nightstand": {
    sku:"W25-C02", label:"Live-Edge Nightstand", model:"/models/w25/w25-live-edge-side-table.glb", kind:"room", thumb:"/catalog-review/w25-production-thumbs/side-table.png", interaction:"surface", scale:1, camera:{distance:2.2,targetY:.42}, productionStatus:"Production Asset"
  },
  "buy-with-game-night-tokens-everyday-basics-warm-table-lamp": {
    sku:"W25-C03", label:"Warm Table Lamp", model:"/models/w25/w25-linen-bronze-table-lamp.glb", kind:"room", thumb:"/catalog-review/w25-production-thumbs/lamp.png", interaction:"toggle_light", scale:1, camera:{distance:2.1,targetY:.55}, productionStatus:"Production Asset"
  },
  "buy-with-game-night-tokens-everyday-basics-double-cabin-bed": {
    sku:"W25-C04", label:"Double Cabin Bed", model:"/models/w25/w25-deep-walnut-upholstered-bed.glb", kind:"room", thumb:"/catalog-review/w25-production-thumbs/bed.png", interaction:"place_rotate", scale:1, camera:{distance:3.5,targetY:.75}, productionStatus:"Production Asset"
  }
});

export const W25_COSMETIC_PRODUCTION = Object.freeze({
  "cowboy-hat": {sku:"W25-A01",label:"Cowboy Hat",model:"/models/w25/w25-dark-brown-ranch-cowboy-hat.glb",kind:"wearable",thumb:"/catalog-review/w25-production-thumbs/cowboy-hat.png",slot:"hat",anchor:"head",productionStatus:"Production Asset",fitStatus:"John W27 Repaired Head Fit Candidate; Device Approval Pending"},
  "aviator-sunglasses": {sku:"W25-A02",label:"Aviator Sunglasses",model:"/models/w25/w25-gold-brown-aviators.glb",kind:"wearable",thumb:"/catalog-review/w25-production-thumbs/aviators.png",slot:"glasses",anchor:"nose_bridge_eye_line_temples",productionStatus:"Production Asset",fitStatus:"John W27 Repaired Head Fit Candidate; Device Approval Pending"},
  "wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings": {sku:"W25-A03",label:"Medium Hoop Earrings",model:"/models/w25/w25-smooth-gold-hoops.glb",kind:"wearable",thumb:"/catalog-review/w25-production-thumbs/hoops.png",slot:"earrings",anchor:"earlobes",productionStatus:"Production Asset",fitStatus:"Fit Master Pending"},
  "wear-flagship-w049-aurora-face-glow": {sku:"W25-A04",label:"Soft-Glam Face Filter",effect:"soft-glam",kind:"wearable",thumb:"/catalog-review/w25-production-thumbs/soft-glam-filter.png",slot:"filter",anchor:"face_material",productionStatus:"Production Effect",fitStatus:"Fit Master Pending"}
});

export const W25_PRODUCTION_IDS = new Set([...Object.keys(W25_HOME_PRODUCTION), ...Object.keys(W25_COSMETIC_PRODUCTION)]);
export const w25ProductionSpec = id => W25_HOME_PRODUCTION[id] || W25_COSMETIC_PRODUCTION[id] || null;
export const isW25Production = id => W25_PRODUCTION_IDS.has(String(id||''));
