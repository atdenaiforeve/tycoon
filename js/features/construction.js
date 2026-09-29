import { BUILD_TIME, COSTS, ENERGY } from "../config.js";

export const constructionFeature = {
  id: "construction",
  init({ stateRef, events }) {
    this.stateRef = stateRef;
    this.events = events;
  },
  duration(type) {
    const s = this.stateRef();
    return Math.max(2, Math.ceil(BUILD_TIME[type] / (1 + s.constructionSpeedLevel * 0.25)));
  },
  energyUsed(s = this.stateRef()) {
    return (s.office ? ENERGY.office : 0) + (s.experimentRoom ? ENERGY.experimentBuilding : 0);
  },
  energyCapacity(s = this.stateRef()) {
    return s.power ? ENERGY.powerCapacity : ENERGY.office;
  },
  canAfford(type) {
    return this.stateRef().points >= COSTS[type];
  },
  requirements(type) {
    const s = this.stateRef();
    if (type === "office") return !s.office;
    if (type === "experimentBuilding") return s.office && s.power && !s.experimentRoom;
    if (type === "power") return s.office && !s.power;
    if (type === "scientist") return s.office;
    if (type === "securityStaff") return s.office && s.scientists > 0;
    return false;
  },
  start(type) {
    const s = this.stateRef();
    if (s.constructionQueue) return { ok:false, message:"Another construction project is already running." };
    if (!this.requirements(type)) return { ok:false, message:"That construction is not available yet." };
    if (!this.canAfford(type)) return { ok:false, message:"Not enough Research Points." };
    if (type === "experimentBuilding" && this.energyUsed() + ENERGY.experimentBuilding > this.energyCapacity()) return { ok:false, message:"Not enough energy capacity for the Experiment Room." };
    s.points -= COSTS[type];
    s.constructionQueue = { type, endsAt: Date.now() + this.duration(type) * 1000 };
    this.events.emit("construction:started", s.constructionQueue);
    return { ok:true };
  },
  tick() {
    const s = this.stateRef();
    const q = s.constructionQueue;
    if (!q || Date.now() < q.endsAt) return;
    const type = q.type;
    s.constructionQueue = null;
    if (type === "office") s.office = true;
    if (type === "experimentBuilding") s.experimentRoom = true;
    if (type === "power") s.power = true;
    if (type === "scientist") s.scientists += 1;
    if (type === "securityStaff") s.security += 1;
    this.events.emit("construction:complete", type);
    this.events.emit("state:changed");
  },
  reset({ stateRef }) { stateRef.value.constructionQueue = null; }
};