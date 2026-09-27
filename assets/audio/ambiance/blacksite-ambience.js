/* BLACKSITE-01 corporate tutorial guide: visual-only overlay, no tutorial audio. */
(function(){
  function boot(){
    try { tutorialVoiceEnabled = false; } catch(e) {}
    var start = document.getElementById("startOverlay");
    if(start) start.style.display = "none";
    var voice = document.getElementById("tutorialVoice");
    if(voice){ voice.pause(); voice.removeAttribute("src"); voice.load(); }

    var style = document.createElement("style");
    style.textContent = `
      #corpGuide{position:fixed;left:18px;bottom:18px;z-index:9999;display:flex;align-items:flex-end;gap:12px;max-width:min(560px,calc(100vw - 28px));font-family:Arial,Helvetica,sans-serif;pointer-events:none;transition:opacity .2s,transform .2s}
      #corpGuide.hidden{opacity:0;transform:translateY(14px);pointer-events:none}
      #corpGuide .guideGuy{width:76px;height:108px;position:relative;flex:0 0 76px;filter:drop-shadow(0 6px 8px #0008)}
      #corpGuide .head{position:absolute;left:20px;top:2px;width:38px;height:38px;border-radius:50%;background:#e5b58e;border:2px solid #202a33}
      #corpGuide .hair{position:absolute;left:22px;top:0;width:34px;height:13px;border-radius:16px 16px 5px 5px;background:#29323b}
      #corpGuide .eye{position:absolute;top:18px;width:4px;height:4px;border-radius:50%;background:#172028}
      #corpGuide .eye.a{left:30px}.eye.b{left:45px}
      #corpGuide .body{position:absolute;left:12px;top:38px;width:54px;height:60px;border-radius:12px 12px 7px 7px;background:#172331;border:2px solid #33485b}
      #corpGuide .shirt{position:absolute;left:28px;top:41px;width:22px;height:52px;background:#f4f7fa;clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
      #corpGuide .tie{position:absolute;left:35px;top:43px;width:9px;height:40px;background:#38d9ff;clip-path:polygon(20% 0,80% 0,100% 18%,62% 100%,38% 100%,0 18%)}
      #corpGuide .arm{position:absolute;top:52px;width:16px;height:44px;border-radius:9px;background:#172331;border:2px solid #33485b}
      #corpGuide .arm.l{left:4px;transform:rotate(8deg)}#corpGuide .arm.r{right:4px;transform:rotate(-8deg)}
      #corpGuide .tablet{position:absolute;right:-1px;top:61px;width:25px;height:31px;border:2px solid #7d8b98;border-radius:4px;background:#0b151d;transform:rotate(-8deg)}
      #corpGuide .bubble{pointer-events:auto;position:relative;min-width:230px;background:#f4f7fa;color:#172028;border:2px solid #38d9ff;border-radius:14px;padding:14px 15px 12px;box-shadow:0 8px 24px #0008}
      #corpGuide .bubble:after{content:"";position:absolute;left:-10px;bottom:18px;width:16px;height:16px;background:#f4f7fa;border-left:2px solid #38d9ff;border-bottom:2px solid #38d9ff;transform:rotate(45deg)}
      #corpGuide .label{font-size:10px;letter-spacing:1.2px;font-weight:800;color:#287f9a;margin-bottom:6px;text-transform:uppercase}
      #corpGuide .text{font-size:14px;line-height:1.35;font-weight:600;padding-right:4px}
      #corpGuide .next{margin-top:10px;border:1px solid #287f9a;border-radius:7px;background:#172331;color:#fff;padding:7px 12px;font-size:12px;font-weight:700;cursor:pointer;min-height:0;width:auto;text-align:center}
      #corpGuide .next:hover{background:#243746}
      @media(max-width:520px){
        #corpGuide{left:8px;bottom:8px;gap:7px;max-width:calc(100vw - 16px)}
        #corpGuide .guideGuy{transform:scale(.78);transform-origin:bottom left;margin-right:-15px}
        #corpGuide .bubble{min-width:0;flex:1;padding:11px 12px}
        #corpGuide .text{font-size:12px}
      }
    `;
    document.head.appendChild(style);

    var guide = document.createElement("div");
    guide.id = "corpGuide";
    guide.innerHTML = `
      <div class="guideGuy" aria-hidden="true">
        <div class="head"></div><div class="hair"></div><div class="eye a"></div><div class="eye b"></div>
        <div class="body"></div><div class="shirt"></div><div class="tie"></div>
        <div class="arm l"></div><div class="arm r"></div><div class="tablet"></div>
      </div>
      <div class="bubble">
        <div class="label">FACILITY GUIDE</div>
        <div class="text" id="corpGuideText">Welcome to BLACKSITE-01.</div>
        <button class="next" id="corpGuideNext" type="button">NEXT</button>
      </div>`;
    document.body.appendChild(guide);

    var text = document.getElementById("corpGuideText");
    var next = document.getElementById("corpGuideNext");
    var page = 0;
    var lastStep = 0;
    var lines = {
      0:["Welcome to BLACKSITE-01. I’ll show you the basics of running the facility.","Let’s start with the Office. It gives your staff somewhere to operate."],
      1:["Build the Office using the BUILDING controls.","Once construction finishes, we’ll move on to the Experiment Room."],
      2:["Good progress. Now build the Experiment Room.","This gives the facility a dedicated place for experiments."],
      3:["The facility needs reliable power.","Install the Power System to increase your available energy capacity."],
      4:["Now we need someone to run the research.","Hire a Scientist from the STAFF controls."],
      5:["A facility also needs protection.","Hire Security before we run the systems test."],
      6:["Everything is ready for the first test.","Run the Facility Systems Test. After that, you’re on your own."],
      7:["Level 1 complete. Nice work.","The guide is stepping out. Build the facility your way."]
    };
    function setGuide(){
      var step = 0;
      try { step = Number(tutorialStep); } catch(e) { step = 0; }
      if(!isFinite(step)) step=0;
      if(step !== lastStep){ page=0; lastStep=step; }
      if(step > 6){
        guide.classList.add("hidden");
        return;
      }
      guide.classList.remove("hidden");
      var pair = lines[step] || lines[0];
      text.textContent = pair[Math.min(page,pair.length-1)];
      next.textContent = page < pair.length-1 ? "NEXT" : "GOT IT";
    }
    next.addEventListener("click",function(){
      var step = 0; try { step=Number(tutorialStep); } catch(e){}
      var pair=lines[step]||lines[0];
      if(page<pair.length-1) page++;
      setGuide();
    });
    setInterval(setGuide,250);
    setGuide();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();