export const ambienceFeature = {
  id: "ambience",
  init({ stateRef, events }) {
    this.audio = document.getElementById("facilityAmbience");
    this.started = false;
    this.start = () => {
      if (this.started || !this.audio || !stateRef().tutorialComplete) return;
      this.audio.volume = 0.22;
      const promise = this.audio.play();
      if (promise?.then) {
        promise.then(() => { this.started = true; }).catch(() => {});
      }
    };

    this.onTutorialComplete = () => this.start();
    this.removeTutorialListener = events.on("tutorial:complete", this.onTutorialComplete);

    document.addEventListener("pointerdown", this.start, { passive: true });
    document.addEventListener("keydown", this.start);
    this.start();
  },
  destroy() {
    document.removeEventListener("pointerdown", this.start);
    document.removeEventListener("keydown", this.start);
    this.removeTutorialListener?.();
    if (this.audio) this.audio.pause();
  }
};
