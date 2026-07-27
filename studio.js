(() => {
  const root = document.querySelector('[data-studio]');
  const q = (selector) => root.querySelector(selector);
  const qa = (selector) => [...root.querySelectorAll(selector)];
  const storageKey = 'trixlab-studio-builds-v3';
  const basePrices = {full:59900,side:39900,accent:24900};
  const materialPrices = {standard:0,chrome:30000,holographic:30000};
  const finishPrices = {gloss:0,matte:4900,sparkle:7900};
  const matsPrice = 18900;
  const products = {
    'spark-trixx-1up':{name:'Spark / Trixx 1UP',platform:'Spark / Trixx 1UP',image:'assets/apex-race-left.webp',mats:true},
    'spark-trixx-2up':{name:'Spark / Trixx 2UP',platform:'Spark / Trixx 2UP',image:'assets/apex-race-left.webp',mats:true},
    'spark-trixx-3up':{name:'Spark / Trixx 3UP',platform:'Spark / Trixx 3UP',image:'assets/apex-race-left.webp',mats:true}
  };
  const cameraImages = {
    left:'assets/trixx-2022-left.webp',
    right:'assets/trixx-2022-right.webp',
    front:'assets/trixx-2022-front.webp',
    rear:'assets/trixx-2022-rear.webp'
  };
  const hqRenderImages = {
    left:{
      race:'assets/apex-race-left.webp',
      ocean:'assets/apex-ocean-left.webp',
      toxic:'assets/apex-toxic-left.webp',
      miami:'assets/apex-miami-left.webp',
      ice:'assets/apex-ice-left.webp'
    },
    right:{race:'assets/apex-race-right.webp'},
    front:{race:'assets/apex-race-front.webp'},
    rear:{race:'assets/apex-race-rear.webp'}
  };
  const designRenderImages = {
    apex:'assets/apex-race-left.webp',
    midnight:'assets/design-midnight-left.webp',
    electric:'assets/design-electric-left.webp',
    toxic:'assets/apex-toxic-left.webp',
    carbon:'assets/design-carbon-left.webp',
    miami:'assets/apex-miami-left.webp',
    arctic:'assets/apex-ice-left.webp',
    camo:'assets/design-camo-left.webp',
    heritage:'assets/design-heritage-left.webp',
    digital:'assets/design-digital-left.webp',
    fetti:'assets/design-fetti-left.webp',
    factory:'assets/design-factory-left.webp'
  };
  const cameraLabels = {left:'LEFT ¾',right:'RIGHT ¾',front:'FRONT',rear:'REAR + MATS',template:'PANEL LAYOUT'};
  const designLabels = {
    apex:'APEX R',midnight:'NIGHTSHIFT',electric:'VOLTAGE',toxic:'TOXIC LINE',
    carbon:'CARBON ATTACK',miami:'MIAMI RUN',arctic:'ARCTIC SHIFT',camo:'RACE CAMO',
    heritage:'HERITAGE 96',digital:'DIGITAL VOID',fetti:'FETTI',factory:'FACTORY R'
  };
  const designColors = {
    apex:['#ef1f2d','#101310','#f5f7f5'],midnight:['#18283b','#07090a','#9abdd4'],
    electric:['#08a9ff','#07101b','#ff2b92'],toxic:['#9cff00','#0a0d0b','#f2f5ed'],
    carbon:['#252a27','#080a09','#cbd2cc'],miami:['#ff2b92','#5c36b8','#08e7e2'],
    arctic:['#dffaff','#167bb0','#13202b'],camo:['#768171','#222720','#b5c2af'],
    heritage:['#f2dfb6','#205c95','#e4432f'],digital:['#171a18','#050706','#655cff'],
    fetti:['#161917','#ff2b92','#ffcf00'],factory:['#f1f3f1','#141715','#ef1f2d']
  };
  const colorways = {
    race:['#ef1f2d','#101310','#f5f7f5'],ocean:['#08a9ff','#061423','#08e7e2'],
    toxic:['#9cff00','#0b0e0c','#f5f7f5'],miami:['#ff2b92','#6e3dda','#08e7e2'],
    ice:['#dffaff','#156b9a','#101820']
  };
  const labels = {
    coverage:{full:'Full Kit',side:'Side Kit',accent:'Accent Kit'},
    material:{standard:'Standard Marine Vinyl',chrome:'Chrome Base',holographic:'Holographic Base'},
    finish:{gloss:'High Gloss',matte:'Stealth Matte',sparkle:'Metal Flake'}
  };
  const state = {
    product:'spark-trixx-2up',year:'2022',design:'apex',pattern:'slash',material:'standard',
    coverage:'full',finish:'gloss',colorway:'race',primary:'#ef1f2d',secondary:'#101310',
    accent:'#f5f7f5',name:'RACE GRAPHICS',number:'21',notes:'',logo:'',logoSize:100,
    logoX:66,logoY:55,zoom:1,view:'left',matsEnabled:true,matPattern:'diamond',matTop:'#151917',
    matBottom:'#9cff00',matText:'TRIXLAB'
  };
  let toastTimer;
  let drag = null;

  const format = (cents) => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  const price = () => basePrices[state.coverage] + materialPrices[state.material] + finishPrices[state.finish] + (state.matsEnabled ? matsPrice : 0);
  const notify = (text) => {
    const toast = document.querySelector('[data-toast]');
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'),1800);
  };
  const getBuilds = () => {
    try{return JSON.parse(localStorage.getItem(storageKey)||'[]');}catch{return [];}
  };
  const snapshot = () => ({...state,logo:''});
  const setActive = (selector,key,value) => document.querySelectorAll(selector).forEach((button) => button.classList.toggle('active',button.dataset[key]===value));

  function setProduct(productId, announce = false) {
    if (!products[productId]) return;
    state.product = productId;
    state.matsEnabled = products[productId].mats;
    q('[data-model]').value = productId;
    q('[data-platform]').value = products[productId].platform;
    closeProducts();
    render();
    if (announce) notify(`${products[productId].name.toUpperCase()} SELECTED`);
  }

  const render = () => {
    const product = products[state.product];
    const usesTrixxMapping = product.platform.startsWith('Spark / Trixx');
    const hqColorway = state.colorway;
    const usesHqRender = usesTrixxMapping &&
      state.view !== 'template' &&
      Boolean(state.view === 'left' ? designRenderImages[state.design] : hqRenderImages[state.view]?.race);
    root.dataset.design = state.design;
    root.dataset.pattern = state.pattern;
    root.dataset.material = state.material;
    root.dataset.coverage = state.coverage;
    root.dataset.finish = state.finish;
    root.dataset.colorway = state.colorway;
    root.dataset.view = state.view;
    root.dataset.hq = usesHqRender ? 'true' : 'false';
    root.dataset.hqFilter = usesHqRender && state.view !== 'left' && hqColorway ? hqColorway : 'none';
    root.dataset.mats = state.matsEnabled ? 'on' : 'off';
    root.dataset.matPattern = state.matPattern;
    root.style.setProperty('--wrap-primary',state.primary);
    root.style.setProperty('--wrap-secondary',state.secondary);
    root.style.setProperty('--wrap-accent',state.accent);
    root.style.setProperty('--mat-top',state.matTop);
    root.style.setProperty('--mat-bottom',state.matBottom);
    q('[data-viewer]').style.setProperty('--zoom',state.zoom);
    q('[data-photo-view]').hidden = state.view==='template';
    q('[data-template-view]').hidden = state.view!=='template';
    q('[data-wrap-layer]').hidden = state.view !== 'template';
    qa('[data-camera-map]').forEach((map) => map.toggleAttribute('hidden',!usesTrixxMapping || map.dataset.cameraMap!==state.view));
    qa('[data-camera-mats]').forEach((map) => map.toggleAttribute('hidden',!usesTrixxMapping || map.dataset.cameraMats!==state.view));
    const hqImage = usesHqRender
      ? (state.view === 'left'
          ? (state.design === 'apex' && hqRenderImages.left[hqColorway] ? hqRenderImages.left[hqColorway] : designRenderImages[state.design])
          : hqRenderImages[state.view].race)
      : '';
    q('[data-vehicle-image]').src = hqImage || (usesTrixxMapping && cameraImages[state.view] ? cameraImages[state.view] : product.image);
    q('[data-vehicle-image]').alt = `${usesHqRender ? 'TRIXLAB rendered' : 'Neutral'} 2022 Sea-Doo ${product.name} · ${cameraLabels[state.view] || 'studio view'}`;
    q('[data-zoom]').textContent = `${Math.round(state.zoom*100)}%`;
    q('[data-preview-name]').textContent = state.name || 'RACE GRAPHICS';
    q('[data-preview-number]').textContent = state.number || '21';
    q('[data-design-name]').textContent = designLabels[state.design];
    q('[data-vehicle-meta]').textContent = `SEA-DOO ${product.name.toUpperCase()} · ${state.year} · ${cameraLabels[state.view]}`;
    q('[data-stage-model]').textContent = `${product.name.toUpperCase()} · ${state.year}`;
    q('[data-rail-model]').textContent = product.platform.toUpperCase();
    q('[data-year]').value = state.year;
    q('[data-model]').value = state.product;
    q('[data-platform]').value = product.platform;
    q('[data-name]').value = state.name;
    q('[data-number]').value = state.number;
    q('[data-notes]').value = state.notes;
    q('[data-logo-size]').value = state.logoSize;
    q('[data-mats-enabled]').checked = state.matsEnabled;
    q('[data-mat-text]').value = state.matText;
    q('[data-mat-preview]').textContent = state.matText || 'TRIXLAB';
    q('[data-mat-color="top"]').value = state.matTop;
    q('[data-mat-color="bottom"]').value = state.matBottom;
    q('.mat-controls').hidden = !state.matsEnabled;
    document.querySelectorAll('[data-product]').forEach((button) => button.classList.toggle('active',button.dataset.product===state.product));
    qa('[data-wrap-color]').forEach((input) => {
      input.value = state[input.dataset.wrapColor];
      q(`[data-color-value="${input.dataset.wrapColor}"]`).textContent = input.value.toUpperCase();
    });
    const logo = q('[data-logo-preview]');
    logo.src = state.logo;
    logo.hidden = !state.logo;
    logo.style.width = `${state.logoSize*1.3}px`;
    logo.style.setProperty('--logo-x',`${state.logoX}%`);
    logo.style.setProperty('--logo-y',`${state.logoY}%`);
    q('[data-drag-hint]').hidden = !state.logo || state.view==='template';
    const total = format(price());
    q('[data-price]').textContent = total;
    q('[data-add-price]').textContent = total;
    document.querySelector('[data-breakdown-price]').textContent = total;
    document.querySelector('[data-breakdown-coverage]').textContent = labels.coverage[state.coverage];
    document.querySelector('[data-breakdown-material]').textContent = labels.material[state.material];
    document.querySelector('[data-breakdown-finish]').textContent = labels.finish[state.finish];
    document.querySelector('[data-breakdown-mats]').textContent = state.matsEnabled ? format(matsPrice) : 'Not selected';
    document.querySelector('[data-build-count]').textContent = getBuilds().length;
    setActive('.design-card','design',state.design);
    setActive('[data-material]','material',state.material);
    setActive('[data-coverage]','coverage',state.coverage);
    setActive('[data-finish]','finish',state.finish);
    setActive('[data-colorway]','colorway',state.colorway);
    setActive('[data-mat-pattern]','matPattern',state.matPattern);
    setActive('.view-switch [data-view]','view',state.view);
  };

  const drawer = document.querySelector('[data-products-drawer]');
  function openProducts(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');}
  function closeProducts(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
  document.querySelectorAll('[data-products-open]').forEach((button) => button.addEventListener('click',openProducts));
  document.querySelectorAll('[data-products-close]').forEach((button) => button.addEventListener('click',closeProducts));
  document.querySelectorAll('[data-product]').forEach((button) => button.addEventListener('click',() => setProduct(button.dataset.product,true)));
  qa('[data-view]').forEach((button) => button.addEventListener('click',() => {state.view=button.dataset.view;render();}));

  qa('[data-tab]').forEach((button) => button.addEventListener('click',() => {
    const tab = button.dataset.tab;
    qa('[data-tab]').forEach((item) => item.classList.toggle('active',item===button));
    qa('[data-panel]').forEach((panel) => {
      const active = panel.dataset.panel===tab;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
    });
    q('[data-progress]').textContent = `${String(qa('[data-tab]').indexOf(button)+1).padStart(2,'0')} / 08`;
  }));
  qa('.design-card').forEach((button) => button.addEventListener('click',() => {
    state.design = button.dataset.design;
    state.pattern = button.dataset.designPattern;
    [state.primary,state.secondary,state.accent] = designColors[state.design];
    state.colorway = state.design === 'apex' ? 'race' : '';
    render();
  }));
  qa('[data-material]').forEach((button) => button.addEventListener('click',() => {state.material=button.dataset.material;render();}));
  qa('[data-coverage]').forEach((button) => button.addEventListener('click',() => {state.coverage=button.dataset.coverage;render();}));
  qa('[data-finish]').forEach((button) => button.addEventListener('click',() => {state.finish=button.dataset.finish;render();}));
  qa('[data-colorway]').forEach((button) => button.addEventListener('click',() => {
    state.colorway = button.dataset.colorway;
    [state.primary,state.secondary,state.accent] = colorways[state.colorway];
    render();
  }));
  qa('[data-wrap-color]').forEach((input) => input.addEventListener('input',(event) => {
    state[event.target.dataset.wrapColor] = event.target.value;
    state.colorway = '';
    render();
  }));
  q('[data-year]').addEventListener('change',(event) => {state.year=event.target.value;render();});
  q('[data-model]').addEventListener('change',(event) => setProduct(event.target.value));
  q('[data-platform]').addEventListener('change',(event) => {
    const match = Object.entries(products).find(([,product]) => product.platform===event.target.value);
    if (match) setProduct(match[0]);
  });
  q('[data-name]').addEventListener('input',(event) => {state.name=event.target.value;render();});
  q('[data-number]').addEventListener('input',(event) => {state.number=event.target.value.replace(/[^a-z0-9]/gi,'').slice(0,3);render();});
  q('[data-notes]').addEventListener('input',(event) => {state.notes=event.target.value;});
  q('[data-logo]').addEventListener('change',(event) => {
    const file=event.target.files?.[0];
    if(!file)return;
    if(!/^image\//.test(file.type)){notify('PLEASE SELECT AN IMAGE');return;}
    if(file.size>5*1024*1024){notify('LOGO IS LARGER THAN 5 MB');return;}
    const reader=new FileReader();
    reader.onload=()=>{state.logo=String(reader.result);state.logoX=66;state.logoY=52;render();notify('LOGO ADDED — DRAG IT ON THE SKI');};
    reader.readAsDataURL(file);
  });
  q('[data-logo-size]').addEventListener('input',(event) => {state.logoSize=Number(event.target.value);render();});
  q('[data-logo-center]').addEventListener('click',() => {state.logoX=60;state.logoY=54;render();notify('LOGO CENTERED');});
  q('[data-logo-remove]').addEventListener('click',() => {state.logo='';q('[data-logo]').value='';render();notify('LOGO REMOVED');});

  const logo = q('[data-logo-preview]');
  logo.addEventListener('pointerdown',(event) => {
    if (!state.logo) return;
    event.preventDefault();
    drag = {pointerId:event.pointerId};
    logo.setPointerCapture(event.pointerId);
    logo.classList.add('dragging');
    q('[data-drag-hint]').hidden = true;
  });
  logo.addEventListener('pointermove',(event) => {
    if (!drag || drag.pointerId!==event.pointerId) return;
    const bounds = q('.vehicle-stack').getBoundingClientRect();
    state.logoX = Math.max(12,Math.min(88,((event.clientX-bounds.left)/bounds.width)*100));
    state.logoY = Math.max(20,Math.min(78,((event.clientY-bounds.top)/bounds.height)*100));
    logo.style.setProperty('--logo-x',`${state.logoX}%`);
    logo.style.setProperty('--logo-y',`${state.logoY}%`);
  });
  const endDrag = (event) => {
    if (!drag || drag.pointerId!==event.pointerId) return;
    if (logo.hasPointerCapture(event.pointerId)) logo.releasePointerCapture(event.pointerId);
    drag = null;
    logo.classList.remove('dragging');
    notify('LOGO POSITION UPDATED');
  };
  logo.addEventListener('pointerup',endDrag);
  logo.addEventListener('pointercancel',endDrag);

  q('[data-mats-enabled]').addEventListener('change',(event) => {state.matsEnabled=event.target.checked;render();});
  qa('[data-mat-pattern]').forEach((button) => button.addEventListener('click',() => {state.matPattern=button.dataset.matPattern;render();}));
  qa('[data-mat-color]').forEach((input) => input.addEventListener('input',(event) => {state[event.target.dataset.matColor==='top'?'matTop':'matBottom']=event.target.value;render();}));
  q('[data-mat-text]').addEventListener('input',(event) => {state.matText=event.target.value.toUpperCase();render();});
  q('[data-zoom-in]').addEventListener('click',() => {state.zoom=Math.min(1.25,state.zoom+.05);render();});
  q('[data-zoom-out]').addEventListener('click',() => {state.zoom=Math.max(.8,state.zoom-.05);render();});
  q('[data-price-info]').addEventListener('click',() => document.querySelector('[data-price-dialog]').showModal());
  q('[data-save]').addEventListener('click',() => {
    const builds=getBuilds();
    builds.unshift({id:Date.now(),name:`${designLabels[state.design]} · ${state.year} ${products[state.product].name}`,date:new Date().toISOString(),state:snapshot()});
    localStorage.setItem(storageKey,JSON.stringify(builds.slice(0,12)));
    render();notify('BUILD SAVED');
  });
  const renderBuilds = () => {
    const list=document.querySelector('[data-build-list]');
    const builds=getBuilds();
    if(!builds.length){list.innerHTML='<div class="empty">NO SAVED BUILDS YET</div>';return;}
    list.innerHTML=builds.map((build,index)=>`<div class="saved-build"><span><b>${build.name}</b><small>${new Date(build.date).toLocaleDateString('de-DE')}</small></span><button type="button" data-load="${index}">LOAD</button><button type="button" data-delete="${index}">×</button></div>`).join('');
    [...list.querySelectorAll('[data-load]')].forEach((button)=>button.addEventListener('click',()=>{
      Object.assign(state,builds[Number(button.dataset.load)].state);
      document.querySelector('[data-builds-dialog]').close();render();notify('BUILD LOADED');
    }));
    [...list.querySelectorAll('[data-delete]')].forEach((button)=>button.addEventListener('click',()=>{
      builds.splice(Number(button.dataset.delete),1);
      localStorage.setItem(storageKey,JSON.stringify(builds));
      renderBuilds();render();
    }));
  };
  document.querySelector('[data-builds]').addEventListener('click',() => {renderBuilds();document.querySelector('[data-builds-dialog]').showModal();});
  document.querySelectorAll('[data-dialog-close]').forEach((button)=>button.addEventListener('click',()=>button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach((dialog)=>dialog.addEventListener('click',(event)=>{if(event.target===dialog)dialog.close();}));
  q('[data-add]').addEventListener('click',() => {
    document.querySelector('[data-cart] b').textContent='1';
    notify('CONFIGURED KIT ADDED TO CART');
  });
  const query = new URLSearchParams(location.search || sessionStorage.getItem('trixlab-studio-query') || '');
  if (query.get('product') && products[query.get('product')]) state.product = query.get('product');
  if (query.get('tab') && q(`[data-tab="${query.get('tab')}"]`)) q(`[data-tab="${query.get('tab')}"]`).click();
  render();
})();
