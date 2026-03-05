import { jsx as Me, jsxs as Ve } from "react/jsx-runtime";
import { useRef as R, useState as q, useEffect as de, useCallback as ae, forwardRef as on, useImperativeHandle as an } from "react";
function kt(e) {
  const n = Math.max(0, Math.min(1, e));
  return n * n * (3 - 2 * n);
}
const cn = 60, ln = 80;
function Zt(e, n) {
  if (!e.length) return 0;
  let i = 0, c = e.length - 1;
  if (e[0].t > n) return 0;
  if (e[c].t <= n) return c;
  for (; i + 1 < c; ) {
    const a = i + c >> 1;
    e[a].t <= n ? i = a : c = a;
  }
  return i;
}
function hn(e, n) {
  if (!e.length) return 0;
  const i = cn / 1e3, c = Zt(e, n), a = e[c].t;
  return c + 1 < e.length && e[c + 1].t - a < i && n < a + i, e[c].v;
}
const un = ln, dn = 0.7;
function mn(e, n, i = {}) {
  const c = i.blendWindowMs ?? un, a = i.coarticulationPrimary ?? dn, h = c / 1e3;
  if (!e.length)
    return { primaryIndex: 0, secondaryIndex: 0, primaryWeight: 1 };
  const o = Zt(e, n), d = e[o].v, l = e[o].t, m = o + 1 < e.length ? e[o + 1].t : l + 1, g = m - l, A = o + 1 < e.length ? e[o + 1].v : d;
  if (A === d || g <= 0)
    return { primaryIndex: d, secondaryIndex: d, primaryWeight: 1 };
  const M = Math.min(h, g * 0.4), L = m - M;
  if (n < L)
    return { primaryIndex: d, secondaryIndex: A, primaryWeight: 1 };
  const p = (n - L) / M, T = kt(p), P = 1 - (1 - a) * T;
  return { primaryIndex: d, secondaryIndex: A, primaryWeight: P };
}
const fn = 1 / 8;
function gn() {
  const e = /* @__PURE__ */ new Map(), n = Ot.frames;
  for (let i = 0; i < n.length; i++) {
    const a = (n[i].phonemes ?? "").split(",").map((h) => h.trim()).filter((h) => /^[A-Za-z]{1,4}$/.test(h));
    for (const h of a) {
      const o = h.toLowerCase();
      for (const d of o)
        e.set(d, i);
    }
  }
  return e;
}
let Lt = null;
function pn() {
  return Lt === null && (Lt = gn()), Lt;
}
function yn(e) {
  const n = e.toLowerCase();
  if (!n) return 0;
  const c = pn().get(n);
  return c !== void 0 ? c : 0;
}
const dt = 80, mt = 50, Nt = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"], wn = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], Kt = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function ot(e) {
  if (e < 0 || !Number.isFinite(e) || e !== Math.floor(e)) return String(e);
  if (e === 0) return "zero";
  if (e < 10) return Nt[e];
  if (e < 20) return wn[e - 10];
  if (e < 100) {
    const n = Math.floor(e / 10), i = e % 10;
    return i === 0 ? Kt[n] : `${Kt[n]}-${Nt[i]}`;
  }
  if (e < 1e3) {
    const n = Math.floor(e / 100), i = e % 100, c = `${Nt[n]} hundred`;
    return i === 0 ? c : `${c} ${ot(i)}`;
  }
  if (e < 1e6) {
    const n = Math.floor(e / 1e3), i = e % 1e3, c = n === 1 ? "one thousand" : `${ot(n)} thousand`;
    return i === 0 ? c : `${c} ${ot(i)}`;
  }
  if (e < 1e9) {
    const n = Math.floor(e / 1e6), i = e % 1e6, c = n === 1 ? "one million" : `${ot(n)} million`;
    return i === 0 ? c : `${c} ${ot(i)}`;
  }
  return String(e);
}
function Jt(e) {
  return e.replace(/\d+/g, (n) => {
    const i = parseInt(n, 10);
    return Number.isNaN(i) ? n : ot(i);
  });
}
function $t(e, n = dt, i = mt) {
  if (e.length <= 1) return e;
  const c = n / 1e3, a = i / 1e3, h = Math.max(c, a), o = [e[0]];
  let d = e[0].t;
  for (let m = 1; m < e.length - 1; m++)
    e[m].t - d >= h && (o.push(e[m]), d = e[m].t);
  const l = e[e.length - 1];
  return l.t > d && o.push(l), o;
}
const Et = {
  ".": 3,
  "!": 3,
  "?": 3,
  "\n": 3,
  ",": 2,
  ";": 2,
  ":": 2
};
function bn(e, n, i) {
  const c = i ?? Ot.frames.length;
  if (c === 0 || n <= 0) return [{ t: 0, v: 0 }];
  const h = [...Jt(e)], o = h.filter((p) => /[a-zA-Z0-9]/.test(p)).length, d = h.reduce((p, T) => p + (Et[T] ?? 0), 0), l = Math.max(1, o + d), A = Math.min(n, l * 0.12) / l, M = [{ t: 0, v: 0 }];
  let L = 0;
  for (const p of h) {
    const T = Et[p];
    if (T !== void 0)
      M[M.length - 1].v !== 0 && M.push({ t: L, v: 0 }), L += T * A;
    else if (/[a-zA-Z0-9]/.test(p)) {
      const P = Math.min(yn(p), c - 1);
      M.push({ t: L, v: P }), L += A;
    }
  }
  return M[M.length - 1].v !== 0 && M.push({ t: L, v: 0 }), $t(M, dt, mt);
}
function zt(e) {
  return {
    x: e.anchorX - e.widthLeft,
    y: e.anchorY - e.heightAbove,
    width: e.widthLeft + e.widthRight,
    height: e.heightAbove + e.heightBelow
  };
}
function Gt(e, n) {
  const i = n >= 8, c = i && e.heightAboveRow2 != null ? e.heightAboveRow2 : e.heightAbove, a = i && e.heightBelowRow2 != null ? e.heightBelowRow2 : e.heightBelow;
  return {
    x: e.anchorX - e.widthLeft,
    y: e.anchorY - c,
    width: e.widthLeft + e.widthRight,
    height: c + a
  };
}
const Ot = {
  imageUrl: "/modifiedmouthsprite.png",
  frames: [
    // Row 1: 8 frames (anchorY 47, height 317); widthLeft/Right and heightBelow kept within atlas
    { anchorX: 55, anchorY: 2, widthLeft: 55, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Rest", phonemes: "P, B, M" },
    { anchorX: 186, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "slight open", phonemes: "F, V" },
    { anchorX: 316, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Lipsst Open", phonemes: "TH, DH" },
    { anchorX: 445, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Medium Open", phonemes: "S, Z" },
    { anchorX: 574, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Rounded Small O", phonemes: "O, U" },
    { anchorX: 704, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Wide O", phonemes: "OW, AW" },
    { anchorX: 833, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Wide O", phonemes: "Wide O (alt)" },
    { anchorX: 962, anchorY: 2, widthLeft: 59, widthRight: 59, heightAbove: 0, heightBelow: 104, viseme: "Smile", phonemes: "E, I" },
    // Row 2: 8 frames (y+h must be ≤580); heightBelow adjusted so anchorY+heightBelow≤580
    { anchorX: 55, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Closed Lips", phonemes: "P, B, M" },
    { anchorX: 186, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Closed lips (M/B/P)", phonemes: "P, B, M" },
    { anchorX: 316, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Teeth Touching", phonemes: "F, V" },
    { anchorX: 445, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Teeth touching lower lip (F/V)", phonemes: "F, V" },
    { anchorX: 575, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Tongue slightly visible (TH)", phonemes: "TH, DH" },
    { anchorX: 703, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "OL shape (tongue behind teeth)O", phonemes: "L, S, Z" },
    { anchorX: 833, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Soft smile open", phonemes: "AE, EH, E" },
    { anchorX: 962, anchorY: 167, widthLeft: 54, widthRight: 56, heightAbove: 0, heightBelow: 131, viseme: "Relaxed open neutral", phonemes: "AH, AA, OH" }
  ]
}, rt = {
  anchorX: 490,
  anchorY: 300,
  widthLeft: 75,
  widthRight: 75,
  // Row 1 (frames 0–7): total height 327
  heightAbove: 0,
  heightBelow: 140,
  // Row 2 (frames 8–15): total height 247
  heightAboveRow2: 0,
  heightBelowRow2: 131
}, Sn = {
  imageUrl: "/eyesspritesheet.png",
  frames: [
    { x: 0, y: 273, width: 322, height: 383, state: "open" },
    { x: 317, y: 273, width: 337, height: 380, state: "closed" },
    { x: 647, y: 273, width: 303, height: 362, state: "smile" },
    { x: 950, y: 273, width: 323, height: 383, state: "surprised" },
    { x: 1271, y: 273, width: 324, height: 379, state: "half" }
  ]
}, An = {
  x: 322,
  y: 185,
  width: 302,
  height: 345
}, vn = {
  visemeRanges: [
    // 0) Silence / Rest
    {
      startFrame: 0,
      // TODO
      endFrame: 0,
      // TODO
      viseme: "REST",
      // pauses after sentence ends (.) (~8–24 frames depending on pause length)
      phonemes: "SIL, SP, SPN"
    },
    // 1) Closed lips (bilabials)
    {
      startFrame: 84,
      // TODO
      endFrame: 90,
      // TODO
      viseme: "MBP",
      // "Peter" (p)(~2–3f), "blue" (b)(~2–3f), "maps" (m)(~3–5f), "banana" (b)(~2–3f), "Martha" (m)(~3–5f)
      phonemes: "M, B, P"
    },
    // 2) Upper teeth on lower lip
    {
      startFrame: 40,
      // TODO
      endFrame: 44,
      // TODO
      viseme: "FV",
      // "five" (f)(~5–8f), "very" (v)(~5–8f), "fresh" (f)(~5–8f), "fruit" (fr->f)(~5–8f)
      phonemes: "F, V"
    },
    // 3) Tongue between teeth (both TH sounds)
    {
      startFrame: 252,
      // TODO
      endFrame: 254,
      // TODO
      viseme: "TH",
      // "thin" (th)(~6–10f), "thief" (th)(~6–10f), "those" (th)(~6–10f), "things" (th)(~6–10f)
      phonemes: "TH, DH"
    },
    // 4) Teeth nearly closed, hissy consonants
    {
      startFrame: 461,
      // TODO
      endFrame: 466,
      // TODO
      viseme: "SZ",
      // "sells" (s)(~6–10f), "shells" (s)(~6–10f), "sounds" (s)(~6–10f), "rose" (s->z sound)(~6–10f)
      phonemes: "S, Z"
    },
    // 5) Rounded/forward lips for “sh/ch/j/zh”
    {
      startFrame: 438,
      // TODO
      endFrame: 444,
      // TODO
      viseme: "SHCHJ",
      // "shiny" (sh)(~6–10f), "seashore" (sh)(~6–10f), "Charles" (ch)(~6–10f),
      // "judge" (j)(~6–10f), "George" (j)(~6–10f), "measure" (s->zh)(~6–10f), "treasure" (zh)(~6–10f)
      phonemes: "SH, CH, JH, ZH"
    },
    // 6) Alveolar: tongue to ridge (T, D, N, L)
    {
      startFrame: 203,
      // TODO
      endFrame: 209,
      // TODO
      viseme: "TDNL",
      // T: "Time" (t)(~2–4f), "Tuesday" (t)(~2–4f), "toys" (t)(~2–4f);
      // D: "drivers" (d)(~2–4f), "during" (d)(~2–4f), "doctor" (d)(~2–4f);
      // N: "near" (n)(~4–8f), "noisy" (n)(~4–8f), "another" (n)(~4–8f);
      // L: "lake" (l)(~4–8f), "light" (l)(~4–8f), "lay" (l)(~4–8f), "low" (l)(~4–8f)
      phonemes: "T, D, N, L"
    },
    // 7) Back-of-mouth consonants (K, G, NG)
    {
      startFrame: 1275,
      // TODO
      endFrame: 1299,
      // TODO
      viseme: "KGNG",
      // K: "quickly" (k)(~2–4f), "rocky" (k)(~2–4f), "lake" (k)(~2–4f);
      // G: "George" (g)(~2–4f), "grabbed" (g)(~2–4f), "argued" (g)(~2–4f);
      // NG: "singer" (ng)(~4–8f), "long" (ng)(~4–8f), "spring" (ng)(~4–8f)
      phonemes: "K, G, NG"
    },
    // 8) R / r-colored
    {
      startFrame: 1499,
      // TODO
      endFrame: 1503,
      // TODO
      viseme: "R",
      // "royal" (r)(~4–8f), "road" (r)(~4–8f), "Brave" (r)(~4–8f), "teacher" (er)(~6–10f), "earlier" (er)(~6–10f)
      phonemes: "R, ER"
    },
    // 9) W / rounded glide
    {
      startFrame: 585,
      // TODO
      endFrame: 587,
      // TODO
      viseme: "W",
      // "we" (w)(~4–8f), "were" (w)(~4–8f), "watching" (w)(~4–8f), "warm" (w)(~4–8f), "wolves" (w)(~4–8f)
      phonemes: "W"
    },
    // 10) Y glide (as in "yes") — optional
    {
      startFrame: 658,
      // TODO
      endFrame: 660,
      // TODO
      viseme: "Y",
      // "yellow" (y)(~4–8f), "Tuesday" (tue- often /tyu/)(y-like glide)(~4–8f), "unicorn" (you-ni-)(y-like glide)(~4–8f)
      phonemes: "Y"
    },
    // =========================
    // VOWELS / DIPHTHONGS
    // =========================
    // 11) Wide open “aa/ah” group (AA/AH)
    {
      startFrame: 1551,
      // TODO
      endFrame: 1593,
      // TODO
      viseme: "AA",
      // "Martha" (ar/ah)(~8–12f), "about" (a-)(~6–10f), "another" (a-)(~6–10f), "banana" (a)(~6–10f), "arena" (a-)(~6–10f)
      phonemes: "AA, AH"
    },
    // 12) “ae” as in “cat”
    {
      startFrame: 1372,
      // TODO
      endFrame: 1377,
      // TODO
      viseme: "AE",
      // "maps" (a)(~6–10f), "wagon" (a)(~6–10f), "palace" (a)(~6–10f)
      phonemes: "AE"
    },
    // 13) Mid open “eh”
    {
      startFrame: 492,
      // TODO
      endFrame: 495,
      // TODO
      viseme: "EH",
      // "red" (e)(~6–10f), "measured" (mea-)(~6–10f), "pleasure" (plea-)(~6–10f)  // use clearest EH-like vowel in your recording
      phonemes: "EH"
    },
    // 14) “ih” as in “bit”
    {
      startFrame: 596,
      // TODO
      endFrame: 600,
      // TODO
      viseme: "IH",
      // "big" (i)(~6–10f), "Philip" (i)(~6–10f), "chips" (i)(~6–10f), "in" (i)(~6–10f), "it" (i)(~6–10f)
      phonemes: "IH"
    },
    // 15) Smile / “ee” as in “see” (IY)
    {
      startFrame: 1406,
      // TODO
      endFrame: 1411,
      // TODO
      viseme: "EE",
      // "she" (ee)(~8–12f), "cheese" (ee)(~8–12f), "see" (if present)(~8–12f), "-y" endings like "shiny" (ee-ish)(~6–10f)
      phonemes: "IY"
    },
    // 16) “uh” as in “book” (UH) — may be weak in your script
    {
      startFrame: 588,
      // TODO
      endFrame: 592,
      // TODO
      viseme: "UH",
      // Weak in your paragraph; closest: "could/book" not present. If you can’t find it, map UH to OO.
      phonemes: "UH"
    },
    // 17) Tight rounded “oo” as in “blue” (UW)
    {
      startFrame: 154,
      // TODO
      endFrame: 157,
      // TODO
      viseme: "OO",
      // "blue" (oo)(~8–12f), "moon" (oo)(~8–12f), "use" (u)(~8–12f), "music" (mu-)(~8–12f)
      phonemes: "UW"
    },
    // 18) Rounded “oh/aw” open-round group (OW/AO)
    {
      startFrame: 682,
      // TODO
      endFrame: 687,
      // TODO
      viseme: "OH",
      // AO: "bought" (ou/aw)(~8–12f), "law" (aw)(~8–12f);
      // OW: "rose" (o)(~8–12f), "ocean" (o)(~8–12f), "road" (o)(~8–12f), "home" (o)(~8–12f)
      phonemes: "OW, AO"
    },
    // 19) “oo” relaxed (optional)
    {
      startFrame: 588,
      // TODO
      endFrame: 592,
      // TODO
      viseme: "OO_RELAXED",
      // If you truly separate UH vs UW: this would be "book/could" (~8–12f) — not clearly present, so usually map to OO.
      phonemes: "UH"
    },
    // =========================
    // DIPHTHONGS
    // =========================
    // 20) AY (time)
    {
      startFrame: 734,
      // TODO
      endFrame: 743,
      // TODO
      viseme: "AY",
      // "Time" (i)(~10–14f), "five" (i)(~10–14f), "by" (y)(~10–14f)  // diphthong motion is useful
      phonemes: "AY"
    },
    // 21) AW (loud)
    {
      startFrame: 195,
      // TODO
      endFrame: 198,
      // TODO
      viseme: "AW",
      // "loud" (ou)(~10–14f), "sounds" (ou)(~10–14f)
      phonemes: "AW"
    },
    // 22) OY (boy)
    {
      startFrame: 878,
      // TODO
      endFrame: 883,
      // TODO
      viseme: "OY",
      // "boy" (oy)(~10–14f), "toys" (oy)(~10–14f), "noisy" (oi)(~10–14f), "royal" (oy)(~10–14f)
      phonemes: "OY"
    },
    // 23) EY (paper / lake)
    {
      startFrame: 774,
      // TODO
      endFrame: 795,
      // TODO
      viseme: "EY",
      // "paper" (pa-per: 'pay')(~8–12f), "Tuesday" (tues- 'tay/tyoo' varies)(~8–12f), "fade" (ay)(~8–12f), "lake" (ay)(~8–12f)
      phonemes: "EY"
    },
    // 24) OW (rose) — optional if you already include OW under OH
    {
      startFrame: 682,
      // TODO
      endFrame: 687,
      // TODO
      viseme: "OW",
      // "rose" (o)(~8–12f), "road" (o)(~8–12f), "home" (o)(~8–12f), "horizon" (o)(~8–12f)
      phonemes: "OW"
    },
    // 25) YUW (“you” / long-U “yoo”)
    {
      startFrame: 154,
      // TODO
      endFrame: 157,
      // TODO
      viseme: "YUW",
      // "use" (u)(~10–14f), "music" (mu-)(~10–14f), "unicorn" (u)(~10–14f), "unusual" (u)(~10–14f), "universe" (u)(~10–14f)
      phonemes: "Y UW"
    },
    // =========================
    // OPTIONAL: “Z” vs “S” split
    // =========================
    {
      startFrame: 461,
      // TODO
      endFrame: 466,
      // TODO
      viseme: "S",
      // "sells" (s)(~6–10f), "seashore" (s)(~6–10f), "sounds" (s)(~6–10f), "spring" (s)(~6–10f)
      phonemes: "S"
    },
    {
      startFrame: 1170,
      // TODO
      endFrame: 1174,
      // TODO
      viseme: "Z",
      // "wolves" (ves -> v+z)(z)(~6–10f), "rose" (z sound)(~6–10f), "use" (z sound)(~6–10f)
      phonemes: "Z"
    },
    // =========================
    // OPTIONAL: extra glides / nasals
    // =========================
    {
      startFrame: 642,
      // TODO
      endFrame: 645,
      // TODO
      viseme: "L",
      // "lake" (l)(~4–8f), "light" (l)(~4–8f), "lay" (l)(~4–8f), "low" (l)(~4–8f), "loud" (l)(~4–8f)
      phonemes: "L"
    },
    {
      startFrame: 258,
      // TODO
      endFrame: 261,
      // TODO
      viseme: "N",
      // "near" (n)(~4–8f), "noisy" (n)(~4–8f), "another" (n)(~4–8f), "banana" (n)(~4–8f)
      phonemes: "N"
    },
    {
      startFrame: 1275,
      // TODO
      endFrame: 1299,
      // TODO
      viseme: "NG",
      // "singer" (ng)(~4–8f), "rang" (ng)(~4–8f), "long" (ng)(~4–8f), "spring" (ng)(~4–8f)
      phonemes: "NG"
    }
  ]
};
function it(e) {
  return !e || e.length === 0 ? 0 : e[Math.floor(e.length / 2)];
}
const Ke = {
  IH: "AY"
}, qt = {
  SIL: "REST",
  SP: "REST",
  SPN: "REST",
  M: "MBP",
  B: "MBP",
  P: "MBP",
  F: "FV",
  V: "FV",
  TH: "TH",
  DH: "TH",
  S: "SZ",
  Z: "SZ",
  SH: "SHCHJ",
  CH: "SHCHJ",
  JH: "SHCHJ",
  ZH: "SHCHJ",
  T: "TDNL",
  D: "TDNL",
  N: "TDNL",
  L: "TDNL",
  K: "KGNG",
  G: "KGNG",
  NG: "KGNG",
  HH: "AA",
  // aspirated H — open mouth, similar to AA/AH
  R: "R",
  ER: "R",
  W: "W",
  Y: "Y",
  AA: "AA",
  AH: "AA",
  AE: "AE",
  EH: "EH",
  IH: "IH",
  IY: "EE",
  UH: "UH",
  UW: "OO",
  OW: "OH",
  AO: "OH",
  AY: "AY",
  AW: "AW",
  OY: "OY",
  EY: "EY",
  YUW: "YUW"
};
function Qt(e) {
  const i = e.visemeFrames.REST ?? [0], c = {};
  for (const [a, h] of Object.entries(qt)) {
    const o = Ke[a] ?? a, d = Ke[h] ?? h, l = e.visemeFrames[o] ?? e.visemeFrames[d] ?? i;
    c[a] = l;
  }
  return c;
}
function Tn(e) {
  const n = {}, i = e.visemeFrames.REST, c = i ? it(i) : 0, a = Qt(e), h = [];
  for (const [o, d] of Object.entries(qt)) {
    const l = Ke[o] ?? o, m = Ke[d] ?? d, g = !!e.visemeFrames[l], A = !!e.visemeFrames[m];
    if (!g && !A) {
      const L = l !== o ? ` remapped→"${l}"` : "";
      h.push(`${o}${L} (tried keys: "${l}", "${m}")`);
    }
    const M = a[o] ?? [c];
    n[o] = it(M), n[`${o}0`] = n[o], n[`${o}1`] = n[o];
  }
  return h.length > 0 && console.warn(
    `[TalkyHeads] buildPhonemeFrameIndex: ${h.length} phoneme(s) not found in viseme_map.json — falling back to REST frame.
` + h.map((o) => `  • ${o}`).join(`
`)
  ), n;
}
const xn = {
  TH: "TH",
  SH: "SH",
  CH: "CH",
  PH: "F",
  WH: "W",
  CK: "K",
  NG: "NG"
}, Rt = {
  A: "AH",
  B: "B",
  C: "K",
  D: "D",
  E: "EH",
  F: "F",
  G: "G",
  H: "HH",
  I: "IH",
  J: "JH",
  K: "K",
  L: "L",
  M: "M",
  N: "N",
  O: "OW",
  P: "P",
  Q: "K",
  R: "R",
  S: "S",
  T: "T",
  U: "UH",
  V: "V",
  W: "W",
  X: "K",
  Y: "Y",
  Z: "Z",
  " ": "SIL",
  ".": "SIL",
  ",": "SIL",
  "!": "SIL",
  "?": "SIL"
}, Mn = 25;
function Fn(e, n) {
  const i = Qt(n), c = n.visemeFrames.REST, a = c ? it(c) : 0, h = c ?? [a], o = e.characters ?? [], d = e.character_start_times_seconds ?? [], l = e.character_end_times_seconds ?? [], m = [];
  let g = 0;
  for (; g < o.length; ) {
    const S = o[g] ?? "", E = Rt[S.toUpperCase()] ?? S.toUpperCase();
    if ((Ke[E] ?? E) === "SIL" || /\s/.test(S))
      m.push({ isSil: !0, ch: S, tStart: d[g] ?? 0, tEnd: l[g] ?? (d[g] ?? 0) + 0.05 }), g++;
    else {
      const _ = [];
      for (; g < o.length; ) {
        const N = o[g] ?? "", ie = Rt[N.toUpperCase()] ?? N.toUpperCase();
        if ((Ke[ie] ?? ie) === "SIL" || /\s/.test(N)) break;
        _.push({ ch: N, tStart: d[g] ?? 0, tEnd: l[g] ?? (d[g] ?? 0) + 0.05 }), g++;
      }
      m.push({ isSil: !1, slots: _ });
    }
  }
  const A = [], M = /* @__PURE__ */ new Set(), L = [], p = (S, E, I, _) => {
    const N = (I - E) * 1e3, ie = _ ?? Rt[S.toUpperCase()] ?? S.toUpperCase(), se = Ke[ie] ?? ie, ge = i[se], ce = !ge;
    ce && M.add(`"${se}" (from char "${S}")`);
    const v = ge ?? h, G = v.length > 1 ? Math.min(v.length, Math.max(1, Math.floor(N / Mn))) : 1, te = `[${v.join(",")}]`;
    let pe, Se;
    if (G >= 2) {
      const ne = G === v.length ? [...v] : Array.from(
        { length: G },
        (Ae, We) => v[Math.round(We * (v.length - 1) / (G - 1))]
      ), Pe = Math.round(N / G);
      pe = G === v.length ? `${se}:[${v[0]}→${v[v.length - 1]}]×${G}@${Pe}ms` : `${se}:[${ne[0]}→${ne[G - 1]}]×${G}/${v.length}@${Pe}ms`, Se = `[${ne.join(",")}]`;
      const _e = (I - E) / G;
      for (let Ae = 0; Ae < G; Ae++)
        A.push({ t: E + Ae * _e, v: ne[Ae] });
    } else {
      const ne = it(v);
      pe = v.length > 1 ? `${se}:${ne}(1/${v.length},${Math.round(N)}ms)` : `${se}:${ne}`, Se = `[${ne}]`, A.push({ t: E, v: ne });
    }
    L.push({ char: S, phoneme: se, mapped: ce ? "⚠ MISSING" : "✓", candidates: te, selected: Se, frames: pe, tStart: Math.round(E * 1e3) / 1e3, dur_ms: Math.round(N) });
  };
  for (const S of m) {
    if (S.isSil) {
      A.push({ t: S.tStart, v: a }), L.push({ char: S.ch, phoneme: "SIL", mapped: "✓", candidates: `[${a}]`, selected: `[${a}]`, frames: `REST:${a}`, tStart: Math.round(S.tStart * 1e3) / 1e3, dur_ms: Math.round((S.tEnd - S.tStart) * 1e3) });
      continue;
    }
    const E = S.slots, I = [];
    {
      let v = 0;
      for (; v < E.length; ) {
        if (v + 1 < E.length) {
          const G = (E[v].ch + E[v + 1].ch).toUpperCase(), te = xn[G];
          if (te) {
            I.push({
              ch: E[v].ch + E[v + 1].ch,
              tStart: E[v].tStart,
              tEnd: E[v + 1].tEnd,
              phonemeOverride: te
            }), v += 2;
            continue;
          }
        }
        I.push({ ch: E[v].ch, tStart: E[v].tStart, tEnd: E[v].tEnd }), v++;
      }
    }
    const _ = I, N = _.length, ie = _[0].tStart, se = _[N - 1].tEnd;
    if ((se - ie) * 1e3 <= 100 && N > 0) {
      const v = _[Math.floor(N / 2)];
      p(v.ch, ie, se, v.phonemeOverride);
      continue;
    }
    const ce = [];
    for (let v = 0; v < N; v += 2) ce.push(v);
    N > 1 && !ce.includes(N - 1) && ce.push(N - 1);
    for (let v = 0; v < ce.length; v++) {
      const G = ce[v], te = _[G], pe = te.tStart, Se = ce[v + 1], ne = Se !== void 0 ? _[Se].tStart : se;
      p(te.ch, pe, ne, te.phonemeOverride);
    }
  }
  if (console.groupCollapsed(`[TalkyHeads] alignment phoneme sequence (${L.length} of ${o.length} chars used)`), console.table(L), console.groupEnd(), M.size > 0 && console.warn(
    `[TalkyHeads] buildVisemeTimelineFromAlignmentAndMap: phoneme(s) not in viseme_map — using REST frame:
` + [...M].map((S) => `  • ${S}`).join(`
`)
  ), A.length === 0) return [{ t: 0, v: a }];
  const T = l[o.length - 1] ?? (d[o.length - 1] ?? 0) + 0.15;
  A.push({ t: T, v: a });
  const X = 60 / 1e3;
  for (let S = 0; S < A.length; S++)
    A[S] = { t: Math.max(0, A[S].t - X), v: A[S].v };
  const x = [A[0]];
  for (let S = 1; S < A.length; S++)
    A[S].v !== x[x.length - 1].v && x.push(A[S]);
  const k = $t(x, dt, mt);
  return k[0].t > 0 && k.unshift({ t: 0, v: a }), k;
}
function Rn(e, n, i) {
  const c = Tn(i), a = i.visemeFrames.REST, h = a ? it(a) : 0, d = [...Jt(e)], l = d.filter((x) => /[a-zA-Z0-9']/.test(x)).length, m = d.reduce((x, k) => x + (Et[k] ?? 0), 0), g = Math.max(1, l + m), L = Math.min(n, g * 0.12) / g, p = [{ t: 0, v: h }];
  let T = 0;
  const P = /* @__PURE__ */ new Set(), X = [];
  for (const x of d) {
    const k = Et[x];
    if (k !== void 0)
      X.push({ char: x, phoneme: "REST (pause)", frameIdx: h, t: T.toFixed(3) }), p[p.length - 1].v !== h && p.push({ t: T, v: h }), T += k * L;
    else if (/[a-zA-Z0-9']/.test(x)) {
      const S = x.toUpperCase(), E = Rt[S] ?? S, I = Ke[E] ?? E, _ = c[I];
      _ === void 0 && P.add(`"${I}" (from char "${x}"${E !== I ? `, remapped from "${E}"` : ""})`);
      const N = E !== I ? `${E}→${I}` : I;
      X.push({ char: x, phoneme: N, frameIdx: _ ?? "MISSING", t: T.toFixed(3) }), p.push({ t: T, v: _ ?? h }), T += L;
    }
  }
  return console.group(`[TalkyHeads] text phoneme sequence (${e.slice(0, 40)}${e.length > 40 ? "…" : ""})`), console.table(X), console.groupEnd(), P.size > 0 && console.warn(
    `[TalkyHeads] buildVisemeTimelineFromTextAndMap: phoneme(s) not in phonemeFrameIndex — using REST frame:
` + [...P].map((x) => `  • ${x}`).join(`
`)
  ), p[p.length - 1].v !== h && p.push({ t: T, v: h }), $t(p, dt, mt);
}
function En(e) {
  var c;
  const n = /* @__PURE__ */ new Map(), i = e.visemeRanges;
  for (let a = 0; a < i.length; a++) {
    const o = (((c = i[a]) == null ? void 0 : c.phonemes) ?? "").trim().split(",").map((d) => d.trim()).filter((d) => /^[A-Za-z]{1,4}$/i.test(d));
    for (const d of o) {
      const l = d.toLowerCase();
      for (const m of l) n.set(m, a);
    }
  }
  return n;
}
function $n(e, n) {
  const i = En(n), c = n.visemeRanges.length;
  if (c === 0) return [{ t: 0, v: 0 }];
  const { characters: a, character_start_times_seconds: h, character_end_times_seconds: o } = e, d = [];
  let l = null;
  for (let A = 0; A < a.length; A++) {
    const M = (a[A] ?? "").toLowerCase(), L = h[A] ?? 0, p = M ? i.get(M) ?? 0 : 0, T = Math.max(0, Math.min(p, c - 1));
    l !== T && (d.push({ t: L, v: T }), l = T);
  }
  if (o.length > 0 && o[o.length - 1], d.length === 0) return [{ t: 0, v: 0 }];
  const m = h[a.length - 1] ?? 0;
  d.push({ t: m + 0.15, v: 0 });
  const g = $t(d, dt, mt);
  return g[0].t > 0 && g.unshift({ t: 0, v: 0 }), g;
}
const at = typeof import.meta < "u" ? "/".replace(/\/$/, "") : "", jt = `${at}/parent.png`, Ct = `${at}/mouthsprite.png`, In = 5 / 60, _n = 4 / 60;
function Hn({
  baseImageUrl: e,
  restImageUrl: n,
  restImageScale: i = 1,
  shape: c = "square",
  audioEl: a = null,
  visemeEvents: h = [],
  speaking: o = !1,
  width: d,
  height: l,
  debug: m = !1,
  atlas: g,
  mouthDest: A,
  overlays: M,
  mouthSpeed: L = 1,
  previewMouthIndex: p,
  onMouthIndexChange: T,
  eyeAtlas: P,
  eyeDest: X,
  eyeState: x,
  eyeFrameIndex: k,
  blinkEnabled: S = !0,
  syncOffsetMs: E = 0,
  onTick: I,
  visemeMap: _,
  className: N = "",
  style: ie,
  disableBlending: se = !1,
  onAssetsReady: ge
}) {
  var Dt;
  const ce = E / 1e3, v = Math.max(0.3, Math.min(2, L)), G = (() => {
    const t = n ?? e ?? jt;
    if (t)
      return t.startsWith("/") ? `${at}${t}` : t;
  })(), te = _ ? (() => {
    const t = _.visemeFrames.REST;
    return t && t.length > 0 ? it(t) : 0;
  })() : 0, pe = R(null), Se = R(null), [ne, Pe] = q(!1), [_e, Ae] = q(null), [We, ze] = q(null), [Ge, Fe] = q(null), [Be, ft] = q(null), He = R(null), ye = R(null), Re = R([]), Ee = R(null), gt = R(null), pt = R(null), J = R(null), Le = R(/* @__PURE__ */ new Map()), Ne = R(o);
  Ne.current = o;
  const F = R(se);
  F.current = se;
  const me = R(0), Q = R(-1), Ce = R(0), ct = R(-1), ue = R(-1), Ue = R(0), ke = R(-1), Je = R(0), je = R(-1), Te = R(""), yt = R(""), wt = R(""), bt = R(0), en = g ?? Ot, oe = P ?? Sn, ve = X ?? An;
  let $e = A ?? rt;
  (!$e || !("anchorX" in $e) || !("anchorY" in $e) || !("widthLeft" in $e) || !("widthRight" in $e) || !("heightAbove" in $e) || !("heightBelow" in $e)) && (console.warn("TalkingHeadCanvas - Invalid mouthDest structure, using defaults:", $e), $e = rt);
  const lt = M && M.length > 0 ? M : [{ atlas: en, dest: $e }], St = R(lt);
  St.current = lt;
  const be = lt[0].atlas, le = lt[0].dest;
  de(() => {
  }, [le, Be, m, be]);
  const [tn, Pt] = q(0), qe = ae(() => a && !isNaN(a.currentTime) ? a.currentTime + ce : (performance.now() - Ce.current) / 1e3, [a, ce]), It = ae(() => {
    const t = qe();
    if (!(o || m)) return 0;
    if (h.length > 0 && o) {
      const r = hn(h, t);
      return Math.max(0, Math.min(r, be.frames.length - 1));
    }
    if (a && o && Number.isFinite(a.duration) && a.duration > 0) {
      const r = a.duration, w = Math.max(0, Math.min(1, t / r));
      return Math.floor(w * be.frames.length) % Math.max(1, be.frames.length);
    }
    return Math.floor(t / fn) % be.frames.length;
  }, [o, m, h, qe, be.frames.length, a]), Wt = ae(() => {
    const t = qe() * v;
    return mn(h, t);
  }, [h, qe, v]), Oe = R(I);
  Oe.current = I;
  const Bt = R(0), [nn, ht] = q(0), Ze = R(null), At = k != null ? Math.max(0, Math.min(k, oe.frames.length - 1)) : x !== void 0 ? (() => {
    const t = oe.frames.findIndex((f) => f.state === x);
    return t >= 0 ? t : 0;
  })() : S ? Math.max(0, Math.min(nn, oe.frames.length - 1)) : 0, _t = R(oe);
  _t.current = oe, de(() => {
    if (!S || x !== void 0 || k != null) return;
    const t = _t.current.frames, f = Math.max(0, t.findIndex((w) => w.state === "open"));
    ht(f);
    const s = () => {
      const w = o ? 2500 : 3e3, y = o ? 5e3 : 6e3, H = w + Math.random() * (y - w);
      Ze.current = setTimeout(r, H);
    }, r = () => {
      const w = _t.current.frames, y = Math.max(0, w.findIndex((u) => u.state === "open")), H = w.findIndex((u) => u.state === "closed"), C = w.findIndex((u) => u.state === "half"), b = C >= 0 ? C : H >= 0 ? H : y, W = H >= 0 ? H : y;
      ht(b), Ze.current = setTimeout(() => {
        ht(W), Ze.current = setTimeout(() => {
          ht(b), Ze.current = setTimeout(() => {
            ht(y), s();
          }, 40);
        }, 40);
      }, 40);
    };
    return s(), () => {
      Ze.current && clearTimeout(Ze.current), Ze.current = null;
    };
  }, [S, o, x, k]);
  const Ht = ae(
    (t, f, s) => {
      const r = ye.current;
      if (!(!(r != null && r.complete) || !r.naturalWidth))
        if (i === 1)
          t.drawImage(r, 0, 0, r.naturalWidth, r.naturalHeight, 0, 0, f, s);
        else {
          const w = f * i, y = s * i, H = (f - w) / 2, C = (s - y) / 2;
          t.drawImage(r, 0, 0, r.naturalWidth, r.naturalHeight, H, C, w, y);
        }
    },
    [i]
  ), Qe = ae(
    (t, f, s) => {
      const r = He.current;
      !(r != null && r.complete) || !r.naturalWidth || (t.fillStyle = "#ffffff", t.fillRect(0, 0, f, s), t.drawImage(r, 0, 0, r.naturalWidth, r.naturalHeight, 0, 0, f, s));
    },
    []
  ), Ye = ae(
    (t, f) => {
      const s = Ee.current;
      if (!(s != null && s.complete) || !s.naturalWidth || !s.naturalHeight) return;
      const r = Math.max(0, Math.min(f, oe.frames.length - 1)), w = oe.frames[r];
      if (!w) return;
      const { x: y, y: H, width: C, height: b } = w, { x: W, y: u, width: z, height: D } = ve, B = s.naturalWidth, $ = s.naturalHeight;
      if (y + C > B || H + b > $ || y < 0 || H < 0) {
        r === 0 && console.warn("TalkingHeadCanvas - Eye frame 0 source rect outside atlas", { sx: y, sy: H, sw: C, sh: b, atlasSize: [B, $] });
        return;
      }
      t.drawImage(s, y, H, C, b, W, u, z, D);
    },
    [oe, ve]
  ), ut = ae(
    (t, f, s, r, w, y) => {
      if (!r.complete || !r.naturalWidth || !r.naturalHeight) return;
      const H = Math.max(0, Math.min(w, f.frames.length - 1)), C = f.frames[H];
      if (!C) return;
      const b = zt(C), W = r.naturalWidth, u = r.naturalHeight, z = b.x, D = b.y, B = Math.max(0, Math.min(z, W - 1)), $ = Math.max(0, Math.min(D, u - 1)), O = Math.min(W, z + b.width), V = Math.min(u, D + b.height), U = Math.max(0, O - B), K = Math.max(0, V - $);
      if (U < 1 || K < 1) {
        H === 0 && console.warn("TalkingHeadCanvas - Frame 0 source rect fully outside atlas; atlas size:", W, "x", u, "sourceRect:", b);
        return;
      }
      const j = Gt(s, H), Y = j.width / b.width, ee = j.height / b.height, re = C.widthLeft * Y, xe = C.heightAbove * ee, we = typeof s.anchorX == "number" && !isNaN(s.anchorX) ? s.anchorX : rt.anchorX, he = typeof s.anchorY == "number" && !isNaN(s.anchorY) ? s.anchorY : rt.anchorY, Z = we - re, fe = he - xe, nt = Z + (B - z) * Y, Xe = fe + ($ - D) * ee, xt = U * Y, Mt = K * ee;
      (isNaN(nt) || isNaN(Xe) || nt < -1e4 || Xe < -1e4) && console.error("TalkingHeadCanvas - Invalid destination position:", { dx: nt, dy: Xe, dw: xt, dh: Mt, destAnchorX: we, destAnchorY: he, ovDest: s, sourceRect: b, destRect: j }), t.save(), t.globalAlpha = y, t.imageSmoothingEnabled = !F.current, t.imageSmoothingQuality = "low", F.current || (t.filter = "brightness(0.98) contrast(1.02) saturate(0.97)");
      try {
        t.drawImage(r, B, $, U, K, nt, Xe, xt, Mt);
      } finally {
        t.filter = "none", t.restore();
      }
    },
    []
    // stable – all data passed as arguments
  ), Ie = ae(
    (t, f, s, r, w) => {
      const y = St.current, H = Re.current;
      y.forEach((C, b) => {
        const W = H[b];
        W && ut(t, C.atlas, C.dest, W, r, w);
      });
    },
    [ut]
  ), De = ae(
    (t, f, s, r, w) => {
      if (!m) return;
      const y = oe.frames[Math.max(0, Math.min(w, oe.frames.length - 1))];
      t.strokeStyle = "#0066ff", t.lineWidth = 2, t.strokeRect(ve.x, ve.y, ve.width, ve.height), t.fillStyle = "rgba(0,0,0,0.85)", t.font = "bold 13px monospace", t.fillText(`Eye: ${(y == null ? void 0 : y.state) ?? "?"} (${w})`, 8, 18);
      const H = Math.max(0, Math.min(r, be.frames.length - 1)), C = be.frames[H];
      if (!C) return;
      const b = zt(C), W = Gt(le, H), u = W.width / b.width, z = W.height / b.height, D = C.widthLeft * u, B = C.heightAbove * z, $ = typeof le.anchorX == "number" && !isNaN(le.anchorX) ? le.anchorX : rt.anchorX, O = typeof le.anchorY == "number" && !isNaN(le.anchorY) ? le.anchorY : rt.anchorY, V = $ - D, U = O - B, K = b.width * u, j = b.height * z;
      t.fillStyle = "#ff0000", t.beginPath(), t.arc($, O, 5, 0, Math.PI * 2), t.fill(), t.fillStyle = "#00ff00", t.beginPath(), t.arc($, O, 5, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(0, 255, 0, 0.1)", t.fillRect(V, U, K, j), t.strokeStyle = "#00ff00", t.lineWidth = 3, t.strokeRect(V, U, K, j), [
        `Mouth frame ${H}: ${C.viseme} (${C.phonemes})`,
        `Source: x=${b.x} y=${b.y} w=${b.width} h=${b.height}`,
        `Dest: x=${V.toFixed(0)} y=${U.toFixed(0)} w=${K.toFixed(0)} h=${j.toFixed(0)}`
      ].forEach((ee, re) => {
        t.fillText(ee, 8, 36 + re * 18);
      });
    },
    [m, be, le, oe, ve]
  ), Yt = ae(
    (t, f, s, r) => {
      const y = Math.round(Math.min(s, r) * 0.12), H = Math.round(Math.min(s, r) * 0.08), C = 3;
      let b = s, W = r, u = -1, z = -1;
      for (let $ = 0; $ < r; $++)
        for (let O = 0; O < s; O++) {
          const V = ($ * s + O) * 4, U = t[V] - f[V], K = t[V + 1] - f[V + 1], j = t[V + 2] - f[V + 2];
          Math.abs(0.2126 * U + 0.7152 * K + 0.0722 * j) > 10 && (O < b && (b = O), O > u && (u = O), $ < W && (W = $), $ > z && (z = $));
        }
      if (u < 0) return new Float32Array(s * r).fill(1);
      b = Math.max(0, b - y), W = Math.max(0, W - y), u = Math.min(s, u + y), z = Math.min(r, z + y);
      let D = new Float32Array(s * r);
      for (let $ = W; $ < z; $++)
        for (let O = b; O < u; O++)
          D[$ * s + O] = 1;
      if (H <= 0) return D;
      const B = Math.max(1, H);
      for (let $ = 0; $ < C; $++) {
        const O = new Float32Array(s * r);
        for (let U = 0; U < r; U++) {
          const K = U * s, j = B * 2 + 1;
          let Y = 0;
          for (let ee = -B; ee <= B; ee++) Y += D[K + Math.max(0, ee)];
          for (let ee = 0; ee < s; ee++)
            O[K + ee] = Y / j, Y -= D[K + Math.max(0, ee - B)], Y += D[K + Math.min(s - 1, ee + B + 1)];
        }
        const V = new Float32Array(s * r);
        for (let U = 0; U < s; U++) {
          const K = B * 2 + 1;
          let j = 0;
          for (let Y = -B; Y <= B; Y++) j += O[Math.max(0, Y) * s + U];
          for (let Y = 0; Y < r; Y++)
            V[Y * s + U] = j / K, j -= O[Math.max(0, Y - B) * s + U], j += O[Math.min(r - 1, Y + B + 1) * s + U];
        }
        D = V;
      }
      for (let $ = 0; $ < D.length; $++) D[$] = Math.min(1, Math.max(0, D[$]));
      return D;
    },
    []
  ), vt = ae(
    (t, f, s, r, w, y) => {
      if (!("OffscreenCanvas" in globalThis)) {
        Ie(t, f, s, r, 1), Ie(t, f, s, w, y);
        return;
      }
      for (const re of [gt, pt, J])
        (!re.current || re.current.width !== f || re.current.height !== s) && (re.current = new OffscreenCanvas(f, s));
      const H = gt.current, C = pt.current, b = J.current, W = H.getContext("2d", { willReadFrequently: !0 }), u = C.getContext("2d", { willReadFrequently: !0 });
      if (!W || !u) {
        Ie(t, f, s, r, 1), Ie(t, f, s, w, y);
        return;
      }
      W.clearRect(0, 0, f, s), u.clearRect(0, 0, f, s);
      const z = St.current, D = Re.current;
      z.forEach((re, xe) => {
        const we = D[xe];
        we && (ut(W, re.atlas, re.dest, we, r, 1), ut(u, re.atlas, re.dest, we, w, 1));
      });
      const B = W.getImageData(0, 0, f, s), $ = u.getImageData(0, 0, f, s), O = `${r}→${w}`;
      let V = Le.current.get(O);
      V || (V = Yt(B.data, $.data, f, s), Le.current.set(O, V), Le.current.size > 200 && Le.current.delete(Le.current.keys().next().value));
      const U = W.createImageData(f, s), K = B.data, j = $.data, Y = U.data;
      for (let re = 0; re < f * s; re++) {
        const xe = V[re] * y, we = 1 - xe, he = re * 4;
        Y[he] = K[he] * we + j[he] * xe, Y[he + 1] = K[he + 1] * we + j[he + 1] * xe, Y[he + 2] = K[he + 2] * we + j[he + 2] * xe, Y[he + 3] = K[he + 3] * we + j[he + 3] * xe;
      }
      const ee = b.getContext("2d");
      ee && (ee.clearRect(0, 0, f, s), ee.putImageData(U, 0, 0), t.drawImage(b, 0, 0));
    },
    [Yt, Ie, ut]
  ), et = ae(
    (t, f, s, r) => {
      var w;
      Ht(t, f, s), (w = Ee.current) != null && w.complete && Ee.current.naturalWidth && Ye(t, r);
    },
    [Ht, Ye]
  ), Tt = ae(
    (t, f, s, r, w) => {
      const y = ye.current;
      (!Ne.current || r === te) && (y != null && y.complete) && y.naturalWidth ? et(t, f, s, w) : (Qe(t, f, s), Ie(t, f, s, r, 1), Ye(t, w)), De(t, f, s, r, w);
    },
    [Qe, Ye, Ie, De, et, te]
  ), tt = ae(() => {
    var we, he;
    const t = pe.current;
    if (!t || !ne) return;
    const f = be.frames.length, s = typeof p == "number", r = t.getContext("2d");
    if (!r) return;
    const w = t.width, y = t.height, H = qe(), C = a && !isNaN(a.currentTime) ? a.currentTime : 0, b = At;
    if (a && (a.paused || a.ended) && h.length > 0) {
      const Z = ye.current;
      Z != null && Z.complete && Z.naturalWidth ? et(r, w, y, b) : Tt(r, w, y, te, b), (we = Oe.current) == null || we.call(Oe, { audioTimeSec: C, syncOffsetSec: ce, visemeIndex: te });
      return;
    }
    if (!s && a && a.ended && h.length === 0) {
      const Z = ye.current;
      Z != null && Z.complete && Z.naturalWidth ? (et(r, w, y, b), De(r, w, y, te, b)) : (Qe(r, w, y), Ie(r, w, y, te, 1), Ye(r, b), De(r, w, y, te, b)), (he = Oe.current) == null || he.call(Oe, { audioTimeSec: C, syncOffsetSec: ce, visemeIndex: te }), me.current = requestAnimationFrame(tt);
      return;
    }
    if (Oe.current && performance.now() - Bt.current >= 100) {
      Bt.current = performance.now();
      const Z = It();
      Oe.current({ audioTimeSec: C, syncOffsetSec: ce, visemeIndex: Z });
    }
    if (s) {
      const Z = Math.max(0, Math.min(p, f - 1));
      Tt(r, w, y, Z, b), me.current = requestAnimationFrame(tt);
      return;
    }
    if (h.length > 0 && o) {
      const Z = Wt(), fe = Math.max(0, Math.min(Z.primaryIndex, f - 1)), nt = Math.max(0, Math.min(Z.secondaryIndex, f - 1)), Xe = Math.max(0, Math.min(1, Z.primaryWeight));
      fe !== je.current && (ke.current = je.current >= 0 ? je.current : fe, Je.current = H, je.current = fe), fe !== Q.current && (Q.current = fe, T == null || T(fe), Pt(fe));
      const xt = H - Je.current, Mt = Math.min(1, xt / _n), Xt = kt(Mt), Vt = !F.current && Xt < 1 && ke.current >= 0 && ke.current !== fe, sn = fe === te && Xe >= 0.9999 && !Vt, Ft = ye.current;
      sn && (Ft != null && Ft.complete) && Ft.naturalWidth ? (et(r, w, y, b), De(r, w, y, 0, b)) : (Qe(r, w, y), Vt ? vt(r, w, y, ke.current, fe, Xt) : Xe >= 0.9999 || F.current ? Ie(r, w, y, fe, 1) : vt(r, w, y, nt, fe, Xe), Ye(r, b), De(r, w, y, fe, b)), me.current = requestAnimationFrame(tt);
      return;
    }
    const u = It();
    u !== ue.current && (ct.current = ue.current >= 0 ? ue.current : u, ue.current = u, Ue.current = H);
    const z = H - Ue.current, D = Math.min(1, z / In), B = kt(D), $ = B < 1 && ct.current >= 0 && ct.current !== ue.current, O = `${le.anchorX},${le.anchorY},${le.widthLeft},${le.widthRight},${le.heightAbove},${le.heightBelow},${le.heightAboveRow2 ?? ""},${le.heightBelowRow2 ?? ""}`, V = O !== Te.current, U = be.frames[u], K = U ? `${u}:${U.anchorX},${U.anchorY},${U.widthLeft},${U.widthRight},${U.heightAbove},${U.heightBelow}` : "", j = K !== yt.current, Y = `${ve.x},${ve.y},${ve.width},${ve.height}|${oe.frames.map((Z) => `${Z.x},${Z.y},${Z.width},${Z.height}`).join(";")}`, ee = Y !== wt.current, re = b !== bt.current, xe = u !== Q.current || $ || m || V || j || ee || re;
    u !== Q.current && (T == null || T(u), Pt(u)), V && (Te.current = O, Q.current = -1), j && (yt.current = K), ee && (wt.current = Y), re && (bt.current = b), Q.current = u, xe && ($ && !F.current ? (Qe(r, w, y), vt(r, w, y, ct.current, ue.current, B), Ye(r, b), De(r, w, y, u, b)) : Tt(r, w, y, u, b)), me.current = requestAnimationFrame(tt);
  }, [
    ne,
    It,
    Wt,
    qe,
    Tt,
    Qe,
    Ye,
    et,
    Ie,
    De,
    Ht,
    m,
    T,
    le,
    ve,
    oe,
    p,
    be,
    h.length,
    o,
    At,
    ce,
    te,
    vt
  ]);
  de(() => {
    if (!n) {
      ye.current = null;
      return;
    }
    const t = new Image();
    t.crossOrigin = "";
    const f = n.startsWith("/") ? `${at}${n}` : n;
    return t.onload = () => {
      ye.current = t, Q.current = -1;
    }, t.onerror = () => {
      ye.current = null;
    }, t.src = f, () => {
      ye.current = null;
    };
  }, [n]);
  const rn = lt.map((t) => t.atlas.imageUrl).join("|");
  return de(() => {
    Pe(!1);
    let t = !1;
    const f = new Image(), s = new Image();
    f.crossOrigin = "", s.crossOrigin = "";
    const r = e ?? jt, w = new Promise((u, z) => {
      f.onload = () => {
        t || (ft({ width: f.naturalWidth, height: f.naturalHeight }), u());
      }, f.onerror = () => {
        t || z(new Error(`Failed to load ${r}`));
      }, f.src = r;
    }), y = St.current, H = y.map(() => {
      const u = new Image();
      return u.crossOrigin = "", u;
    }), C = y.map((u, z) => {
      const D = H[z], B = u.atlas.imageUrl.startsWith("/") ? `${at}${u.atlas.imageUrl}` : u.atlas.imageUrl;
      return new Promise(($, O) => {
        const V = (U, K) => {
          D.onload = () => $(), D.onerror = () => {
            t || (!K && !M && z === 0 && B !== Ct ? (D.src = Ct, V(Ct, !0)) : O(new Error(`Failed to load ${u.atlas.imageUrl}`)));
          }, D.src = U;
        };
        V(B, !1);
      });
    }), b = oe.imageUrl.startsWith("/") ? `${at}${oe.imageUrl}` : oe.imageUrl, W = new Promise((u, z) => {
      s.onload = () => {
        u();
      }, s.onerror = () => {
        t || z(new Error(`Failed to load ${oe.imageUrl}`));
      }, s.src = b;
    });
    return w.then(() => {
      if (!t)
        return He.current = f, Ae(null), Promise.all(C);
    }).then(() => {
      if (!t)
        return Re.current = H, ze(null), W.then(() => {
          t || (Ee.current = s, bt.current = -1, Fe(null));
        }).catch((u) => {
          console.debug("[TalkyHeads] Eye spritesheet not found (optional):", (u == null ? void 0 : u.message) ?? u), Ee.current = null;
        });
    }).then(() => {
      t || Pe(!0);
    }).catch((u) => {
      t || (He.current ? (ze(u instanceof Error ? u.message : String(u)), Pe(!0)) : Ae(u instanceof Error ? u.message : String(u)));
    }), () => {
      t = !0, He.current = null, Re.current = [], Ee.current = null;
    };
  }, [rn, oe.imageUrl, e]), de(() => {
    ge == null || ge(ne);
  }, [ne, ge]), de(() => {
    if (!ne || !Be) return;
    const t = pe.current;
    if (!t) return;
    const f = d ?? Be.width, s = l ?? Be.height;
    return (t.width !== f || t.height !== s) && (t.width = f, t.height = s, Q.current = -1), Se.current && (Se.current.style.aspectRatio = c !== "circle" ? `${f} / ${s}` : ""), Ce.current = performance.now(), bt.current = -1, me.current = requestAnimationFrame(tt), () => cancelAnimationFrame(me.current);
  }, [ne, Be, d, l, c, tt]), de(() => {
    m && (Ce.current = performance.now(), Q.current = -1);
  }, [m]), _e ? /* @__PURE__ */ Me("div", { className: `flex items-center justify-center bg-gray-200 text-red-600 text-sm p-4 ${N}`, style: ie, children: _e }) : /* @__PURE__ */ Ve(
    "div",
    {
      ref: Se,
      className: `relative w-full min-h-[80px] rounded-lg overflow-hidden ${N}`,
      style: {
        position: "relative",
        width: "100%",
        minHeight: "80px",
        overflow: "hidden",
        backgroundColor: "transparent",
        ...c === "circle" ? { borderRadius: "50%" } : {},
        ...ie
      },
      children: [
        /* @__PURE__ */ Me(
          "canvas",
          {
            ref: pe,
            className: "absolute inset-0 w-full h-full block",
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "contain",
              objectPosition: "center top",
              backgroundColor: "#ffffff",
              zIndex: 2
            },
            "aria-label": "Talking head avatar"
          }
        ),
        G && /* @__PURE__ */ Me(
          "div",
          {
            className: "absolute inset-0 pointer-events-none select-none",
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 1,
              opacity: ne ? 0 : 1,
              transition: "opacity 200ms ease",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ Me(
              "img",
              {
                src: G,
                alt: "",
                draggable: !1,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  userSelect: "none",
                  pointerEvents: "none"
                }
              }
            )
          }
        ),
        m && /* @__PURE__ */ Ve(
          "div",
          {
            className: "absolute top-1 left-1 bg-black/70 text-green-400 text-xs font-mono px-2 py-1 rounded",
            style: { position: "absolute", top: 4, left: 4, zIndex: 10, fontSize: 11, fontFamily: "monospace", background: "rgba(0,0,0,0.7)", color: "#4ade80", padding: "2px 6px", borderRadius: 4 },
            children: [
              "mouth: ",
              tn,
              " | eye: ",
              ((Dt = oe.frames[At]) == null ? void 0 : Dt.state) ?? "?",
              " (",
              At,
              ")"
            ]
          }
        ),
        We && /* @__PURE__ */ Ve(
          "div",
          {
            className: "absolute bottom-1 left-1 right-1 bg-amber-800/90 text-amber-100 text-xs px-2 py-1 rounded text-center",
            style: { position: "absolute", bottom: 4, left: 4, right: 4, zIndex: 10, fontSize: 11, background: "rgba(120,53,15,0.9)", color: "#fef3c7", padding: "4px 8px", borderRadius: 4, textAlign: "center" },
            children: [
              "Mouth image failed: check ",
              /* @__PURE__ */ Me("code", { style: { background: "rgba(69,26,3,0.5)", padding: "0 2px" }, children: be.imageUrl }),
              " in public/"
            ]
          }
        ),
        Ge && /* @__PURE__ */ Ve(
          "div",
          {
            className: "absolute bottom-8 left-1 right-1 bg-blue-900/90 text-blue-100 text-xs px-2 py-1 rounded text-center",
            style: { position: "absolute", bottom: 36, left: 4, right: 4, zIndex: 10, fontSize: 11, background: "rgba(30,58,138,0.9)", color: "#dbeafe", padding: "4px 8px", borderRadius: 4, textAlign: "center" },
            children: [
              "Eyes image failed: check ",
              /* @__PURE__ */ Me("code", { style: { background: "rgba(23,37,84,0.5)", padding: "0 2px" }, children: oe.imageUrl }),
              " in public/"
            ]
          }
        )
      ]
    }
  );
}
function Ut(e, n, i) {
  const c = e ? `${e}/` : "", a = c && n.startsWith(c) ? n.slice(c.length) : n;
  return `${i}/${a}`;
}
function Ln(e, n) {
  const i = Ut(e.group ?? "", e.base.file, n), c = e.parts.map((o) => {
    const d = o.atlasPages[0];
    if (!d) return null;
    const l = o.bboxOnBase, { tileW: m, tileH: g } = d, A = Math.round((m - l.w) / 2), M = Math.round((g - l.h) / 2), L = Ut(e.group ?? "", d.file, n), p = e.frames.map((P) => {
      const X = P.parts.find((S) => S.partIndex === o.partIndex), x = X ? X.atlasX + A : 0, k = X ? X.atlasY + M : 0;
      return {
        anchorX: x + Math.floor(l.w / 2),
        anchorY: k,
        widthLeft: Math.floor(l.w / 2),
        widthRight: Math.ceil(l.w / 2),
        heightAbove: 0,
        heightBelow: l.h,
        viseme: P.imageStem,
        phonemes: P.imageStem
      };
    });
    if (p.length === 0) return null;
    const T = {
      anchorX: l.x + Math.floor(l.w / 2),
      anchorY: l.y,
      widthLeft: Math.floor(l.w / 2),
      widthRight: Math.ceil(l.w / 2),
      heightAbove: 0,
      heightBelow: l.h
    };
    return { atlasConfig: { imageUrl: L, frames: p }, dest: T };
  }).filter((o) => o !== null);
  if (c.length === 0) return null;
  let a = null, h = null;
  if (e.eyes) {
    const o = e.eyes, d = /* @__PURE__ */ new Set(["open", "closed", "half", "smile", "surprised"]), l = o.states.filter((m) => d.has(m.state)).map((m) => ({ x: m.x, y: m.y, width: m.width, height: m.height, state: m.state }));
    l.length > 0 && (a = {
      imageUrl: Ut(e.group ?? "", o.file, n),
      frames: l
    }, h = { x: o.destX, y: o.destY, width: o.frameWidth, height: o.frameHeight });
  }
  return { overlays: c, baseImageUrl: i, eyeAtlasConfig: a, eyeDestRect: h };
}
const Nn = on(
  function({
    avatarDir: n = "/avatars/Lucy",
    state: i = "IDLE",
    className: c = "",
    style: a,
    debug: h = !1,
    syncOffsetMs: o = 0,
    shape: d = "square",
    restImageScale: l = 1,
    disableBlending: m = !1,
    blinkEnabled: g = !0,
    onSpeakingChange: A,
    onError: M
  }, L) {
    const [p, T] = q(null), [P, X] = q(null), [x, k] = q(null), [S, E] = q(null), [I, _] = q(!1), [N, ie] = q(l), [se, ge] = q(null), [ce, v] = q(null), [G, te] = q(!1), pe = R(null), [Se, ne] = q(null), [Pe, _e] = q([]), [Ae, We] = q(!1), ze = R(null), Ge = R(null), Fe = R(null), Be = R(null), ft = R(null), He = R(!1), ye = R(!1);
    de(() => {
      Be.current = S;
    }, [S]), de(() => {
      ft.current = p;
    }, [p]), de(() => {
      He.current = G;
    }, [G]), de(() => {
      ye.current = I;
    }, [I]);
    const Re = ae(() => {
      Ge.current !== null && (clearTimeout(Ge.current), Ge.current = null);
    }, []);
    de(() => {
      const J = new Audio();
      return pe.current = J, ne(J), J.onended = () => {
        Re(), We(!1), _e([]);
      }, () => {
        J.pause(), pe.current = null;
      };
    }, [Re]), de(() => {
      x && M && M(x);
    }, [x, M]), de(() => {
      let J = !1;
      k(null), T(null), X(null), E(null), ge(null), v(null), _(!0), Fe.current = null;
      const Le = fetch(`${n}/sprite_manifest.json`).then((F) => {
        if (!F.ok) throw new Error(`HTTP ${F.status} loading sprite_manifest.json`);
        return F.json();
      }), Ne = fetch(`${n}/viseme_map.json`).then((F) => F.ok ? F.json() : null).catch(() => null);
      return Promise.all([Le, Ne]).then(([F, me]) => {
        if (J) return;
        const Q = Ln(F, n);
        if (!Q) {
          k("sprite_manifest.json has no valid parts (empty atlas?)");
          return;
        }
        T(Q.overlays.map((Ce) => ({ atlas: Ce.atlasConfig, dest: Ce.dest }))), X(Q.baseImageUrl), typeof F.restImageScale == "number" ? ie(F.restImageScale) : ie(l), Q.eyeAtlasConfig && ge(Q.eyeAtlasConfig), Q.eyeDestRect && v(Q.eyeDestRect), me && E(me);
      }).catch((F) => {
        J || k(F instanceof Error ? F.message : String(F));
      }).finally(() => {
        J || _(!1);
      }), () => {
        J = !0;
      };
    }, [n]);
    const Ee = ae(() => {
      ze.current && (URL.revokeObjectURL(ze.current), ze.current = null);
    }, []), gt = ae((J) => {
      te(J), J || console.debug("[TalkyHeads] canvas assets not ready yet; deferring playback if needed");
    }, []);
    de(() => {
      if (G && !I && Fe.current) {
        console.debug("[TalkyHeads] canvas assets ready, resuming deferred playback");
        const J = Fe.current;
        Fe.current = null, J();
      }
    }, [G, I]), an(L, () => ({
      avatarDir: n,
      speak(J, Le, Ne) {
        const F = pe.current;
        if (!F) return;
        F.pause(), Re(), Ee(), Fe.current = null;
        const me = URL.createObjectURL(Le);
        ze.current = me;
        const Q = (ue) => {
          const Ue = ue.length > 0 ? ue[ue.length - 1].t : 0, ke = () => {
            _e(ue), We(!0), console.debug(`[TalkyHeads] speak: startPlayback events=${ue.length} lastT=${Ue.toFixed(3)}s ready=${G} t=${performance.now().toFixed(1)}ms`), Ge.current = setTimeout(() => {
              We(!1), _e([]), Ge.current = null;
            }, Ue * 1e3 + 200), F.play().catch(console.warn);
          };
          if (!He.current || ye.current) {
            console.debug("[TalkyHeads] speak: deferring playback until canvas + viseme map ready"), Fe.current = ke;
            return;
          }
          ke();
        }, Ce = () => {
          var je;
          const ue = Be.current, Ue = ft.current ?? p;
          if (Ne && ue) {
            F.src = me;
            const Te = Fn(Ne, ue);
            Q(Te);
            return;
          }
          if (Ne) {
            F.src = me;
            const Te = $n(Ne, vn);
            Q(Te);
            return;
          }
          if (ue) {
            F.src = me;
            const Te = () => {
              const yt = isFinite(F.duration) && F.duration > 0 ? F.duration : 2, wt = Rn(J, yt, ue);
              Q(wt), F.removeEventListener("loadedmetadata", Te);
            };
            F.addEventListener("loadedmetadata", Te), F.load();
            return;
          }
          const ke = (je = Ue == null ? void 0 : Ue[0]) == null ? void 0 : je.atlas.frames.length;
          F.src = me;
          const Je = () => {
            const Te = isFinite(F.duration) && F.duration > 0 ? F.duration : 2;
            Q(bn(J, Te, ke)), F.removeEventListener("loadedmetadata", Je);
          };
          F.readyState >= HTMLMediaElement.HAVE_METADATA ? Je() : F.addEventListener("loadedmetadata", Je);
        };
        if (!He.current || ye.current) {
          console.debug("[TalkyHeads] speak: waiting for canvas/viseme-map readiness", { canvasReady: He.current, visemeMapLoading: ye.current }), Fe.current = Ce;
          return;
        }
        Ce();
      },
      stop() {
        var J;
        Re(), (J = pe.current) == null || J.pause(), We(!1), _e([]), Ee(), Fe.current = null;
      }
    }), [p, S, Ee, Re, n]), de(() => {
      A && A(Ae);
    }, [Ae, A]);
    const pt = i === "SPEAKING" || Ae;
    return x ? /* @__PURE__ */ Ve(
      "div",
      {
        className: `flex items-center justify-center bg-gray-200 text-red-600 text-sm p-4 rounded ${c}`,
        style: a,
        children: [
          "TalkingHead error: ",
          x
        ]
      }
    ) : !p || !P ? /* @__PURE__ */ Me(
      "div",
      {
        className: `flex items-center justify-center bg-gray-100 text-gray-400 text-sm p-4 rounded ${c}`,
        style: a,
        children: "Loading avatar…"
      }
    ) : /* @__PURE__ */ Me(
      Hn,
      {
        baseImageUrl: P,
        restImageUrl: `${n}/rest.webp`,
        restImageScale: N,
        shape: d,
        audioEl: Se,
        visemeEvents: Pe,
        speaking: pt,
        overlays: p,
        visemeMap: S ?? void 0,
        debug: h,
        syncOffsetMs: o,
        className: c,
        style: a,
        disableBlending: m,
        eyeAtlas: se ?? void 0,
        eyeDest: ce ?? void 0,
        blinkEnabled: g,
        onAssetsReady: gt
      }
    );
  }
), Cn = "https://api.elevenlabs.io/v1";
async function Un(e, n, i, c = "mp3", a = 1, h) {
  var P, X;
  const d = `${Cn}/text-to-speech/${i}/with-timestamps?output_format=${c === "mp3" ? "mp3_44100_128" : "pcm_44100"}`, l = await fetch(d, {
    method: "POST",
    headers: {
      "xi-api-key": n,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: e.slice(0, 4096),
      model_id: "eleven_multilingual_v2",
      voice_settings: { speed: Math.max(0.5, Math.min(2, a)) }
    }),
    signal: h
  });
  if (!l.ok) {
    const x = await l.text().catch(() => l.statusText);
    throw new Error(`ElevenLabs TTS failed (${l.status}): ${x}`);
  }
  const m = await l.json(), g = atob(m.audio_base64), A = new Uint8Array(g.length);
  for (let x = 0; x < g.length; x++) A[x] = g.charCodeAt(x);
  const M = c === "mp3" ? "audio/mpeg" : "audio/wav", L = new Blob([A], { type: M }), p = m.alignment ?? m.normalized_alignment ?? null, T = p && ((P = p.characters) == null ? void 0 : P.length) > 0 && ((X = p.character_start_times_seconds) == null ? void 0 : X.length) === p.characters.length ? p : null;
  return T ? (console.group(`[TalkyHeads] ElevenLabs alignment — "${e.slice(0, 60)}${e.length > 60 ? "…" : ""}"`), console.table(
    T.characters.map((x, k) => {
      var S, E;
      return {
        char: x,
        start_s: (S = T.character_start_times_seconds[k]) == null ? void 0 : S.toFixed(3),
        end_s: (E = T.character_end_times_seconds[k]) == null ? void 0 : E.toFixed(3)
      };
    })
  ), console.groupEnd()) : console.warn("[TalkyHeads] ElevenLabs returned no alignment — lip-sync will use text-based fallback."), { audioBlob: L, alignment: T };
}
async function kn(e, n, i = "en-US-Neural2-F", c = "en-US", a = "mp3", h) {
  const o = a === "mp3" ? "MP3" : "LINEAR16", d = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${n}`, l = await fetch(d, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: e.slice(0, 5e3) },
      voice: { languageCode: c, name: i },
      audioConfig: { audioEncoding: o }
    }),
    signal: h
  });
  if (!l.ok) {
    const p = await l.text().catch(() => l.statusText);
    throw new Error(`Google TTS failed (${l.status}): ${p}`);
  }
  const m = await l.json(), g = atob(m.audioContent), A = new Uint8Array(g.length);
  for (let p = 0; p < g.length; p++) A[p] = g.charCodeAt(p);
  const M = a === "mp3" ? "audio/mpeg" : "audio/wav";
  return { audioBlob: new Blob([A], { type: M }), alignment: null };
}
async function On(e, n, i = "elevenlabs", c, a = "mp3", h, o, d) {
  var M;
  const l = { "Content-Type": "application/json" };
  o && (l["X-API-Key"] = o);
  const m = n.replace(/\/$/, "");
  if (i === "elevenlabs")
    try {
      const L = performance.now(), p = await fetch(`${m}/tts-with-timestamps`, {
        method: "POST",
        headers: l,
        body: JSON.stringify({ text: e, voice: c, format: a, speed: h }),
        signal: d
      }), T = performance.now(), P = p.headers.get("X-Cache") ?? "UNKNOWN";
      if (p.ok) {
        const X = await p.json();
        if (X.audio_base64) {
          const x = performance.now(), k = atob(X.audio_base64), S = new Uint8Array(k.length);
          for (let N = 0; N < k.length; N++) S[N] = k.charCodeAt(N);
          const E = performance.now(), I = a === "mp3" ? "audio/mpeg" : "audio/wav", _ = X.alignment ?? null;
          return console.debug(
            `[TalkyHeads] proxy /tts-with-timestamps [${P}] — fetch: ${(T - L).toFixed(0)}ms | decode: ${(E - x).toFixed(0)}ms | audio_b64_len: ${X.audio_base64.length} | align_chars: ${((M = _ == null ? void 0 : _.characters) == null ? void 0 : M.length) ?? "none"}`
          ), _ ? (console.groupCollapsed(`[TalkyHeads] proxy alignment — "${e.slice(0, 60)}${e.length > 60 ? "…" : ""}"`), console.table(
            _.characters.map((N, ie) => {
              var se, ge;
              return {
                char: N,
                start_s: (se = _.character_start_times_seconds[ie]) == null ? void 0 : se.toFixed(3),
                end_s: (ge = _.character_end_times_seconds[ie]) == null ? void 0 : ge.toFixed(3)
              };
            })
          ), console.groupEnd()) : console.warn("[TalkyHeads] proxy /tts-with-timestamps returned no alignment — lip-sync will use text-based fallback."), {
            audioBlob: new Blob([S], { type: I }),
            alignment: _
          };
        }
      }
    } catch {
    }
  const g = await fetch(`${m}/tts`, {
    method: "POST",
    headers: l,
    body: JSON.stringify({ text: e, provider: i, voice: c, format: a, speed: h }),
    signal: d
  });
  if (!g.ok) {
    const L = await g.text().catch(() => g.statusText);
    throw new Error(`TTS proxy failed (${g.status}): ${L}`);
  }
  return { audioBlob: await g.blob(), alignment: null };
}
function Pn(e) {
  const [n, i] = q(!1), [c, a] = q(null), h = R(null), o = ae(() => {
    var l;
    (l = h.current) == null || l.abort(), h.current = null, i(!1);
  }, []);
  return { synthesize: ae(
    async (l) => {
      o();
      const m = new AbortController();
      h.current = m, i(!0), a(null);
      try {
        let g;
        return e.mode === "proxy" ? g = await On(
          l,
          e.proxyUrl,
          e.provider ?? "elevenlabs",
          e.voice,
          "mp3",
          e.speed,
          e.apiKey,
          m.signal
        ) : e.provider === "elevenlabs" ? g = await Un(
          l,
          e.apiKey,
          e.voice ?? "",
          "mp3",
          e.speed ?? 1,
          m.signal
        ) : g = await kn(
          l,
          e.apiKey,
          e.voice,
          e.language,
          "mp3",
          m.signal
        ), i(!1), g;
      } catch (g) {
        if (g.name === "AbortError")
          throw i(!1), g;
        const A = g instanceof Error ? g.message : String(g);
        throw a(A), i(!1), g;
      }
    },
    [e, o]
  ), cancel: o, loading: n, error: c };
}
const st = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end"
  },
  textarea: {
    flex: 1,
    resize: "none",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    padding: "8px 12px",
    fontSize: "14px",
    fontFamily: "inherit",
    lineHeight: 1.5,
    outline: "none"
  },
  speakBtn: {
    flexShrink: 0,
    padding: "9px 20px",
    borderRadius: "8px",
    background: "#6366f1",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s"
  },
  speakBtnDisabled: {
    background: "#a5b4fc",
    cursor: "not-allowed"
  },
  error: {
    fontSize: "12px",
    color: "#dc2626",
    marginTop: "2px"
  }
};
function Yn({
  avatarDir: e = "/avatars/Lucy",
  ttsConfig: n,
  placeholder: i = "Type something for the avatar to say…",
  className: c = "",
  style: a,
  debug: h = !1,
  shape: o,
  syncOffsetMs: d,
  disableBlending: l,
  restImageScale: m
}) {
  const g = R(null), [A, M] = q(""), [L, p] = q("IDLE"), { synthesize: T, loading: P, error: X } = Pn(n), x = ae((I) => {
    p((_) => I ? "SPEAKING" : _ === "SPEAKING" ? "IDLE" : _);
  }, []), k = async () => {
    var _;
    const I = A.trim();
    if (!(!I || P))
      try {
        p("THINKING");
        const { audioBlob: N, alignment: ie } = await T(I);
        p("SPEAKING"), (_ = g.current) == null || _.speak(I, N, ie);
      } catch {
        p("IDLE");
      }
  }, S = (I) => {
    I.key === "Enter" && !I.shiftKey && (I.preventDefault(), k());
  }, E = {
    ...st.speakBtn,
    ...P || !A.trim() ? st.speakBtnDisabled : {}
  };
  return /* @__PURE__ */ Ve("div", { style: { ...st.root, ...a }, className: c, children: [
    /* @__PURE__ */ Me(
      Nn,
      {
        ref: g,
        avatarDir: e,
        state: L,
        debug: h,
        ...o !== void 0 && { shape: o },
        ...d !== void 0 && { syncOffsetMs: d },
        ...l !== void 0 && { disableBlending: l },
        ...m !== void 0 && { restImageScale: m },
        onSpeakingChange: x
      }
    ),
    /* @__PURE__ */ Ve("div", { style: st.inputRow, children: [
      /* @__PURE__ */ Me(
        "textarea",
        {
          value: A,
          onChange: (I) => M(I.target.value),
          onKeyDown: S,
          placeholder: i,
          rows: 2,
          disabled: P,
          style: {
            ...st.textarea,
            opacity: P ? 0.6 : 1
          }
        }
      ),
      /* @__PURE__ */ Me(
        "button",
        {
          onClick: k,
          disabled: P || !A.trim(),
          style: E,
          children: P ? "…" : "Speak"
        }
      )
    ] }),
    X && /* @__PURE__ */ Ve("p", { style: st.error, children: [
      "TTS error: ",
      X
    ] })
  ] });
}
function Dn(e, n, i) {
  return n ? "SPEAKING" : e ? "THINKING" : i ? "LISTENING" : "IDLE";
}
export {
  Nn as TalkingHead,
  Yn as TalkingHeadWithTTS,
  Dn as deriveAvatarState,
  Pn as useTTS
};
//# sourceMappingURL=talky-heads-sdk.es.js.map
