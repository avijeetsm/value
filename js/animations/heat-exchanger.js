export function initHeatExchangerAnimation(canvasId = 'heat-exchanger-canvas') {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const cx = cv.getContext('2d');

  let W, H, NP = 10, plates = [];
  let hotP = [], coldP = [], xP = [];

  function resize() {
    W = cv.width  = cv.offsetWidth;
    H = cv.height = cv.parentElement.offsetHeight;
    plates = [];
    for (let i = 0; i <= NP; i++) plates.push((W / NP) * i);
  }

  function lerp(t, r1,g1,b1, r2,g2,b2) {
    const s = Math.max(0, Math.min(1, t));
    return [r1+(r2-r1)*s|0, g1+(g2-g1)*s|0, b1+(b2-b1)*s|0];
  }

  // HOT: vivid flame red → duller warm blue-grey (cooled but not cold)
  function hotCol(x) {
    const t = (x - plates[0]) / (plates[NP] - plates[0]);
    const [r,g,b] = lerp(t, 255, 55, 10,  100, 115, 140);
    return {r,g,b};
  }

  // COLD: vivid ice blue right → warm amber left
  function coldCol(x) {
    const t = (x - plates[0]) / (plates[NP] - plates[0]);
    const [r,g,b] = lerp(t, 200, 100, 20,  30, 145, 255);
    return {r,g,b};
  }

  // HOT particle — hollow ring + filled centre
  class HotParticle {
    constructor() { this.reset(); }
    reset() {
      const u = plates[NP] - plates[0];
      this.x   = plates[0] + Math.random() * u;
      this.spd = 0.5 + Math.random() * 0.75;
      this.wo  = Math.random() * Math.PI * 2;
      this.ws  = 0.011 + Math.random() * 0.016;
      this.lb  = 0.1  + Math.random() * 0.8;
      this.wa  = 2    + Math.random() * 5;
      this.sz  = 2.8  + Math.random() * 1.8;
      this.al  = 0.8  + Math.random() * 0.2;
    }
    get y() {
      const ch = H/2 - 6;
      return 6 + this.lb*(ch-12) + Math.sin(this.wo)*this.wa;
    }
    update() {
      this.wo += this.ws; this.x += this.spd;
      if (this.x > plates[NP]+10) this.x = plates[0]-10;
    }
    draw() {
      const c = hotCol(this.x);
      const col = `rgba(${c.r},${c.g},${c.b},${this.al})`;
      // outer ring
      cx.beginPath(); cx.arc(this.x, this.y, this.sz, 0, Math.PI*2);
      cx.strokeStyle = col; cx.lineWidth = 1.4; cx.stroke();
      // inner dot
      cx.beginPath(); cx.arc(this.x, this.y, this.sz*0.38, 0, Math.PI*2);
      cx.fillStyle = col; cx.fill();
    }
  }

  // COLD particle — rotating square
  class ColdParticle {
    constructor() { this.reset(); }
    reset() {
      const u = plates[NP] - plates[0];
      this.x   = plates[0] + Math.random() * u;
      this.spd = 0.5 + Math.random() * 0.75;
      this.wo  = Math.random() * Math.PI * 2;
      this.ws  = 0.011 + Math.random() * 0.016;
      this.lb  = 0.1  + Math.random() * 0.8;
      this.wa  = 2    + Math.random() * 5;
      this.sz  = 2.5  + Math.random() * 1.6;
      this.rot = Math.random() * Math.PI;
      this.rs  = (Math.random()-0.5) * 0.013;
      this.al  = 0.8  + Math.random() * 0.2;
    }
    get y() {
      const ch = H/2 - 6;
      return H/2 + 6 + this.lb*(ch-12) + Math.sin(this.wo)*this.wa;
    }
    update() {
      this.wo += this.ws; this.rot += this.rs; this.x -= this.spd;
      if (this.x < plates[0]-10) this.x = plates[NP]+10;
    }
    draw() {
      const c = coldCol(this.x);
      const col = `rgba(${c.r},${c.g},${c.b},${this.al})`;
      cx.save();
      cx.translate(this.x, this.y); cx.rotate(this.rot);
      const s = this.sz;
      cx.strokeStyle = col; cx.lineWidth = 1.4;
      cx.strokeRect(-s,-s,s*2,s*2);
      cx.fillStyle = col;
      cx.fillRect(-s*0.36,-s*0.36,s*0.72,s*0.72);
      cx.restore();
    }
  }

  // HEAT particle — bright white-yellow triangle crossing the divider wall
  class HeatParticle {
    constructor() { this.reset(); }
    reset() {
      const pi = 1 + Math.floor(Math.random()*(NP-1));
      this.px   = plates[pi] + (Math.random()-0.5)*5;
      this.dn   = Math.random() < 0.65;
      const hotZone  = () => 10 + Math.random()*(H/2 - 20);
      const coldZone = () => H/2+10 + Math.random()*(H/2 - 20);
      this.sy   = this.dn ? hotZone()  : coldZone();
      this.ey   = this.dn ? coldZone() : hotZone();
      this.prog = Math.random();
      this.spd  = 0.003 + Math.random()*0.004;
      this.sz   = 1.5   + Math.random()*1.0;
      this.wx   = (Math.random()-0.5)*8;
      this.al   = 0;
    }
    eio(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
    update() {
      this.prog += this.spd;
      const e  = this.eio(Math.min(this.prog,1));
      this.cy  = this.sy + (this.ey-this.sy)*e;
      this.cx2 = this.px + this.wx*Math.sin(this.prog*Math.PI);
      this.al  = Math.sin(Math.min(this.prog,1)*Math.PI)*0.95;
      if (this.prog >= 1) this.reset();
    }
    draw() {
      if (this.al < 0.02) return;
      const s = this.sz;
      // White-yellow — unmistakably energy, not fluid
      const col  = `rgba(255,235,100,${this.al})`;
      const glow = `rgba(255,235,100,${this.al*0.18})`;
      cx.save(); cx.translate(this.cx2, this.cy);
      if (this.dn) cx.rotate(0); else cx.rotate(Math.PI);
      // halo
      cx.beginPath(); cx.arc(0,0,s*2,0,Math.PI*2);
      cx.fillStyle = glow; cx.fill();
      // triangle
      cx.beginPath();
      cx.moveTo(0,-s); cx.lineTo(s*0.9,s*0.65); cx.lineTo(-s*0.9,s*0.65);
      cx.closePath();
      cx.strokeStyle = col; cx.lineWidth = 1; cx.stroke();
      // bright core
      cx.beginPath(); cx.arc(0,0,s*0.3,0,Math.PI*2);
      cx.fillStyle = col; cx.fill();
      cx.restore();
    }
  }

  // ── BACKGROUND ──────────────────────────────────────
  function drawBg() {
    const mid = H/2;

    // Hot channel: vivid warm red-orange gradient left→right
    const hg = cx.createLinearGradient(0,0,W,0);
    hg.addColorStop(0,   '#3d0800');  // deep red at hot entry
    hg.addColorStop(0.5, '#280608');
    hg.addColorStop(1,   '#111520');  // dark blue-grey at cooled exit
    cx.fillStyle = hg; cx.fillRect(0,0,W,mid);

    // Cold channel: vivid ice blue right, warm amber left
    const cg = cx.createLinearGradient(0,0,W,0);
    cg.addColorStop(0,   '#1e0e00');  // warm amber-dark at heated exit
    cg.addColorStop(0.5, '#0a0e1e');
    cg.addColorStop(1,   '#001535');  // deep ice blue at cold entry
    cx.fillStyle = cg; cx.fillRect(0,mid,W,mid);

    // Colour wash per column — makes gradient more vivid between plates
    for (let i=0; i<NP; i++) {
      const x0=plates[i], x1=plates[i+1], t=i/NP;
      const [hr,hg2,hb] = lerp(t, 180,30,5,   22,28,55);
      const [cr,cg2,cb] = lerp(t, 130,50,5,   5,40,150);
      cx.fillStyle=`rgba(${hr},${hg2},${hb},0.35)`; cx.fillRect(x0,0,x1-x0,mid);
      cx.fillStyle=`rgba(${cr},${cg2},${cb},0.35)`; cx.fillRect(x0,mid,x1-x0,mid);
    }
  }

  // ── PLATES (vertical) — look like actual metal plates ──
  function drawPlates() {
    plates.forEach(px => {
      // Wide metallic sheen — 3 layers
      // 1. Outer glow — wide, very faint
      cx.beginPath(); cx.moveTo(px,0); cx.lineTo(px,H);
      cx.strokeStyle = 'rgba(210,230,255,0.04)';
      cx.lineWidth = 12; cx.stroke();

      // 2. Body of plate — steel grey, solid
      cx.beginPath(); cx.moveTo(px,0); cx.lineTo(px,H);
      cx.strokeStyle = 'rgba(180,200,230,0.55)';
      cx.lineWidth = 3; cx.stroke();

      // 3. Highlight edge — bright thin line on one side (light source from left)
      cx.beginPath(); cx.moveTo(px-0.5,0); cx.lineTo(px-0.5,H);
      cx.strokeStyle = 'rgba(240,248,255,0.7)';
      cx.lineWidth = 0.8; cx.stroke();

      // 4. Shadow edge — darker on right side
      cx.beginPath(); cx.moveTo(px+1.5,0); cx.lineTo(px+1.5,H);
      cx.strokeStyle = 'rgba(0,0,0,0.25)';
      cx.lineWidth = 1; cx.stroke();
    });
  }

  // ── DIVIDER WALL (horizontal) — thick solid separator ──
  function drawDivider() {
    const mid = H/2;
    const WALL = 6; // wall thickness in px

    // Fill the wall zone
    cx.fillStyle = '#1a2540';
    cx.fillRect(0, mid - WALL/2, W, WALL);

    // Top edge highlight — warm (hot side above)
    cx.beginPath(); cx.moveTo(0, mid-WALL/2); cx.lineTo(W, mid-WALL/2);
    cx.strokeStyle = 'rgba(255,120,60,0.5)';
    cx.lineWidth = 1.5; cx.stroke();

    // Bottom edge highlight — cool (cold side below)
    cx.beginPath(); cx.moveTo(0, mid+WALL/2); cx.lineTo(W, mid+WALL/2);
    cx.strokeStyle = 'rgba(60,160,255,0.5)';
    cx.lineWidth = 1.5; cx.stroke();

    // Centre line — bright metallic
    cx.beginPath(); cx.moveTo(0, mid); cx.lineTo(W, mid);
    cx.strokeStyle = 'rgba(220,235,255,0.8)';
    cx.lineWidth = 0.8; cx.stroke();
  }

  function init() {
    hotP  = Array.from({length:38}, () => new HotParticle());
    coldP = Array.from({length:38}, () => new ColdParticle());
    xP    = Array.from({length:24}, () => new HeatParticle());
  }

  function frame() {
    requestAnimationFrame(frame);
    drawBg();
    drawPlates();
    drawDivider();
    xP.forEach(p    => { p.update(); p.draw(); });
    hotP.forEach(p  => { p.update(); p.draw(); });
    coldP.forEach(p => { p.update(); p.draw(); });
  }

  resize(); init(); frame();
  window.addEventListener('resize', () => { resize(); init(); });
}