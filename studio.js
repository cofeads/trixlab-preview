(() => {
  const root = document.querySelector('[data-studio]');
  const q = (selector) => root.querySelector(selector);
  const qa = (selector) => [...root.querySelectorAll(selector)];
  const storageKey = 'trixlab-studio-builds-v3';
  const cartKey = 'trixlab-cart-v1';
  const basePrices = {full:59900,side:39900,accent:24900};
  const customCoveragePrices = {upper:17900,side:24900,accent:9900};
  const materialPrices = {standard:0,chrome:30000,holographic:30000};
  const finishPrices = {gloss:0,matte:4900,sparkle:7900};
  const matsPrice = 18900;
  const matProfilePrices = {'dual-6':0,'triple-9':4900};
  const matColorways = {
    race:['#151917','#ef1f2d','#f5f7f5'],toxic:['#151917','#9cff00','#f5f7f5'],
    mono:['#f1f3f1','#151917','#8e9690'],ice:['#13202b','#08a9ff','#dffaff'],
    candy:['#151917','#ff2b92','#08e7e2']
  };
  const products = {
    'trixx-1up':{name:'Spark Trixx 1UP',platform:'Spark Trixx 1UP',image:'',mats:false,available:false},
    'trixx-2up':{name:'Spark Trixx 2UP',platform:'Spark Trixx 2UP',image:'assets/apex-race-left.webp',mats:true,available:true},
    'trixx-3up':{name:'Spark Trixx 3UP',platform:'Spark Trixx 3UP',image:'',mats:false,available:false}
  };
  const cameraImages = {
    left:'assets/trixx-2022-left.webp',
    right:'assets/trixx-2022-right.webp',
    front:'assets/trixx-2022-front.webp',
    rear:'assets/trixx-2022-rear.webp'
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
  const cameraLabels = {left:'LEFT ¾',right:'RIGHT ¾',front:'FRONT',rear:'REAR + MATS',template:'PANEL LAYOUT','mat-template':'MAT 8-PIECE LAYOUT'};
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
    ice:['#dffaff','#156b9a','#101820'],magma:['#ff4b16','#240805','#ffd9a8'],
    gulf:['#5bd8e8','#ff6c32','#f4f0df'],venom:['#c8ff00','#291238','#f4f6ed'],
    stealth:['#343a37','#070909','#a5aea8'],royal:['#315cff','#0a1030','#f5ce46'],
    sunset:['#ff7139','#7b2cff','#ffd4b8'],military:['#78836b','#20251f','#c9d0b9'],
    candy:['#ff4fa3','#25d9ff','#fff4fb'],copper:['#c66b31','#17110d','#e9c6a8'],
    glacier:['#a9efff','#123d62','#f4ffff'],vapor:['#826dff','#19152e','#5ef0e6'],
    gold:['#d9ac46','#15110a','#fff1bd'],mono:['#f4f6f4','#111311','#8c938e'],
    lagoon:['#00c7a5','#052b39','#f1ffce'],crimson:['#a50022','#12060a','#e3e6e4']
  };
  const paletteLabels = {
    race:'RACE',ocean:'OCEAN',toxic:'TOXIC',miami:'MIAMI',ice:'ICE',magma:'MAGMA',
    gulf:'GULF',venom:'VENOM',stealth:'STEALTH',royal:'ROYAL',sunset:'SUNSET',
    military:'MILITARY',candy:'CANDY',copper:'COPPER',glacier:'GLACIER',vapor:'VAPOR',
    gold:'GOLD',mono:'MONO',lagoon:'LAGOON',crimson:'CRIMSON'
  };
  const labels = {
    coverage:{full:'Full Kit',side:'Side Kit',accent:'Accent Kit',custom:'Custom Coverage'},
    material:{standard:'Standard Marine Vinyl',chrome:'Chrome Base',holographic:'Holographic Base'},
    finish:{gloss:'High Gloss',matte:'Stealth Matte',sparkle:'Metal Flake'}
  };
  const coverageLabels = {
    full:'FULL KIT · UPPER + SIDE PANELS',
    side:'SIDE KIT · HULL SIDES + REAR',
    accent:'ACCENT KIT · SELECTED IMPACT PANELS',
    custom:'CUSTOM COVERAGE'
  };
  const matPatternLabels = {
    diamond:'DIAMOND',hive:'HIVE',razor:'RAZOR',spark:'SPARK',topo:'TOPO',wave:'WAVE'
  };
  const state = {
    product:'trixx-2up',year:'2022',design:'digital',pattern:'digital',material:'standard',
    coverage:'full',finish:'gloss',colorway:'vapor',primary:'#826dff',secondary:'#19152e',
    accent:'#5ef0e6',name:'RACE GRAPHICS',number:'21',notes:'',logo:'',logoSize:100,
    logoX:66,logoY:55,zoom:1,view:'left',matsEnabled:true,matPattern:'diamond',matTop:'#151917',
    matBottom:'#ef1f2d',matCore:'#f5f7f5',matText:'CK',matColorway:'race',matProfile:'dual-6',
    matBadge:'ck',matEdge:'bevel',coverageZones:['upper','side','accent'],overlay:'none',
    textFont:'Arial,Helvetica,sans-serif',textColor:'#ffffff',textOutline:true,textShadow:true,
    aiStyle:'race',panX:0,panY:0,moveMode:false
  };
  let toastTimer;
  let drag = null;
  let panDrag = null;
  let history = [];
  let historyIndex = -1;
  let historyRestoring = false;

  const format = (cents) => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  const coveragePrice = () => state.coverage === 'custom'
    ? state.coverageZones.reduce((sum,zone) => sum + customCoveragePrices[zone],0)
    : basePrices[state.coverage];
  const matPrice = () => matsPrice + matProfilePrices[state.matProfile];
  const price = () => coveragePrice() + materialPrices[state.material] + finishPrices[state.finish] + (state.matsEnabled ? matPrice() : 0);
  const matDisplayText = () => state.matBadge==='none'?'':state.matBadge==='ck'?'CK':state.matBadge==='trixlab'?'TRIXLAB':(state.matText||'CUSTOM').toUpperCase();
  const hexHue = (hex) => {
    const value = parseInt(hex.slice(1),16);
    const r=((value>>16)&255)/255,g=((value>>8)&255)/255,b=(value&255)/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
    if(!delta)return 0;
    let hue=max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;
    return Math.round((hue*60+360)%360);
  };
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
  const getCart = () => {
    try{return JSON.parse(localStorage.getItem(cartKey)||'[]');}catch{return [];}
  };
  const saveCart = (items) => localStorage.setItem(cartKey,JSON.stringify(items));
  const cartCount = () => getCart().reduce((sum,item) => sum + Number(item.quantity || 1),0);
  const snapshot = () => ({...state,logo:state.logo.length<300000?state.logo:''});
  const setActive = (selector,key,value) => document.querySelectorAll(selector).forEach((button) => button.classList.toggle('active',button.dataset[key]===value));
  const escapeXml = (value) => String(value ?? '').replace(/[<>&"']/g,(character) => ({
    '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'
  })[character]);
  const stateForHistory = () => JSON.stringify(state);
  const rememberHistory = () => {
    if (historyRestoring) return;
    const serialized=stateForHistory();
    if (history[historyIndex]===serialized) return;
    history=history.slice(0,historyIndex+1);
    history.push(serialized);
    if(history.length>40)history.shift();
    historyIndex=history.length-1;
  };
  const restoreHistory = (nextIndex) => {
    if(nextIndex<0||nextIndex>=history.length)return;
    historyRestoring=true;
    historyIndex=nextIndex;
    Object.assign(state,JSON.parse(history[historyIndex]));
    render();
    historyRestoring=false;
    document.querySelector('[data-undo]').disabled=historyIndex<=0;
    document.querySelector('[data-redo]').disabled=historyIndex>=history.length-1;
  };
  const svgLogo = (kind,label='TRIXLAB') => {
    const safe=escapeXml(String(label).toUpperCase().slice(0,12));
    const symbols={
      race:`<path d="M18 62 42 18h34L61 46h29l-20 16H18Z" fill="#9cff00"/><text x="106" y="55" text-anchor="middle" font-family="Arial" font-size="24" font-weight="900" font-style="italic" fill="#fff">TRIXLAB</text>`,
      bolt:`<path d="m84 7-49 56h34L55 94l51-58H72Z" fill="#9cff00"/><text x="150" y="59" font-family="Arial" font-size="20" font-weight="900" fill="#fff">VOLT</text>`,
      checker:`<g fill="#fff">${[0,1,2,3].map((row)=>[0,1,2,3,4,5].map((column)=>`<rect x="${18+column*18}" y="${16+row*18}" width="18" height="18" opacity="${(row+column)%2?'.18':'1'}"/>`).join('')).join('')}</g><text x="188" y="58" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="#9cff00">RACE</text>`,
      wave:`<path d="M8 61q27-47 54 0t54 0 54 0 54 0" fill="none" stroke="#9cff00" stroke-width="12"/><path d="M8 81q27-47 54 0t54 0 54 0 54 0" fill="none" stroke="#fff" stroke-width="4"/>`,
      ck:`<circle cx="60" cy="50" r="40" fill="none" stroke="#9cff00" stroke-width="8"/><text x="60" y="61" text-anchor="middle" font-family="Arial" font-size="34" font-weight="900" fill="#fff">CK</text><text x="163" y="58" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#fff">CUSTOM KIT</text>`,
      number:`<text x="115" y="78" text-anchor="middle" font-family="Impact,Arial Black" font-size="78" font-style="italic" fill="#fff" stroke="#9cff00" stroke-width="3" paint-order="stroke">${safe||'21'}</text>`,
      ai:`<path d="M18 75 49 18h44L70 54h32l-27 21Z" fill="${state.accent}"/><path d="M107 23h105v52H92Z" fill="${state.primary}" opacity=".88"/><text x="151" y="58" text-anchor="middle" font-family="Arial" font-size="19" font-weight="900" fill="${state.textColor}">${safe||'TRIXLAB'}</text>`
    };
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="230" height="100" viewBox="0 0 230 100"><rect width="230" height="100" rx="10" fill="#090b0a" opacity=".92"/>${symbols[kind]||symbols.race}</svg>`)}`;
  };
  const assetAsDataUrl = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load ${url}`);
    const blob = await response.blob();
    return await new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const patternDefinition = () => {
    const primary=state.primary,secondary=state.secondary,accent=state.accent;
    const definitions = {
      slash:`<pattern id="production-pattern" width="180" height="110" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)"><path d="M-25 105 55-15h30L5 105Zm78 0L128-15h18L75 105Zm75 0 52-78v46l-21 32Z" fill="${accent}"/><path d="m25 105 90-120h20L50 105Zm112 0 55-84v31l-35 53Z" fill="${secondary}" opacity=".88"/><path d="M0 88h180v8H0Z" fill="${primary}"/></pattern>`,
      hex:`<pattern id="production-pattern" width="72" height="62" patternUnits="userSpaceOnUse"><path d="M18 3h36l16 28-16 28H18L2 31Z" fill="none" stroke="${accent}" stroke-width="5"/><path d="M18 31h36" stroke="${primary}" stroke-width="3"/></pattern>`,
      bolt:`<pattern id="production-pattern" width="150" height="105" patternUnits="userSpaceOnUse"><path d="M-10 88 58-10h34L61 42h53L38 114l22-55H16Z" fill="${accent}"/><path d="m95 105 39-59h22l-30 59Z" fill="${secondary}"/></pattern>`,
      topo:`<pattern id="production-pattern" width="110" height="82" patternUnits="userSpaceOnUse"><path d="M-15 16Q22-15 126 20M-12 44Q26 10 125 48M-8 76Q32 37 129 79" fill="none" stroke="${accent}" stroke-width="5"/><path d="M12 29Q45 3 96 28t83 0" fill="none" stroke="${secondary}" stroke-width="2.5"/></pattern>`,
      carbon:`<pattern id="production-pattern" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="48" fill="${accent}"/><rect x="24" width="9" height="48" fill="${primary}" opacity=".74"/></pattern>`,
      wave:`<pattern id="production-pattern" width="100" height="60" patternUnits="userSpaceOnUse"><path d="M-8 39Q18 4 44 39t52 0t52 0" fill="none" stroke="${accent}" stroke-width="8"/><path d="M-8 52Q18 17 44 52t52 0t52 0" fill="none" stroke="${secondary}" stroke-width="3"/></pattern>`,
      ice:`<pattern id="production-pattern" width="116" height="94" patternUnits="userSpaceOnUse"><path d="m7 81 29-73 20 41L82 7l28 74-48-23Z" fill="${accent}"/><path d="m30 81 29-29 24 29Z" fill="${secondary}" opacity=".74"/></pattern>`,
      camo:`<pattern id="production-pattern" width="148" height="106" patternUnits="userSpaceOnUse"><path d="M-13 24 29 2l44 19-12 32-50 9Zm84 39 31-29 53 8 14 42-47 24-56-16Z" fill="${accent}"/><path d="m37 87 29-35 34 19-13 34Z" fill="${secondary}"/></pattern>`,
      stripes:`<pattern id="production-pattern" width="190" height="94" patternUnits="userSpaceOnUse" patternTransform="skewX(-20)"><rect width="70" height="94" fill="${accent}"/><rect x="82" width="21" height="94" fill="${secondary}"/><rect x="114" width="12" height="94" fill="${primary}"/></pattern>`,
      digital:`<pattern id="production-pattern" width="78" height="78" patternUnits="userSpaceOnUse"><path d="M3 3h31v19H20v21H3Zm39 29h33v42H42ZM14 53h20v21H14Z" fill="${accent}"/><path d="M43 5h18v16H43Z" fill="${secondary}"/></pattern>`,
      fetti:`<pattern id="production-pattern" width="110" height="94" patternUnits="userSpaceOnUse"><path d="m13 11 13 26-23 8Zm45-6 21 13-14 19-18-15Zm21 48 26 10-11 23-24-13ZM24 66l21-11 10 26-24 8Z" fill="${accent}"/><circle cx="92" cy="24" r="10" fill="${secondary}"/></pattern>`,
      factory:`<pattern id="production-pattern" width="190" height="92" patternUnits="userSpaceOnUse" patternTransform="skewX(-16)"><rect width="92" height="92" fill="${accent}"/><path d="M102 0h24v92h-24z" fill="${primary}"/><path d="M138 0h12v92h-12z" fill="${secondary}"/></pattern>`
    };
    return definitions[state.pattern] || definitions.slash;
  };
  const coverageClipDefinition = () => {
    const pieces = {
      upper:'<path d="M520 430H2480V1480H520ZM1080 100H1920V950H1080Z"/>',
      side:'<path d="M0 0H760V3000H0ZM2240 0H3000V3000H2240ZM520 620H1100V2380H520ZM1900 620H2480V2380H1900Z"/>',
      accent:'<path d="M260 480H720V1240H260ZM2280 480H2740V1240H2280ZM560 1720H1040V2450H560ZM1960 1720H2440V2450H1960ZM1220 180H1780V880H1220ZM1260 2200H1740V2920H1260Z"/>'
    };
    if(state.coverage==='custom')return state.coverageZones.map((zone)=>pieces[zone]).join('');
    if (state.coverage === 'side') {
      return pieces.side;
    }
    if (state.coverage === 'accent') {
      return pieces.accent;
    }
    return '<rect width="3000" height="3000"/>';
  };
  const overlayDefinition = () => ({
    halftone:'<pattern id="extra-overlay" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="4" fill="#fff"/><circle cx="25" cy="25" r="2" fill="#fff"/></pattern>',
    checker:'<pattern id="extra-overlay" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M0 0h35v35H0Zm35 35h35v35H35Z" fill="#fff"/></pattern>',
    topo:'<pattern id="extra-overlay" width="120" height="90" patternUnits="userSpaceOnUse"><path d="M-10 20Q35-15 130 24M-8 53Q38 17 132 57M0 84Q45 49 135 86" fill="none" stroke="#fff" stroke-width="5"/></pattern>',
    speed:'<pattern id="extra-overlay" width="180" height="100" patternUnits="userSpaceOnUse" patternTransform="skewX(-22)"><path d="M0 0h18v100H0Zm42 0h8v100h-8Zm74 0h30v100h-30Z" fill="#fff"/></pattern>'
  })[state.overlay]||'';
  const matPatternDefinition = () => ({
    diamond:`<pattern id="mat-routing" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect x="4" y="4" width="18" height="18" rx="2" fill="none" stroke="${state.matBottom}" stroke-width="4"/></pattern>`,
    hive:`<pattern id="mat-routing" width="36" height="32" patternUnits="userSpaceOnUse"><path d="M10 2h16l8 14-8 14H10L2 16Z" fill="none" stroke="${state.matBottom}" stroke-width="4"/></pattern>`,
    razor:`<pattern id="mat-routing" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="10" height="40" fill="${state.matBottom}"/></pattern>`,
    spark:`<pattern id="mat-routing" width="42" height="42" patternUnits="userSpaceOnUse"><path d="m21 2 5 13 14 6-14 5-5 14-6-14-13-5 13-6Z" fill="${state.matBottom}"/></pattern>`,
    topo:`<pattern id="mat-routing" width="54" height="44" patternUnits="userSpaceOnUse"><path d="M-4 12Q16-5 59 14M-4 35Q18 18 59 37" fill="none" stroke="${state.matBottom}" stroke-width="4"/></pattern>`,
    wave:`<pattern id="mat-routing" width="54" height="38" patternUnits="userSpaceOnUse"><path d="M0 21Q14 3 27 21t27 0" fill="none" stroke="${state.matBottom}" stroke-width="6"/></pattern>`
  })[state.matPattern];
  const matCutPaths = [
    ['LF-01','M88 114 474 94 526 142 482 220 132 211 68 170Z'],
    ['RF-01','M1112 114 726 94 674 142 718 220 1068 211 1132 170Z'],
    ['LR-02','M74 278 224 250 270 302 242 382 98 369 54 324Z'],
    ['RR-02','M1126 278 976 250 930 302 958 382 1102 369 1146 324Z'],
    ['LD-03','M318 292 520 274 558 324 520 411 341 404 300 355Z'],
    ['RD-03','M882 292 680 274 642 324 680 411 859 404 900 355Z'],
    ['LH-04','M356 490 518 471 550 512 513 591 372 584 336 537Z'],
    ['RH-04','M844 490 682 471 650 512 687 591 828 584 864 537Z']
  ];
  const downloadBlob = (blob,filename) => {
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement('a');
    anchor.href=url;
    anchor.download=filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  };
  const exportMatsSvg = () => {
    if(state.product!=='trixx-2up'){notify('MAT EXPORT IS AVAILABLE FOR TRIXX 2UP');return;}
    const safeText=escapeXml(matDisplayText());
    const cutDefs=matCutPaths.map(([id,path])=>`<path id="${id}" d="${path}"/>`).join('');
    const artwork=matCutPaths.map(([id])=>`<g id="PIECE_${id}"><use href="#${id}" fill="${state.matTop}" stroke="${state.matBottom}" stroke-width="7"/><use href="#${id}" fill="url(#mat-routing)" opacity=".92"/><use href="#${id}" fill="none" stroke="#ff00b8" stroke-width="1"/></g>`).join('');
    const badges=safeText?`<g id="ROUTED_BADGES" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="900" font-style="italic" text-anchor="middle" fill="${state.matBottom}" stroke="${state.matTop}" stroke-width="3" paint-order="stroke"><text x="430" y="365">${safeText}</text><text x="770" y="365">${safeText}</text></g>`:'';
    const metadata=escapeXml(JSON.stringify({
      type:'TRIXLAB Spark Trixx 2UP traction mat CNC proof',fitment:'2017-2023',
      pieces:8,canvas:'1200mm x 700mm',scale:'1:1',pattern:matPatternLabels[state.matPattern],
      profile:state.matProfile,edge:state.matEdge,colors:{top:state.matTop,reveal:state.matBottom,core:state.matCore},
      badge:state.matBadge,text:matDisplayText(),status:'PROOF — verify paths against factory DXF before cutting'
    }));
    const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200mm" height="700mm" viewBox="0 0 1200 700">
  <title>TRIXLAB Spark Trixx 2UP Traction Mats — 8 Piece 1:1 Proof</title>
  <metadata>${metadata}</metadata>
  <defs>${matPatternDefinition()}${cutDefs}</defs>
  <rect width="1200" height="700" fill="#fff"/>
  <g id="CORE_LAYER" fill="${state.matCore}" opacity="${state.matProfile==='triple-9'?1:0}">${matCutPaths.map(([id])=>`<use href="#${id}" transform="translate(0 7)"/>`).join('')}</g>
  <g id="TOP_AND_ROUTING">${artwork}</g>
  ${badges}
  <g id="JOB_TICKET" font-family="Arial,Helvetica,sans-serif">
    <rect x="35" y="620" width="1130" height="48" rx="12" fill="#0b0e0c"/>
    <text x="55" y="650" fill="#9cff00" font-size="15" font-weight="900">TRIXLAB · SPARK TRIXX 2UP 2017–2023 · ${state.matProfile==='triple-9'?'9MM TRIPLE LAYER':'6MM DUAL LAYER'} · ${escapeXml(matPatternLabels[state.matPattern])}</text>
    <text x="1145" y="650" text-anchor="end" fill="#fff" font-size="12" font-weight="700">MAGENTA = CUT CONTOUR · VERIFY FACTORY DXF</text>
  </g>
</svg>`;
    const filename=`TRIXLAB_TRIXX_2UP_MATS_${matPatternLabels[state.matPattern]}_${state.matProfile}_PROOF_1TO1.svg`.replace(/[^a-z0-9_.-]+/gi,'_');
    downloadBlob(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),filename);
    notify('1:1 MAT PRODUCTION PROOF READY');
  };
  const exportProductionSvg = async () => {
    if (state.product !== 'trixx-2up') {
      notify('1:1 EXPORT IS CURRENTLY AVAILABLE FOR TRIXX 2UP');
      return;
    }
    const button=q('[data-export-svg]');
    button.disabled=true;
    button.textContent='BUILDING FILE…';
    try{
      const [redMask,blackMask,whiteMask,greyMask,allMask,outline,brand]=await Promise.all([
        'assets/trixx-2up-template-red.webp','assets/trixx-2up-template-black.webp',
        'assets/trixx-2up-template-white.webp','assets/trixx-2up-template-grey.webp',
        'assets/trixx-2up-template-all.webp','assets/trixx-2up-template-outline.webp',
        'assets/trixlab-race-mark.svg'
      ].map(assetAsDataUrl));
      const safeName=escapeXml(state.name || 'RACE GRAPHICS');
      const safeNumber=escapeXml(state.number || '21');
      const safeLogo=state.logo ? escapeXml(state.logo) : '';
      const logoWidth=Math.max(180,Math.min(620,state.logoSize*4));
      const materialOverlay=state.material==='chrome'
        ? `<rect width="3000" height="3000" fill="url(#chrome)" mask="url(#mask-all)" opacity=".42"/>`
        : state.material==='holographic'
          ? `<rect width="3000" height="3000" fill="url(#holo)" mask="url(#mask-all)" opacity=".5"/>`
          : '';
      const finishOverlay=state.finish==='sparkle'
        ? `<rect width="3000" height="3000" fill="url(#sparkle)" mask="url(#mask-all)" opacity=".68"/>`
        : '';
      const metadata=escapeXml(JSON.stringify({
        format:'TRIXLAB TRIXX 2UP production artwork',canvas:'4000mm x 4000mm',scale:'1:1',
        model:products[state.product].name,year:state.year,design:designLabels[state.design],
        palette:state.colorway ? paletteLabels[state.colorway] : 'CUSTOM',
        colors:{primary:state.primary,secondary:state.secondary,accent:state.accent},
        material:labels.material[state.material],finish:labels.finish[state.finish],
        coverage:labels.coverage[state.coverage],coverageZones:state.coverageZones,overlay:state.overlay,
        typography:{font:state.textFont,color:state.textColor,outline:state.textOutline,shadow:state.textShadow},
        name:state.name,number:state.number,
        mats:state.matsEnabled ? {
          pattern:matPatternLabels[state.matPattern],profile:state.matProfile,edge:state.matEdge,
          top:state.matTop,reveal:state.matBottom,core:state.matCore,badge:state.matBadge,text:matDisplayText()
        } : false,
        notes:state.notes
      }));
      const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4000mm" height="4000mm" viewBox="0 0 3000 3000">
  <title>TRIXLAB ${escapeXml(designLabels[state.design])} — Sea-Doo Spark Trixx 2UP 1:1</title>
  <metadata>${metadata}</metadata>
  <defs>
    <mask id="mask-red"><image href="${redMask}" width="3000" height="3000"/></mask>
    <mask id="mask-black"><image href="${blackMask}" width="3000" height="3000"/></mask>
    <mask id="mask-white"><image href="${whiteMask}" width="3000" height="3000"/></mask>
    <mask id="mask-grey"><image href="${greyMask}" width="3000" height="3000"/></mask>
    <mask id="mask-all"><image href="${allMask}" width="3000" height="3000"/></mask>
    <clipPath id="coverage-clip">${coverageClipDefinition()}</clipPath>
    ${patternDefinition()}
    ${overlayDefinition()}
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".22" stop-color="#616a66"/><stop offset=".5" stop-color="#f8ffff"/><stop offset=".74" stop-color="#7f8783"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff4da6"/><stop offset=".25" stop-color="#7d5cff"/><stop offset=".5" stop-color="#37e7ff"/><stop offset=".75" stop-color="#d7ff42"/><stop offset="1" stop-color="#ff7b45"/></linearGradient>
    <pattern id="sparkle" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="5" cy="7" r="2.2" fill="#fff"/><circle cx="22" cy="20" r="1.5" fill="#fff"/><circle cx="13" cy="28" r="1" fill="#fff"/></pattern>
  </defs>
  <g id="CONFIGURED_ARTWORK" clip-path="url(#coverage-clip)">
    <rect width="3000" height="3000" fill="${state.primary}" mask="url(#mask-red)"/>
    <rect width="3000" height="3000" fill="${state.secondary}" mask="url(#mask-black)"/>
    <rect width="3000" height="3000" fill="${state.accent}" mask="url(#mask-white)"/>
    <rect width="3000" height="3000" fill="${state.secondary}" opacity=".52" mask="url(#mask-grey)"/>
    <rect width="3000" height="3000" fill="url(#production-pattern)" opacity=".66" mask="url(#mask-all)"/>
    ${state.overlay!=='none' ? '<rect width="3000" height="3000" fill="url(#extra-overlay)" opacity=".25" mask="url(#mask-all)"/>' : ''}
    ${materialOverlay}
    ${finishOverlay}
  </g>
  <g id="PERSONALIZATION" font-family="${escapeXml(state.textFont)}" font-weight="900" fill="${escapeXml(state.textColor)}" stroke="#090b0a" paint-order="stroke" stroke-width="${state.textOutline?5:0}" ${state.textShadow?'style="filter:drop-shadow(0 5px 4px #0008)"':''}>
    <image href="${brand}" x="660" y="1460" width="450" height="130" transform="rotate(61 885 1525)"/>
    <image href="${brand}" x="1890" y="1460" width="450" height="130" transform="rotate(-61 2115 1525)"/>
    <text x="735" y="1665" font-size="42" letter-spacing="4" transform="rotate(61 735 1665)">${safeName}</text>
    <text x="2265" y="1665" font-size="42" letter-spacing="4" text-anchor="end" transform="rotate(-61 2265 1665)">${safeName}</text>
    <text x="820" y="1880" font-size="104" font-style="italic" transform="rotate(61 820 1880)">${safeNumber}</text>
    <text x="2180" y="1880" font-size="104" font-style="italic" text-anchor="end" transform="rotate(-61 2180 1880)">${safeNumber}</text>
    ${safeLogo ? `<image href="${safeLogo}" x="${720-logoWidth/2}" y="1260" width="${logoWidth}" height="${logoWidth*.45}" preserveAspectRatio="xMidYMid meet" transform="rotate(61 720 1350)"/><image href="${safeLogo}" x="${2280-logoWidth/2}" y="1260" width="${logoWidth}" height="${logoWidth*.45}" preserveAspectRatio="xMidYMid meet" transform="rotate(-61 2280 1350)"/>` : ''}
  </g>
  <g id="CUT_REFERENCE" opacity=".28"><image href="${outline}" width="3000" height="3000"/></g>
  <g id="JOB_TICKET" font-family="Arial,Helvetica,sans-serif">
    <rect x="45" y="45" width="720" height="${state.matsEnabled ? 250 : 205}" rx="24" fill="#fff" stroke="#111" stroke-width="4"/>
    <text x="80" y="100" font-size="25" font-weight="900" fill="#008d70">TRIXLAB · TRIXX 2UP · 1:1 / 4000 × 4000 MM</text>
    <text x="80" y="146" font-size="36" font-weight="900" fill="#111">${escapeXml(designLabels[state.design])} / ${escapeXml(state.colorway ? paletteLabels[state.colorway] : 'CUSTOM')}</text>
    <text x="80" y="185" font-size="23" font-weight="700" fill="#555">${escapeXml(labels.coverage[state.coverage])} · ${escapeXml(labels.material[state.material])} · ${escapeXml(labels.finish[state.finish])}</text>
    ${state.matsEnabled ? `<text x="80" y="226" font-size="23" font-weight="700" fill="#555">MATS: ${escapeXml(matPatternLabels[state.matPattern])} · ${escapeXml(state.matProfile)} · ${escapeXml(state.matTop)} / ${escapeXml(state.matBottom)} · ${escapeXml(matDisplayText())}</text>` : ''}
  </g>
</svg>`;
      const palette=state.colorway ? paletteLabels[state.colorway] : 'CUSTOM';
      const filename=`TRIXLAB_TRIXX_2UP_${designLabels[state.design]}_${palette}_1TO1.svg`.replace(/[^a-z0-9_.-]+/gi,'_');
      downloadBlob(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),filename);
      notify('1:1 PRODUCTION SVG READY');
    }catch(error){
      console.error(error);
      notify('EXPORT FAILED — PLEASE TRY AGAIN');
    }finally{
      button.disabled=false;
      button.textContent='EXPORT 1:1 SVG';
    }
  };

  function setProduct(productId, announce = false) {
    if (!products[productId]) return;
    if (!products[productId].available) {
      notify(`${products[productId].name.toUpperCase()} · COMING SOON`);
      return;
    }
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
    const usesTrixxMapping = state.product === 'trixx-2up';
    const usesHqRender = usesTrixxMapping && state.view === 'left' && state.coverage === 'full' && state.overlay === 'none' && Boolean(designRenderImages[state.design]);
    const usesLiveMapping = usesTrixxMapping && ['left','right','front','rear'].includes(state.view) && !usesHqRender;
    const matsVisible = usesTrixxMapping && state.matsEnabled && ['left','right','rear'].includes(state.view);
    const designHue = hexHue(designColors[state.design][0]);
    const paletteHue = hexHue(state.primary);
    root.dataset.design = state.design;
    root.dataset.pattern = state.pattern;
    root.dataset.material = state.material;
    root.dataset.coverage = state.coverage;
    root.dataset.finish = state.finish;
    root.dataset.colorway = state.colorway;
    root.dataset.view = state.view;
    root.dataset.hq = usesHqRender ? 'true' : 'false';
    root.dataset.previewMode = usesHqRender ? 'render' : usesLiveMapping ? 'mapped' : 'template';
    root.dataset.mats = state.matsEnabled ? 'on' : 'off';
    root.dataset.matPattern = state.matPattern;
    root.dataset.matProfile = state.matProfile;
    root.dataset.matEdge = state.matEdge;
    root.dataset.overlay = state.overlay;
    root.dataset.canvasMode = state.moveMode ? 'move' : 'select';
    root.style.setProperty('--wrap-primary',state.primary);
    root.style.setProperty('--wrap-secondary',state.secondary);
    root.style.setProperty('--wrap-accent',state.accent);
    root.style.setProperty('--mat-top',state.matTop);
    root.style.setProperty('--mat-bottom',state.matBottom);
    root.style.setProperty('--mat-core',state.matCore);
    root.style.setProperty('--livery-hue',`${(paletteHue-designHue+360)%360}deg`);
    root.style.setProperty('--livery-sat',state.colorway==='mono'||state.colorway==='stealth' ? '.42' : '1.08');
    root.style.setProperty('--text-font',state.textFont);
    root.style.setProperty('--text-color',state.textColor);
    root.style.setProperty('--text-stroke',state.textOutline ? '1px' : '0');
    root.style.setProperty('--text-shadow',state.textShadow ? '0 2px 4px #000' : 'none');
    q('[data-viewer]').style.setProperty('--zoom',state.zoom);
    q('[data-viewer]').style.setProperty('--pan-x',`${state.panX}px`);
    q('[data-viewer]').style.setProperty('--pan-y',`${state.panY}px`);
    q('[data-photo-view]').hidden = ['template','mat-template'].includes(state.view);
    q('[data-template-view]').hidden = state.view!=='template';
    q('[data-mat-template-view]').hidden = state.view!=='mat-template';
    q('[data-wrap-layer]').hidden = !usesLiveMapping;
    q('[data-mat-layer]').hidden = !matsVisible;
    qa('[data-camera-map]').forEach((map) => map.toggleAttribute('hidden',!usesTrixxMapping || map.dataset.cameraMap!==state.view));
    qa('[data-camera-mats]').forEach((map) => map.toggleAttribute('hidden',!matsVisible || map.dataset.cameraMats!==state.view));
    qa('.photo-color-map > *').forEach((piece) => {
      let visible=true;
      if(state.coverage==='custom'){
        visible=state.coverageZones.some((zone)=>piece.classList.contains(`coverage-${zone}`));
        if(piece.classList.contains('coverage-accent-only'))visible=false;
      }
      piece.classList.toggle('coverage-zone-hidden',!visible);
    });
    const hqImage = usesHqRender ? designRenderImages[state.design] : '';
    q('[data-vehicle-image]').src = hqImage || (usesTrixxMapping && cameraImages[state.view] ? cameraImages[state.view] : product.image);
    q('[data-vehicle-image]').alt = `${usesHqRender ? 'TRIXLAB rendered' : 'Neutral'} 2022 Sea-Doo ${product.name} · ${cameraLabels[state.view] || 'studio view'}`;
    q('[data-zoom]').textContent = `${Math.round(state.zoom*100)}%`;
    q('[data-preview-name]').textContent = state.name || 'RACE GRAPHICS';
    q('[data-preview-number]').textContent = state.number || '21';
    q('[data-design-name]').textContent = designLabels[state.design];
    q('[data-coverage-label]').textContent = state.coverage==='custom'
      ? `CUSTOM · ${state.coverageZones.map((zone)=>({upper:'HOOD',side:'SIDES',accent:'ACCENTS'})[zone]).join(' + ')}`
      : coverageLabels[state.coverage];
    const paletteIndex=Math.max(0,Object.keys(colorways).indexOf(state.colorway));
    q('[data-variant-id]').textContent = `${state.colorway ? 'VARIANT' : 'CUSTOM'} ${String(Object.keys(designLabels).indexOf(state.design)*Object.keys(colorways).length+paletteIndex+1).padStart(3,'0')} / ${Object.keys(designLabels).length*Object.keys(colorways).length}`;
    q('[data-vehicle-meta]').textContent = `SEA-DOO ${product.name.toUpperCase()} · ${state.year} · ${cameraLabels[state.view]}`;
    q('[data-stage-model]').textContent = `${product.name.toUpperCase()} · ${state.year}`;
    q('[data-rail-model]').textContent = product.platform.toUpperCase();
    q('[data-year]').value = state.year;
    q('[data-model]').value = state.product;
    q('[data-platform]').value = product.platform;
    q('[data-name]').value = state.name;
    q('[data-number]').value = state.number;
    q('[data-notes]').value = state.notes;
    q('[data-text-font]').value = state.textFont;
    q('[data-text-color]').value = state.textColor;
    q('[data-text-outline]').checked = state.textOutline;
    q('[data-text-shadow]').checked = state.textShadow;
    q('[data-logo-size]').value = state.logoSize;
    q('[data-mats-enabled]').checked = state.matsEnabled;
    q('[data-mat-text]').value = state.matText;
    qa('[data-mat-preview]').forEach((element) => element.textContent = matDisplayText());
    q('[data-mat-color="top"]').value = state.matTop;
    q('[data-mat-color="bottom"]').value = state.matBottom;
    q('[data-mat-color="core"]').value = state.matCore;
    q('[data-mat-profile]').value = state.matProfile;
    q('[data-mat-badge]').value = state.matBadge;
    q('[data-mat-edge]').value = state.matEdge;
    q('[data-mat-layout-spec]').textContent=state.matProfile==='triple-9'?'9MM TRIPLE LAYER':'6MM DUAL LAYER';
    q('.mat-controls').hidden = !state.matsEnabled;
    qa('[data-template-name]').forEach((element) => element.textContent=state.name || 'RACE GRAPHICS');
    qa('[data-template-number]').forEach((element) => element.textContent=state.number || '21');
    q('[data-template-design]').textContent=designLabels[state.design];
    q('[data-template-palette]').textContent=state.colorway ? paletteLabels[state.colorway] : 'CUSTOM';
    q('[data-template-material]').textContent=`${labels.material[state.material]} · ${labels.finish[state.finish]} · ${labels.coverage[state.coverage]}`.toUpperCase();
    q('[data-template-mat]').textContent=state.matsEnabled
      ? `${matPatternLabels[state.matPattern]} · ${state.matProfile==='triple-9'?'9MM TRIPLE':'6MM DUAL'} · ${state.matTop.toUpperCase()} / ${state.matBottom.toUpperCase()} · ${matDisplayText()||'NO BADGE'}`
      : 'TRACTION MATS NOT SELECTED';
    document.querySelectorAll('[data-product]').forEach((button) => button.classList.toggle('active',button.dataset.product===state.product));
    qa('[data-wrap-color]').forEach((input) => {
      input.value = state[input.dataset.wrapColor];
      q(`[data-color-value="${input.dataset.wrapColor}"]`).textContent = input.value.toUpperCase();
    });
    const logo = q('[data-logo-preview]');
    if(state.logo){logo.src=state.logo;logo.hidden=false;}else{logo.removeAttribute('src');logo.hidden=true;}
    logo.style.width = `${state.logoSize*1.3}px`;
    logo.style.setProperty('--logo-x',`${state.logoX}%`);
    logo.style.setProperty('--logo-y',`${state.logoY}%`);
    qa('[data-template-logo]').forEach((templateLogo) => {
      if(state.logo){templateLogo.src=state.logo;templateLogo.hidden=false;}else{templateLogo.removeAttribute('src');templateLogo.hidden=true;}
      templateLogo.style.width=`${Math.max(7,Math.min(18,state.logoSize/8))}%`;
    });
    q('[data-drag-hint]').hidden = !state.logo || ['template','mat-template'].includes(state.view);
    const total = format(price());
    q('[data-price]').textContent = total;
    q('[data-add-price]').textContent = total;
    document.querySelector('[data-breakdown-price]').textContent = total;
    document.querySelector('[data-breakdown-coverage]').textContent = labels.coverage[state.coverage];
    document.querySelector('[data-breakdown-material]').textContent = labels.material[state.material];
    document.querySelector('[data-breakdown-finish]').textContent = labels.finish[state.finish];
    document.querySelector('[data-breakdown-mats]').textContent = state.matsEnabled ? format(matPrice()) : 'Not selected';
    q('[data-mats-only-price]').textContent=format(matPrice());
    q('[data-mat-price-note]').textContent=`+${format(matPrice())}`;
    q('[data-custom-coverage-price]').textContent=format(state.coverageZones.reduce((sum,zone)=>sum+customCoveragePrices[zone],0));
    document.querySelector('[data-build-count]').textContent = getBuilds().length;
    document.querySelector('[data-cart] b').textContent = cartCount();
    setActive('.design-card','design',state.design);
    setActive('[data-material]','material',state.material);
    setActive('[data-coverage]','coverage',state.coverage);
    setActive('[data-finish]','finish',state.finish);
    setActive('[data-colorway]','colorway',state.colorway);
    setActive('[data-mat-pattern]','matPattern',state.matPattern);
    setActive('[data-mat-colorway]','matColorway',state.matColorway);
    setActive('[data-mat-view]','matView',state.view);
    setActive('.view-switch [data-view]','view',state.view);
    setActive('[data-coverage-zone]','coverageZone','__none__');
    qa('[data-coverage-zone]').forEach((button)=>button.classList.toggle('active',state.coverageZones.includes(button.dataset.coverageZone)));
    setActive('[data-overlay]','overlay',state.overlay);
    setActive('[data-ai-style]','aiStyle',state.aiStyle);
    q('[data-move-mode]').classList.toggle('active',state.moveMode);
    q('[data-move-mode]').setAttribute('aria-pressed',String(state.moveMode));
    rememberHistory();
    q('[data-undo]').disabled=historyIndex<=0;
    q('[data-redo]').disabled=historyIndex>=history.length-1;
  };

  const drawer = document.querySelector('[data-products-drawer]');
  function openProducts(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');}
  function closeProducts(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
  document.querySelectorAll('[data-products-open]').forEach((button) => button.addEventListener('click',openProducts));
  document.querySelectorAll('[data-products-close]').forEach((button) => button.addEventListener('click',closeProducts));
  document.querySelectorAll('[data-product]').forEach((button) => button.addEventListener('click',() => setProduct(button.dataset.product,true)));
  qa('[data-view]').forEach((button) => button.addEventListener('click',() => {
    state.view=button.dataset.view;
    if(state.view==='mat-template')state.matsEnabled=true;
    render();
  }));

  qa('[data-tab]').forEach((button) => button.addEventListener('click',() => {
    const tab = button.dataset.tab;
    if (tab === 'mats') {state.view = 'mat-template';state.matsEnabled=true;}
    qa('[data-tab]').forEach((item) => item.classList.toggle('active',item===button));
    qa('[data-panel]').forEach((panel) => {
      const active = panel.dataset.panel===tab;
      panel.hidden = !active;
      panel.classList.toggle('active',active);
    });
    q('[data-progress]').textContent = `${String(qa('[data-tab]').indexOf(button)+1).padStart(2,'0')} / ${String(qa('[data-tab]').length).padStart(2,'0')}`;
    render();
  }));
  qa('.design-card').forEach((button) => button.addEventListener('click',() => {
    state.design = button.dataset.design;
    state.pattern = button.dataset.designPattern;
    render();
  }));
  qa('.design-card').forEach((button) => {
    const label=designLabels[button.dataset.design];
    button.querySelector('b').textContent=label;
    button.setAttribute('aria-label',`${label} design for Sea-Doo Spark Trixx 2UP`);
    button.querySelector('i').setAttribute('role','img');
    button.querySelector('i').setAttribute('aria-label',`${label} rendered graphics preview`);
  });
  qa('[data-material]').forEach((button) => button.addEventListener('click',() => {state.material=button.dataset.material;render();}));
  qa('[data-coverage]').forEach((button) => button.addEventListener('click',() => {
    state.coverage=button.dataset.coverage;
    state.coverageZones=state.coverage==='full'?['upper','side','accent']:state.coverage==='side'?['side']:['accent'];
    if (['template','mat-template'].includes(state.view)) state.view = 'left';
    render();
    notify(`${coverageLabels[state.coverage]} SELECTED`);
  }));
  qa('[data-finish]').forEach((button) => button.addEventListener('click',() => {state.finish=button.dataset.finish;render();}));
  qa('[data-colorway]').forEach((button) => button.addEventListener('click',() => {
    state.colorway = button.dataset.colorway;
    [state.primary,state.secondary,state.accent] = colorways[state.colorway];
    render();
  }));
  q('[data-randomize]').addEventListener('click',() => {
    const designs=Object.keys(designLabels);
    const palettes=Object.keys(colorways);
    state.design=designs[Math.floor(Math.random()*designs.length)];
    state.pattern=q(`.design-card[data-design="${state.design}"]`).dataset.designPattern;
    state.colorway=palettes[Math.floor(Math.random()*palettes.length)];
    [state.primary,state.secondary,state.accent]=colorways[state.colorway];
    render();
    notify(`${designLabels[state.design]} · ${paletteLabels[state.colorway]}`);
  });
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
  q('[data-text-font]').addEventListener('change',(event)=>{state.textFont=event.target.value;render();});
  q('[data-text-color]').addEventListener('input',(event)=>{state.textColor=event.target.value;render();});
  q('[data-text-outline]').addEventListener('change',(event)=>{state.textOutline=event.target.checked;render();});
  q('[data-text-shadow]').addEventListener('change',(event)=>{state.textShadow=event.target.checked;render();});
  qa('[data-library-logo]').forEach((button)=>button.addEventListener('click',()=>{
    state.logo=svgLogo(button.dataset.libraryLogo,state.number);
    state.logoX=62;state.logoY=53;state.logoSize=100;
    render();notify(`${button.querySelector('span').textContent} ADDED`);
  }));
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

  q('[data-mats-enabled]').addEventListener('change',(event) => {
    state.matsEnabled=event.target.checked;
    if (state.matsEnabled && !['left','right','rear','mat-template'].includes(state.view)) state.view='mat-template';
    render();
  });
  qa('[data-mat-view]').forEach((button)=>button.addEventListener('click',()=>{
    state.view=button.dataset.matView;state.matsEnabled=true;render();
  }));
  qa('[data-mat-colorway]').forEach((button)=>button.addEventListener('click',()=>{
    state.matColorway=button.dataset.matColorway;
    if(matColorways[state.matColorway])[state.matTop,state.matBottom,state.matCore]=matColorways[state.matColorway];
    state.matsEnabled=true;render();
  }));
  qa('[data-mat-pattern]').forEach((button) => button.addEventListener('click',() => {
    state.matPattern=button.dataset.matPattern;
    state.matsEnabled=true;
    if (!['left','right','rear','mat-template'].includes(state.view)) state.view='mat-template';
    render();
  }));
  qa('[data-mat-color]').forEach((input) => input.addEventListener('input',(event) => {
    const key={top:'matTop',bottom:'matBottom',core:'matCore'}[event.target.dataset.matColor];
    state[key]=event.target.value;
    state.matColorway='custom';
    state.matsEnabled=true;
    render();
  }));
  q('[data-mat-profile]').addEventListener('change',(event)=>{state.matProfile=event.target.value;state.matsEnabled=true;render();});
  q('[data-mat-badge]').addEventListener('change',(event)=>{state.matBadge=event.target.value;state.matsEnabled=true;render();});
  q('[data-mat-edge]').addEventListener('change',(event)=>{state.matEdge=event.target.value;state.matsEnabled=true;render();});
  q('[data-mat-text]').addEventListener('input',(event) => {
    state.matText=event.target.value.toUpperCase();
    state.matBadge='custom';
    state.matsEnabled=true;
    render();
  });
  qa('[data-coverage-zone]').forEach((button)=>button.addEventListener('click',()=>{
    const zone=button.dataset.coverageZone;
    const hasZone=state.coverageZones.includes(zone);
    if(hasZone&&state.coverageZones.length===1){notify('KEEP AT LEAST ONE PANEL AREA');return;}
    state.coverageZones=hasZone?state.coverageZones.filter((item)=>item!==zone):[...state.coverageZones,zone];
    state.coverage='custom';
    if(['template','mat-template'].includes(state.view))state.view='left';
    render();
    notify(`CUSTOM COVERAGE · ${state.coverageZones.length} AREA${state.coverageZones.length===1?'':'S'}`);
  }));
  qa('[data-overlay]').forEach((button)=>button.addEventListener('click',()=>{
    state.overlay=button.dataset.overlay;
    render();
  }));
  qa('[data-ai-style]').forEach((button)=>button.addEventListener('click',()=>{
    state.aiStyle=button.dataset.aiStyle;
    render();
  }));
  const generateConcept=()=>{
    const prompt=q('[data-ai-prompt]').value.trim();
    if(!prompt){notify('DESCRIBE YOUR ELEMENT FIRST');return;}
    const lower=prompt.toLowerCase();
    const matchedDesign=lower.includes('wave')||lower.includes('ocean')?'miami':lower.includes('camo')?'camo':lower.includes('electric')||lower.includes('bolt')?'electric':lower.includes('retro')?'heritage':'apex';
    const matchedPalette=lower.includes('red')?'race':lower.includes('green')||lower.includes('toxic')?'toxic':lower.includes('blue')?'ocean':lower.includes('pink')?'miami':state.colorway||'vapor';
    state.design=matchedDesign;
    state.pattern=q(`.design-card[data-design="${matchedDesign}"]`).dataset.designPattern;
    state.colorway=matchedPalette;
    [state.primary,state.secondary,state.accent]=colorways[matchedPalette];
    const conceptName=prompt.replace(/[^a-z0-9 äöüß-]/gi,'').trim().split(/\s+/).slice(0,2).join(' ')||'RACE';
    state.logo=svgLogo('ai',conceptName);
    state.logoX=62;state.logoY=53;state.logoSize=112;
    q('[data-ai-result-name]').textContent=`${conceptName.toUpperCase()} · ${state.aiStyle.toUpperCase()}`;
    q('[data-ai-result]').hidden=false;
    render();notify('ORIGINAL CONCEPT ELEMENT READY');
  };
  q('[data-ai-generate]').addEventListener('click',generateConcept);
  q('[data-ai-result]').addEventListener('click',()=>{if(state.logo){state.logoX=62;state.logoY=53;render();notify('CONCEPT ELEMENT APPLIED');}});
  q('[data-zoom-in]').addEventListener('click',() => {state.zoom=Math.min(1.25,state.zoom+.05);render();});
  q('[data-zoom-out]').addEventListener('click',() => {state.zoom=Math.max(.8,state.zoom-.05);render();});
  q('[data-move-mode]').addEventListener('click',()=>{state.moveMode=!state.moveMode;render();});
  q('[data-reset-view]').addEventListener('click',()=>{state.zoom=1;state.panX=0;state.panY=0;render();notify('VIEW RESET');});
  q('[data-undo]').addEventListener('click',()=>restoreHistory(historyIndex-1));
  q('[data-redo]').addEventListener('click',()=>restoreHistory(historyIndex+1));
  const viewer=q('[data-viewer]');
  viewer.addEventListener('pointerdown',(event)=>{
    if(!state.moveMode||event.target.closest('button')||event.target.closest('[data-logo-preview]'))return;
    panDrag={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,panX:state.panX,panY:state.panY};
    if(viewer.setPointerCapture)viewer.setPointerCapture(event.pointerId);
    viewer.classList.add('panning');
  });
  viewer.addEventListener('pointermove',(event)=>{
    if(!panDrag||panDrag.pointerId!==event.pointerId)return;
    state.panX=Math.max(-240,Math.min(240,panDrag.panX+event.clientX-panDrag.startX));
    state.panY=Math.max(-180,Math.min(180,panDrag.panY+event.clientY-panDrag.startY));
    viewer.style.setProperty('--pan-x',`${state.panX}px`);
    viewer.style.setProperty('--pan-y',`${state.panY}px`);
  });
  const endPan=(event)=>{
    if(!panDrag||panDrag.pointerId!==event.pointerId)return;
    if(viewer.hasPointerCapture&&viewer.hasPointerCapture(event.pointerId))viewer.releasePointerCapture(event.pointerId);
    panDrag=null;viewer.classList.remove('panning');render();
  };
  viewer.addEventListener('pointerup',endPan);
  viewer.addEventListener('pointercancel',endPan);
  document.addEventListener('keydown',(event)=>{
    if(!(event.ctrlKey||event.metaKey))return;
    if(event.key.toLowerCase()==='z'){event.preventDefault();restoreHistory(historyIndex+(event.shiftKey?1:-1));}
    if(event.key.toLowerCase()==='y'){event.preventDefault();restoreHistory(historyIndex+1);}
  });
  q('[data-price-info]').addEventListener('click',() => document.querySelector('[data-price-dialog]').showModal());
  q('[data-export-svg]').addEventListener('click',exportProductionSvg);
  q('[data-export-mats-svg]').addEventListener('click',exportMatsSvg);
  q('[data-save]').addEventListener('click',() => {
    const builds=getBuilds();
    builds.unshift({id:Date.now(),name:`${designLabels[state.design]} · ${state.year} ${products[state.product].name}`,date:new Date().toISOString(),state:snapshot()});
    localStorage.setItem(storageKey,JSON.stringify(builds.slice(0,12)));
    render();notify('BUILD SAVED');
  });
  document.querySelector('[data-save-header]').addEventListener('click',()=>q('[data-save]').click());
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
  q('[data-add-mats]').addEventListener('click',()=>{
    state.matsEnabled=true;
    const items=getCart();
    const configuration={
      product:state.product,year:state.year,type:'traction-mats',fitment:'Spark Trixx 2UP 2017-2023',
      pattern:state.matPattern,profile:state.matProfile,edge:state.matEdge,
      top:state.matTop,reveal:state.matBottom,core:state.matCore,badge:state.matBadge,text:matDisplayText()
    };
    const key=JSON.stringify(configuration);
    const existing=items.find((item)=>item.key===key);
    if(existing)existing.quantity=Number(existing.quantity||1)+1;
    else items.push({
      id:`trixlab-mats-${Date.now()}`,key,quantity:1,
      title:'Custom Traction Mats · Spark Trixx 2UP',
      subtitle:`8 pieces · ${matPatternLabels[state.matPattern]} · ${state.matProfile==='triple-9'?'9mm Triple Layer':'6mm Dual Layer'} · ${matDisplayText()||'No badge'}`,
      price:matPrice(),image:'assets/trixx-2022-rear.webp',configuration
    });
    saveCart(items);render();notify('CUSTOM TRACTION MATS ADDED TO CART');
  });
  q('[data-add]').addEventListener('click',() => {
    const items=getCart();
    const configuration={
      product:state.product,year:state.year,design:state.design,designName:designLabels[state.design],
      colorway:state.colorway || 'custom',coverage:state.coverage,coverageName:labels.coverage[state.coverage],
      material:state.material,finish:state.finish,matsEnabled:state.matsEnabled,
      matPattern:state.matPattern,matProfile:state.matProfile,matEdge:state.matEdge,
      matTop:state.matTop,matBottom:state.matBottom,matCore:state.matCore,
      matBadge:state.matBadge,matText:matDisplayText(),name:state.name,number:state.number,coverageZones:state.coverageZones,
      overlay:state.overlay,textFont:state.textFont,textColor:state.textColor
    };
    const key=JSON.stringify(configuration);
    const existing=items.find((item)=>item.key===key);
    if(existing) existing.quantity=Number(existing.quantity || 1)+1;
    else items.push({
      id:`trixlab-${Date.now()}`,key,quantity:1,
      title:`${designLabels[state.design]} · Spark Trixx 2UP`,
      subtitle:`${labels.coverage[state.coverage]} · ${labels.material[state.material]}${state.matsEnabled ? ` · ${matPatternLabels[state.matPattern]} ${state.matProfile==='triple-9'?'9mm':'6mm'} Mats` : ''}`,
      price:price(),image:designRenderImages[state.design],configuration
    });
    saveCart(items);
    render();
    notify('CONFIGURED KIT ADDED TO CART');
  });
  document.querySelector('[data-cart]').addEventListener('click',() => {
    if(!cartCount()){notify('YOUR CART IS EMPTY');return;}
    location.href='index.html?cart=open';
  });

  const introKey='trixlab-studio-intro-v2';
  const modelGate=document.querySelector('[data-model-gate]');
  const tourLayer=document.querySelector('[data-tour-layer]');
  const tourSteps=[
    {selector:'.design-rail',kicker:'DESIGN LIBRARY',title:'CHOOSE A MOTIF.',copy:'Start with one of 12 original TRIXLAB motifs. Every motif can be combined with all 20 palettes.'},
    {selector:'[data-viewer]',kicker:'LIVE PREVIEW',title:'CHECK EVERY ANGLE.',copy:'Use left, right, front, rear and the production panel layout. MOVE pans the canvas; zoom keeps the model geometry fixed.'},
    {selector:'.control-tabs',kicker:'CONFIGURATION',title:'BUILD IT YOUR WAY.',copy:'Material, colors, text, logos, mats, coverage, finish, overlays and notes are separate editable steps.'},
    {selector:'[data-tab="personalize"]',kicker:'PERSONALIZATION',title:'ADD YOUR IDENTITY.',copy:'Add rider text, race number, an original library badge or your own logo. Uploaded logos can be dragged directly on the ski.'},
    {selector:'[data-view="template"]',kicker:'PRODUCTION MAP',title:'VERIFY THE PANELS.',copy:'The panel layout and 1:1 SVG use the supplied Spark Trixx 2UP cut template for plot and production review.'},
    {selector:'.control-actions',kicker:'SAVE + ORDER',title:'YOUR BUILD IS READY.',copy:'Save the configuration, add the exact build to the cart, or export the mapped 1:1 production SVG.'}
  ];
  let tourIndex=0;
  let tourTarget=null;
  const clearTourTarget=()=>{if(tourTarget)tourTarget.classList.remove('tour-highlight');tourTarget=null;};
  const paintTour=()=>{
    clearTourTarget();
    const step=tourSteps[tourIndex];
    tourTarget=document.querySelector(step.selector);
    if(tourTarget){
      tourTarget.classList.add('tour-highlight');
      if(tourTarget.scrollIntoView)tourTarget.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
    }
    document.querySelector('[data-tour-step]').textContent=`${String(tourIndex+1).padStart(2,'0')} / ${String(tourSteps.length).padStart(2,'0')}`;
    document.querySelector('[data-tour-kicker]').textContent=step.kicker;
    document.querySelector('[data-tour-title]').textContent=step.title;
    document.querySelector('[data-tour-copy]').textContent=step.copy;
    document.querySelector('[data-tour-back]').disabled=tourIndex===0;
    document.querySelector('[data-tour-next]').textContent=tourIndex===tourSteps.length-1?'FINISH':'NEXT';
  };
  const endTour=()=>{
    clearTourTarget();tourLayer.hidden=true;localStorage.setItem(introKey,'seen');
  };
  const startTour=()=>{
    if(document.querySelector('[data-support-dialog]').open)document.querySelector('[data-support-dialog]').close();
    tourIndex=0;tourLayer.hidden=false;paintTour();
  };
  document.querySelector('[data-tour-next]').addEventListener('click',()=>{
    if(tourIndex>=tourSteps.length-1){endTour();return;}
    tourIndex+=1;paintTour();
  });
  document.querySelector('[data-tour-back]').addEventListener('click',()=>{if(tourIndex>0){tourIndex-=1;paintTour();}});
  document.querySelector('[data-tour-skip]').addEventListener('click',endTour);
  document.querySelectorAll('[data-tour-start]').forEach((button)=>button.addEventListener('click',startTour));
  document.querySelector('[data-help-open]').addEventListener('click',()=>document.querySelector('[data-support-dialog]').showModal());
  document.querySelector('[data-model-gate-continue]').addEventListener('click',()=>{
    modelGate.close();setProduct('trixx-2up');startTour();
  });
  document.querySelector('[data-model-gate-close]').addEventListener('click',()=>{
    modelGate.close();localStorage.setItem(introKey,'seen');
  });
  const loader=document.querySelector('[data-loader]');
  const finishLoading=()=>{
    document.querySelector('[data-loader-status]').textContent='STUDIO READY';
    document.querySelector('[data-loader-progress]').style.width='100%';
    setTimeout(()=>{
      loader.classList.add('done');
      if(!localStorage.getItem(introKey)&&!modelGate.open)modelGate.showModal();
    },350);
  };
  document.querySelector('[data-loader-progress]').style.width='62%';
  document.querySelector('[data-loader-status]').textContent='MAPPING 2UP PANELS + TRACTION MATS…';
  if(document.readyState==='complete')setTimeout(finishLoading,300);
  else window.addEventListener('load',()=>setTimeout(finishLoading,300),{once:true});
  const query = new URLSearchParams(location.search || sessionStorage.getItem('trixlab-studio-query') || '');
  if (query.get('product') && products[query.get('product')]?.available) state.product = query.get('product');
  if (query.get('tab') && q(`[data-tab="${query.get('tab')}"]`)) q(`[data-tab="${query.get('tab')}"]`).click();
  render();
})();
