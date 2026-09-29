const $ = id => document.getElementById(id);
const FACE_BASE = "assets/characters/tutorial-guy/";

  if (transparentFaces.has(src)) {
    resolve(transparentFaces.get(src));
    return;
  }

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      resolve(src);
      return;
    }

    ctx.drawImage(img, 0, 0);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = image.data;
    const w = canvas.width;
    const h = canvas.height;
    const visited = new Uint8Array(w * h);
    const queue = [];

    // The artwork uses a white/gray backdrop. Only remove backdrop-colored
    // pixels that are connected to the outside edge, so light details inside
    // the character are not accidentally erased.
    const isBackdrop = (i, reference) => {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const neutral = max - min <= 28;
      const brightness = (r + g + b) / 3;
      if (!neutral || brightness < 145) return false;
      if (!reference) return true;
      const distance = Math.abs(r - reference[0]) + Math.abs(g - reference[1]) + Math.abs(b - reference[2]);
      return distance <= 105;
    };

    const add = (x, y, reference) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      const p = y * w + x;
      if (visited[p]) return;
      const i = p * 4;
      if (!isBackdrop(i, reference)) return;
      visited[p] = 1;
      queue.push([x, y, [data[i], data[i + 1], data[i + 2]]]);
    };

    // Seed from every edge pixel, using each edge area's actual backdrop tone.
    for (let x = 0; x < w; x++) {
      add(x, 0);
      add(x, h - 1);
    }
    for (let y = 1; y < h - 1; y++) {
      add(0, y);
      add(w - 1, y);
    }

    while (queue.length) {
      const [x, y, reference] = queue.pop();
      const p = y * w + x;
      data[p * 4 + 3] = 0;
      add(x + 1, y, reference);
      add(x - 1, y, reference);
      add(x, y + 1, reference);
      add(x, y - 1, reference);
    }

    ctx.putImageData(image, 0, 0);
    const result = canvas.toDataURL("image/png");
    transparentFaces.set(src, result);
    resolve(result);
  };
  img.onerror = () => resolve(src);
  img.src = src;
});

const steps = [
  ["WELCOME TO BLACKSITE-01","I'm your facility guide. I'll show you the basics without locking you out of anything.",null,null],
  ["BUILD AN OFFICE","Open BUILDING and construct the Office Room. Construction takes a few seconds.","building","office"],
  ["HIRE A SCIENTIST","Once the Office is online, open STAFF and hire a Scientist. Scientists generate Research Points.","staff","scientist"],
  ["BUILD THE EXPERIMENT ROOM","Go back to BUILDING and construct the Experiment Room.","building","experimentBuilding"],
  ["POWER THE FACILITY","Build the Power System. Buildings use energy capacity; staff and experiments do not.","building","power"],
  ["RUN YOUR FIRST TEST","Open EXPERIMENTS and run the Facility Systems Test after the required rooms and scientist are ready.","experiments","basicExperiment"],
  ["YOU'RE IN COMMAND","That's it. The rest of the facility is yours to develop. Raids, upgrades and deeper experiments are now yours to discover.",null,null]
];

export const tutorialFeature = {
  id: "tutorial",
  init({ stateRef, events, save }) {
    // UI event handlers are installed immediately after the feature registry initializes.
    // Defer tutorial setup one microtask so tab clicks/highlights work reliably on first load.
    queueMicrotask(() => {
      if (stateRef().tutorialComplete) return;

      const root = $("tutorialOverlay");
      if (!root) return;

      let index = 0;

      const clearPulses = () => {
        document.querySelectorAll(".tutorial-pulse").forEach(el => el.classList.remove("tutorial-pulse"));
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

      const show = () => {
        const step = steps[index];
        if (!step) return;

        clearPulses();
        const guide = $("tutorialGuide");
        if (guide) {
          const face = index === 0 ? "neutral_face.jpg"
            : index === 1 || index === 2 || index === 4 ? "thinking_face.jpg"
            : index === 5 ? "task_complete_face.jpg"
            : "you_did_it_face.jpg";
          guide.src = FACE_BASE + face;
          guide.style.visibility = "visible";
        }

        $("tutorialTitle").textContent = step[0];
        $("tutorialText").textContent = step[1];
        $("tutorialStep").textContent = (index + 1) + " / " + steps.length;
        $("tutorialNext").textContent = index === steps.length - 1 ? "FINISH" : "NEXT";
        if (step[2]) {
          const tab = document.querySelector('.tab[data-tab="' + step[2] + '"]');
          if (tab) tab.click();
        }

        if (step[3]) {
          const target = $(step[3]);
          if (target) target.classList.add("tutorial-pulse");
        }
      };

      $("tutorialNext").addEventListener("click", () => {
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

      $("tutorialSkip").addEventListener("click", finish);
      events.on("construction:complete", show);
      events.on("construction:started", show);
      show();
    });
  },
  tick() {},
  reset() {},
  destroy() {}
};
