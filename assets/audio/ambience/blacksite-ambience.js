(function(){
  let ctx=null, master=null, running=false, nodes=[];
  function noiseBuffer(c){
    const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
    return b;
  }
  function start(){
    if(running)return;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    ctx=ctx||new AC();
    if(ctx.state==="suspended")ctx.resume();
    master=ctx.createGain(); master.gain.value=0.075; master.connect(ctx.destination);
    const low=ctx.createOscillator(); low.type="sine"; low.frequency.value=55;
    const lowG=ctx.createGain(); lowG.gain.value=0.42; low.connect(lowG).connect(master);
    const hum=ctx.createOscillator(); hum.type="sine"; hum.frequency.value=82.5;
    const humG=ctx.createGain(); humG.gain.value=0.16; hum.connect(humG).connect(master);
    const pad=ctx.createOscillator(); pad.type="sine"; pad.frequency.value=110;
    const padG=ctx.createGain(); padG.gain.value=0.11; pad.connect(padG).connect(master);
    const n=ctx.createBufferSource(); n.buffer=noiseBuffer(ctx); n.loop=true;
    const f=ctx.createBiquadFilter(); f.type="lowpass"; f.frequency.value=420;
    const ng=ctx.createGain(); ng.gain.value=0.035; n.connect(f).connect(ng).connect(master);
    const lfo=ctx.createOscillator(); lfo.frequency.value=0.125;
    const lfoG=ctx.createGain(); lfoG.gain.value=0.025; lfo.connect(lfoG).connect(ng.gain);
    [low,hum,pad,n,lfo].forEach(x=>{x.start();nodes.push(x)});
    running=true;
  }
  function stop(){
    if(!ctx)return;
    nodes.forEach(x=>{try{x.stop()}catch(e){}});
    nodes=[]; running=false;
    if(master)master.disconnect();
  }
  window.BLACKSITE_AMBIENCE={start,stop};
})();