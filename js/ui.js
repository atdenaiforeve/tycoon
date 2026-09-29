import { BUILD_ID, COSTS, UPGRADE_COSTS, UPDATE_AGES } from "./config.js";

const $ = id => document.getElementById(id);
const money = n => Math.floor(n).toLocaleString();

export function createUI({ stateStore, events, features, save }) {
  const stateRef = () => stateStore.value;
  const construction = features.find("construction");
  const economy = features.find("economy");
  const research = features.find("research");
  const upgrades = features.find("upgrades");

  function message(text) { $("systemMessage").textContent = text; }

  function button(id, handler) {
    const el = $(id);
    if (el) el.addEventListener("click", () => {
      const result = handler();
      if (result?.message) message(result.message);
      render();
    });
  }

  function setup() {
    $("buildLabel").textContent = "SYSTEM BUILD " + BUILD_ID + " — MODULAR CORE";
    document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === tab));
      document.querySelectorAll(".upgrade-list").forEach(x => x.classList.toggle("active", x.id === tab.dataset.tab));
    }));
    button("office", () => construction.start("office"));
    button("experimentBuilding", () => construction.start("experimentBuilding"));
    button("power", () => construction.start("power"));
    button("scientist", () => construction.start("scientist"));
    button("securityStaff", () => construction.start("securityStaff"));
    button("basicExperiment", () => research.startBasic());
    button("buySecurityTraining", () => upgrades.buy("securityTraining"));
    button("buySecurityEquipment", () => upgrades.buy("securityEquipment"));
    button("buyGovernment", () => upgrades.buy("government"));
    button("buyResearchSpeed", () => upgrades.buy("researchSpeed"));
    button("buyAdvanced", () => upgrades.buy("advanced"));
    button("buyConstruction", () => upgrades.buy("construction"));
    button("buyFacility", () => upgrades.buy("facility"));
    button("buyExpansion", () => upgrades.buy("expansion"));
    $("saveProgress").addEventListener("click", () => { save.save(); message("Progress saved locally."); render(); });
    $("resetProgress").addEventListener("click", () => {
      if (!confirm("Reset ALL BLACKSITE-01 progress? This cannot be undone.")) return;
      save.reset();
      stateStore.value = stateStore.factory();
      message("All progress reset. Starting a new facility.");
      render();
      save.save();
    });
    events.on("save:complete", () => { $("saveStatus").textContent = "Progress saved locally · " + new Date().toLocaleTimeString(); });
    events.on("save:loaded", () => { $("saveStatus").textContent = "Saved progress loaded from this browser."; });
    events.on("construction:started", q => message("Construction started: " + q.type.replaceAll("_"," ") + "."));
    events.on("construction:complete", type => message("Construction complete: " + type.replaceAll("_"," ") + "."));
    events.on("research:experiment-started", () => message("Facility systems test started. Super Research is being generated."));
    events.on("raid:started", () => message("Security alert: external raid detected."));
    events.on("raid:defended", () => message("Raid repelled. Security held the facility."));
    events.on("raid:damage", damage => message("Raid damage contained. " + damage + " RP was lost."));
    events.on("experiment:breach", () => message("Containment warning: experiment conditions caused a breach."));
    render();
  }

  function setAction(id, disabled, text) {
    const el = $(id);
    if (!el) return;
    el.disabled = !!disabled;
    const copy = el.querySelector(".button-copy");
    if (copy && text) {
      const count = copy.querySelector(".upgrade-count");
      const old = copy.firstChild;
      if (old) old.textContent = text;
      if (count) copy.appendChild(count);
    }
  }

  function renderRoom(roomId, active, statusId, status) {
    const room = $(roomId);
    if (!room) return;
    room.classList.toggle("locked", !active);
    room.classList.toggle("active", active);
    $(statusId).textContent = status;
  }

  function render() {
    const s = stateRef();
    const income = economy.getIncome();
    const energyUsed = construction.energyUsed();
    const energyCapacity = construction.energyCapacity();

    $("points").textContent = money(s.points) + " RP";
    $("income").textContent = income.toFixed(1) + " RP / sec";
    $("energy").textContent = energyUsed + " / " + energyCapacity;
    $("srp").textContent = s.superResearch.toFixed(1) + " SRP";
    $("raidRisk").textContent = Math.round(s.raidRisk) + "%";
    $("status").textContent = s.raid.active ? "UNDER RAID" : s.repair ? "RECOVERING" : "OPERATIONAL";

    renderRoom("officeRoom", s.office, "officeRoomStatus", s.office ? "Operational" : "Awaiting construction");
    renderRoom("experimentRoom", s.experimentRoom, "experimentRoomStatus", s.experimentRoom ? "Operational" : "Awaiting construction");
    renderRoom("powerRoom", s.power, "powerRoomStatus", s.power ? "15 capacity online" : "Awaiting construction");
    renderRoom("securityRoom", s.security > 0, "securityRoomStatus", s.security > 0 ? s.security + " personnel" : "Awaiting staff");
    renderRoom("researchRoom", s.researchWing, "researchRoomStatus", s.researchWing ? "Research wing online" : "Level 2 required");

    const q = s.constructionQueue;
    const queued = q?.type;
    const timeLeft = q ? Math.max(0, Math.ceil((q.endsAt - Date.now()) / 1000)) : 0;
    $("officeBuildStatus").textContent = queued === "office" ? "Constructing · " + timeLeft + "s" : s.office ? "Built" : "Ready";
    $("experimentBuildStatus").textContent = queued === "experimentBuilding" ? "Constructing · " + timeLeft + "s" : s.experimentRoom ? "Built" : "Ready";
    $("powerBuildStatus").textContent = queued === "power" ? "Constructing · " + timeLeft + "s" : s.power ? "Online" : "Ready";
    $("scientistCount").textContent = "Hired: " + s.scientists;
    $("securityCount").textContent = "Hired: " + s.security;
    $("experimentCount").textContent = "Experiments: " + s.experiments;
    $("creatureStatus").textContent = s.creatureEscaped ? "CONTAINMENT BREACH · COMFORT " + Math.round(s.creatureComfort) + "%" : "COMFORT · " + Math.round(s.creatureComfort) + "% · STABLE";
    $("researchStatus").textContent = research.canRunBasic() ? "Ready to run" : "Requires Office, Experiment Room, Power and Scientist.";

    setAction("office", !!(s.office || queued), queued === "office" ? "OFFICE ROOM · CONSTRUCTING" : "OFFICE ROOM");
    setAction("experimentBuilding", !!(s.experimentRoom || queued), queued === "experimentBuilding" ? "EXPERIMENT ROOM · CONSTRUCTING" : "EXPERIMENT ROOM");
    setAction("power", !!(s.power || queued), queued === "power" ? "POWER SYSTEM · CONSTRUCTING" : "POWER SYSTEM");
    setAction("scientist", !!queued || !s.office, "SCIENTIST");
    setAction("securityStaff", !!queued || !s.office || s.scientists < 1, "SECURITY");
    setAction("basicExperiment", !!queued || !research.canRunBasic(), "FACILITY SYSTEMS TEST");

    $("securityTrainingCount").textContent = "Level: " + s.securityTrainingLevel + " / 5";
    $("securityEquipmentCount").textContent = "Level: " + s.securityEquipmentLevel + " / 3";

    const lock = (id, unlocked) => { const el=$(id); if(el) el.classList.toggle("locked-node", !unlocked); };
    lock("srSecurityTraining", s.superResearch >= UPGRADE_COSTS.securityTraining);
    lock("srSecurityEquipment", s.securityTrainingLevel > 0);
    lock("srGovernment", s.securityEquipmentLevel > 0);
    lock("srResearchSpeed", s.scientists > 0);
    $("srAdvanced").classList.toggle("hidden-node", !s.advancedExperiment && s.researchSpeedLevel < 1);
    lock("srFacility", s.facilityLevel >= 1);
    lock("srExpansion", s.facilityLevel >= 2);

    $("buySecurityTraining").disabled = s.superResearch < UPGRADE_COSTS.securityTraining || s.securityTrainingLevel >= 5;
    $("buySecurityEquipment").disabled = s.superResearch < UPGRADE_COSTS.securityEquipment || s.securityTrainingLevel < 1 || s.securityEquipmentLevel >= 3;
    $("buyGovernment").disabled = s.superResearch < UPGRADE_COSTS.government || s.securityEquipmentLevel < 1 || s.governmentCover;
    $("buyResearchSpeed").disabled = s.superResearch < UPGRADE_COSTS.researchSpeed || s.scientists < 1;
    $("buyAdvanced").disabled = s.superResearch < UPGRADE_COSTS.advanced || s.researchSpeedLevel < 1 || s.advancedExperiment;
    $("buyConstruction").disabled = s.superResearch < UPGRADE_COSTS.construction || s.constructionSpeedLevel >= 5;
    $("buyFacility").disabled = s.superResearch < UPGRADE_COSTS.facility || s.facilityLevel >= 2;
    $("buyExpansion").disabled = s.superResearch < UPGRADE_COSTS.expansion || s.facilityLevel < 2 || s.researchWing;

    const eraIndex = s.researchWing ? 5 : s.facilityLevel >= 2 ? 2 : s.researchSpeedLevel ? 3 : s.securityTrainingLevel ? 4 : s.constructionSpeedLevel ? 1 : 0;
    $("currentUpdateName").textContent = UPDATE_AGES[eraIndex][0];
    $("currentUpdateDesc").textContent = UPDATE_AGES[eraIndex][1];

    const file = research.fileText();
    $("experimentFile").innerHTML = "<strong>UNKNOWN EXPERIMENT — OBSERVATION FILE</strong><br><br>Condition: " + file.condition + "<br>Containment: " + (s.creatureEscaped ? "BREACHED" : "SECURE") + "<br>Security condition: " + (s.securityFatigue > 0 ? "Temporarily fatigued" : "Normal") + "<br><br><strong>LEARNED INFORMATION</strong><br>" + file.lines.map((x,i) => (i+1) + ". " + x).join("<br>");

    $("raidBanner").classList.toggle("active", s.raid.active);
    $("raidMarker").classList.toggle("active", s.raid.active);
    $("securityShield").classList.toggle("active", s.security > 0);
    $("raidTimer").textContent = s.raid.active ? Math.max(0, Math.ceil((s.raid.endsAt-Date.now())/1000)) : 0;
    $("facilityPanel").classList.toggle("raid-active", s.raid.active);

    const debug = $("debugPanel");
    if (debug) {
      const show = new URLSearchParams(location.search).has("debug");
      debug.hidden = !show;
      if (show) $("debugStatus").innerHTML = "Build: " + BUILD_ID + "<br>Features: " + features.list().map(f=>f.id).join(", ") + "<br>Queue: " + (q?.type || "none") + "<br>Raid: " + s.raid.active;
    }
  }

  return { setup, render, message };
}