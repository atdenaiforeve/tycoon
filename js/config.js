export const BUILD_ID = "100";
export const SAVE_KEY = "blacksite01_tycoon_modular_v1";
export const SAVE_VERSION = 1;

export const COSTS = Object.freeze({
  office: 200,
  experimentBuilding: 400,
  power: 500,
  scientist: 300,
  securityStaff: 250,
  basicExperiment: 350
});

export const BUILD_TIME = Object.freeze({
  office: 5,
  experimentBuilding: 7,
  power: 10,
  scientist: 3,
  securityStaff: 3
});

export const ENERGY = Object.freeze({
  office: 3,
  experimentBuilding: 5,
  powerCapacity: 15
});

export const UPGRADE_COSTS = Object.freeze({
  securityTraining: 2,
  securityEquipment: 3,
  government: 5,
  researchSpeed: 2,
  advanced: 8,
  construction: 1,
  facility: 3,
  expansion: 5
});

export const TICK_MS = 250;
export const AUTOSAVE_MS = 5000;
export const RAID_CHECK_MS = 10000;
export const RAID_DURATION_MS = 12000;

export const UPDATE_AGES = Object.freeze([
  ["The Beginning Update", "BLACKSITE-01 is operational and ready for controlled expansion."],
  ["The Expansion Update", "Construction systems are becoming faster and the facility is growing."],
  ["The Foundation Update", "A stronger facility foundation has been established."],
  ["The Discovery Update", "Research teams are learning how to push the facility further."],
  ["The Lockdown Update", "Security procedures are becoming a permanent part of operations."],
  ["The Deep Blacksite Update", "The facility has entered its next underground research era."]
]);