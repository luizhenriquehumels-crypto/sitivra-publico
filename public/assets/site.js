(()=>{
    'use strict';
    const $=(selector,root=document)=>root.querySelector(selector);
    const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
    const demo={
      '7':{sessions:'560',sessionsDiff:'↓ 20,0%',ctr:'3,0%',ctrDiff:'↓ 2,0 p.p.',engagement:'40%',engagementDiff:'↓ 20 p.p.',labels:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],current:[88,86,74,80,77,78,77],previous:[110,103,108,99,95,93,92],desc:'As visitas ficaram 20% abaixo do período anterior. É importante investigar os canais e páginas antes de apontar uma causa.',chart:'Comparação de 7 dias'},
      '30':{sessions:'2.470',sessionsDiff:'↓ 12,1%',ctr:'3,6%',ctrDiff:'↓ 0,8 p.p.',engagement:'44%',engagementDiff:'↓ 8 p.p.',labels:['Sem 1','Sem 2','Sem 3','Sem 4'],current:[620,580,640,630],previous:[680,710,735,685],desc:'No período demonstrativo de 30 dias, as visitas ficaram aproximadamente 12,1% abaixo da comparação. A variação precisa de investigação antes de qualquer conclusão.',chart:'Comparação de 30 dias'}
    };
    function chart(data){
      const all=[...data.current,...data.previous], ymax=Math.ceil(Math.max(...all)*1.22/20)*20, xmin=30,xmax=592,top=19,bot=210;
      const coord=(v,i,arr)=>({x:xmin+(xmax-xmin)*(i/Math.max(1,arr.length-1)),y:bot-(v/ymax)*(bot-top)});
      const pts=(arr)=>arr.map((v,i)=>coord(v,i,arr));
      const path=(arr)=>pts(arr).map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      $('#chart-prev').setAttribute('d',path(data.previous));$('#chart-cur').setAttribute('d',path(data.current));
      $('#chart-area').setAttribute('d',path(data.current)+` L${xmax},${bot} L${xmin},${bot} Z`);
      const svgNS='http://www.w3.org/2000/svg';let grid=$('#chart-grid'),labels=$('#chart-labels');grid.replaceChildren();labels.replaceChildren();
      for(let i=0;i<=4;i++){
        let y=top+(bot-top)*(i/4),line=document.createElementNS(svgNS,'line');line.setAttribute('x1',String(xmin));line.setAttribute('x2',String(xmax));line.setAttribute('y1',String(y));line.setAttribute('y2',String(y));line.setAttribute('stroke','#edf2f7');line.setAttribute('stroke-width','1');grid.appendChild(line);
        const tx=document.createElementNS(svgNS,'text');tx.textContent=String(Math.round(ymax*(1-i/4)));tx.setAttribute('x','2');tx.setAttribute('y',String(y+4));tx.setAttribute('fill','#9eacbb');tx.setAttribute('font-size','10');labels.appendChild(tx);
      }
      for(let i=0;i<data.labels.length;i++){const p=coord(0,i,data.labels),tx=document.createElementNS(svgNS,'text');tx.textContent=data.labels[i];tx.setAttribute('x',String(p.x));tx.setAttribute('y','238');tx.setAttribute('text-anchor','middle');tx.setAttribute('fill','#9eacbb');tx.setAttribute('font-size','11');labels.appendChild(tx)}
    }
    function setPeriod(p){let d=demo[p];if(!d)return;for(const k of ['sessions','sessionsDiff','ctr','ctrDiff','engagement','engagementDiff']){$('#'+k.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())).textContent=d[k]}$('#chart-period').textContent=d.chart;$('#insight-copy').textContent=d.desc;chart(d);$$('[data-period]').forEach(b=>{const sel=b.dataset.period===p;b.classList.toggle('active',sel);b.setAttribute('aria-pressed',String(sel))})}
    const titles={overview:'Visão geral',opportunities:'Oportunidades',reports:'Relatórios',connections:'Integrações'};
    function openView(view){if(!titles[view])return;$$('[data-panel]').forEach(s=>s.hidden=s.dataset.panel!==view);$$('[data-view]').forEach(b=>{const sel=b.dataset.view===view;b.classList.toggle('active',sel);if(sel)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});$('#crumb').textContent=titles[view]}
    $$('[data-view]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view)));
    $$('[data-period]').forEach(b=>b.addEventListener('click',()=>setPeriod(b.dataset.period)));
    $('#open-opportunities').addEventListener('click',()=>openView('opportunities'));
    $$('.question button').forEach(btn=>btn.addEventListener('click',()=>{const wasOpen=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!wasOpen));$('#'+btn.getAttribute('aria-controls')).hidden=wasOpen;$('.plus',btn).textContent=wasOpen?'+':'−'}));
    setPeriod('7');
  })();
