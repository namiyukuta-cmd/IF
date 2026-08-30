(() => {
  'use strict';

  function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function decorate(){
    const quests=Array.isArray(window.DDQuests)?window.DDQuests:[];
    document.querySelectorAll('.quest-row[data-quest-id]').forEach(row=>{
      const q=quests.find(v=>v.id===row.dataset.questId);
      if(!q)return;
      const title=row.querySelector('.quest-title');
      if(!title||title.querySelector('.quest-level'))return;
      const parts=[];
      if(q.minLevel!=null&&q.maxLevel!=null)parts.push(`想定Lv.${q.minLevel}〜${q.maxLevel}`);
      else if(q.recommendedLevel!=null)parts.push(`想定Lv.${q.recommendedLevel}`);
      if(q.recommendedLevel!=null&&!(q.minLevel===q.recommendedLevel&&q.maxLevel===q.recommendedLevel))parts.push(`推奨Lv.${q.recommendedLevel}`);
      if(!parts.length)return;
      const small=document.createElement('small');
      small.className='quest-level';
      small.textContent=parts.join(' / ');
      title.appendChild(small);
    });
  }

  const style=document.createElement('style');
  style.textContent='.quest-level{display:block;margin-top:2px;font-size:10px!important;font-weight:800!important;color:#5f482f!important}';
  document.head.appendChild(style);

  document.addEventListener('click',event=>{
    if(event.target.closest?.('#questButton,.quest-row[data-quest-id]'))setTimeout(decorate,0);
  });
  const observer=new MutationObserver(decorate);
  const start=()=>{const root=document.getElementById('windowContent');if(root)observer.observe(root,{childList:true,subtree:true});decorate();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
