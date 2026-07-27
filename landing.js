(() => {
  const cartKey = 'trixlab-cart-v1';
  const orderKey = 'trixlab-order-requests-v1';
  const menu = document.querySelector('[data-menu]');
  const menuDrawer = document.querySelector('[data-menu-drawer]');
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartItems = document.querySelector('[data-cart-items]');
  const checkoutButton = document.querySelector('[data-checkout]');
  const checkoutDialog = document.querySelector('[data-checkout-dialog]');
  const checkoutForm = document.querySelector('[data-checkout-form]');
  const format = (cents) => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g,(character)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[character]);
  let toastTimer;

  const notify = (message) => {
    const toast=document.querySelector('[data-site-toast]');
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);
  };
  const getCart = () => {
    try{return JSON.parse(localStorage.getItem(cartKey)||'[]');}catch{return [];}
  };
  const saveCart = (items) => {
    localStorage.setItem(cartKey,JSON.stringify(items));
    renderCart();
  };
  const cartCount = (items=getCart()) => items.reduce((sum,item)=>sum+Number(item.quantity||1),0);
  const cartTotal = (items=getCart()) => items.reduce((sum,item)=>sum+Number(item.price||0)*Number(item.quantity||1),0);
  const openCart = () => {
    renderCart();
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  };
  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden','true');
    document.body.style.removeProperty('overflow');
  };

  function renderCart() {
    const items=getCart();
    document.querySelectorAll('[data-cart-count]').forEach((counter)=>counter.textContent=cartCount(items));
    document.querySelector('[data-cart-subtotal]').textContent=format(cartTotal(items));
    document.querySelector('[data-checkout-total]').textContent=format(cartTotal(items));
    checkoutButton.disabled=!items.length;
    if(!items.length){
      cartItems.innerHTML='<div class="cart-empty"><b>YOUR CART IS EMPTY</b><span>Configure a Trixx 2UP graphics kit or traction mat set.</span><a href="studio.html?product=trixx-2up">OPEN STUDIO</a></div>';
      return;
    }
    cartItems.innerHTML=items.map((item,index)=>`
      <article class="cart-item">
        <img src="${escapeHtml(item.image || 'assets/apex-race-left.webp')}" alt="">
        <div class="cart-item-copy">
          <b>${escapeHtml(item.title)}</b>
          <small>${escapeHtml(item.subtitle)}</small>
          <em>${format(Number(item.price||0))}</em>
        </div>
        <div class="cart-item-actions">
          <button type="button" data-cart-remove="${index}" aria-label="Artikel entfernen">REMOVE</button>
          <div class="quantity"><button type="button" data-cart-decrease="${index}" aria-label="Menge reduzieren">−</button><span>${Number(item.quantity||1)}</span><button type="button" data-cart-increase="${index}" aria-label="Menge erhöhen">+</button></div>
        </div>
      </article>`).join('');
    cartItems.querySelectorAll('[data-cart-remove]').forEach((button)=>button.addEventListener('click',()=>{
      const next=getCart();
      next.splice(Number(button.dataset.cartRemove),1);
      saveCart(next);
      notify('ITEM REMOVED');
    }));
    cartItems.querySelectorAll('[data-cart-increase]').forEach((button)=>button.addEventListener('click',()=>{
      const next=getCart();
      next[Number(button.dataset.cartIncrease)].quantity=Number(next[Number(button.dataset.cartIncrease)].quantity||1)+1;
      saveCart(next);
    }));
    cartItems.querySelectorAll('[data-cart-decrease]').forEach((button)=>button.addEventListener('click',()=>{
      const next=getCart();
      const index=Number(button.dataset.cartDecrease);
      next[index].quantity=Math.max(0,Number(next[index].quantity||1)-1);
      if(!next[index].quantity) next.splice(index,1);
      saveCart(next);
    }));
  }

  menu?.addEventListener('click', () => { menuDrawer.hidden = !menuDrawer.hidden; });
  menuDrawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menuDrawer.hidden = true; }));
  document.querySelectorAll('a[href^="studio.html?"]').forEach((link) => {
    link.addEventListener('click',() => sessionStorage.setItem('trixlab-studio-query',link.search));
  });
  document.querySelectorAll('[data-cart-open]').forEach((button)=>button.addEventListener('click',openCart));
  document.querySelectorAll('[data-cart-close]').forEach((button)=>button.addEventListener('click',closeCart));
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape'){
      closeCart();
      if(checkoutDialog.open) checkoutDialog.close();
    }
  });
  checkoutButton.addEventListener('click',()=>{
    if(!getCart().length)return;
    closeCart();
    document.querySelector('[data-checkout-success]').hidden=true;
    checkoutForm.hidden=false;
    checkoutDialog.showModal();
  });
  document.querySelectorAll('[data-checkout-close]').forEach((button)=>button.addEventListener('click',()=>checkoutDialog.close()));
  checkoutDialog.addEventListener('click',(event)=>{if(event.target===checkoutDialog)checkoutDialog.close();});
  checkoutForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!checkoutForm.reportValidity())return;
    const requests=(()=>{
      try{return JSON.parse(localStorage.getItem(orderKey)||'[]');}catch{return [];}
    })();
    const data=Object.fromEntries(new FormData(checkoutForm).entries());
    requests.unshift({
      id:`TL-${Date.now()}`,
      createdAt:new Date().toISOString(),
      customer:data,
      items:getCart(),
      total:cartTotal()
    });
    localStorage.setItem(orderKey,JSON.stringify(requests.slice(0,10)));
    localStorage.removeItem(cartKey);
    checkoutForm.hidden=true;
    document.querySelector('[data-checkout-success]').hidden=false;
    renderCart();
  });
  document.querySelector('[data-newsletter]').addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!event.currentTarget.reportValidity())return;
    notify('WELCOME TO TRIXLAB');
    event.currentTarget.reset();
  });

  renderCart();
  if(new URLSearchParams(location.search).get('cart')==='open') openCart();
})();
