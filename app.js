
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded",()=>{
  // Age gate
  const modal=$("#ageModal");
  let confirmed=false;
  try{confirmed=sessionStorage.getItem("promoSaint21")==="yes"}catch(e){}
  if(modal){
    modal.hidden=confirmed;
    document.body.style.overflow=confirmed?"":"hidden";
  }
  $("#ageYes")?.addEventListener("click",()=>{
    try{sessionStorage.setItem("promoSaint21","yes")}catch(e){}
    if(modal) modal.hidden=true;
    document.body.style.overflow="";
  });
  $("#ageNo")?.addEventListener("click",()=>{
    document.body.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;background:#09090b;color:#fff;font-family:system-ui;text-align:center;padding:24px"><div><div style="width:80px;height:80px;border-radius:24px;display:grid;place-items:center;margin:0 auto 20px;background:linear-gradient(135deg,#7c5cff,#ff3158);font-weight:900;font-size:22px">21+</div><h1>Доступ обмежено</h1><p style="color:#7f7f8c">Сайт призначений лише для користувачів віком від 21 року.</p></div></main>';
  });

  // Smooth page transitions
  $$(".page-link").forEach(a=>a.addEventListener("click",e=>{
    const href=a.getAttribute("href");
    if(!href || href.startsWith("#") || e.metaKey || e.ctrlKey) return;
    if(document.startViewTransition) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(()=>location.href=href,260);
  }));

  // Reveal cards. Important: cards are also visible without JS via CSS fallback below.
  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.04});
    $$(".reveal").forEach(el=>io.observe(el));
  }else{
    $$(".reveal").forEach(el=>el.classList.add("show"));
  }

  // Search + filters
  const search=$("#search");
  const cards=$$(".offer-card");
  const filters=$$(".filter");
  const empty=$("#emptyState");
  let activeFilter="all";

  const apply=()=>{
    const q=(search?.value||"").trim().toLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const name=(card.dataset.name||"").toLowerCase();
      const badge=(card.dataset.badge||"").toUpperCase();
      const ok=name.includes(q)&&(activeFilter==="all"||badge===activeFilter);
      card.style.display=ok?"":"none";
      if(ok) visible++;
    });
    if(empty) empty.hidden=visible!==0;
  };

  search?.addEventListener("input",apply);
  filters.forEach(btn=>btn.addEventListener("click",()=>{
    filters.forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    activeFilter=btn.dataset.filter||"all";
    apply();
  }));

  // Copy promo codes
  document.addEventListener("click",async e=>{
    const btn=e.target.closest(".copy-casino-code,.copy-promo");
    if(!btn) return;
    const code=btn.dataset.code||"";
    if(!code) return;
    try{
      await navigator.clipboard.writeText(code);
    }catch(err){
      const ta=document.createElement("textarea");
      ta.value=code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const old=btn.textContent;
    btn.textContent="Скопійовано ✓";
    btn.classList.add("copied");
    setTimeout(()=>{
      btn.textContent=old;
      btn.classList.remove("copied");
    },1300);
  });
});
