function login(){

  let name = document.getElementById("name").value;
  let pass = document.getElementById("pass").value;

  // غير القيم دي براحتك 👇
  if(name === "كيرلس" && pass === "2102007"){

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    let music = document.getElementById("bgMusic");
    setTimeout(() => {
        music.play();   
    }, 2000);

  }else{
    document.getElementById("error").innerText = "يلهوييييييييي 😢";
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let heartPoints = [];
let flying = [];
let sparks = [];
let time = 0;

let img = new Image();

img.src = "photo.jpeg"; // جرب ده الأول

img.onload = function(){
  console.log("image loaded ✅");
};

// شكل القلب
for (let t = 0; t < Math.PI * 2; t += 0.05) {

  let x = 16 * Math.pow(Math.sin(t), 3);
  let y =
    13 * Math.cos(t)
    - 5 * Math.cos(2 * t)
    - 2 * Math.cos(3 * t)
    - Math.cos(4 * t);

  heartPoints.push({
    x: canvas.width/2 + x*12,
    y: canvas.height/2 - y*12,
    filled:false
  });
}

// رسم القلب + Glow
function drawHeart(){

  heartPoints.forEach(p => {

    ctx.beginPath();

    ctx.fillStyle = p.filled ? "#ff4d88" : "rgba(255,255,255,0.1)";
    ctx.shadowColor = "#ff4d88";
    ctx.shadowBlur = 20;

    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fill();
})};

  // النص جوا القلب
  ctx.shadowBlur = 0;
  ctx.fillStyle="white";
  ctx.font="45px Arial";
  ctx.textAlign="center";
  // رسم الصورة جوه القلب
function drawImageInsideHeart(){

  if(!img.complete) return;

  ctx.save();

  ctx.beginPath();

  // رسم شكل قلب (نفس معادلة القلب)
  for (let t = 0; t < Math.PI * 2; t += 0.01) {

    let x = 16 * Math.pow(Math.sin(t), 3);
    let y =
      13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t);

    x = canvas.width/2 + x * 10;
    y = canvas.height/2 - y * 10;

    if(t === 0){
      ctx.moveTo(x, y);
    }else{
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.clip(); // ✨ هنا السحر

  // رسم الصورة (تغطي القلب كله)
  ctx.drawImage(img, 100, 100, 300, 300);

  ctx.restore();
}

// إنشاء قلب من القطط
function createHeart(){

  let fromLeft = Math.random()>0.5;

  flying.push({
    x: fromLeft ? 80 : canvas.width - 80,
    y: canvas.height - 100,
    target: heartPoints[Math.floor(Math.random()*heartPoints.length)],
    trail: []
  });
}

// رسم القلوب + Trails
function drawFlying(){

  flying.forEach((h,i)=>{

    let dx = h.target.x - h.x;
    let dy = h.target.y - h.y;
    let dist = Math.sqrt(dx*dx+dy*dy);

    h.x += dx/dist*3;
    h.y += dy/dist*3;

    // Trail
    h.trail.push({x:h.x,y:h.y});
    if(h.trail.length>10) h.trail.shift();

    h.trail.forEach((t,j)=>{
      ctx.globalAlpha = j/10;
      ctx.fillStyle="#ff99bb";
      ctx.fillText("❤",t.x,t.y);
    });

    ctx.globalAlpha=1;
    ctx.fillText("❤",h.x,h.y);

    if(dist<5){
      h.target.filled=true;

      // Sparkles
      for(let s=0;s<6;s++){
        sparks.push({
          x:h.x,
          y:h.y,
          dx:(Math.random()-0.5)*4,
          dy:(Math.random()-0.5)*4,
          life:30
        });
      }

      flying.splice(i,1);
    }
  });
}

// Sparkles
function drawSparks(){

  sparks.forEach((s,i)=>{

    s.x+=s.dx;
    s.y+=s.dy;
    s.life--;

    ctx.fillStyle="white";
    ctx.fillRect(s.x,s.y,2,2);

    if(s.life<=0){
      sparks.splice(i,1);
    }
  });
}

// Animation
function animate(){

  ctx.clearRect(0,0,500,500);

  time += 0.05;

  drawHeart();
  drawFlying();
  drawSparks();
  drawImageInsideHeart();

  requestAnimationFrame(animate);
}

setInterval(createHeart,150);

animate();