export function createEventBus() {
  const listeners = new Map();
  return {
    on(name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
      return () => listeners.get(name)?.delete(fn);
    },
    emit(name, payload) {
      for (const fn of listeners.get(name) || []) {
        try { fn(payload); } catch (error) { console.error("Event error:", name, error); }
      }
    },
    clear() { listeners.clear(); }
  };
}