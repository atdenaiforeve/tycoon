(function(){
  const AUDIO_PATH="assets/audio/ambience/blacksite-ambience.mp3";
  let audio=null;
  let started=false;
  window.BLACKSITE_AMBIENCE={
    start:function(){
      if(started)return;
      started=true;
      audio=document.getElementById("facilityAmbience");
      if(!audio){
        audio=new Audio(AUDIO_PATH);
        audio.id="facilityAmbience";
        audio.preload="auto";
        audio.loop=true;
        audio.volume=0.18;
        document.body.appendChild(audio);
      }
      audio.loop=true;
      audio.volume=0.18;
      const p=audio.play();
      if(p&&p.catch)p.catch(function(){started=false;});
    },
    stop:function(){
      if(audio){audio.pause();audio.currentTime=0;}
      started=false;
    }
  };
})();
