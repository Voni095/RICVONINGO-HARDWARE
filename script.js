
const PRODUCTS = [
    { id: 'p1', name: 'Wood plank', cat: 'wood', price: 75 },
    { id: 'p2', name: 'Clay bricks (10)', cat: 'bricks', price: 120 },
    { id: 'p3', name: 'Hammer (tool)', cat: 'tools', price: 35 },
    { id: 'p4', name: 'Interior paint (5L)', cat: 'paint', price: 220 },
    { id: 'p5', name: 'Screws pack', cat: 'tools', price: 25 },
    { id: 'p6', name: 'Plywood sheet', cat: 'wood', price: 150 },
  ];
  
  function $(sel){return document.querySelector(sel)}
  function $all(sel){return Array.from(document.querySelectorAll(sel))}
  
  // localStorage cart helpers
  const CART_KEY = 'riv_cart_v1';
  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch(e){ return [];}
  }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartDisplays(); }
  function addToCart(prodId){
    const cart = getCart();
    const found = cart.find(i=>i.id===prodId);
    if(found) found.qty += 1; else cart.push({id:prodId, qty:1});
    saveCart(cart);
  }
  function removeFromCart(prodId){
    let cart = getCart().filter(i=>i.id!==prodId);
    saveCart(cart);
  }
  function clearCart(){ saveCart([]); }
  
  function updateCartDisplays(){
    const cart = getCart();
    const itemsContainer = $('#cart-items');
    const itemsContainer2 = $('#cart-items-2');
    const viewCart = $('#view-cart');
    const checkout = $('#checkout');
  
    const summary = cart.length===0 ? 'No items' : cart.map(ci=>{
      const p = PRODUCTS.find(x=>x.id===ci.id);
      return `${p.name} × ${ci.qty}`;
    }).join('<br>');
  
    if(itemsContainer) itemsContainer.innerHTML = summary;
    if(itemsContainer2) itemsContainer2.innerHTML = summary;
    if(viewCart) viewCart.textContent = cart.length ? `View Cart (${cart.reduce((s,i)=>s+i.qty,0)})` : 'View Cart';
    if(checkout) checkout.disabled = cart.length===0;
  }
  
  /* Renderers for page areas */
  function renderHomepageSidebar(){
    const container = $('#sidebar-products');
    if(!container) return;
    container.innerHTML = '';
    const picks = PRODUCTS.slice(0,4);
    for(const p of picks){
      const el = document.createElement('div');
      el.className = 'product-card';
      el.innerHTML = `<div class="thumb"></div><div class="title">${p.name}</div>
        <button class="btn add" data-id="${p.id}">Add</button>`;
      container.appendChild(el);
    }
    $all('#sidebar-products .add').forEach(b=>b.addEventListener('click', e=>addToCart(e.target.dataset.id)));
  }
  
  function renderFeatured(){
    const container = $('#featured-grid');
    if(!container) return;
    container.innerHTML = '';
    for(const p of PRODUCTS.slice(0,4)){
      const el = document.createElement('div');
      el.className = 'product-card';
      el.innerHTML = `<div class="thumb"></div><div class="title">${p.name}</div>
        <button class="btn add" data-id="${p.id}">Add</button>`;
      container.appendChild(el);
    }
    $all('#featured-grid .add').forEach(b=>b.addEventListener('click', e=>addToCart(e.target.dataset.id)));
  }
  
  function renderProductsGrid(category){
    const container = $('#products-grid');
    if(!container) return;
    container.innerHTML = '';
    const list = (category && category!=='all') ? PRODUCTS.filter(p=>p.cat===category) : PRODUCTS;
    for(const p of list){
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `<div class="thumb"></div>
        <div class="title">${p.name}</div>
        <div class="meta">R ${p.price}</div>
        <div style="margin-top:8px">
          <button class="btn add" data-id="${p.id}">Add to cart</button>
        </div>`;
      container.appendChild(card);
    }
    $all('.product-card .add').forEach(b=>b.addEventListener('click', e=>{
      addToCart(e.target.dataset.id);
      // little feedback
      e.target.textContent = 'Added';
      setTimeout(()=>e.target.textContent='Add to cart',900);
    }));
  }
  
  function renderSidebarProductsContact(){
    const container = $('#sidebar-products-2');
    if(!container) return;
    container.innerHTML = '';
    for(const p of PRODUCTS.slice(0,2)){
      const el = document.createElement('div');
      el.className = 'product-card';
      el.innerHTML = `<div class="thumb"></div><div class="title">${p.name}</div>
        <button class="btn add" data-id="${p.id}">Add</button>`;
      container.appendChild(el);
    }
    $all('#sidebar-products-2 .add').forEach(b=>b.addEventListener('click', e=>addToCart(e.target.dataset.id)));
  }
  
  /* attach nav & interactive handlers */
  document.addEventListener('DOMContentLoaded', ()=>{
    // set years
    ['#year','#year2','#year3','#year4'].forEach(s=>{ const el=$(s); if(el) el.textContent = new Date().getFullYear(); });
  
    updateCartDisplays();
    renderHomepageSidebar();
    renderFeatured();
    renderSidebarProductsContact();
    renderProductsGrid();
  
    // category chips on products page
    $all('.chip').forEach(chip=>{
      chip.addEventListener('click', e=>{
        $all('.chip').forEach(c=>c.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.dataset.cat;
        renderProductsGrid(cat);
      });
    });
  
    // panel buttons in index.html
    const s1 = $('#select-one'), s2 = $('#select-two');
    if(s1) s1.addEventListener('click', ()=> {
      if(PRODUCTS[0]) { addToCart(PRODUCTS[0].id); alert(`${PRODUCTS[0].name} added to cart`); }
    });
    if(s2) s2.addEventListener('click', ()=> {
      if(PRODUCTS[1]) { addToCart(PRODUCTS[1].id); alert(`${PRODUCTS[1].name} added to cart`); }
    });
  
    // view cart
    const viewCart = $('#view-cart');
    if(viewCart) viewCart.addEventListener('click', ()=>{
      const cart = getCart();
      if(cart.length===0) return alert('Cart is empty');
      const lines = cart.map(ci=>{
        const p = PRODUCTS.find(x=>x.id===ci.id);
        return `${p.name} × ${ci.qty} (R ${p.price} each)`;
      }).join('\n');
      if(confirm(lines + '\n\nClear cart?')) clearCart();
    });
  
    // checkout button
    const checkout = $('#checkout');
    if(checkout) checkout.addEventListener('click', ()=>{
      const cart = getCart();
      if(cart.length===0) return alert('Cart empty');
      const total = cart.reduce((sum,ci)=> {
        const p = PRODUCTS.find(x=>x.id===ci.id);
        return sum + (p.price * ci.qty);
      }, 0);
      if(confirm(`Total: R ${total}\nProceed to checkout?`)) { clearCart(); alert('Order placed (demo).'); }
    });
  
    // contact form
    const contactForm = $('#contact-form');
    if(contactForm){
      contactForm.addEventListener('submit', e=>{
        e.preventDefault();
        const name = $('#name').value.trim();
        const email = $('#email').value.trim();
        const message = $('#message').value.trim();
        if(!name||!email||!message) return alert('Please fill all fields');
        // simulate send
        alert('Message sent. Thank you, ' + name + '!');
        contactForm.reset();
      });
    }
  
    // product grid in other pages: rebind add buttons that may have been added dynamically
    // done inside renderers above
  
    updateCartDisplays();
  });
  