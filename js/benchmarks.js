/* ==========================================================================
   Dywe Open-Source Microstructure Benchmarks Interactive Explorer (v0.3.3)
   Drop into: js/benchmarks.js
   All numbers strictly verified against dywe-ablation-sim v0.3.3 README.
   ========================================================================== */

(function () {
  'use strict';

  var DATA = {
    l1: {
      datasetBadge: 'Native L1 · Mar 2024',
      markoutDelta: '−40.4%',
      markoutSub: '−0.782 vs. −1.312 bp · −87.1% stale sniping (SOL L1: −54.3%)',
      droppedVol: '0.0%',
      droppedSub: 'Post-decrypt New (ALO) → Cancel → Taker ($64.36B replayed)',
      zeroMev: '+0.005 bp',
      zeroMevSub: 'Negligible overhead vs. 70 ms open batch (SOL L1: −0.014 bp)',
      mevSavings: '−22.3% to −48.2%',
      mevSavingsSub: '25%–50% capture / 1.0 bp · Breakeven at 10% / 0.5 bp',
      placeboNote:
        'Circular-shift placebo control (600 s): 97.3% of Regime A 1s markout and 95.8% of the B − A cancel-priority gap vanish, confirming genuine causal adverse selection on true L1 quotes.',
      rows: [
        { name: 'A: Continuous FIFO', mk: '−1.312 bp', sp: '1.112 bp', allin: '0.670 bp', drop: '0.0%', dywe: false },
        { name: 'B: Open Batch 70 ms (hl)', mk: '−0.667 bp', sp: '0.467 bp', allin: '0.651 bp', drop: '0.0%', dywe: false },
        { name: 'C: Uniform FBA 100 ms', mk: '−0.622 bp', sp: '0.422 bp', allin: '0.671 bp', drop: '0.0%', dywe: false },
        { name: 'D: Dywe IBTE 50 ms (35 ms dec)', mk: '−0.782 bp', sp: '0.582 bp', allin: '0.656 bp', drop: '0.0%', dywe: true }
      ],
      scenarios: {
        zero: {
          label: 'Sterile Zero-MEV Baseline',
          delta: '+0.005 bp',
          win: false,
          pct: 5,
          verdict:
            'Virtually identical execution cost to a 70 ms open priority batch even when zero MEV occurs, with 10% conservative cancel-header leakage modeled.'
        },
        breakeven: {
          label: '10% Capture · 0.5 bp Impact',
          delta: '−0.019 bp (D<B)',
          win: true,
          pct: 22,
          verdict:
            'Statistically cheaper than a 70 ms open batch (95% block bootstrap CI < 0) as soon as 10% of ≥$50k orders experience 0.5 bp of MEV extraction.'
        },
        mid: {
          label: '25% Capture · 1.0 bp Impact',
          delta: '−0.145 bp (−22.3%)',
          win: true,
          pct: 58,
          verdict:
            'Cuts total taker All-In Net execution cost by 22.3% vs. a 70 ms open batch across $64.4B of Native L1 bookTicker flow (68.2% large-order share).'
        },
        high: {
          label: '50% Capture · 1.0 bp Impact',
          delta: '−0.314 bp (−48.2%)',
          win: true,
          pct: 95,
          verdict:
            'Nearly halves All-In taker execution costs (−48.2%) under active mempool MEV while keeping 0.0% dropped USD volume.'
        }
      }
    },

    primary: {
      datasetBadge: 'BTC+ETH · Nov 2026',
      markoutDelta: '−38.9%',
      markoutSub: '−1.049 vs. −1.717 bp · −88.1% stale sniping (71,633 → 8,523)',
      droppedVol: '0.0%',
      droppedSub: 'Post-decrypt New (ALO) → Cancel → Taker ($168.20B replayed)',
      zeroMev: '−0.002 bp (~)',
      zeroMevSub: 'Statistically indistinguishable from 70 ms open batch at MEV = 0',
      mevSavings: '−16.8% to −35.9%',
      mevSavingsSub: '25%–50% capture / 1.0 bp · Breakeven at 10% / 0.5 bp',
      placeboNote:
        'Circular-shift placebo control (600 s): 96.8% of Regime A 1s markout (−1.717 → −0.055 bp) and 97.2% of the B − A gap vanish across 56 synchronized 3-hour blocks.',
      rows: [
        { name: 'A: Continuous FIFO', mk: '−1.717 bp', sp: '1.517 bp', allin: '0.928 bp', drop: '0.0%', dywe: false },
        { name: 'B: Open Batch 70 ms (hl)', mk: '−0.885 bp', sp: '0.685 bp', allin: '0.924 bp', drop: '0.0%', dywe: false },
        { name: 'C: Uniform FBA 100 ms', mk: '−0.861 bp', sp: '0.661 bp', allin: '0.950 bp', drop: '0.0%', dywe: false },
        { name: 'D: Dywe IBTE 50 ms (35 ms dec)', mk: '−1.049 bp', sp: '0.849 bp', allin: '0.922 bp', drop: '0.0%', dywe: true }
      ],
      scenarios: {
        zero: {
          label: 'Sterile Zero-MEV Baseline',
          delta: '−0.002 bp (~)',
          win: true,
          pct: 6,
          verdict:
            'Statistically zero latency tax vs. a 70 ms open batch across 14 pair-days of BTCUSDT and ETHUSDT ($168.2B replayed).'
        },
        breakeven: {
          label: '10% Capture · 0.5 bp Impact',
          delta: '−0.026 bp (D<B)',
          win: true,
          pct: 25,
          verdict:
            'Strictly cheaper than a 70 ms open batch (95% CI < 0) at minimal MEV incidence across 71.2% large-order (≥$50k) volume share.'
        },
        mid: {
          label: '25% Capture · 1.0 bp Impact',
          delta: '−0.155 bp (−16.8%)',
          win: true,
          pct: 60,
          verdict:
            'Saves 0.155 bp (−16.8%) on total All-In execution cost for BTC/ETH takers vs. an open-mempool 70 ms priority CLOB.'
        },
        high: {
          label: '50% Capture · 1.0 bp Impact',
          delta: '−0.332 bp (−35.9%)',
          win: true,
          pct: 96,
          verdict:
            'Cuts total All-In taker cost by 35.9% (−0.332 bp) under 50% MEV capture while preserving full MM cancel protection.'
        }
      }
    },

    sol: {
      datasetBadge: 'SOLUSDT · Nov 2026',
      markoutDelta: '−33.5%',
      markoutSub: '−1.435 vs. −2.159 bp · −85.3% stale sniping on thinner book',
      droppedVol: '0.0%',
      droppedSub: 'Post-decrypt New (ALO) → Cancel → Taker ($15.1B replayed)',
      zeroMev: '+0.002 bp (~)',
      zeroMevSub: 'Statistically ~0 vs. 70 ms open batch · −0.232 bp cheaper than FIFO',
      mevSavings: '−6.5% to −14.3%',
      mevSavingsSub: '25%–50% capture / 1.0 bp · ≥$50k orders = 42.4% of SOL vol',
      placeboNote:
        'Placebo control removes 77.7% of Regime A markout; the residual reflects the uniform $25k simulated sniper clip representing 15.0% of SOL FIFO volume (vs. 1.1% on BTC/ETH). Full per-regime CSV in results/SOL_B70_hl_vs_D50_hl_drop/.',
      rows: [
        { name: 'A: Continuous FIFO', mk: '−2.159 bp', sp: '1.959 bp', allin: '+0.232 bp vs D', drop: '0.0%', dywe: false },
        { name: 'B: Open Batch 70 ms (hl)', mk: 'See GitHub', sp: 'See GitHub', allin: '−0.002 bp vs D (~)', drop: '0.0%', dywe: false },
        { name: 'D: Dywe IBTE 50 ms (35 ms dec)', mk: '−1.435 bp', sp: '1.235 bp', allin: 'Baseline (−0.232 vs A)', drop: '0.0%', dywe: true }
      ],
      scenarios: {
        zero: {
          label: 'Sterile Zero-MEV Baseline',
          delta: '+0.002 bp (~)',
          win: false,
          pct: 5,
          verdict:
            'Matches 70 ms open batch cost (+0.002 bp, statistically zero) while beating Continuous FIFO by −0.232 bp even with zero MEV.'
        },
        breakeven: {
          label: '10% Capture · 0.5 bp Impact',
          delta: '−0.010 bp (D<B)',
          win: true,
          pct: 18,
          verdict:
            'Statistically beats a 70 ms open batch (D < B) starting at 10% capture / 0.5 bp impact even with SOLUSDT’s lower 42.4% large-order share.'
        },
        mid: {
          label: '25% Capture · 1.0 bp Impact',
          delta: '−6.5% All-In (D<B)',
          win: true,
          pct: 48,
          verdict:
            'Reduces All-In taker cost by 6.5% vs. a 70 ms open batch while shielding mid-cap directional sweeps from sandwich extraction.'
        },
        high: {
          label: '50% Capture · 1.0 bp Impact',
          delta: '−14.3% All-In (D<B)',
          win: true,
          pct: 84,
          verdict:
            'Delivers a 14.3% reduction in total taker execution costs on thinner altcoin liquidity with 0.0% dropped USD volume.'
        }
      }
    }
  };

  function init() {
    var root = document.getElementById('benchmarks');
    if (!root) return;

    var state = { ds: 'l1', sc: 'zero' };
    var tabs = root.querySelectorAll('[data-bm-ds]');
    var pills = root.querySelectorAll('[data-bm-sc]');
    var tbody = document.getElementById('bmTableBody');
    var meterFill = document.getElementById('bmMeterFill');

    function setField(name, text) {
      var el = root.querySelector('[data-bm-field="' + name + '"]');
      if (el) el.textContent = text;
    }

    function render() {
      var d = DATA[state.ds];
      var s = d.scenarios[state.sc];

      setField('datasetBadge', d.datasetBadge);
      setField('markoutDelta', d.markoutDelta);
      setField('markoutSub', d.markoutSub);
      setField('droppedVol', d.droppedVol);
      setField('droppedSub', d.droppedSub);
      setField('zeroMev', d.zeroMev);
      setField('zeroMevSub', d.zeroMevSub);
      setField('mevSavings', d.mevSavings);
      setField('mevSavingsSub', d.mevSavingsSub);
      setField('placeboNote', d.placeboNote);

      if (tbody) {
        tbody.innerHTML = '';
        d.rows.forEach(function (r) {
          var tr = document.createElement('tr');
          if (r.dywe) tr.className = 'is-dywe';
          [r.name, r.mk, r.sp, r.allin, r.drop].forEach(function (val) {
            var td = document.createElement('td');
            td.textContent = val;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
      }

      setField('scLabel', s.label);
      setField('scVerdict', s.verdict);
      var deltaEl = root.querySelector('[data-bm-field="scDelta"]');
      if (deltaEl) {
        deltaEl.textContent = s.delta;
        deltaEl.classList.toggle('is-win', !!s.win);
      }
      if (meterFill) {
        meterFill.style.width = s.pct + '%';
      }

      tabs.forEach(function (btn) {
        var active = btn.getAttribute('data-bm-ds') === state.ds;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      pills.forEach(function (btn) {
        var active = btn.getAttribute('data-bm-sc') === state.sc;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.ds = btn.getAttribute('data-bm-ds');
        render();
      });
    });

    pills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.sc = btn.getAttribute('data-bm-sc');
        render();
      });
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
