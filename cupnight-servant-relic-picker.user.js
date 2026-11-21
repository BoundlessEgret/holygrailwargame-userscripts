// ==UserScript==
// @name         聖杯之夜：自選從者聖遺物
// @namespace    https://holygrailwargame.cupnight.workers.dev/
// @version      1.1
// @description  選擇本局或下局從者，取得並使用對應的聖遺物。
// @match        https://holygrailwargame.cupnight.workers.dev/*
// @updateURL    https://raw.githubusercontent.com/BoundlessEgret/holygrailwargame-userscripts/main/cupnight-servant-relic-picker.user.js
// @downloadURL  https://raw.githubusercontent.com/BoundlessEgret/holygrailwargame-userscripts/main/cupnight-servant-relic-picker.user.js
// @run-at       document-start
// @sandbox      raw
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const PENDING_KEY = 'cupnight.tm.relic-picker.pending.v1';
  const ACTIVE_KEY = 'cupnight.tm.relic-picker.active.v1';
  const CLASSES = {
    sword: 'Saber', lance: 'Lancer', bow: 'Archer', rider: 'Rider',
    caster: 'Caster', shadow: 'Assassin', berserk: 'Berserker',
    avenger: 'Avenger', judge: 'Ruler', moon: 'Moon Cancer', ego: 'Alter Ego',
  };
  // Traditional Chinese names and relics from the game's own zht dictionary.
  const ZH = {"sigurd":["齊格魯德","被火燻黑的戒指碎片"],"siegfried":["齊格飛","一片龍鱗"],"lancelot":["蘭斯洛特","被湖水鏽蝕的銀馬刺"],"arjuna":["阿周那","陳舊的弓弦絲線"],"robin":["羅賓漢","橡樹葉做的箭羽"],"atalanta":["阿塔蘭塔","卡呂冬野豬的獠牙碎片"],"cuchulainn":["庫．夫林","曾綁在石柱上的腰帶"],"hector":["赫克特","青銅頭盔的馬鬃飾羽"],"leonidas":["列奧尼達一世","溫泉關生鏽的槍頭"],"alexander":["伊斯坎達爾","刻著王之面容的銀幣"],"boudica":["布狄卡","青銅戰車的裝飾"],"achilles":["阿基里斯","赫菲斯托斯之盾的青銅碎片"],"medea":["美狄亞","一縷金色的羊毛"],"merlin":["梅林","長滿青苔的橡樹枝"],"paracelsus":["帕拉塞爾斯","曾鑲在劍柄上的紅色石頭碎片"],"jingke":["荊軻","易水冰冷的石頭"],"heracles":["赫拉克勒斯","涅墨亞獅子的毛皮"],"spartacus":["斯巴達克斯","生鏽的鐐銬環"],"lubu":["呂布奉先","紅色的雉雞翎"],"dantes":["巖窟王","挖穿牢牆的斷勺"],"salieri":["安東尼奧．薩里耶利","一張泛黃的五線譜紙"],"jeanne":["貞德","燒焦的旗布"],"qinshihuang":["始皇帝","裂成兩半的玉璽碎片"],"artoria":["阿爾托莉亞．潘德拉剛","閃耀金光的劍鞘碎片"],"nero":["尼祿．克勞狄烏斯","金線繡成的薔薇"],"gawain":["高文","綠色腰帶的線頭"],"mordred":["莫德雷德","鏽成紅色的頭盔裝飾"],"altera":["阿蒂拉","染成三種顏色的劍之碎片"],"charlemagne":["查理曼","帶有十二道刻痕的劍柄裝飾"],"bedivere":["貝德維爾","被湖水浸濕的銀色指節"],"okita":["沖田總司","印著「誠」字的羽織衣角"],"musashi":["宮本武藏","兩把木刀的碎屑"],"rama":["羅摩","燒焦的金色鹿毛"],"richard":["理查一世","刻有獅子紋章的盾牌碎片"],"emiya":["Emiya","出現裂痕的紅寶石吊墜"],"gilgamesh":["吉爾伽美什","世上第一條蛻皮之蛇的化石"],"chiron":["凱隆","半人馬陳舊的弓弦"],"arash":["阿拉什","身軀碎裂的弓兵之箭鏃"],"tristan":["崔斯坦","一根斷掉的豎琴弦"],"nobunaga":["織田信長","燒焦的南蠻披風碎片"],"tomoe":["巴御前","繪有火焰紋樣的弓韘"],"tesla":["尼古拉．特斯拉","一截燒壞的線圈"],"napoleon":["拿破崙","二角帽的羽毛"],"orion":["俄里翁","含著月光的銀箭"],"superorion":["超人俄里翁","走過大海的獵人的涼鞋"],"diarmuid":["迪爾姆德．奧德利暗","紅槍與黃槍的繩飾"],"karna":["迦爾納","一片黃金鎧甲的鱗片"],"vlad":["弗拉德三世","生鏽的木樁尖端"],"elizabeth":["伊莉莎白．巴托里","出現裂痕的手鏡"],"enkidu":["恩奇都","一把烏魯克城牆的泥土"],"scathach":["斯卡薩哈","掛在影之國大門上的紅布"],"romulus":["羅慕路斯","喝狼奶長大的孩子的銅鈴"],"brynhild":["布倫希爾德","從火焰之環中取出的戒指"],"qinliangyu":["秦良玉","白桿槍的流蘇裝飾"],"fionn":["芬恩．麥克庫爾","智慧鮭魚的鱗片"],"medusa":["美杜莎","珀伽索斯的白色羽毛"],"drake":["弗朗西斯．德雷克","刻有金鹿的船釘"],"astolfo":["阿斯托爾福","從月亮上帶回來的玻璃瓶"],"georgios":["聖喬治","浸染龍血的十字徽章"],"teach":["愛德華．蒂奇","插在鬍子上的一截導火線"],"ozymandias":["奧茲曼迪亞斯","刻有太陽的石板碎片"],"medb":["女王梅芙","裝著一塊乳酪的銀盒"],"ushiwaka":["牛若丸","鞍馬山天狗的羽扇"],"ivan":["伊凡雷帝","黃金權杖的頂飾"],"odysseus":["奧德修斯","木馬的木片"],"hippolyta":["希波呂忒","從軍神腰帶上掉落的金屬裝飾"],"gilles":["吉爾．德．萊斯","被火燒焦的聖女旗幟之線"],"tamamo":["玉藻前","用狐狸尾毛編成的護身符"],"andersen":["漢斯．克里斯蒂安．安徒生","一張墨水暈開的原稿"],"shakespeare":["威廉．莎士比亞","第一部全集破損的扉頁"],"davinci":["李奧納多．達．文西","一張用鏡像文字寫下的便條"],"nitocris":["尼托克里絲","刻有冥界之神的鏡子碎片"],"mozart":["沃夫岡．阿瑪迪斯．莫札特","沾有墨漬的安魂曲樂譜"],"sanzang":["玄奘三藏","一個金色的箍"],"circe":["喀耳刻","豬形的銀胸針"],"avicebron":["阿維斯布隆","刻有希伯來文字的泥板"],"prelati":["弗朗索瓦．普勒拉蒂","畫著倒五芒星的卡片"],"kojiro":["佐佐木小次郎","長刀物干竿的刀鐔"],"cursedarm":["咒腕的哈桑","纏在右臂上的繃帶布"],"hundred":["百貌的哈桑","白色骷髏面具的碎片"],"serenity":["靜謐的哈桑","用毒草編成的髮繩"],"kinghassan":["山之翁","刻有晚鐘的黑鐵碎片"],"semiramis":["塞彌拉彌斯","插著鴿羽的銀色毒瓶"],"jack":["開膛手傑克","霧夜的報紙碎片"],"lishuwen":["李書文","槍頭磨損的大槍"],"sanson":["夏爾．亨利．桑松","斷頭台刀刃上的鏽片"],"shuten":["酒吞童子","紅色酒杯的碎片"],"frankenstein":["弗蘭肯斯坦","一顆燒壞的螺栓"],"asterios":["阿斯忒里翁","迷宮牆壁的石片"],"darius":["大流士三世","不死部隊的槍頭"],"beowulf":["貝奧武夫","格倫戴爾的爪子"],"kintoki":["坂田金時","金色斧頭的裝飾繩"],"raikou":["源賴光","刻有雷紋的弓弭"],"ibaraki":["茨木童子","包裹過斷臂的綢緞"],"penthesilea":["彭忒西勒亞","亞馬遜女王折斷的槍"],"hijikata":["土方歲三","「誠」字旗的碎片"],"caligula":["卡利古拉","沐浴月光的金幣"],"hessian":["海森．羅伯","一把灰狼的毛"],"kagekiyo":["平景清","平家赤旗的碎片"],"angra":["安格拉曼紐","刻著紅色刺青的繃帶"],"jalter":["貞德〔Alter〕","燒得焦黑的旗布"],"amakusa":["天草四郎","刻有十字架的念珠珠子"],"holmes":["夏洛克．福爾摩斯","沾著菸斗灰的放大鏡"],"caenis":["凱妮絲","被海水沖刷過的槍刃碎片"],"quixote":["唐吉訶德","缺了口的理髮師銅盆"],"percival":["帕西瓦爾","見過聖杯的騎士的銀杯"],"kagetora":["長尾景虎","刻有「毗」字的軍旗碎片"],"morgan":["摩根","冰封湖泊的水滴"],"shingen":["武田信玄","風林火山軍旗的一縷絲線"],"ptolemaios":["托勒密","亞歷山卓燈塔的石頭碎片"],"kriemhild":["克琳希德","殘留血跡的菩提樹葉"],"solomon":["所羅門","第十枚戒指"],"baobhan":["芭班．希","一隻鞋跟磨損的紅色高跟鞋"],"barghest":["巴格斯特","被黑焰燻焦的角的碎片"],"melusine":["美露莘","一片閃爍著虹彩的鱗片"],"muramasa":["千子村正","村正一派鍛造的一把短刀"],"ishtar":["伊絲塔","曾供奉於烏魯克神殿的青金石項鍊"],"ereshkigal":["埃列什基伽勒","刻有冥界七道門的泥板"],"lanling":["蘭陵王","有裂痕的鬼面面具碎片"],"habetrot":["哈貝特洛特","小紡車和一捲金色的線"],"quetzalcoatl":["魁札爾．科亞特爾","刻有羽蛇的石雕"],"kama":["迦摩","用甘蔗莖做成的弓"],"sheba":["示巴女王","曾裝過香料和黃金的舊箱子"],"asclepius":["阿斯克勒庇俄斯","纏繞著蛇的木杖"],"constantine":["君士坦丁十一世","狄奧多西城牆的石塊碎片"],"huyan":["呼延灼","一對竹節形狀的鐵鞭"],"lilith":["莉莉絲","黑色貓頭鷹的羽毛"],"yuyoku":["幽弋的哈桑","熄了火的舊影燈籠"],"nameless":["無名的Assassin","有裂痕的骷髏面具碎片"],"bb":["BB","一條末端褪色的紅色緞帶"],"meltryllis":["Meltryllis","一隻腳尖被磨得鋒利的銀色足尖鞋"],"passionlip":["Passionlip","一個留有深深爪痕的小音樂盒"],"suzuka":["鈴鹿御前","一截掛在手機上當吊飾的紅色刀緒"],"tamamocat":["玉藻貓","一隻留有爪痕的大貓爪手套"],"emiya_alter":["Emiya〔Alter〕","從帶刃手槍裡退出的一枚空彈殼"]};
  const read = key => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  };
  const write = (key, value) => {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  };

  function install() {
    if (typeof Sim === 'undefined' || !Sim.HEROES || !Sim.newLife ||
        !Sim.load || !Sim.resolve) {
      setTimeout(install, 30);
      return;
    }
    if (window.__CUPNIGHT_RELIC_PICKER_V1) return;
    window.__CUPNIGHT_RELIC_PICKER_V1 = true;

    const heroes = Sim.HEROES.filter(h => h.relic && Sim.CLS[h.cls] &&
      !Sim.CLS[h.cls].boss);
    const byId = Object.fromEntries(heroes.map(h => [h.id, h]));
    const zhByKo = new Map();
    for (const h of heroes) if (ZH[h.id]) {
      zhByKo.set(h.name, ZH[h.id][0]);
      zhByKo.set(h.relic, ZH[h.id][1]);
    }
    let pending = read(PENDING_KEY);
    if (!byId[pending]) pending = null;
    let active = read(ACTIVE_KEY);
    if (!active || !byId[active.id]) active = null;
    let updatePanel = () => {};

    const label = value => {
      if (zhByKo.has(value)) return zhByKo.get(value);
      try { return typeof tr === 'function' ? tr(value) : value; }
      catch { return value; }
    };
    const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    const sameLife = state => !!(state && active && state.seed === active.seed &&
      state.birthYear === active.birthYear);
    const canApplyNow = state => !!(state && !state.dead && !state.hero &&
      (state.phase === 'life' || state.phase === 'war'));
    const clearForce = id => {
      if (id && window.__FORCE_HERO === id) delete window.__FORCE_HERO;
    };

    function syncForce(state) {
      if (sameLife(state) && !state.hero && !state.dead) {
        window.__FORCE_HERO = active.id;
      } else if (active) clearForce(active.id);
    }

    function grantRelic(state, id) {
      const h = byId[id];
      if (!h || !canApplyNow(state)) return false;
      if (active && active.id !== id) clearForce(active.id);
      state.flags ||= {};
      state.flags.tmRelicChoice = id;
      state.relics = Array.isArray(state.relics) ? state.relics : [];
      state.relSeen = Array.isArray(state.relSeen) ? state.relSeen : [];
      if (!state.relics.includes(id)) state.relics.unshift(id);
      if (!state.relSeen.includes(id)) state.relSeen.push(id);
      // A previously selected bond would take precedence over a relic.
      state.bond = null;
      active = { id, seed: state.seed, birthYear: state.birthYear };
      write(ACTIVE_KEY, active);
      syncForce(state);
      updatePanel();
      return true;
    }

    function choose(id) {
      if (!byId[id]) return;
      const state = Sim.S;
      if (canApplyNow(state)) {
        grantRelic(state, id);
        pending = null;
        write(PENDING_KEY, null);
      } else {
        pending = id;
        write(PENDING_KEY, id);
        updatePanel();
      }
    }

    const originalNewLife = Sim.newLife;
    Sim.newLife = function (...args) {
      clearForce(active?.id);
      const state = originalNewLife.apply(this, args);
      active = null;
      write(ACTIVE_KEY, null);
      // Keep the pending choice until Sim.start: another script may reroll
      // newLife several times and discard all but the final birth.
      if (pending && byId[pending]) grantRelic(state, pending);
      updatePanel();
      return state;
    };

    const originalStart = Sim.start;
    Sim.start = function (...args) {
      if (pending && canApplyNow(Sim.S)) grantRelic(Sim.S, pending);
      const result = originalStart.apply(this, args);
      if (pending && sameLife(Sim.S) && active.id === pending) {
        pending = null;
        write(PENDING_KEY, null);
        updatePanel();
      }
      return result;
    };

    const originalLoad = Sim.load;
    Sim.load = function (...args) {
      const state = originalLoad.apply(this, args);
      const id = byId[state?.flags?.tmRelicChoice] ? state.flags.tmRelicChoice :
        sameLife(state) ? active.id : null;
      if (id && canApplyNow(state)) grantRelic(state, id);
      else syncForce(state);
      updatePanel();
      return state;
    };

    // When several relics exist, select the chosen one in the game's own
    // catalyst decision. Other decisions and battles remain manual.
    let selecting = false;
    setInterval(() => {
      const state = Sim.S;
      syncForce(state);
      if (selecting || !sameLife(state) || !canApplyNow(state) ||
          state.paused || window.__lbBirth || state.pending?.title !== '촉매') return;
      const i = state.pending.choices.findIndex(c =>
        c.t === byId[active.id].relic && !c.off);
      if (i < 0) return;
      selecting = true;
      try { Sim.resolve(i, ''); }
      catch (error) { console.error('[Cupnight relic picker] Catalyst choice failed:', error); }
      finally { selecting = false; }
    }, 80);

    // Restore a selection in an already running life after installing the script.
    const liveId = byId[Sim.S?.flags?.tmRelicChoice] ? Sim.S.flags.tmRelicChoice :
      sameLife(Sim.S) ? active.id : null;
    if (liveId && canApplyNow(Sim.S)) grantRelic(Sim.S, liveId);
    else syncForce(Sim.S);

    function mountPanel() {
      if (!document.body) { setTimeout(mountPanel, 30); return; }
      const host = document.createElement('div');
      host.id = 'tm-cupnight-relic-picker';
      const root = host.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host { all: initial; font: 14px/1.45 system-ui, sans-serif; color: #f4e8ca; }
          * { box-sizing: border-box; }
          button, input, select { font: inherit; }
          #open { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000;
            padding: 10px 14px; border: 1px solid #d5b56a; border-radius: 999px;
            color: #fff1c7; background: #141828; box-shadow: 0 5px 20px #0009; cursor: pointer; }
          #panel { position: fixed; right: 16px; bottom: 64px; z-index: 2147483001;
            width: min(520px, calc(100vw - 32px)); max-height: min(76vh, 680px);
            display: flex; flex-direction: column; overflow: hidden; border: 1px solid #a98e57;
            border-radius: 14px; background: #101525; box-shadow: 0 16px 48px #000c; }
          #panel[hidden] { display: none; }
          header { padding: 14px 16px 9px; border-bottom: 1px solid #5c4e35; }
          header strong { font-size: 17px; }
          header p { margin: 5px 0 0; color: #c7c9d1; font-size: 12px; }
          .filters { display: flex; gap: 8px; padding: 10px 12px; }
          input, select { min-width: 0; padding: 9px 10px; border: 1px solid #6c6880;
            border-radius: 8px; color: #fff; background: #20263a; }
          input { flex: 1; }
          select { max-width: 140px; }
          #list { overflow: auto; padding: 0 12px 10px; }
          .hero { display: block; width: 100%; margin: 4px 0; padding: 9px 11px;
            text-align: left; color: #f4e8ca; background: #1b2235; border: 1px solid #454a5d;
            border-radius: 9px; cursor: pointer; }
          .hero:hover, .hero[aria-pressed="true"] { border-color: #e3bb63; background: #333047; }
          .hero b { display: block; font-weight: 650; }
          .hero small { display: block; color: #bbc2d2; margin-top: 2px; }
          footer { padding: 10px 12px 12px; border-top: 1px solid #5c4e35; }
          #status { min-height: 18px; color: #f3d586; font-size: 12px; }
          .actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .actions button { padding: 7px 12px; border: 1px solid #a98e57; border-radius: 7px;
            color: #f4e8ca; background: #262c40; cursor: pointer; }
          #close { background: #66512d; }
        </style>
        <button id="open" type="button">🎯 選擇本局從者</button>
        <section id="panel" role="dialog" aria-label="選擇從者聖遺物" hidden>
          <header><strong>選擇從者聖遺物</strong>
            <p>未召喚前選擇會套用本局；召喚後選擇會留給下局。祈荒為頭目專用，不能契約。</p>
          </header>
          <div class="filters"><input id="search" type="search" placeholder="搜尋從者或聖遺物">
            <select id="class" aria-label="職階"><option value="">所有職階</option></select></div>
          <div id="list"></div>
          <footer><div id="status"></div><div class="actions">
            <button id="zh" type="button">遊戲改成繁中</button>
            <button id="clear" type="button">清除預選</button>
            <button id="close" type="button">完成</button>
          </div></footer>
        </section>`;
      document.body.appendChild(host);
      const $ = selector => root.querySelector(selector);
      const classSelect = $('#class');
      classSelect.innerHTML += Object.entries(CLASSES).filter(([id]) =>
        heroes.some(h => h.cls === id)).map(([id, name]) =>
          `<option value="${id}">${name}</option>`).join('');

      const render = () => {
        const query = $('#search').value.trim().toLocaleLowerCase();
        const cls = classSelect.value;
        const shown = heroes.filter(h => (!cls || h.cls === cls) &&
          (!query || [h.id, h.name, h.relic, label(h.name), label(h.relic)]
            .some(part => String(part).toLocaleLowerCase().includes(query))));
        const current = sameLife(Sim.S) ? active?.id : null;
        const chosen = current && !Sim.S.hero ? current : pending || current;
        $('#list').innerHTML = shown.length ? shown.map(h => `
          <button class="hero" type="button" data-id="${escapeHtml(h.id)}"
            aria-pressed="${chosen === h.id}"><b>${escapeHtml(label(h.name))}</b>
            <small>${escapeHtml(CLASSES[h.cls] || h.cls)} · 聖遺物：${escapeHtml(label(h.relic))}</small></button>`)
          .join('') : '<p>沒有符合的從者。</p>';
        const h = byId[chosen];
        const place = current && chosen === current && !Sim.S.hero ? '本局已取得' :
          pending && chosen === pending ? '下局預選' : current ? '本局已召喚' : '';
        $('#status').textContent = h ? `${place}：${label(h.name)}的聖遺物「${label(h.relic)}」` :
          '尚未選擇；不影響正常開局。';
        $('#open').textContent = h ? `🎯 ${place}：${label(h.name)}` : '🎯 選擇本局從者';
      };
      updatePanel = render;
      $('#open').onclick = () => { $('#panel').hidden = !$('#panel').hidden; if (!$('#panel').hidden) $('#search').focus(); };
      $('#close').onclick = () => { $('#panel').hidden = true; };
      $('#zh').onclick = () => {
        localStorage.setItem('cupnight.lang', JSON.stringify('zht'));
        location.reload();
      };
      $('#search').oninput = render;
      classSelect.onchange = render;
      $('#list').onclick = event => {
        const button = event.target.closest('button[data-id]');
        if (button) choose(button.dataset.id);
      };
      $('#clear').onclick = () => {
        pending = null;
        write(PENDING_KEY, null);
        const state = Sim.S;
        if (sameLife(state) && canApplyNow(state)) {
          const id = active.id;
          state.relics = (state.relics || []).filter(x => x !== id);
          state.relSeen = (state.relSeen || []).filter(x => x !== id);
          delete state.flags.tmRelicChoice;
          clearForce(id);
          active = null;
          write(ACTIVE_KEY, null);
        }
        render();
      };
      render();
    }
    if (typeof document !== 'undefined') mountPanel();
    console.info('[Cupnight relic picker] Ready; selectable Servants:', heroes.length);
  }

  install();
})();
