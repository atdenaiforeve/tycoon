import { TICK_MS } from "../config.js";

export const economyFeature = {
  id: "economy",
  init({ stateRef, events }) {
    this.stateRef = stateRef;
    this.events = events;
  },
  tick(dt) {
    const s = this.stateRef();
    const base = s.scientists * 2;
    const experimentBonus = s.experiments * 1.5;
    const speedBonus = 1 + s.researchSpeedLevel * 0.25;
    const income = (base + experimentBonus) * speedBonus;
    s.points += income * dt / 1000;
    s.superResearch += s.experiments * 0.02 * dt / 1000;
    this.events.emit("state:changed");
  },
  getIncome() {
    const s = this.stateRef();
    return (s.scientists * 2 + s.experiments * 1.5) * (1 + s.researchSpeedLevel * 0.25);
  }
};