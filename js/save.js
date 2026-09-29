import { SAVE_KEY, SAVE_VERSION } from "./config.js";
import { applySavedState, serializeState } from "./state.js";

export function createSaveSystem({ stateRef, events }) {
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState(stateRef.value)));
      events.emit("save:complete");
      return true;
    } catch (error) {
      console.error(error);
      events.emit("save:error", error);
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (Number(parsed?.version) > SAVE_VERSION) {
        events.emit("save:future-version");
        return false;
      }
      stateRef.value = applySavedState(stateRef.value, parsed);
      events.emit("save:loaded");
      return true;
    } catch (error) {
      console.warn("Save load failed; starting clean.", error);
      localStorage.removeItem(SAVE_KEY);
      events.emit("save:corrupt");
      return false;
    }
  }

  function reset() {
    localStorage.removeItem(SAVE_KEY);
    events.emit("save:reset");
  }

  return { save, load, reset };
}
