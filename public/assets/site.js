(()=>{
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const previous7=[110,103,108,99,95,93,92],previous30=[680,710,735,685];
  const days=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],weeks=['Dias 1–7','8–14','15–21','22–30'];
  const scenarios={
    drop:{
      '7':{sessions:'560',sessionsDiff:'↓ 20,0%',ctr:'3,0%',ctrDiff:'↓ 2,0 p.p.',engagement:'40%',engagementDiff:'↓ 20 p.p.',labels:days,current:[88,86,74,80,77,78,77],previous:previous7,before:'700',ctrBefore:'5,0%',engagementBefore:'60%',direction:'drop',desc:'As visitas ficaram 20% abaixo do período anterior. É importante investigar os canais e páginas antes de apontar uma causa.'},
      '30':{sessions:'2.470',sessionsDiff:'↓ 12,1%',ctr:'3,6%',ctrDiff:'↓ 0,8 p.p.',engagement:'44%',engagementDiff:'↓ 8 p.p.',labels:weeks,current:[620,580,640,630],previous:previous30,before:'2.810',ctrBefore:'4,4%',engagementBefore:'52%',direction:'drop',desc:'As visitas ficaram aproximadamente 12,1% abaixo do período anterior. A variação precisa de investigação antes de qualquer conclusão.'}
    },
    growth:{
      '7':{sessions:'840',sessionsDiff:'↑ 20,0%',ctr:'6,0%',ctrDiff:'↑ 1,0 p.p.',engagement:'65%',engagementDiff:'↑ 5 p.p.',labels:days,current:[100,110,120,125,130,135,120],previous:previous7,before:'700',ctrBefore:'5,0%',engagementBefore:'60%',direction:'gain',desc:'As visitas cresceram 20% no exemplo. O próximo passo é identificar onde ocorreu o crescimento e verificar sua continuidade, sem atribuí-lo automaticamente a uma ação.'},
      '30':{sessions:'3.300',sessionsDiff:'↑ 17,4%',ctr:'5,2%',ctrDiff:'↑ 0,8 p.p.',engagement:'62%',engagementDiff:'↑ 10 p.p.',labels:weeks,current:[750,800,850,900],previous:previous30,before:'2.810',ctrBefore:'4,4%',engagementBefore:'52%',direction:'gain',desc:'O exemplo mostra aumento de aproximadamente 17,4% nas visitas. Compare os canais e as páginas para entender a evolução; esses números não comprovam uma causa nem um ganho financeiro.'}
    },
    insufficient:{'7':{sessions:'180',sessionsDiff:'Sem comparação',ctr:'—',ctrDiff:'Não disponível',engagement:'40%',engagementDiff:'Sem comparação',labels:days.slice(0,5),current:[30,36,40,38,36],previous:[],direction:'neutral',desc:'Há apenas 5 dias fictícios de visitas e engajamento, sem dados de busca. Esse histórico não permite comparar dois períodos completos de 7 dias. A análise de tendência e as recomendações ficam suspensas.'}}
  };
  let selectedScenario='drop',selectedPeriod='7';
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
  function element(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
  function recommendations(data){
    if(selectedScenario==='insufficient')return [];
    const growing=selectedScenario==='growth';
    return [
      {title:growing?'Entender as fontes do crescimento':'Investigar a queda de visitas',evidence:`Sessões: ${data.before} → ${data.sessions} (${data.sessionsDiff}).`,action:growing?'Comparar canais e páginas de entrada para localizar o crescimento e verificar se ele se mantém.':'Comparar canais e páginas de entrada para localizar a redução antes de sugerir uma mudança.',metric:'Sessões',priority:growing?'Média':'Alta'},
      {title:growing?'Examinar a evolução na busca':'Verificar cliques nas buscas',evidence:`CTR ilustrativo: ${data.ctrBefore} → ${data.ctr}.`,action:'Analisar cliques, impressões, consultas e páginas em conjunto antes de concluir o que motivou a variação.',metric:'Cliques e CTR',priority:growing?'Média':'Alta'},
      {title:'Acompanhar o engajamento',evidence:`Engajamento ilustrativo: ${data.engagementBefore} → ${data.engagement}.`,action:'Comparar páginas e dispositivos e acompanhar a próxima janela completa antes de propor alterações.',metric:'Engajamento',priority:'Média'}
    ];
  }
  function renderRecommendations(data){
    const items=recommendations(data),list=$('#priority-list'),opportunities=$('#opportunity-list');list.replaceChildren();opportunities.replaceChildren();
    $('#priority-count').textContent=items.length?`${items.length} pontos para revisar`:'Análise suspensa';
    $('#opportunity-context').textContent=items.length?`Exemplo fictício de ${selectedPeriod} dias: evidências, análise e acompanhamento.`:'Exemplo fictício com apenas 5 dias de histórico.';
    if(!items.length){
      const empty=element('div',undefined,'empty-history');empty.append(element('b','Ainda não há base para recomendar.'),element('p','Aguardar 14 dias completos e validar as fontes antes de comparar períodos. Dados ausentes não são tratados como zero.'));
      list.append(empty);opportunities.append(empty.cloneNode(true));return;
    }
    items.forEach((item,index)=>{
      const priority=element('div',undefined,'priority'),copy=element('div');copy.append(element('b',item.title),element('p',item.action),element('span',`● ${item.priority} prioridade`,'severity'+(item.priority==='Média'?' medium':'')));
      priority.append(element('span',String(index+1).padStart(2,'0'),'priority-mark'),copy);list.append(priority);
      const card=element('div',undefined,'op-card'),head=element('div',undefined,'op-header');head.append(element('strong',`${String(index+1).padStart(2,'0')} · ${item.title}`),element('span',`● ${item.priority}`,'severity'+(item.priority==='Média'?' medium':'')));
      const evidence=element('p');evidence.append(element('b','Evidência: '),document.createTextNode(item.evidence));
      const action=element('p');action.append(element('b','Próxima análise: '),document.createTextNode(item.action));
      const foot=element('div',undefined,'op-bottom');foot.append(element('span',`Indicador: ${item.metric}`),element('span','Reavaliar no próximo período completo'),element('span','Aguardando revisão','status'));
      card.append(head,evidence,action,foot);opportunities.append(card);
    });
  }
  function setPeriod(period){
    if(selectedScenario==='insufficient')period='7';
    selectedPeriod=period;const data=scenarios[selectedScenario][period];if(!data)return;
    for(const key of ['sessions','sessionsDiff','ctr','ctrDiff','engagement','engagementDiff']){const target=$('#'+key.replace(/[A-Z]/g,x=>'-'+x.toLowerCase()));target.textContent=data[key];if(key.endsWith('Diff'))target.className=data.direction;}
    const partial=selectedScenario==='insufficient';
    $$('.metric-foot').forEach(foot=>{for(const node of foot.childNodes)if(node.nodeType===3)node.textContent=partial?' neste exemplo':' vs. anterior';});
    $('#chart-period').textContent=partial?'5 dias disponíveis · sem comparação':`Comparação de ${period} dias`;
    $('#insight-copy').textContent=data.desc;
    $('#scenario-summary').textContent=partial?'DADOS FICTÍCIOS · Histórico insuficiente. Tendência e recomendações suspensas.':`DADOS FICTÍCIOS · ${selectedScenario==='growth'?'Crescimento':'Queda'} · comparação de dois períodos de ${period} dias.`;
    $('#scenario-summary').classList.toggle('partial',partial);
    $('#visits-chart').setAttribute('aria-label',partial?'Visitas fictícias em 5 dias, sem período anterior':`Visitas fictícias em dois períodos de ${period} dias`);
    $('#chart-prev').setAttribute('visibility',partial?'hidden':'visible');
    $('.swatch.old').parentElement.hidden=partial;
    $$('[data-period]').forEach(button=>{const active=button.dataset.period===period;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));button.disabled=partial;});
    chart(data);renderRecommendations(data);
  }
  const titles={overview:'Visão geral',opportunities:'Oportunidades',reports:'Relatórios',connections:'Integrações'};
  function openView(view){if(!titles[view])return;$$('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==view);$$('[data-view]').forEach(button=>{const active=button.dataset.view===view;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});$('#crumb').textContent=titles[view];}
  $$('[data-view]').forEach(button=>button.addEventListener('click',()=>openView(button.dataset.view)));
  $$('[data-period]').forEach(button=>button.addEventListener('click',()=>setPeriod(button.dataset.period)));
  $('#demo-scenario').addEventListener('change',event=>{selectedScenario=event.target.value;if(!scenarios[selectedScenario])selectedScenario='drop';setPeriod(selectedPeriod);});
  $('#open-opportunities').addEventListener('click',()=>openView('opportunities'));
  $$('.question button').forEach(button=>button.addEventListener('click',()=>{const wasOpen=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!wasOpen));$('#'+button.getAttribute('aria-controls')).hidden=wasOpen;$('.plus',button).textContent=wasOpen?'+':'−';}));
  setPeriod('7');
})();
