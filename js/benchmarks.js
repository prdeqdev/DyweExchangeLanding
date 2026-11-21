/* ==========================================================================
   Dywe Open-Source Microstructure Benchmarks Interactive Explorer (v0.3.4)
   Drop into: js/benchmarks.js
   All numbers strictly verified against dywe-ablation-sim v0.3.4 reports.
   ========================================================================== */

   (function () {
    'use strict';
  
    var DATA = {
      l1: {
        datasetBadge: 'Native L1 · Mar 2024',
        markoutDelta: '−40.4%',
        markoutSub: '−0.782 vs. −1.312 bp · −87.1% stale sniping (74.02M L1 rows)',
        droppedVol: '0.0%',
        droppedSub: 'Post-decrypt New (ALO) → Cancel → Taker ($64.36B replayed)',
        zeroMev: '+0.005 bp',
        zeroMevSub: 'Taker All-In delta (MM s*net: +0.115 bp for 35 ms dec)',
        mevSavings: '−17.6% to −31.7%',
        mevSavingsSub: '25%–50% capture / 1.0 bp · Breakeven at 10% / 0.5 bp',
        placeboNote:
          'Circular-shift placebo control (600 s): 97.3% of Regime A 1s markout and 95.8% of the B − A cancel-priority gap vanish; same-day BidAskProxy matches L1 FIFO within 0.013 bp.',
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
              'Statistically near-identical taker All-In Net cost to a 70 ms open priority batch at MEV = 0, with full pre-commit payload encryption.'
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
            delta: '−0.145 bp (−17.6%)',
            win: true,
            pct: 58,
            verdict:
              'Cuts total taker All-In Net execution cost by 17.6% (0.677 vs. 0.822 bp) vs. a 70 ms open batch across $64.4B of Native L1 bookTicker flow (68.2% large-order share).'
          },
          high: {
            label: '50% Capture · 1.0 bp Impact',
            delta: '−0.314 bp (−31.7%)',
            win: true,
            pct: 95,
            verdict:
              'Cuts total All-In taker execution cost by 31.7% (0.678 vs. 0.992 bp) under active mempool MEV while keeping 0.0% dropped USD volume.'
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
        mevSavings: '−14.1% to −25.9%',
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
              'Statistically zero taker cost overhead vs. a 70 ms open batch across 14 pair-days of BTCUSDT and ETHUSDT ($168.2B replayed).'
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
            delta: '−0.155 bp (−14.1%)',
            win: true,
            pct: 60,
            verdict:
              'Saves 0.155 bp (−14.1%, 0.947 vs. 1.102 bp) on total All-In execution cost for BTC/ETH takers vs. an open-mempool 70 ms priority CLOB.'
          },
          high: {
            label: '50% Capture · 1.0 bp Impact',
            delta: '−0.332 bp (−25.9%)',
            win: true,
            pct: 96,
            verdict:
              'Cuts total All-In taker cost by 25.9% (−0.332 bp, 0.948 vs. 1.280 bp) under 50% MEV capture while preserving full MM cancel protection.'
          }
        }
      },
  
      sol: {
        datasetBadge: 'SOLUSDT · Nov 2026',
        markoutDelta: '−23.8% / −33.5%',
        markoutSub: '−1.533 vs. −2.011 bp organic (--sniper-clip 0) · −1.435 vs. −2.159 bp w/ probe',
        droppedVol: '0.0%',
        droppedSub: 'Post-decrypt New (ALO) → Cancel → Taker ($12.63B organic / $15.13B w/ probe)',
        zeroMev: '+0.002 bp (~)',
        zeroMevSub: 'Statistically ~0 vs. 70 ms open batch (both organic & probe runs)',
        mevSavings: '−5.8% to −12.2%',
        mevSavingsSub: '25%–50% capture / 1.0 bp · ≥$50k orders = 42.4% of SOL vol',
        placeboNote:
          'On pure organic SOLUSDT flow (--sniper-clip 0), 600 s circular-shift placebo removes 99.7% of Regime A markout (−2.011 → −0.006 bp). Full tables in results/SOL_B70_hl_vs_D50_hl_drop_nosniper/.',
        rows: [
          { name: 'A: Continuous FIFO (organic)', mk: '−2.011 bp', sp: '1.811 bp', allin: '1.332 bp', drop: '0.0%', dywe: false },
          { name: 'B: Open Batch 70 ms (hl)', mk: '−1.400 bp', sp: '1.200 bp', allin: '1.341 bp', drop: '0.0%', dywe: false },
          { name: 'C: Uniform FBA 100 ms', mk: '−1.384 bp', sp: '1.184 bp', allin: '1.357 bp', drop: '0.0%', dywe: false },
          { name: 'D: Dywe IBTE 50 ms (35 ms dec)', mk: '−1.533 bp', sp: '1.333 bp', allin: '1.346 bp', drop: '0.0%', dywe: true }
        ],
        scenarios: {
          zero: {
            label: 'Sterile Zero-MEV Baseline',
            delta: '+0.005 bp / +0.002 bp (~)',
            win: false,
            pct: 5,
            verdict:
              'Matches 70 ms open batch All-In cost (+0.005 bp organic; +0.002 bp w/ probe) while cutting organic FIFO MM markout by −23.8%.'
          },
          breakeven: {
            label: '10% Capture · 0.5 bp Impact',
            delta: '−0.008 bp / −0.010 bp (D<B)',
            win: true,
            pct: 18,
            verdict:
              'Statistically beats a 70 ms open batch (D < B) starting at 10% capture / 0.5 bp impact even with SOLUSDT’s lower 42.4% large-order share.'
          },
          mid: {
            label: '25% Capture · 1.0 bp Impact',
            delta: '−0.085 bp (−5.8%)',
            win: true,
            pct: 48,
            verdict:
              'Reduces All-In taker cost by −0.085 bp (−5.8%, 1.374 vs. 1.459 bp) vs. a 70 ms open batch while shielding mid-cap directional sweeps from sandwich extraction.'
          },
          high: {
            label: '50% Capture · 1.0 bp Impact',
            delta: '−0.191 bp (−12.2%)',
            win: true,
            pct: 84,
            verdict:
              'Delivers a −0.191 bp (−12.2%, 1.374 vs. 1.565 bp) reduction in total taker execution costs on thinner altcoin liquidity with 0.0% dropped USD volume.'
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
  