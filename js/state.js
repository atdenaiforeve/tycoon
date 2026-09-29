import { SAVE_VERSION } from "./config.js";

export const DEFAULT_STATE = Object.freeze({
  points: 2000,
  superResearch: 0,
  facilityLevel: 1,
  office: false,
  experimentRoom: false,
  power: false,
  researchWing: false,
  scientists: 0,
  security: 0,
  experiments: 0,
  advancedExperiment: false,
  constructionSpeedLevel: 0,
  researchSpeedLevel: 0,
  securityTrainingLevel: 0,
  securityEquipmentLevel: 0,
  governmentCover: false,
  raidRisk: 0,
  creatureComfort: 70,
  creatureEscaped: false,
  creatureEscapeCause: "",
  securityFatigue: 0,
  tutorialComplete: false,
  fileLearnings: ["Initial containment conditions have not yet produced a confirmed behavioural rule."]
});

export function createState() {
  return {
    ...DEFAULT_STATE,
    fileLearnings: [...DEFAULT_STATE.fileLearnings],
    constructionQueue: null,
    raid: { active: false, endsAt: 0 },
    repair: null
  };
}

export function serializeState(state) {
  return {
    version: SAVE_VERSION,
    points: state.points,
    superResearch: state.superResearch,
    facilityLevel: state.facilityLevel,
    office: state.office,
    experimentRoom: state.experimentRoom,
    power: state.power,
    researchWing: state.researchWing,
    scientists: state.scientists,
    security: state.security,
    experiments: state.experiments,
    advancedExperiment: state.advancedExperiment,
    constructionSpeedLevel: state.constructionSpeedLevel,
    researchSpeedLevel: state.researchSpeedLevel,
    securityTrainingLevel: state.securityTrainingLevel,
    securityEquipmentLevel: state.securityEquipmentLevel,
    governmentCover: state.governmentCover,
    raidRisk: state.raidRisk,
    creatureComfort: state.creatureComfort,
    creatureEscaped: state.creatureEscaped,
    creatureEscapeCause: state.creatureEscapeCause,
    securityFatigue: state.securityFatigue,
    tutorialComplete: !!state.tutorialComplete,
    fileLearnings: [...state.fileLearnings],
    constructionQueue: state.constructionQueue,
    raid: state.raid,
    repair: state.repair
  };
}

export function applySavedState(state, saved) {
  const clean = createState();
  if (!saved || typeof saved !== "object") return clean;
  for (const key of Object.keys(clean)) {
    if (key === "fileLearnings" || key === "raid" || key === "constructionQueue" || key === "repair") continue;
    if (typeof clean[key] === "number" && Number.isFinite(saved[key])) clean[key] = saved[key];
    else if (typeof clean[key] === "boolean" && typeof saved[key] === "boolean") clean[key] = saved[key];
    else if (typeof clean[key] === "string" && typeof saved[key] === "string") clean[key] = saved[key];
  }
  if (Array.isArray(saved.fileLearnings)) clean.fileLearnings = saved.fileLearnings.filter(x => typeof x === "string").slice(0, 50);
  if (saved.constructionQueue && typeof saved.constructionQueue === "object") clean.constructionQueue = saved.constructionQueue;
  if (saved.raid && typeof saved.raid === "object") clean.raid = { active: !!saved.raid.active, endsAt: Number(saved.raid.endsAt) || 0 };
  if (saved.repair && typeof saved.repair === "object") clean.repair = saved.repair;
  return clean;
}