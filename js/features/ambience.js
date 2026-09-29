export const ambienceFeature = {
  id: "ambience",
  init() {
    this.audio = document.getElementById("facilityAmbience");
    this.started = false;
    this.start = () => {
      if (this.started || !this.audio) return;
      this.audio.volume = 0.22;
      const promise = this.audio.play();
      if (promise?.then) promise.then(() => { this.started = true; }).catch(() => {});
    };
    document.addEventListener("pointerdown", this.start, { once: true, passive: true });
    document.addEventListener("keydown", this.start, { once: true });
  },
  destroy() {
    document.removeEventListener("pointerdown", this.start);
    document.removeEventListener("keydown", this.start);
    if (this.audio) this.audio.pause();
  }
};