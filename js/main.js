(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* ---------- hero order book (illustrative) ---------- */
  var mid = 68240.5, STEP = 5, N = 6;
  var asks = [], bids = [];
  function rnd(a,b){return a + Math.random()*(b-a)}
  function seed(){ asks=[];bids=[]; for(var i=0;i<N;i++){asks.push(rnd(.4,6.5));bids.push(rnd(.4,6.5));} }
  function fmt(n){return n.toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1})}
  function row(cls,price,size,max){
    return '<div class="ob-row '+cls+'"><i style="width:'+Math.max(6,(size/max)*100)+'%"></i><span>'+fmt(price)+'</span><span>'+size.toFixed(2)+'</span></div>';
  }
  function drawBook(){
    var max = Math.max.apply(null,asks.concat(bids));
    var a='',b='';
    for(var i=N-1;i>=0;i--){a+=row('a',mid+(i+1)*STEP/2,asks[i],max)}
    for(var j=0;j<N;j++){b+=row('b',mid-(j+1)*STEP/2,bids[j],max)}
    $('#asks').innerHTML=a; $('#bids').innerHTML=b; $('#mid').textContent=fmt(mid);
  }
  seed(); drawBook();
  if(!reduce){
    setInterval(function(){
      for(var k=0;k<3;k++){
        var i=Math.floor(Math.random()*N);
        if(Math.random()<.5) asks[i]=Math.max(.2,asks[i]+rnd(-1.4,1.6)); else bids[i]=Math.max(.2,bids[i]+rnd(-1.4,1.6));
      }
      mid += rnd(-1.2,1.2)*STEP/2;
      drawBook();
    },1100);
  }

  /* ---------- sealed batch animation (50ms commit -> 35ms decrypt -> <10ms ALO-first match) ---------- */
  var batchNo = 0, ticks = 0;
  function hex(n){var s='';for(var i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}
  var orders = [];

  function shuffle(arr){
    for(var i=arr.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var tmp=arr[i]; arr[i]=arr[j]; arr[j]=tmp;
    }
    return arr;
  }

  function newBatch(){
    batchNo++; ticks=0;
    var mkBuyPx  = fmt(mid - Math.round(rnd(1,3))*STEP/2);
    var mkSellPx = fmt(mid + Math.round(rnd(1,3))*STEP/2);
    var tkSide1  = Math.random()<.5?'buy':'sell';
    var tkSide2  = Math.random()<.5?'buy':'sell';
    var cancelId = hex(4);

    // Arrival order is mixed pre-commit; post-decrypt executes strictly: ALO (1) -> CANCEL (2) -> TAKER (3)
    orders = shuffle([
      {
        prio: 1, tag: 'ALO', side: 'buy', plaintext: false,
        h: '0x'+hex(4)+'…'+hex(4),
        txt: 'BUY '+rnd(.4,3.2).toFixed(2)+' @ '+mkBuyPx
      },
      {
        prio: 1, tag: 'ALO', side: 'sell', plaintext: false,
        h: '0x'+hex(4)+'…'+hex(4),
        txt: 'SELL '+rnd(.4,3.2).toFixed(2)+' @ '+mkSellPx
      },
      {
        prio: 2, tag: 'CANCEL', side: 'cancel', plaintext: true,
        h: 'hdr:cancel #'+cancelId,
        txt: 'CANCEL #'+cancelId+' (MM)'
      },
      {
        prio: 3, tag: 'TAKER', side: tkSide1, plaintext: false,
        h: '0x'+hex(4)+'…'+hex(4),
        txt: (tkSide1==='buy'?'BUY ':'SELL ')+rnd(.5,4.8).toFixed(2)+' @ '+fmt(mid)
      },
      {
        prio: 3, tag: 'TAKER', side: tkSide2, plaintext: false,
        h: '0x'+hex(4)+'…'+hex(4),
        txt: (tkSide2==='buy'?'BUY ':'SELL ')+rnd(.3,2.9).toFixed(2)+' @ '+fmt(mid+(tkSide2==='buy'?1:-1)*STEP/2)
      }
    ]);
    setBatchHeader('50ms commit');
  }

  function setBatchHeader(phase){
    var el = $('#batchTitle');
    if(el) el.textContent = 'Batch #'+batchNo+' · '+phase;
  }

  function drawBatch(revealed){
    var list = revealed
      ? orders.slice().sort(function(a,b){ return a.prio - b.prio; })
      : orders;
    var html='';
    list.forEach(function(o){
      if(revealed){
        var sideCls = o.side === 'cancel' ? '' : ' '+o.side;
        html += '<div class="batch-line open'+sideCls+'"><span class="h">'+o.txt+'</span><span class="st">'+o.tag+'</span></div>';
      } else if(o.plaintext){
        html += '<div class="batch-line"><span class="h">'+o.h+'</span><span class="st">cancel-hdr</span></div>';
      } else {
        html += '<div class="batch-line"><span class="h">'+o.h+'</span><span class="st">sealed</span></div>';
      }
    });
    $('#batch').innerHTML=html;
  }

  function drawShares(n){
    $$('#shares i').forEach(function(el,i){el.classList.toggle('on',i<n)});
    $('#shareLbl').textContent=n+' of 7 key shares';
  }

  newBatch();
  if(reduce){
    setBatchHeader('<10ms match');
    drawBatch(true);
    drawShares(5);
  } else {
    drawBatch(false); drawShares(0);
    setInterval(function(){
      ticks++;
      if(ticks<=5){
        setBatchHeader(ticks<=1 ? '50ms commit' : '35ms decrypt');
        drawBatch(false);
        drawShares(ticks);
      } else if(ticks===6){
        setBatchHeader('<10ms match');
        drawBatch(true);
        drawShares(5);
      } else if(ticks===9){
        newBatch();
        drawBatch(false);
        drawShares(0);
        ticks=0;
      }
    },650);
  }

  /* ---------- latency bars reveal ---------- */
  var bars = $$('#bars .bar-row');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ bars.forEach(function(b,i){setTimeout(function(){b.classList.add('in')},i*180)}); io.disconnect(); } });
    },{threshold:.3});
    io.observe($('#bars'));
    setTimeout(function(){bars.forEach(function(b){b.classList.add('in')})},4000);
  } else { bars.forEach(function(b){b.classList.add('in')}); }

  /* ---------- tabs ---------- */
  var tabs = $$('.tab');
  function selectTab(t){
    tabs.forEach(function(x){
      var on = x===t;
      x.setAttribute('aria-selected',on); x.tabIndex = on?0:-1;
      var p = document.getElementById(x.getAttribute('aria-controls'));
      p.classList.toggle('on',on); p.hidden=!on;
    });
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){selectTab(t)});
    t.addEventListener('keydown',function(e){
      var k = e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
      if(k){ var n=tabs[(i+k+tabs.length)%tabs.length]; selectTab(n); n.focus(); e.preventDefault(); }
    });
  });

  /* ---------- security rings ---------- */
  (function(){
    var g = $('#rings'); if(!g) return;
    var radii=[188,160,132,104,76,48], NS='http://www.w3.org/2000/svg', rings=[], ticks=[];
    radii.forEach(function(r,i){
      var poly=document.createElementNS(NS,'polygon');
      poly.setAttribute('points','200,'+(200-r)+' '+(200+r)+',200 200,'+(200+r)+' '+(200-r)+',200');
      poly.setAttribute('class','ring'); poly.setAttribute('stroke-linejoin','round');
      g.appendChild(poly); rings.push(poly);
      var t=document.createElementNS(NS,'text'); t.setAttribute('x',200); t.setAttribute('y',200-r+17);
      t.setAttribute('class','tick'); t.textContent=i+1; g.appendChild(t); ticks.push(t);
    });
    var items=$$('#layers li');
    function setOn(k){
      rings.forEach(function(x,i){x.classList.toggle('on',i===k)});
      ticks.forEach(function(x,i){x.classList.toggle('on',i===k)});
      items.forEach(function(x,i){x.classList.toggle('on',i===k)});
    }
    items.forEach(function(li,i){
      li.addEventListener('mouseenter',function(){setOn(i)});
      li.addEventListener('focus',function(){setOn(i)});
      li.addEventListener('click',function(){setOn(i)});
    });
    rings.forEach(function(r,i){ r.addEventListener('mouseenter',function(){setOn(i)}); r.addEventListener('click',function(){setOn(i)}); });
    setOn(5);
  })();

  /* ---------- waitlist modal ---------- */
  var dlg = $('#wl'), form = $('#f'), err = $('#fErr');
  var endpoint = (window.DYWE_CONFIG && window.DYWE_CONFIG.formEndpoint) || 'api/waitlist.php';
  function openWL(role){
    $('#wlForm').hidden=false; $('#wlDone').hidden=true; err.textContent='';
    if(role){ var sel=$('#fRole'); if($$('option',sel).some(function(o){return o.value===role})) sel.value=role; }
    if(dlg.showModal){ if(!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open',''); }
    setTimeout(function(){ $('#fName').focus(); },30);
  }
  function closeWL(){ if(dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  $$('[data-wl]').forEach(function(b){ b.addEventListener('click',function(){ openWL(b.getAttribute('data-role')); }); });
  $('#wlClose').addEventListener('click',closeWL);
  $('#wlDoneClose').addEventListener('click',closeWL);
  dlg.addEventListener('click',function(e){ if(e.target===dlg) closeWL(); });

  form.addEventListener('submit',async function(e){
    e.preventDefault(); err.textContent='';
    var name = $('#fName').value.trim(), email = $('#fEmail').value.trim();
    if(name.length<2){ err.textContent='Enter your full name.'; $('#fName').focus(); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){ err.textContent='Enter a valid email address, for example name@company.com.'; $('#fEmail').focus(); return; }
    if(!$('#fOk').checked){ err.textContent='Please confirm the consent box to continue.'; $('#fOk').focus(); return; }
    var btn = $('#fSubmit');
    var payload = new FormData(form);
    payload.set('name', name);
    payload.set('email', email);
    payload.set('role', $('#fRole').value);
    payload.set('volume', $('#fVol').value);
    payload.set('org', $('#fOrg').value.trim());
    payload.set('telegram', $('#fTg').value.trim());
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      var response = await fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { 'Accept': 'application/json' }
      });
      var result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || '');
      }
      form.reset();
      $('#wlForm').hidden = true;
      $('#wlDone').hidden = false;
      $('#wlPreview').hidden = true;
    } catch (ex) {
      err.textContent = ex.message || 'Network error. Please try again in a moment.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Request access';
    }
  });
})();


(function () {
  'use strict';

  var cfg = window.SECURITY_CONFIG;
  var stackEl = document.getElementById('bStack');
  if (!cfg || !stackEl) return;

  var capEl    = document.getElementById('cap');
  var detailEl = document.getElementById('detail');
  var items    = Array.prototype.slice.call(document.querySelectorAll('#layers li'));
  var slabs    = [];

  function setOn(k) {
    slabs.forEach(function (el, i) { el.classList.toggle('on', i === k); });
    items.forEach(function (el, i) { el.classList.toggle('on', i === k); });

    if (capEl) {
      capEl.innerHTML = 'Layer ' + (k + 1) + ' <b>·</b> ' + cfg.layers[k].name;
    }

    if (detailEl && items[k]) {
      var more = items[k].querySelector('.more');
      detailEl.innerHTML =
        '<h4>' + cfg.layers[k].name + '</h4>' + (more ? more.innerHTML : '');
    }
  }


  for (var i = 0; i < cfg.totalLayers; i++) {
    var slab = document.createElement('div');
    slab.className = 'slab' + (i === cfg.coreIndex ? ' core' : '');
    slab.style.setProperty('--z', (cfg.totalLayers - 1) - i);

    var label = document.createElement('i');
    label.textContent = (i + 1) + ' ' + cfg.layers[i].short;
    slab.appendChild(label);

    (function (k) {
      slab.addEventListener('mouseenter', function () { setOn(k); });
      slab.addEventListener('click',      function () { setOn(k); });
    })(i);

    stackEl.appendChild(slab);
    slabs.push(slab);
  }

  // Sync the layer list.
  items.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { setOn(i); });
    li.addEventListener('focus',      function () { setOn(i); });
    li.addEventListener('click',      function () { setOn(i); });
  });

  // Initial state.
  setOn(0);
})();
