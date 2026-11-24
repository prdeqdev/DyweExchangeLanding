/* ==========================================================================
   DYWE — OPEN-SOURCE BENCHMARKS INTERACTIVE CONTROLLER (v0.3.5)
   Synced with dywe-ablation-sim v0.3.5 (exp=all, 17 preflight / 18 unit tests).
   ========================================================================== */

(function () {
  "use strict";

  const DATASETS = {
    l1: {
      datasetBadge: "Native L1 · Mar 2024",
      markoutDelta: "−40.4%",
      markoutSub: "−0.782 vs. −1.312 bp · up to −51.1% at 1 ms react",
      droppedVol: "0.036%",
      droppedSub: "Post-decrypt ALO-first (<0.12% at 0.15 bp req)",
      zeroMev: "+0.005 bp",
      zeroMevSub: "Taker All-In delta · Pure 35 ms decrypt: +0.007 bp at matched 70 ms",
      mevSavings: "−11.7% to −26.7%",
      mevSavingsSub: "25%–50% cap / 1.0 bp (10% leak, exp=all) · eff_leak* = 8.4%",
      placeboNote:
        "Circular-shift placebo control (600 s): 97.3% of Regime A 1s markout and 95.8% of the B − A cancel-priority gap vanish, confirming genuine causal adverse selection.",
      rows: [
        { name: "A: Continuous FIFO", m1s: "−1.312 bp", snet: "1.112 bp", allin: "0.670 bp", drop: "0.004%", dywe: false },
        { name: "B: Open Batch 70 ms (hl)", m1s: "−0.667 bp", snet: "0.467 bp", allin: "0.651 bp", drop: "0.026%", dywe: false },
        { name: "C: Uniform FBA 100 ms", m1s: "−0.622 bp", snet: "0.422 bp", allin: "0.671 bp", drop: "0.013%", dywe: false },
        { name: "D: Dywe IBTE 50 ms (35 ms dec)", m1s: "−0.782 bp", snet: "0.582 bp", allin: "0.656 bp", drop: "0.036%", dywe: true },
        { name: "D: Dywe IBTE 70 ms (35 ms dec)", m1s: "−0.674 bp", snet: "0.474 bp", allin: "0.658 bp", drop: "0.026%", dywe: true }
      ],
      scenarios: {
        zero: {
          label: "Sterile Zero-MEV Baseline",
          delta: "+0.005 bp",
          win: false,
          width: "4%",
          verdict:
            "Statistically near-identical taker All-In Net cost to a 70 ms open batch at MEV = 0. Pure 35 ms decryption adds only +0.007 bp to MM s*net at a matched 70 ms window."
        },
        low: {
          label: "Moderate Capture (25% / 0.5 bp, 10% leak)",
          delta: "−0.045 bp",
          win: true,
          width: "22%",
          verdict:
            "Dywe is strictly cheaper for takers (D < B at 95% CI) under uniform exposure (exp=all). Break-even residual leakage eff_leak* is 8.4% at 10% / 0.5 bp."
        },
        mid: {
          label: "Mid MEV Scenario (25% / 1.0 bp, 10% leak)",
          delta: "−0.096 bp",
          win: true,
          width: "45%",
          verdict:
            "−11.7% lower All-In taker cost vs. B (70 ms) at the 68.2% 1-ms burst upper bound (−8.7% / −0.067 bp at the 47.9% unmerged aggTrades lower bound)."
        },
        high: {
          label: "High MEV Scenario (50% / 1.0 bp, 10% leak)",
          delta: "−0.265 bp",
          win: true,
          width: "88%",
          verdict:
            "−26.7% lower All-In taker cost vs. B (70 ms) at the 68.2% burst bound (−21.0% / −0.187 bp at the 47.9% raw bound); eff_leak* = 49.2%."
        }
      }
    },

    primary: {
      datasetBadge: "BTC+ETH Proxy · Nov 2026",
      markoutDelta: "−38.9%",
      markoutSub: "−1.049 vs. −1.717 bp (D50) · −48.5% at matched 70 ms",
      droppedVol: "0.041%",
      droppedSub: "Matched 70 ms D/B parity · Post-decrypt ALO-first",
      zeroMev: "0.000 bp",
      zeroMevSub: "Taker All-In parity · Pure 35 ms decrypt: +0.000 bp at matched 70 ms",
      mevSavings: "−9.6% to −22.0%",
      mevSavingsSub: "25%–50% cap / 1.0 bp (10% leak, exp=all) · 8.1%–19.1% raw bound",
      placeboNote:
        "Circular-shift placebo control (600 s): 96.8% of Regime A 1s markout (−1.717 → −0.055 bp) and 97.2% of the B − A cancel-priority gap vanish.",
      rows: [
        { name: "A: Continuous FIFO", m1s: "−1.717 bp", snet: "1.517 bp", allin: "0.928 bp", drop: "0.022%", dywe: false },
        { name: "B: Open Batch 70 ms (hl)", m1s: "−0.885 bp", snet: "0.685 bp", allin: "0.924 bp", drop: "0.041%", dywe: false },
        { name: "C: Uniform FBA 100 ms", m1s: "−0.861 bp", snet: "0.661 bp", allin: "0.950 bp", drop: "0.029%", dywe: false },
        { name: "D: Dywe IBTE 50 ms (35 ms dec)", m1s: "−1.049 bp", snet: "0.849 bp", allin: "0.922 bp", drop: "<0.06%", dywe: true },
        { name: "D: Dywe IBTE 70 ms (35 ms dec)", m1s: "−0.885 bp", snet: "0.685 bp", allin: "0.924 bp", drop: "0.041%", dywe: true }
      ],
      scenarios: {
        zero: {
          label: "Sterile Zero-MEV Baseline (D70 vs. B70)",
          delta: "0.000 bp",
          win: false,
          width: "4%",
          verdict:
            "Exact zero-MEV parity: at a matched 70 ms window, 35 ms threshold decryption adds +0.000 bp to both MM s*net (0.685 bp) and taker All-In Net (0.924 bp)."
        },
        low: {
          label: "Moderate Capture (25% / 0.5 bp, 10% leak)",
          delta: "−0.053 bp",
          win: true,
          width: "24%",
          verdict:
            "Because Δ₀ = 0.000 bp on BTC/ETH, break-even eff_leak* ≈ capture (10.0% / 25.0% / 50.0%): any leakage reduction below ambient capture yields net taker savings."
        },
        mid: {
          label: "Mid MEV Scenario (25% / 1.0 bp, 10% leak)",
          delta: "−0.106 bp",
          win: true,
          width: "48%",
          verdict:
            "−9.6% lower All-In taker cost vs. B (70 ms) at the 71.2% 1-ms burst upper bound (−8.1% / −0.087 bp at the 57.8% unmerged aggTrades lower bound)."
        },
        high: {
          label: "High MEV Scenario (50% / 1.0 bp, 10% leak)",
          delta: "−0.282 bp",
          win: true,
          width: "92%",
          verdict:
            "−22.0% lower All-In taker cost vs. B (70 ms) at the 71.2% burst bound (−19.1% / −0.231 bp at the 57.8% raw bound)."
        }
      }
    },

    sol: {
      datasetBadge: "SOLUSDT Organic · Nov 2026",
      markoutDelta: "−23.8%",
      markoutSub: "−1.533 vs. −2.011 bp · Pure organic flow (--sniper-clip 0)",
      droppedVol: "0.039%",
      droppedSub: "Post-decrypt New (ALO) → Cancel → Taker",
      zeroMev: "+0.005 bp",
      zeroMevSub: "Taker All-In delta at MEV = 0 (35 ms dec adds +0.009 bp s*net)",
      mevSavings: "−4.0% to −10.6%",
      mevSavingsSub: "25%–50% cap / 1.0 bp (10% leak, exp=all) · eff_leak* = 7.4%",
      placeboNote:
        "Circular-shift placebo control (600 s): 99.7% of Regime A 1s markout (−2.011 → −0.006 bp) vanishes under pure organic SOLUSDT flow without synthetic sniper probes.",
      rows: [
        { name: "A: Continuous FIFO", m1s: "−2.011 bp", snet: "1.811 bp", allin: "1.332 bp", drop: "0.017%", dywe: false },
        { name: "B: Open Batch 70 ms (hl)", m1s: "−1.400 bp", snet: "1.200 bp", allin: "1.341 bp", drop: "0.027%", dywe: false },
        { name: "C: Uniform FBA 100 ms", m1s: "−1.384 bp", snet: "1.184 bp", allin: "1.357 bp", drop: "0.023%", dywe: false },
        { name: "D: Dywe IBTE 50 ms (35 ms dec)", m1s: "−1.533 bp", snet: "1.333 bp", allin: "1.346 bp", drop: "0.039%", dywe: true }
      ],
      scenarios: {
        zero: {
          label: "Sterile Zero-MEV Baseline (No Probe)",
          delta: "+0.005 bp",
          win: false,
          width: "4%",
          verdict:
            "Pure historical SOLUSDT taker flow ($12.63B, zero synthetic probe): All-In Net cost is within +0.005 bp of an open 70 ms priority batch."
        },
        low: {
          label: "Moderate Capture (25% / 0.5 bp, 10% leak)",
          delta: "−0.026 bp",
          win: true,
          width: "18%",
          verdict:
            "Dywe is cheaper for takers (D < B at 95% CI) despite SOL's lower large-burst share (39.8%–42.4% ≥$50k); break-even eff_leak* = 7.4% at 10% / 0.5 bp."
        },
        mid: {
          label: "Mid MEV Scenario (25% / 1.0 bp, 10% leak)",
          delta: "−0.058 bp",
          win: true,
          width: "34%",
          verdict:
            "−4.0% lower All-In taker cost vs. B (70 ms) under uniform exposure (exp=all) with 10% residual leakage."
        },
        high: {
          label: "High MEV Scenario (50% / 1.0 bp, 10% leak)",
          delta: "−0.164 bp",
          win: true,
          width: "64%",
          verdict:
            "−10.6% lower All-In taker cost vs. B (70 ms) under uniform exposure (exp=all); break-even eff_leak* = 48.7%."
        }
      }
    }
  };

  let activeDs = "l1";
  let activeSc = "zero";

  function setText(field, val) {
    document.querySelectorAll('[data-bm-field="' + field + '"]').forEach(function (el) {
      el.textContent = val;
    });
  }

  function renderScenario() {
    const ds = DATASETS[activeDs];
    const sc = ds.scenarios[activeSc] || ds.scenarios.zero;
    setText("scLabel", sc.label);
    setText("scDelta", sc.delta);
    setText("scVerdict", sc.verdict);

    const deltaEl = document.querySelector('[data-bm-field="scDelta"]');
    if (deltaEl) {
      deltaEl.classList.toggle("is-win", !!sc.win);
    }
    const meterEl = document.getElementById("bmMeterFill");
    if (meterEl) {
      meterEl.style.width = sc.width;
    }
  }

  function renderDataset() {
    const ds = DATASETS[activeDs];
    setText("datasetBadge", ds.datasetBadge);
    setText("markoutDelta", ds.markoutDelta);
    setText("markoutSub", ds.markoutSub);
    setText("droppedVol", ds.droppedVol);
    setText("droppedSub", ds.droppedSub);
    setText("zeroMev", ds.zeroMev);
    setText("zeroMevSub", ds.zeroMevSub);
    setText("mevSavings", ds.mevSavings);
    setText("mevSavingsSub", ds.mevSavingsSub);
    setText("placeboNote", ds.placeboNote);

    const tbody = document.getElementById("bmTableBody");
    if (tbody) {
      tbody.innerHTML = ds.rows
        .map(function (r) {
          const cls = r.dywe ? ' class="is-dywe"' : "";
          return (
            "<tr" + cls + ">" +
            "<td>" + r.name + "</td>" +
            "<td>" + r.m1s + "</td>" +
            "<td>" + r.snet + "</td>" +
            "<td>" + r.allin + "</td>" +
            "<td>" + r.drop + "</td>" +
            "</tr>"
          );
        })
        .join("");
    }
    renderScenario();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll("[data-bm-ds]");
    const pills = document.querySelectorAll("[data-bm-sc]");
    if (!tabs.length) return;

    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeDs = btn.getAttribute("data-bm-ds") || "l1";
        tabs.forEach(function (t) {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderDataset();
      });
    });

    pills.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeSc = btn.getAttribute("data-bm-sc") || "zero";
        pills.forEach(function (p) {
          p.classList.toggle("is-active", p === btn);
        });
        renderScenario();
      });
    });

    renderDataset();
  });
})();
