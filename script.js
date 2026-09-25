const menu=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav-links");
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu?.setAttribute("aria-expanded","false")}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add("visible");
    observer.unobserve(e.target);
  }
}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* Cinematic transitions between page sections */
const cinematicSections = document.querySelectorAll("main > section");
cinematicSections.forEach(section => section.classList.add("cinematic-section"));

const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
    }
  });
},{threshold:.16, rootMargin:"-8% 0px -8% 0px"});

cinematicSections.forEach(section => sectionObserver.observe(section));

document.getElementById("year").textContent=new Date().getFullYear();

const form=document.getElementById("budgetForm");
form?.addEventListener("submit",e=>{
  e.preventDefault();
  const d=new FormData(form);
  const text=`Olá, Principado Produções! 👋

Meu nome é ${d.get("name")}.
WhatsApp: ${d.get("phone")}

Tipo de evento: ${d.get("event")}
Data prevista: ${d.get("date")||"A definir"}
Cidade/local: ${d.get("location")||"A definir"}
Faixa de investimento: ${d.get("budget")||"A conversar"}

Sobre o evento:
${d.get("message")||"Gostaria de conversar sobre o projeto."}

Quero saber como a Principado pode produzir essa experiência.`;
  window.open(`https://wa.me/5521975542783?text=${encodeURIComponent(text)}`,"_blank","noopener");
});

document.addEventListener("mousemove",e=>{
  const glow=document.querySelector(".cursor-glow");
  if(window.innerWidth>900){glow.style.opacity=".025";glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}
});


/* Keep the fixed brand readable over dark and light sections. */
const header=document.querySelector(".header");
const darkAreaSelector=".hero, .services, .no-portfolio, .footer";
const updateHeaderContrast=()=>{
  if(!header) return;
  const x=Math.min(18,window.innerWidth-1);
  const y=Math.min(104,window.innerHeight-1);
  const target=document.elementFromPoint(x,y)?.closest(darkAreaSelector);
  header.classList.toggle("on-dark",!!target);
};
updateHeaderContrast();
window.addEventListener("scroll",updateHeaderContrast,{passive:true});
window.addEventListener("resize",updateHeaderContrast);


/* ===== PREMIUM INTERACTION LAYER ===== */
const prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Scroll progress + subtle direction-aware header */
const progress=document.createElement("div");
progress.className="scroll-progress";
progress.innerHTML="<span></span>";
document.body.prepend(progress);
const progressBar=progress.querySelector("span");
let lastScrollY=window.scrollY;
let ticking=false;
const updateScrollUI=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const ratio=max>0?window.scrollY/max:0;
  progressBar.style.transform=`scaleX(${ratio})`;
  if(header){
    header.classList.toggle("is-scrolled",window.scrollY>55);
    if(!prefersReducedMotion){
      const delta=window.scrollY-lastScrollY;
      if(window.scrollY>120 && delta>7) header.classList.add("is-hidden");
      if(delta<-7) header.classList.remove("is-hidden");
      if(window.scrollY<=55) header.classList.remove("is-hidden");
    }
  }
  lastScrollY=window.scrollY;
  ticking=false;
};
window.addEventListener("scroll",()=>{
  if(!ticking){requestAnimationFrame(updateScrollUI);ticking=true}
},{passive:true});
updateScrollUI();

/* Page vignette */
const vignette=document.createElement("div");
vignette.className="page-vignette";
document.body.appendChild(vignette);

/* Magnetic CTAs — restrained so the interface stays premium. */
if(!prefersReducedMotion){
  document.querySelectorAll(".button,.nav-button").forEach(el=>{
    el.addEventListener("pointermove",e=>{
      if(e.pointerType==="touch") return;
      const r=el.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))*0.12;
      const dy=(e.clientY-(r.top+r.height/2))*0.12;
      el.style.transform=`translate3d(${dx}px,${dy}px,0)`;
    });
    el.addEventListener("pointerleave",()=>{el.style.transform=""});
  });
}

/* Hero card 3D parallax */
const heroCard=document.querySelector(".hero-card");
if(heroCard && !prefersReducedMotion && window.matchMedia("(pointer:fine)").matches){
  heroCard.addEventListener("pointermove",e=>{
    const r=heroCard.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    heroCard.style.transform=`perspective(1100px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateZ(0)`;
    heroCard.querySelectorAll(".orbit").forEach((o,index)=>{
      o.style.transform=`translate3d(${x*(index+1)*8}px,${y*(index+1)*8}px,0)`;
    });
  });
  heroCard.addEventListener("pointerleave",()=>{
    heroCard.style.transform="";
    heroCard.querySelectorAll(".orbit").forEach(o=>o.style.transform="");
  });
}

/* Stagger reveals inside sections */
document.querySelectorAll(".event-grid,.services-list,.process-grid,.experience-points").forEach(group=>{
  [...group.children].forEach((child,index)=>child.style.setProperty("--reveal-delay",`${Math.min(index*.07,.28)}s`));
});

/* Active navigation state */
const navAnchors=[...document.querySelectorAll('.nav-links a[href^="#"]')].filter(a=>a.getAttribute("href")!=="#orcamento");
const navSections=navAnchors.map(a=>({a,section:document.querySelector(a.getAttribute("href"))})).filter(x=>x.section);
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navAnchors.forEach(a=>a.classList.remove("active"));
      navSections.find(x=>x.section===entry.target)?.a.classList.add("active");
    }
  });
},{threshold:.15,rootMargin:"-35% 0px -55% 0px"});
navSections.forEach(x=>navObserver.observe(x.section));

/* Cursor glow with smooth interpolation */
if(!prefersReducedMotion && window.matchMedia("(pointer:fine)").matches){
  const glow=document.querySelector(".cursor-glow");
  let gx=0,gy=0,tx=0,ty=0;
  window.addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});
  const animateGlow=()=>{
    gx+=(tx-gx)*.12; gy+=(ty-gy)*.12;
    if(glow){glow.style.left=gx+"px";glow.style.top=gy+"px";glow.style.opacity=".035"}
    requestAnimationFrame(animateGlow);
  };
  animateGlow();
}

/* Subtle hero parallax on scroll */
const hero=document.querySelector(".hero");
if(hero && !prefersReducedMotion){
  window.addEventListener("scroll",()=>{
    const y=Math.min(window.scrollY,hero.offsetHeight);
    hero.style.setProperty("--hero-shift",`${y*.08}px`);
  },{passive:true});
}


/* Experience signature: gentle spotlight follows the pointer. */
const experienceBox=document.querySelector(".experience-box");
if(experienceBox && !prefersReducedMotion && window.matchMedia("(pointer:fine)").matches){
  experienceBox.addEventListener("pointermove",e=>{
    const r=experienceBox.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    experienceBox.style.background=`radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.065), transparent 32%), #050505`;
  });
  experienceBox.addEventListener("pointerleave",()=>{experienceBox.style.background="#050505"});
}
