export function createFeatureRegistry({ stateRef, events }) {
  const features = new Map();

  function register(feature) {
    if (!feature?.id) throw new Error("Feature must have an id");
    if (features.has(feature.id)) throw new Error("Duplicate feature: " + feature.id);
    features.set(feature.id, feature);
  }

  function initAll(context) {
    for (const feature of features.values()) feature.init?.(context);
  }

  function tickAll(dt, context) {
    for (const feature of features.values()) feature.tick?.(dt, context);
  }

  function resetAll(context) {
    for (const feature of features.values()) feature.reset?.(context);
  }

  function destroyAll(context) {
    for (const feature of features.values()) feature.destroy?.(context);
  }

  return { register, initAll, tickAll, resetAll, destroyAll, list: () => [...features.values()] };
}