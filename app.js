
const $=(s,c=document)=>c.querySelector(s); const $$=(s,c=document)=>[...c.querySelectorAll(s)];
document.addEventListener("DOMContentLoaded",()=>{
  // age gate
  const modal=$("#ageModal"); let confirmed=false;
  try{confirmed=sessionStorage.getItem("promoSaint21")==="yes"}catch(e){}
  if(modal){modal.hidden=confirmed;document.body.style.overflow=confirmed?"":"hidden"}
  $("#ageYes")?.addEventListener("click",()=>{try{sessionStorage.setItem("promoSaint21","yes")}catch(e){};if(modal)modal.hidden=true;document.body.style.overflow=""});
  $("#ageNo")?.addEventListener("click",()=>{document.body.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;background:#09090b;color:#fff;font-family:system-ui;text-align:center;padding:24px"><div><div style="width:80px;height:80px;border-radius:24px;display:grid;place-items:center;margin:0 auto 20px;background:linear-gradient(135deg,#7c5cff,#ff3158);font-weight:900;font-size:22px">21+</div><h1>Доступ обмежено</h1><p style="color:#7f7f8c">Сайт призначений лише для користувачів віком від 21 року.</p></div></main>'});

  // smooth cross-page transition fallback
  $$(".page-link").forEach(a=>a.addEventListener("click",e=>{
    const href=a.getAttribute("href");
    if(!href || href.startsWith("#") || e.metaKey || e.ctrlKey) return;
    if(document.startViewTransition) return; // native cross-document transition handles it
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(()=>location.href=href,380);
  }));

  // reveal
  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.06});
    $$(".reveal").forEach(el=>io.observe(el));
  } else $$(".reveal").forEach(el=>el.classList.add("show"));

  // search + filters on bonuses page
  const search=$("#search"), cards=$$(".offer-card"), filters=$$(".filter"), empty=$("#emptyState");
  let activeFilter="all";
  const apply=()=>{
    const q=(search?.value||"").trim().toLowerCase(); let visible=0;
    cards.forEach(card=>{
      const name=card.dataset.name||"", badge=(card.dataset.badge||"").toUpperCase();
      const ok=name.includes(q)&&(activeFilter==="all"||badge===activeFilter);
      card.style.display=ok?"":"none"; if(ok)visible++;
    });
    if(empty) empty.hidden=visible!==0;
  };
  search?.addEventListener("input",apply);
  filters.forEach(btn=>btn.addEventListener("click",()=>{
    filters.forEach(x=>x.classList.remove("active")); btn.classList.add("active");
    activeFilter=btn.dataset.filter||"all"; apply();
  }));
});
