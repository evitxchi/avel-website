import {
  Archive, CalendarDays, Check, CircleDot, Folder,
  Columns3, FileText, Inbox, LayoutDashboard, Mail, Maximize2, Menu, MessageCircle,
  MoreHorizontal, Orbit, Plane, Plug, Plus, Route, Search, Settings,
  Users, Workflow, X, createIcons,
} from "lucide"

createIcons({
  icons: { Archive, CalendarDays, Check, CircleDot, Columns3, FileText, Folder, Inbox, LayoutDashboard, Mail, Maximize2, Menu, MessageCircle, MoreHorizontal, Orbit, Plane, Plug, Plus, Route, Search, Settings, Users, Workflow, X },
  attrs: { "stroke-width": 1.7 },
})

const announcementDismiss=document.getElementById('announcement-dismiss');
announcementDismiss?.addEventListener('click',()=>{
  document.getElementById('avel-announcement')?.remove();
  document.documentElement.style.setProperty('--announcement-height','0px');
});

const setupStage=document.getElementById('setup-visual-body');
if(setupStage){
  const setupSvg=setupStage.querySelector('.setup-lines');
  const setupCore=document.getElementById('setup-core-node');
  const setupEdges=[
    {target:'setup-email-node',side:'left',color:'#4c7dff'},
    {target:'setup-fms-node',side:'right',color:'#14b8a6'},
    {target:'setup-add-node',side:'right',color:'#9b6bff'},
    {target:'setup-team-node',side:'down',color:'#f59e0b'},
  ];
  const svgNs='http://www.w3.org/2000/svg';
  const snapPoint=value=>Math.round(value*2)/2;
  let setupFrame=0;
  const drawSetupEdges=()=>{
    setupFrame=0;
    const frame=setupStage.getBoundingClientRect();
    const core=setupCore?.getBoundingClientRect();
    if(!setupSvg||!core||!frame.width||!frame.height)return;
    setupSvg.setAttribute('viewBox',`0 0 ${frame.width} ${frame.height}`);
    setupSvg.replaceChildren();
    const at=(x,y)=>({x:snapPoint(x-frame.left),y:snapPoint(y-frame.top)});
    const origins=new Map();
    setupEdges.forEach((edge,index)=>{
      const target=document.getElementById(edge.target)?.getBoundingClientRect();
      if(!target)return;
      const from=edge.side==='left'?at(core.left,core.top+core.height/2):edge.side==='right'?at(core.right,core.top+core.height/2):at(core.left+core.width/2,core.bottom);
      const to=edge.side==='left'?at(target.right,target.top+target.height/2):edge.side==='right'?at(target.left,target.top+target.height/2):at(target.left+target.width/2,target.top);
      const middle=edge.side==='down'?(from.y+to.y)/2:(from.x+to.x)/2;
      const d=edge.side==='down'?`M${from.x} ${from.y} C${from.x} ${middle} ${to.x} ${middle} ${to.x} ${to.y}`:`M${from.x} ${from.y} C${middle} ${from.y} ${middle} ${to.y} ${to.x} ${to.y}`;
      origins.set(edge.side,from);
      const group=document.createElementNS(svgNs,'g');
      group.setAttribute('class','setup-path');
      group.style.setProperty('--path-accent',edge.color);
      const base=document.createElementNS(svgNs,'path');
      base.setAttribute('class','setup-path-base');
      base.setAttribute('d',d);
      group.append(base);
      const pulse=document.createElementNS(svgNs,'path');
      pulse.setAttribute('class','setup-path-glint');
      pulse.setAttribute('d',d);
      pulse.setAttribute('pathLength','100');
      pulse.style.animationDelay=`${-index*.7}s`;
      group.append(pulse);
      const end=document.createElementNS(svgNs,'circle');
      end.setAttribute('class','setup-line-end');
      end.setAttribute('cx',String(to.x));
      end.setAttribute('cy',String(to.y));
      end.setAttribute('r','3.5');
      group.append(end);
      setupSvg.append(group);
    });
    origins.forEach(point=>{
      const origin=document.createElementNS(svgNs,'circle');
      origin.setAttribute('class','setup-line-origin');
      origin.setAttribute('cx',String(point.x));
      origin.setAttribute('cy',String(point.y));
      origin.setAttribute('r','3');
      setupSvg.append(origin);
    });
  };
  const scheduleSetupEdges=()=>{if(!setupFrame)setupFrame=requestAnimationFrame(drawSetupEdges)};
  if('ResizeObserver'in window){
    const setupObserver=new ResizeObserver(scheduleSetupEdges);
    setupObserver.observe(setupStage);
    if(setupCore)setupObserver.observe(setupCore);
    setupEdges.forEach(edge=>{const target=document.getElementById(edge.target);if(target)setupObserver.observe(target)});
  }
  window.addEventListener('resize',scheduleSetupEdges,{passive:true});
  scheduleSetupEdges();
}

document.querySelectorAll('.setup-mode-row').forEach(row=>{
  const options=[...row.querySelectorAll('button')];
  options.forEach(button=>button.addEventListener('click',()=>{
    options.forEach(option=>{
      const selected=option===button;
      option.classList.toggle('selected',selected);
      option.setAttribute('aria-pressed',String(selected));
    });
  }));
});


    const navItems=[...document.querySelectorAll('.nav-item')];
    navItems.forEach(item=>{const trigger=item.querySelector('.nav-trigger');trigger.addEventListener('click',()=>{const isOpen=item.classList.contains('is-open');navItems.forEach(other=>{other.classList.remove('is-open');other.querySelector('.nav-trigger').setAttribute('aria-expanded','false')});if(!isOpen){item.classList.add('is-open');trigger.setAttribute('aria-expanded','true')}})});
    document.addEventListener('click',event=>{if(!event.target.closest('.nav-item'))navItems.forEach(item=>{item.classList.remove('is-open');item.querySelector('.nav-trigger').setAttribute('aria-expanded','false')})});
    const menuToggle=document.querySelector('.mobile-menu-toggle');const mobileMenu=document.querySelector('.mobile-menu');menuToggle.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open))});
    document.querySelectorAll('.hero-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.hero-tab').forEach(item=>item.classList.remove('is-active'));tab.classList.add('is-active')}));
    document.querySelectorAll('.benefit-toggle').forEach(button=>button.addEventListener('click',()=>{const parent=button.closest('.benefit');const opening=!parent.classList.contains('is-open');document.querySelectorAll('.benefit').forEach(item=>{item.classList.remove('is-open');item.querySelector('.benefit-toggle').setAttribute('aria-expanded','false');item.querySelector('.benefit-sign').textContent='+'});if(opening){parent.classList.add('is-open');button.setAttribute('aria-expanded','true');button.querySelector('.benefit-sign').textContent='−'}}));
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('[data-reveal]').forEach(element=>revealObserver.observe(element));
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const heroAtmosphere=document.querySelector('.hero-atmosphere');let targetScroll=window.scrollY,softScroll=targetScroll,scrollFrame=0;window.addEventListener('scroll',()=>{targetScroll=window.scrollY;if(!scrollFrame&&!reducedMotion)scrollFrame=requestAnimationFrame(softenScroll)},{passive:true});function softenScroll(){softScroll+=(targetScroll-softScroll)*.075;heroAtmosphere.style.transform='translate3d(0,'+(-softScroll*.065)+'px,0)';if(Math.abs(targetScroll-softScroll)>.2)scrollFrame=requestAnimationFrame(softenScroll);else scrollFrame=0}
