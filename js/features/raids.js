import { RAID_CHECK_MS, RAID_DURATION_MS } from "../config.js";

export const raidsFeature = {
  id: "raids",
  init({ stateRef, events }) {
    this.stateRef = stateRef;
    this.events = events;
    this.checkTimer = 0;
  },
  securityPower() {
    const s = this.stateRef();
    return s.security * (1 + s.securityTrainingLevel * 0.5 + s.securityEquipmentLevel * 0.75) * Math.max(0.4, 1 - s.securityFatigue);
  },
  tick(dt) {
    const s = this.stateRef();
    this.checkTimer += dt;
    if (s.repair && Date.now() >= s.repair.endsAt) {
      s.repair = null;
      s.securityFatigue = Math.max(0, s.securityFatigue - 0.12);
      this.events.emit("raid:repaired");
    }
    if (s.raid.active) {
      if (Date.now() >= s.raid.endsAt) this.finishRaid();
      return;
    }
    s.securityFatigue = Math.max(0, s.securityFatigue - 0.003 * dt / 1000);
    if (this.checkTimer < RAID_CHECK_MS) return;
    this.checkTimer = 0;
    const experimentRisk = s.experiments * (s.governmentCover ? 1 : 2);
    const risk = Math.min(80, Math.max(0, s.raidRisk + experimentRisk - this.securityPower() * 4));
    if (risk > 0 && Math.random() < risk / 100 * 0.12) this.startRaid();
  },
  startRaid() {
    const s = this.stateRef();
    s.raid = { active:true, endsAt:Date.now() + RAID_DURATION_MS };
    this.events.emit("raid:started");
  },
  finishRaid() {
    const s = this.stateRef();
    const defense = this.securityPower();
    const damage = Math.max(0, Math.round(120 - defense * 35));
    if (damage > 0) {
      s.points = Math.max(0, s.points - damage);
      s.securityFatigue = Math.min(0.7, s.securityFatigue + 0.08);
      s.repair = { endsAt: Date.now() + 6000, cost: damage };
      this.events.emit("raid:damage", damage);
    } else {
      s.raidRisk = Math.max(0, s.raidRisk - 5);
      this.events.emit("raid:defended");
    }
    s.raid = { active:false, endsAt:0 };
    this.events.emit("raid:ended");
  }
};