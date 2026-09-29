import { COSTS } from "../config.js";

export const researchFeature = {
  id: "research",
  init({ stateRef, events }) {
    this.stateRef = stateRef;
    this.events = events;
  },
  canRunBasic() {
    const s = this.stateRef();
    return s.office && s.experimentRoom && s.power && s.scientists > 0 && !s.advancedExperiment;
  },
  startBasic() {
    const s = this.stateRef();
    if (!this.canRunBasic()) return { ok:false, message:"Build Office, Experiment Room and Power, then hire a Scientist." };
    if (s.points < COSTS.basicExperiment) return { ok:false, message:"Not enough Research Points." };
    s.points -= COSTS.basicExperiment;
    s.experiments += 1;
    s.superResearch += 1;
    s.raidRisk = Math.min(100, s.raidRisk + 4);
    this.events.emit("research:experiment-started");
    return { ok:true };
  },
  tick(dt) {
    const s = this.stateRef();
    if (!s.experiments) return;
    const drift = (s.experiments * 0.5) * dt / 1000;
    s.creatureComfort = Math.max(0, Math.min(100, s.creatureComfort + (s.creatureEscaped ? 0.8 : 0.08) * dt / 1000));
    if (!s.creatureEscaped && s.creatureComfort < 20 && Math.random() < 0.0015 * dt / 1000) {
      s.creatureEscaped = true;
      s.creatureEscapeCause = "prolonged environmental stress";
      s.securityFatigue = Math.min(0.7, s.securityFatigue + 0.25);
      s.fileLearnings.push("Containment breach recorded: " + s.creatureEscapeCause + ".");
      this.events.emit("experiment:breach");
    }
    s.superResearch += drift * 0.01;
  },
  fileText() {
    const s = this.stateRef();
    const condition = s.creatureEscaped ? "CONTAINMENT BREACH" : s.creatureComfort < 20 ? "CRITICAL DISTRESS" : s.creatureComfort < 40 ? "DISTRESSED" : s.creatureComfort < 60 ? "UNCOMFORTABLE" : "STABLE";
    return { condition, lines: s.fileLearnings };
  }
};