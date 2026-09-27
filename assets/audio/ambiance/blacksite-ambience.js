(function(){
  window.BLACKSITE_AMBIENCE={
    start:function(){
      const audio=document.getElementById("facilityAmbience");
      if(!audio)return;
      audio.loop=true;
      audio.volume=0.12;
      const p=audio.play();
      if(p&&typeof p.catch==="function")p.catch(function(){});
    },
    stop:function(){
      const audio=document.getElementById("facilityAmbience");
      if(audio){audio.pause();audio.currentTime=0;}
    }
  };
})();
