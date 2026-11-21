// ==UserScript==
// @name         Cupnight: A circuits every new life
// @namespace    https://holygrailwargame.cupnight.workers.dev/
// @version      1.1
// @description  每次新人生都取得 A 級魔術迴路，不更改從者。
// @match        https://holygrailwargame.cupnight.workers.dev/*
// @updateURL    https://raw.githubusercontent.com/BoundlessEgret/holygrailwargame-userscripts/main/cupnight-every-life-a.user.js
// @downloadURL  https://raw.githubusercontent.com/BoundlessEgret/holygrailwargame-userscripts/main/cupnight-every-life-a.user.js
// @run-at       document-start
// @sandbox      raw
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  function install() {
    if (typeof Sim === 'undefined') {
      setTimeout(install, 25);
      return;
    }
    if (typeof Sim.newLife !== 'function' || Sim.GR?.[5] !== 'A') {
      console.warn('[Cupnight A circuits] Game birth interface changed; script not applied.');
      return;
    }

    const originalNewLife = Sim.newLife;
    Sim.newLife = function (options = {}) {
      const base = Number.isInteger(options.seed)
        ? options.seed
        : Math.floor(Math.random() * 0x80000000);

      // Keep the game's own family, circuit, and starting-stat rules intact.
      for (let i = 0; i < 128; i++) {
        const state = originalNewLife.call(this, { ...options, seed: (base + i) >>> 0 });
        if (state.circuit === 5) return state;
      }

      // Seed 7 is an A-grade birth in the current game version.
      const state = originalNewLife.call(this, { ...options, seed: 7 });
      if (state.circuit !== 5) {
        throw new Error('[Cupnight A circuits] Game birth rules changed; A-grade seed failed.');
      }
      return state;
    };
  }

  install();
})();
