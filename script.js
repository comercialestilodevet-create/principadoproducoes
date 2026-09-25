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
