import { UPGRADE_COSTS } from "../config.js";

export const upgradesFeature = {
  id: "upgrades",
  init({ stateRef, events }) {
    this.stateRef = stateRef;
    this.events = events;
  },
  buy(id) {
    const s = this.stateRef();
    const cost = UPGRADE_COSTS[id];
    if (!cost || s.superResearch < cost) return { ok:false, message:"Not enough Super Research." };
    if (id === "securityEquipment" && s.securityTrainingLevel < 1) return { ok:false, message:"Research Security Training first." };
    if (id === "government" && s.securityEquipmentLevel < 1) return { ok:false, message:"Research Security Equipment first." };
    if (id === "researchSpeed" && s.scientists < 1) return { ok:false, message:"Hire a Scientist first." };
    if (id === "advanced" && s.researchSpeedLevel < 1) return { ok:false, message:"Research Speed must be upgraded first." };
    if (id === "facility" && s.facilityLevel < 1) return { ok:false, message:"Facility level is already at the required starting point." };
    if (id === "expansion" && s.facilityLevel < 2) return { ok:false, message:"Facility Level 2 is required." };
    if (id === "securityTraining" && s.securityTrainingLevel >= 5) return { ok:false, message:"Security Training is maxed." };
    if (id === "securityEquipment" && s.securityEquipmentLevel >= 3) return { ok:false, message:"Security Equipment is maxed." };
    s.superResearch -= cost;
    if (id === "securityTraining") s.securityTrainingLevel++;
    if (id === "securityEquipment") s.securityEquipmentLevel++;
    if (id === "government") s.governmentCover = true;
    if (id === "researchSpeed") s.researchSpeedLevel++;
    if (id === "advanced") s.advancedExperiment = true;
    if (id === "construction") s.constructionSpeedLevel++;
    if (id === "facility") s.facilityLevel = 2;
    if (id === "expansion") s.researchWing = true;
    this.events.emit("upgrade:bought", id);
    return { ok:true };
  }
};