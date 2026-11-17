(() => {
  'use strict';
  const canvas = document.querySelector('#opal-rain');
  const control = document.querySelector('#motion-button');
  const ctx = canvas?.getContext('2d', {alpha:true});
  if (!ctx || !control) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, width = 0, height = 0, drops = [], ripples = [];
  let frame = 0, previous = 0, time = 0;
  const pointer = {x:.5, y:.5}, target = {x:.5, y:.5};
  const random = (min,max) => min + Math.random() * (max-min);
  function resize() {
    width = innerWidth; height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    ctx.setTransform(scale,0,0,scale,0,0);
    drops = Array.from({length:Math.min(220,Math.max(55,Math.round(width*height/7000)))}, () => ({x:random(-100,width+100),y:random(-height,height),speed:random(170,390),length:random(13,30),alpha:random(.09,.28)}));
    if (paused) draw(0);
  }
  function glow(x,y,radius,color) {
    const gradient=ctx.createRadialGradient(x,y,0,x,y,radius);
    gradient.addColorStop(0,color);gradient.addColorStop(1,'transparent');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
  }
  function draw(delta) {
    pointer.x += (target.x-pointer.x)*.045; pointer.y += (target.y-pointer.y)*.045;
    const drift = Math.sin(time*.12), radius = Math.max(width,height)*.78;
    ctx.clearRect(0,0,width,height);
    glow(width*(.12+drift*.08),height*.85,radius,'rgba(177,204,186,.73)');
    glow(width*.88,height*(.2+Math.cos(time*.1)*.09),radius*.8,'rgba(222,210,185,.65)');
    glow(width*(.65+Math.sin(time*.09)*.12),height*.85,radius*.65,'rgba(194,217,222,.63)');
    glow(width*pointer.x,height*pointer.y,radius*.48,'rgba(246,226,235,.44)');
    glow(width*(1-pointer.x),height*.12,radius*.64,'rgba(255,255,242,.65)');
    // Long, translucent contours give the light a nacre-like surface.
    ctx.lineWidth=1;
    for(let i=0;i<12;i++) {
      ctx.beginPath();ctx.strokeStyle='rgba(255,255,250,'+(i%3===0?.09:.035)+')';
      for(let y=-40;y<=height+40;y+=30) {
        const x=width*(i/9-.1)+Math.sin(y/240+time*.09+i*.8)*width*.11+(pointer.x-.5)*55;
        if(y===-40)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    if(paused) return;
    const wind=(pointer.x-.5)*58;
    for(const drop of drops) {
      drop.y+=drop.speed*delta;drop.x+=wind*delta;
      if(drop.y>height+40){drop.y=random(-160,-30);drop.x=random(-80,width+80)}
      if(drop.x>width+100)drop.x=-70;if(drop.x< -100)drop.x=width+70;
      ctx.beginPath();ctx.lineWidth=.7;ctx.strokeStyle='rgba(94,125,112,'+drop.alpha+')';
      ctx.moveTo(drop.x,drop.y);ctx.lineTo(drop.x+wind*.035,drop.y+drop.length);ctx.stroke();
      ctx.beginPath();ctx.strokeStyle='rgba(255,255,255,'+(drop.alpha+.08)+')';
      ctx.moveTo(drop.x+1,drop.y);ctx.lineTo(drop.x+1+wind*.035,drop.y+drop.length*.7);ctx.stroke();
    }
    ripples=ripples.filter(r=>time-r.start<2);
    for(const ripple of ripples){const age=time-ripple.start;ctx.beginPath();ctx.ellipse(ripple.x,ripple.y,8+age*95,4+age*38,0,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,250,'+(.4*(1-age/2))+')';ctx.lineWidth=1;ctx.stroke();}
  }
  function tick(now) {
    if(paused || document.hidden){frame=0;previous=0;return}
    if(!previous || now-previous>=32) {
      const delta=previous?Math.min((now-previous)/1000,.06):0;
      previous=now;time+=delta;draw(delta);
    }
    frame=requestAnimationFrame(tick);
  }
  function updateControl() {
    control.textContent=paused?'Play rain':'Pause rain';
    control.setAttribute('aria-pressed',String(!paused));
  }
  function setPaused(value) {
    paused=value;cancelAnimationFrame(frame);frame=0;previous=0;
    updateControl();if(paused)draw(0);else if(!document.hidden)frame=requestAnimationFrame(tick);
  }
  addEventListener('pointermove',event=>{target.x=event.clientX/width;target.y=event.clientY/height},{passive:true});
  addEventListener('pointerdown',event=>{
    if(paused || event.target.closest('main,button,input,label'))return;
    ripples.push({x:event.clientX,y:event.clientY,start:time});if(ripples.length>8)ripples.shift();
  },{passive:true});
  addEventListener('pointerout',event=>{if(!event.relatedTarget){target.x=.5;target.y=.5}},{passive:true});
  addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;previous=0}else if(!paused&&!frame)frame=requestAnimationFrame(tick)});
  reduced.addEventListener('change',event=>{if(event.matches)setPaused(true)});
  control.addEventListener('click',()=>setPaused(!paused));
  resize();draw(0);control.hidden=false;setPaused(paused);
})();
