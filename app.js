
var TIER={S:0,A:1,B:2,C:3,D:4};
var RNAMES={common:'普通',uncommon:'稀有',rare:'超稀有',legendary:'传奇',secret:'神秘'};
var RCOLORS={common:'#6b7280',uncommon:'#3b82f6',rare:'#a855f7',legendary:'#f59e0b',secret:'#9b59b6'};
var TCOLORS={S:'#ef4444',A:'#f97316',B:'#eab308',C:'#22c55e',D:'#64748b'};

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function cardHTML(j){
  var r=j.rarity||'common';
  var t=j.tier||'';
  var color=RCOLORS[r]||'#6b7280';
  var tc=TCOLORS[t]||'#64748b';
  var nm=j.name_cn||j.name||'';
  var en=j.name||'';
  var ltr=nm.charAt(0)||'?';
  var tags='';
  if(j.tags&&j.tags.length)tags=j.tags.slice(0,4).map(function(x){return'<span class=tag>'+esc(x)+'</span>';}).join('');
  var tH=t?'<span class="tier t-'+t.toLowerCase()+'">'+t+'</span>':'';
  var synHTML='';
  if(j.synergy&&j.synergy.length){
    synHTML='<div class=syn>协同: '+j.synergy.map(function(s){return'<span class=syntag>'+esc(s)+'</span>';}).join('')+'</div>';
  }
  return '<div class="card '+r+'" onclick="show(\''+j.id+'\')">'+
    '<div class=ci style="background:linear-gradient(145deg,'+color+'33,'+color+'11);border:2px solid '+color+'44;border-radius:12px;padding:8px;text-align:center;">'+
    '<div style="font-size:36px;font-weight:bold;color:'+color+';line-height:1;">'+esc(ltr)+'</div>'+
    '<div style="font-size:10px;color:#fff;margin-top:2px;font-weight:bold;">'+esc(nm.substring(0,6))+'</div>'+
    '<div style="font-size:8px;color:rgba(255,255,255,0.4);">'+esc(en.substring(0,12))+'</div>'+
    '<div style="margin-top:4px;font-size:9px;color:rgba(255,255,255,0.6);line-height:1.3;">'+(j.effect?'+'+esc(j.effect.substring(0,40)):'')+'</div>'+
    '</div>'+
    '<div class=cn><b>'+esc(nm)+'</b><br><span class=en>'+esc(en)+'</span></div>'+
    '<div class=cr><span class="ct '+r+'">'+RNAMES[r]+'</span>'+tH+'</div>'+
    synHTML+
    '<p class=ce>'+esc((j.effect||'').substring(0,40))+'</p>'+
    '<div class=tags>'+tags+'</div></div>';
}

function show(id){
  var j=CARD_DATA.find(function(x){return x.id===id;});
  if(!j)return;
  var color=RCOLORS[j.rarity]||'#6b7280';
  var tc=TCOLORS[j.tier]||'#64748b';
  var nm=j.name_cn||j.name||'';
  var tH=j.tier?'<span class="tier t-'+j.tier.toLowerCase()+'">'+j.tier+'</span>':'';
  var syn=j.synergy||[];
  var synHTML=syn.length?'<div class=ms><h4>推荐协同</h4><ul>'+syn.map(function(s){return'<li>'+esc(s)+'</li>';}).join('')+'</ul></div>':'';
  var comboHTML=j.combo_tips?'<div class=mc-tip><h4>组合思路</h4><p>'+esc(j.combo_tips)+'</p></div>':'';
  document.getElementById('modal-body').innerHTML=
    '<div class=mbig style="border:3px solid '+color+';border-radius:16px;padding:20px;background:linear-gradient(145deg,'+color+'33,'+color+'11);text-align:center;margin-bottom:20px;">'+
    '<div style="font-size:64px;font-weight:bold;color:'+color+';">'+esc(nm.charAt(0))+'</div>'+
    '<div style="font-size:16px;font-weight:bold;color:#fff;margin-top:4px;">'+esc(nm)+'</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,0.5);">'+esc(j.name||'')+'</div></div>'+
    '<div class=mm><span class="ct '+j.rarity+'">'+RNAMES[j.rarity]+'</span>'+tH+'<span class=pill><strong>费用:</strong>'+j.cost+'</span></div>'+
    '<p class=me>'+esc(j.effect||'')+'</p>'+synHTML+comboHTML;
  document.getElementById('modal').classList.add('on');
}

function closeModal(){document.getElementById('modal').classList.remove('on');}

function switchTab(name){
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on');});
  document.querySelectorAll('.nav').forEach(function(n){n.classList.remove('active');});
  document.getElementById('tab-'+name).classList.add('on');
  document.getElementById('tab-'+name+'-btn').classList.add('active');
}

function doSearch(q){
  var lq=q.toLowerCase().trim();
  if(!lq){document.getElementById('search-grid').innerHTML='<div class=empty>输入关键词搜索...</div>';return;}
  var r=CARD_DATA.filter(function(j){
    return(j.name_cn||'').toLowerCase().indexOf(lq)>=0||
           (j.name||'').toLowerCase().indexOf(lq)>=0||
           (j.effect||'').toLowerCase().indexOf(lq)>=0||
           (j.tags||[]).some(function(t){return t.toLowerCase().indexOf(lq)>=0;})||
           (j.synergy||[]).some(function(s){return s.toLowerCase().indexOf(lq)>=0;});
  });
  r.sort(function(a,b){return(TIER[a.tier]||9)-(TIER[b.tier]||9);});
  if(r.length){
    document.getElementById('search-grid').innerHTML=
      '<div class=stat-bar><span class=pill>找到 <strong>'+r.length+'</strong> 张卡牌</span></div>'+
      r.map(cardHTML).join('');
  }else{
    document.getElementById('search-grid').innerHTML='<div class=empty>没有找到「'+esc(q)+'」</div>';
  }
}

document.addEventListener('DOMContentLoaded',function(){
  var s=CARD_DATA.slice().sort(function(a,b){return(TIER[a.tier]||9)-(TIER[b.tier]||9);});
  document.getElementById('joker-grid').innerHTML=s.map(cardHTML).join('');
  document.getElementById('search-grid').innerHTML='<div class=empty>输入关键词搜索卡牌...</div>';
});

document.getElementById('modal').onclick=function(e){if(e.target===this)closeModal();};
