import { BUILD_ID, TICK_MS, AUTOSAVE_MS } from "./config.js";
import { createEventBus } from "./events.js";
import { createState } from "./state.js";
import { createSaveSystem } from "./save.js";
import { createFeatureRegistry } from "./feature-registry.js";
import { economyFeature } from "./features/economy.js";
import { constructionFeature } from "./features/construction.js";
import { researchFeature } from "./features/research.js";
import { raidsFeature } from "./features/raids.js";
import { upgradesFeature } from "./features/upgrades.js";
import { createUI } from "./ui.js";

const events = createEventBus();
const stateRef = {
  value: createState(),
  factory: createState
};

const save = createSaveSystem({
  stateRef,
  events
});

const registry = createFeatureRegistry({ stateRef, events });
registry.register(economyFeature);
registry.register(constructionFeature);
registry.register(researchFeature);
registry.register(raidsFeature);
registry.register(upgradesFeature);

const features = {
  list: () => registry.list(),
  find: id => registry.list().find(feature => feature.id === id)
};

const context = { stateRef: () => stateRef.value, events, save, features };

save.load();
registry.initAll(context);

const ui = createUI({ stateRef: () => stateRef.value, events, features, save });
ui.setup();

let last = performance.now();
let saveTimer = 0;
let renderTimer = 0;

function frame(now) {
  const dt = Math.min(1000, now - last);
  last = now;
  registry.tickAll(dt, context);
  saveTimer += dt;
  renderTimer += dt;

  if (saveTimer >= AUTOSAVE_MS) {
    saveTimer = 0;
    save.save();
  }
  if (renderTimer >= TICK_MS) {
    renderTimer = 0;
    ui.render();
  }
  requestAnimationFrame(frame);
}

window.BLACKSITE = {
  version: BUILD_ID,
  state: () => stateRef.value,
  features,
  save,
  events
};

requestAnimationFrame(frame);