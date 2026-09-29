const $ = id => document.getElementById(id);
const FACE_BASE = "assets/characters/tutorial-guy/";

const steps = [
  ["WELCOME TO BLACKSITE-01","I'm your facility guide. I'll show you the basics without locking you out of anything.",null,null],
  ["BUILD AN OFFICE","Open BUILDING and construct the Office Room. Construction takes a few seconds.","building","office"],
  ["HIRE A SCIENTIST","Once the Office is online, open STAFF and hire a Scientist. Scientists generate Research Points.","staff","scientist"],
  ["BUILD THE EXPERIMENT ROOM","Go back to BUILDING and construct the Experiment Room.","building","experimentBuilding"],
  ["POWER THE FACILITY","Build the Power System. Buildings use energy capacity; staff and experiments do not.","building","power"],
  ["RUN YOUR FIRST TEST","Open EXPERIMENTS and run the Facility Systems Test after the required rooms and scientist are ready.","experiments","basicExperiment"],
  ["YOU'RE IN COMMAND","That's it. The rest of the facility is yours to develop. Raids, upgrades and deeper experiments are now yours to discover.",null,null]
];

const transparentFaces = new Map();

function removeOutsideBackground(src) {
  return new Promise(resolve => {
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = source.naturalWidth;
      canvas.height = source.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return resolve(src);

      ctx.drawImage(source, 0, 0);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = image.data;
      const w = canvas.width;
      const h = canvas.height;
      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      // Remove only background-colored pixels that are connected to an outside edge.
      // This keeps black/white details that are actually part of the character.
      const isBackground = i => {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const neutral = max - min <= 45;
        const brightness = (r + g + b) / 3;

        // White/gray paper-style background.
        if (neutral && brightness >= 145) return true;

        // Black/dark background.
        if (neutral && brightness <= 55) return true;

        return false;
      };

      const seed = (x, y) => {
        const p = y * w + x;
        if (visited[p]) return;
        if (!isBackground(p * 4)) return;
        visited[p] = 1;
        queue[tail++] = p;
      };

      for (let x = 0; x < w; x++) {
        seed(x, 0);
        seed(x, h - 1);
      }
      for (let y = 1; y < h - 1; y++) {
        seed(0, y);
        seed(w - 1, y);
      }

      while (head < tail) {
        const p = queue[head++];
        const x = p % w;
        const y = Math.floor(p / w);
        data[p * 4 + 3] = 0;

        if (x > 0) seed(x - 1, y);
        if (x + 1 < w) seed(x + 1, y);
        if (y > 0) seed(x, y - 1);
        if (y + 1 < h) seed(x, y + 1);
      }

      ctx.putImageData(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    source.onerror = () => resolve(src);
    source.src = src;
  });
}

export const tutorialFeature = {
  id: "tutorial",

  init({ stateRef, events, save }) {
    queueMicrotask(() => {
      if (stateRef().tutorialComplete) return;

      const root = $("tutorialOverlay");
      const guide = $("tutorialGuide");
      const next = $("tutorialNext");
      const skip = $("tutorialSkip");
      if (!root || !guide || !next || !skip) return;

      let index = 0;

      const clearPulses = () => {
        document.querySelectorAll(".tutorial-pulse").forEach(el => {
          el.classList.remove("tutorial-pulse");
        });
      };

      const finish = () => {
        stateRef().tutorialComplete = true;
        save.save();
        clearPulses();
        root.remove();
        events.emit("tutorial:complete");
      };

      const ready = target => {
        const s = stateRef();
        if (target === "office") return s.office;
        if (target === "scientist") return s.scientists > 0;
        if (target === "experimentBuilding") return s.experimentRoom;
        if (target === "power") return s.power;
        if (target === "basicExperiment") return s.experiments > 0;
        return true;
      };

      const show = async () => {
        const step = steps[index];
        if (!step) return;

        clearPulses();

        const face = index === 0 ? "neutral_face.png"
          : index <= 4 ? "thinking_face.png"
          : index === 5 ? "task_complete_face.png"
          : "you_did_it_face.png";

        const src = FACE_BASE + face;
        guide.style.visibility = "hidden";

        // The PNG already contains real alpha transparency.
        if (steps[index] !== step) return;
        guide.src = src;
        guide.style.background = "transparent";
        guide.style.visibility = "visible";

        $("tutorialTitle").textContent = step[0];
        $("tutorialText").textContent = step[1];
        $("tutorialStep").textContent = (index + 1) + " / " + steps.length;
        next.textContent = index === steps.length - 1 ? "FINISH" : "NEXT";

        if (step[2]) {
          const tab = document.querySelector('.tab[data-tab="' + step[2] + '"]');
          if (tab) tab.click();
        }

        if (step[3]) {
          const target = $(step[3]);
          if (target) target.classList.add("tutorial-pulse");
        }
      };

      next.addEventListener("click", () => {
        const target = steps[index][3];

        if (target && !ready(target)) {
          const el = $(target);
          if (el) {
            el.classList.remove("tutorial-pulse");
            void el.offsetWidth;
            el.classList.add("tutorial-pulse");
          }
          return;
        }

        index++;
        if (index >= steps.length) finish();
        else show();
      });

      skip.addEventListener("click", finish);
      events.on("construction:complete", show);
      events.on("construction:started", show);

      show();
    });
  },

  tick() {},
  reset() {},
  destroy() {}
};
