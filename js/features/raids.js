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
    if (s.raid.active) {
      if (Date.now() >= s.raid.endsAt) this.finishRaid();
      return;
    }
    if (this.checkTimer < RAID_CHECK_MS) return;
    this.checkTimer = 0;
    const risk = Math.min(80, Math.max(0, s.raidRisk + s.experiments * 2 - this.securityPower() * 4));
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
      this.events.emit("raid:damage", damage);
    } else {
      s.raidRisk = Math.max(0, s.raidRisk - 5);
      this.events.emit("raid:defended");
    }
    s.raid = { active:false, endsAt:0 };
    this.events.emit("raid:ended");
  }
};