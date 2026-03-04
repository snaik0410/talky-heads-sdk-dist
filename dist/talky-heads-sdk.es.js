import { jsx as Ee, jsxs as Xe } from "react/jsx-runtime";
import { useRef as F, useState as q, useEffect as ye, useCallback as se, forwardRef as sn, useImperativeHandle as on } from "react";
function Ct(e) {
  const n = Math.max(0, Math.min(1, e));
  return n * n * (3 - 2 * n);
}
const an = 60, cn = 80;
function jt(e, n) {
  if (!e.length) return 0;
  let a = 0, c = e.length - 1;
  if (e[0].t > n) return 0;
  if (e[c].t <= n) return c;
  for (; a + 1 < c; ) {
    const i = a + c >> 1;
    e[i].t <= n ? a = i : c = i;
  }
  return a;
}
function ln(e, n) {
  if (!e.length) return 0;
  const a = an / 1e3, c = jt(e, n), i = e[c].t;
  return c + 1 < e.length && e[c + 1].t - i < a && n < i + a, e[c].v;
}
const hn = cn, un = 0.7;
function dn(e, n, a = {}) {
  const c = a.blendWindowMs ?? hn, i = a.coarticulationPrimary ?? un, h = c / 1e3;
  if (!e.length)
    return { primaryIndex: 0, secondaryIndex: 0, primaryWeight: 1 };
  const o = jt(e, n), u = e[o].v, l = e[o].t, f = o + 1 < e.length ? e[o + 1].t : l + 1, d = f - l, A = o + 1 < e.length ? e[o + 1].v : u;
  if (A === u || d <= 0)
    return { primaryIndex: u, secondaryIndex: u, primaryWeight: 1 };
  const T = Math.min(h, d * 0.4), I = f - T;
  if (n < I)
    return { primaryIndex: u, secondaryIndex: A, primaryWeight: 1 };
  const w = (n - I) / T, x = Ct(w), W = 1 - (1 - i) * x;
  return { primaryIndex: u, secondaryIndex: A, primaryWeight: W };
}
const mn = 1 / 8;
function fn() {
  const e = /* @__PURE__ */ new Map(), n = Ut.frames;
  for (let a = 0; a < n.length; a++) {
    const i = (n[a].phonemes ?? "").split(",").map((h) => h.trim()).filter((h) => /^[A-Za-z]{1,4}$/.test(h));
    for (const h of i) {
      const o = h.toLowerCase();
      for (const u of o)
        e.set(u, a);
    }
  }
  return e;
}
let _t = null;
function gn() {
  return _t === null && (_t = fn()), _t;
}
function pn(e) {
  const n = e.toLowerCase();
  if (!n) return 0;
  const c = gn().get(n);
  return c !== void 0 ? c : 0;
}
const ht = 80, ut = 50, Ht = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"], yn = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], Vt = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function rt(e) {
  if (e < 0 || !Number.isFinite(e) || e !== Math.floor(e)) return String(e);
  if (e === 0) return "zero";
  if (e < 10) return Ht[e];
  if (e < 20) return yn[e - 10];
  if (e < 100) {
    const n = Math.floor(e / 10), a = e % 10;
    return a === 0 ? Vt[n] : `${Vt[n]}-${Ht[a]}`;
  }
  if (e < 1e3) {
    const n = Math.floor(e / 100), a = e % 100, c = `${Ht[n]} hundred`;
    return a === 0 ? c : `${c} ${rt(a)}`;
  }
  if (e < 1e6) {
    const n = Math.floor(e / 1e3), a = e % 1e3, c = n === 1 ? "one thousand" : `${rt(n)} thousand`;
    return a === 0 ? c : `${c} ${rt(a)}`;
  }
  if (e < 1e9) {
    const n = Math.floor(e / 1e6), a = e % 1e6, c = n === 1 ? "one million" : `${rt(n)} million`;
    return a === 0 ? c : `${c} ${rt(a)}`;
  }
  return String(e);
}
function Zt(e) {
  return e.replace(/\d+/g, (n) => {
    const a = parseInt(n, 10);
    return Number.isNaN(a) ? n : rt(a);
  });
}
function Rt(e, n = ht, a = ut) {
  if (e.length <= 1) return e;
  const c = n / 1e3, i = a / 1e3, h = Math.max(c, i), o = [e[0]];
  let u = e[0].t;
  for (let f = 1; f < e.length - 1; f++)
    e[f].t - u >= h && (o.push(e[f]), u = e[f].t);
  const l = e[e.length - 1];
  return l.t > u && o.push(l), o;
}
const Ft = {
  ".": 3,
  "!": 3,
  "?": 3,
  "\n": 3,
  ",": 2,
  ";": 2,
  ":": 2
};
function wn(e, n, a) {
  const c = a ?? Ut.frames.length;
  if (c === 0 || n <= 0) return [{ t: 0, v: 0 }];
  const h = [...Zt(e)], o = h.filter((w) => /[a-zA-Z0-9]/.test(w)).length, u = h.reduce((w, x) => w + (Ft[x] ?? 0), 0), l = Math.max(1, o + u), A = Math.min(n, l * 0.12) / l, T = [{ t: 0, v: 0 }];
  let I = 0;
  for (const w of h) {
    const x = Ft[w];
    if (x !== void 0)
      T[T.length - 1].v !== 0 && T.push({ t: I, v: 0 }), I += x * A;
    else if (/[a-zA-Z0-9]/.test(w)) {
      const W = Math.min(pn(w), c - 1);
      T.push({ t: I, v: W }), I += A;
    }
  }
  return T[T.length - 1].v !== 0 && T.push({ t: I, v: 0 }), Rt(T, ht, ut);
}
function Kt(e) {
  return {
    x: e.anchorX - e.widthLeft,
    y: e.anchorY - e.heightAbove,
    width: e.widthLeft + e.widthRight,
    height: e.heightAbove + e.heightBelow
  };
}
function zt(e, n) {
  const a = n >= 8, c = a && e.heightAboveRow2 != null ? e.heightAboveRow2 : e.heightAbove, i = a && e.heightBelowRow2 != null ? e.heightBelowRow2 : e.heightBelow;
  return {
    x: e.anchorX - e.widthLeft,
    y: e.anchorY - c,
    width: e.widthLeft + e.widthRight,
    height: c + i
  };
}
const Ut = {
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
}, tt = {
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
}, bn = {
  imageUrl: "/eyesspritesheet.png",
  frames: [
    { x: 0, y: 273, width: 322, height: 383, state: "open" },
    { x: 317, y: 273, width: 337, height: 380, state: "closed" },
    { x: 647, y: 273, width: 303, height: 362, state: "smile" },
    { x: 950, y: 273, width: 323, height: 383, state: "surprised" },
    { x: 1271, y: 273, width: 324, height: 379, state: "half" }
  ]
}, Sn = {
  x: 322,
  y: 185,
  width: 302,
  height: 345
}, An = {
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
function ot(e) {
  return !e || e.length === 0 ? 0 : e[Math.floor(e.length / 2)];
}
const Ve = {
  IH: "AY"
}, Jt = {
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
function qt(e) {
  const a = e.visemeFrames.REST ?? [0], c = {};
  for (const [i, h] of Object.entries(Jt)) {
    const o = Ve[i] ?? i, u = Ve[h] ?? h, l = e.visemeFrames[o] ?? e.visemeFrames[u] ?? a;
    c[i] = l;
  }
  return c;
}
function vn(e) {
  const n = {}, a = e.visemeFrames.REST, c = a ? ot(a) : 0, i = qt(e), h = [];
  for (const [o, u] of Object.entries(Jt)) {
    const l = Ve[o] ?? o, f = Ve[u] ?? u, d = !!e.visemeFrames[l], A = !!e.visemeFrames[f];
    if (!d && !A) {
      const I = l !== o ? ` remapped→"${l}"` : "";
      h.push(`${o}${I} (tried keys: "${l}", "${f}")`);
    }
    const T = i[o] ?? [c];
    n[o] = ot(T), n[`${o}0`] = n[o], n[`${o}1`] = n[o];
  }
  return h.length > 0 && console.warn(
    `[TalkyHeads] buildPhonemeFrameIndex: ${h.length} phoneme(s) not found in viseme_map.json — falling back to REST frame.
` + h.map((o) => `  • ${o}`).join(`
`)
  ), n;
}
const Tn = {
  TH: "TH",
  SH: "SH",
  CH: "CH",
  PH: "F",
  WH: "W",
  CK: "K",
  NG: "NG"
}, Mt = {
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
}, xn = 25;
function Mn(e, n) {
  const a = qt(n), c = n.visemeFrames.REST, i = c ? ot(c) : 0, h = c ?? [i], o = e.characters ?? [], u = e.character_start_times_seconds ?? [], l = e.character_end_times_seconds ?? [], f = [];
  let d = 0;
  for (; d < o.length; ) {
    const S = o[d] ?? "", R = Mt[S.toUpperCase()] ?? S.toUpperCase();
    if ((Ve[R] ?? R) === "SIL" || /\s/.test(S))
      f.push({ isSil: !0, ch: S, tStart: u[d] ?? 0, tEnd: l[d] ?? (u[d] ?? 0) + 0.05 }), d++;
    else {
      const _ = [];
      for (; d < o.length; ) {
        const N = o[d] ?? "", oe = Mt[N.toUpperCase()] ?? N.toUpperCase();
        if ((Ve[oe] ?? oe) === "SIL" || /\s/.test(N)) break;
        _.push({ ch: N, tStart: u[d] ?? 0, tEnd: l[d] ?? (u[d] ?? 0) + 0.05 }), d++;
      }
      f.push({ isSil: !1, slots: _ });
    }
  }
  const A = [], T = /* @__PURE__ */ new Set(), I = [], w = (S, R, L, _) => {
    const N = (L - R) * 1e3, oe = _ ?? Mt[S.toUpperCase()] ?? S.toUpperCase(), Q = Ve[oe] ?? oe, he = a[Q], ie = !he;
    ie && T.add(`"${Q}" (from char "${S}")`);
    const v = he ?? h, k = v.length > 1 ? Math.min(v.length, Math.max(1, Math.floor(N / xn))) : 1, we = `[${v.join(",")}]`;
    let Fe, ue;
    if (k >= 2) {
      const ne = k === v.length ? [...v] : Array.from(
        { length: k },
        (Te, $e) => v[Math.round($e * (v.length - 1) / (k - 1))]
      ), Le = Math.round(N / k);
      Fe = k === v.length ? `${Q}:[${v[0]}→${v[v.length - 1]}]×${k}@${Le}ms` : `${Q}:[${ne[0]}→${ne[k - 1]}]×${k}/${v.length}@${Le}ms`, ue = `[${ne.join(",")}]`;
      const Ne = (L - R) / k;
      for (let Te = 0; Te < k; Te++)
        A.push({ t: R + Te * Ne, v: ne[Te] });
    } else {
      const ne = ot(v);
      Fe = v.length > 1 ? `${Q}:${ne}(1/${v.length},${Math.round(N)}ms)` : `${Q}:${ne}`, ue = `[${ne}]`, A.push({ t: R, v: ne });
    }
    I.push({ char: S, phoneme: Q, mapped: ie ? "⚠ MISSING" : "✓", candidates: we, selected: ue, frames: Fe, tStart: Math.round(R * 1e3) / 1e3, dur_ms: Math.round(N) });
  };
  for (const S of f) {
    if (S.isSil) {
      A.push({ t: S.tStart, v: i }), I.push({ char: S.ch, phoneme: "SIL", mapped: "✓", candidates: `[${i}]`, selected: `[${i}]`, frames: `REST:${i}`, tStart: Math.round(S.tStart * 1e3) / 1e3, dur_ms: Math.round((S.tEnd - S.tStart) * 1e3) });
      continue;
    }
    const R = S.slots, L = [];
    {
      let v = 0;
      for (; v < R.length; ) {
        if (v + 1 < R.length) {
          const k = (R[v].ch + R[v + 1].ch).toUpperCase(), we = Tn[k];
          if (we) {
            L.push({
              ch: R[v].ch + R[v + 1].ch,
              tStart: R[v].tStart,
              tEnd: R[v + 1].tEnd,
              phonemeOverride: we
            }), v += 2;
            continue;
          }
        }
        L.push({ ch: R[v].ch, tStart: R[v].tStart, tEnd: R[v].tEnd }), v++;
      }
    }
    const _ = L, N = _.length, oe = _[0].tStart, Q = _[N - 1].tEnd;
    if ((Q - oe) * 1e3 <= 100 && N > 0) {
      const v = _[Math.floor(N / 2)];
      w(v.ch, oe, Q, v.phonemeOverride);
      continue;
    }
    const ie = [];
    for (let v = 0; v < N; v += 2) ie.push(v);
    N > 1 && !ie.includes(N - 1) && ie.push(N - 1);
    for (let v = 0; v < ie.length; v++) {
      const k = ie[v], we = _[k], Fe = we.tStart, ue = ie[v + 1], ne = ue !== void 0 ? _[ue].tStart : Q;
      w(we.ch, Fe, ne, we.phonemeOverride);
    }
  }
  if (console.groupCollapsed(`[TalkyHeads] alignment phoneme sequence (${I.length} of ${o.length} chars used)`), console.table(I), console.groupEnd(), T.size > 0 && console.warn(
    `[TalkyHeads] buildVisemeTimelineFromAlignmentAndMap: phoneme(s) not in viseme_map — using REST frame:
` + [...T].map((S) => `  • ${S}`).join(`
`)
  ), A.length === 0) return [{ t: 0, v: i }];
  const x = l[o.length - 1] ?? (u[o.length - 1] ?? 0) + 0.15;
  A.push({ t: x, v: i });
  const X = 60 / 1e3;
  for (let S = 0; S < A.length; S++)
    A[S] = { t: Math.max(0, A[S].t - X), v: A[S].v };
  const M = [A[0]];
  for (let S = 1; S < A.length; S++)
    A[S].v !== M[M.length - 1].v && M.push(A[S]);
  const O = Rt(M, ht, ut);
  return O[0].t > 0 && O.unshift({ t: 0, v: i }), O;
}
function Fn(e, n, a) {
  const c = vn(a), i = a.visemeFrames.REST, h = i ? ot(i) : 0, u = [...Zt(e)], l = u.filter((M) => /[a-zA-Z0-9']/.test(M)).length, f = u.reduce((M, O) => M + (Ft[O] ?? 0), 0), d = Math.max(1, l + f), I = Math.min(n, d * 0.12) / d, w = [{ t: 0, v: h }];
  let x = 0;
  const W = /* @__PURE__ */ new Set(), X = [];
  for (const M of u) {
    const O = Ft[M];
    if (O !== void 0)
      X.push({ char: M, phoneme: "REST (pause)", frameIdx: h, t: x.toFixed(3) }), w[w.length - 1].v !== h && w.push({ t: x, v: h }), x += O * I;
    else if (/[a-zA-Z0-9']/.test(M)) {
      const S = M.toUpperCase(), R = Mt[S] ?? S, L = Ve[R] ?? R, _ = c[L];
      _ === void 0 && W.add(`"${L}" (from char "${M}"${R !== L ? `, remapped from "${R}"` : ""})`);
      const N = R !== L ? `${R}→${L}` : L;
      X.push({ char: M, phoneme: N, frameIdx: _ ?? "MISSING", t: x.toFixed(3) }), w.push({ t: x, v: _ ?? h }), x += I;
    }
  }
  return console.group(`[TalkyHeads] text phoneme sequence (${e.slice(0, 40)}${e.length > 40 ? "…" : ""})`), console.table(X), console.groupEnd(), W.size > 0 && console.warn(
    `[TalkyHeads] buildVisemeTimelineFromTextAndMap: phoneme(s) not in phonemeFrameIndex — using REST frame:
` + [...W].map((M) => `  • ${M}`).join(`
`)
  ), w[w.length - 1].v !== h && w.push({ t: x, v: h }), Rt(w, ht, ut);
}
function Rn(e) {
  var c;
  const n = /* @__PURE__ */ new Map(), a = e.visemeRanges;
  for (let i = 0; i < a.length; i++) {
    const o = (((c = a[i]) == null ? void 0 : c.phonemes) ?? "").trim().split(",").map((u) => u.trim()).filter((u) => /^[A-Za-z]{1,4}$/i.test(u));
    for (const u of o) {
      const l = u.toLowerCase();
      for (const f of l) n.set(f, i);
    }
  }
  return n;
}
function En(e, n) {
  const a = Rn(n), c = n.visemeRanges.length;
  if (c === 0) return [{ t: 0, v: 0 }];
  const { characters: i, character_start_times_seconds: h, character_end_times_seconds: o } = e, u = [];
  let l = null;
  for (let A = 0; A < i.length; A++) {
    const T = (i[A] ?? "").toLowerCase(), I = h[A] ?? 0, w = T ? a.get(T) ?? 0 : 0, x = Math.max(0, Math.min(w, c - 1));
    l !== x && (u.push({ t: I, v: x }), l = x);
  }
  if (o.length > 0 && o[o.length - 1], u.length === 0) return [{ t: 0, v: 0 }];
  const f = h[i.length - 1] ?? 0;
  u.push({ t: f + 0.15, v: 0 });
  const d = Rt(u, ht, ut);
  return d[0].t > 0 && d.unshift({ t: 0, v: 0 }), d;
}
const st = typeof import.meta < "u" ? "/".replace(/\/$/, "") : "", Gt = `${st}/parent.png`, Lt = `${st}/mouthsprite.png`, $n = 5 / 60, In = 4 / 60;
function _n({
  baseImageUrl: e,
  restImageUrl: n,
  restImageScale: a = 1,
  shape: c = "square",
  audioEl: i = null,
  visemeEvents: h = [],
  speaking: o = !1,
  width: u,
  height: l,
  debug: f = !1,
  atlas: d,
  mouthDest: A,
  overlays: T,
  mouthSpeed: I = 1,
  previewMouthIndex: w,
  onMouthIndexChange: x,
  eyeAtlas: W,
  eyeDest: X,
  eyeState: M,
  eyeFrameIndex: O,
  blinkEnabled: S = !0,
  syncOffsetMs: R = 0,
  onTick: L,
  visemeMap: _,
  className: N = "",
  disableBlending: oe = !1,
  onAssetsReady: Q
}) {
  var Yt;
  const he = R / 1e3, ie = Math.max(0.3, Math.min(2, I)), v = (() => {
    const t = n ?? e ?? Gt;
    if (t)
      return t.startsWith("/") ? `${st}${t}` : t;
  })(), k = _ ? (() => {
    const t = _.visemeFrames.REST;
    return t && t.length > 0 ? ot(t) : 0;
  })() : 0, we = F(null), Fe = F(null), [ue, ne] = q(!1), [Le, Ne] = q(null), [Te, $e] = q(null), [Ie, dt] = q(null), [ke, Ge] = q(null), Ce = F(null), de = F(null), Oe = F([]), Pe = F(null), mt = F(null), J = F(null), je = F(null), xe = F(/* @__PURE__ */ new Map()), $ = F(o);
  $.current = o;
  const me = F(oe);
  me.current = oe;
  const ae = F(0), fe = F(-1), ft = F(0), ge = F(-1), Se = F(-1), Ke = F(0), We = F(-1), at = F(0), Ae = F(-1), gt = F(""), pt = F(""), kt = F(""), yt = F(0), Qt = d ?? Ut, re = W ?? bn, Me = X ?? Sn;
  let _e = A ?? tt;
  (!_e || !("anchorX" in _e) || !("anchorY" in _e) || !("widthLeft" in _e) || !("widthRight" in _e) || !("heightAbove" in _e) || !("heightBelow" in _e)) && (console.warn("TalkingHeadCanvas - Invalid mouthDest structure, using defaults:", _e), _e = tt);
  const it = T && T.length > 0 ? T : [{ atlas: Qt, dest: _e }], wt = F(it);
  wt.current = it;
  const ve = it[0].atlas, ce = it[0].dest;
  ye(() => {
  }, [ce, ke, f, ve]);
  const [en, Ot] = q(0), Ze = se(() => i && !isNaN(i.currentTime) ? i.currentTime + he : (performance.now() - ft.current) / 1e3, [i, he]), Et = se(() => {
    const t = Ze();
    if (!(o || f)) return 0;
    if (h.length > 0 && o) {
      const r = ln(h, t);
      return Math.max(0, Math.min(r, ve.frames.length - 1));
    }
    if (i && o && Number.isFinite(i.duration) && i.duration > 0) {
      const r = i.duration, y = Math.max(0, Math.min(1, t / r));
      return Math.floor(y * ve.frames.length) % Math.max(1, ve.frames.length);
    }
    return Math.floor(t / mn) % ve.frames.length;
  }, [o, f, h, Ze, ve.frames.length, i]), Pt = se(() => {
    const t = Ze() * ie;
    return dn(h, t);
  }, [h, Ze, ie]), Ue = F(L);
  Ue.current = L;
  const Wt = F(0), [tn, ct] = q(0), ze = F(null), bt = O != null ? Math.max(0, Math.min(O, re.frames.length - 1)) : M !== void 0 ? (() => {
    const t = re.frames.findIndex((g) => g.state === M);
    return t >= 0 ? t : 0;
  })() : S ? Math.max(0, Math.min(tn, re.frames.length - 1)) : 0, $t = F(re);
  $t.current = re, ye(() => {
    if (!S || M !== void 0 || O != null) return;
    const t = $t.current.frames, g = Math.max(0, t.findIndex((y) => y.state === "open"));
    ct(g);
    const s = () => {
      const y = o ? 2500 : 3e3, p = o ? 5e3 : 6e3, H = y + Math.random() * (p - y);
      ze.current = setTimeout(r, H);
    }, r = () => {
      const y = $t.current.frames, p = Math.max(0, y.findIndex((m) => m.state === "open")), H = y.findIndex((m) => m.state === "closed"), C = y.findIndex((m) => m.state === "half"), b = C >= 0 ? C : H >= 0 ? H : p, B = H >= 0 ? H : p;
      ct(b), ze.current = setTimeout(() => {
        ct(B), ze.current = setTimeout(() => {
          ct(b), ze.current = setTimeout(() => {
            ct(p), s();
          }, 40);
        }, 40);
      }, 40);
    };
    return s(), () => {
      ze.current && clearTimeout(ze.current), ze.current = null;
    };
  }, [S, o, M, O]);
  const It = se(
    (t, g, s) => {
      const r = de.current;
      if (!(!(r != null && r.complete) || !r.naturalWidth))
        if (a === 1)
          t.drawImage(r, 0, 0, r.naturalWidth, r.naturalHeight, 0, 0, g, s);
        else {
          const y = g * a, p = s * a, H = (g - y) / 2, C = (s - p) / 2;
          t.drawImage(r, 0, 0, r.naturalWidth, r.naturalHeight, H, C, y, p);
        }
    },
    [a]
  ), Je = se(
    (t, g, s) => {
      const r = Ce.current;
      !(r != null && r.complete) || !r.naturalWidth || (t.fillStyle = "#ffffff", t.fillRect(0, 0, g, s), t.drawImage(r, 0, 0, r.naturalWidth, r.naturalHeight, 0, 0, g, s));
    },
    []
  ), Be = se(
    (t, g) => {
      const s = Pe.current;
      if (!(s != null && s.complete) || !s.naturalWidth || !s.naturalHeight) return;
      const r = Math.max(0, Math.min(g, re.frames.length - 1)), y = re.frames[r];
      if (!y) return;
      const { x: p, y: H, width: C, height: b } = y, { x: B, y: m, width: G, height: V } = Me, Y = s.naturalWidth, E = s.naturalHeight;
      if (p + C > Y || H + b > E || p < 0 || H < 0) {
        r === 0 && console.warn("TalkingHeadCanvas - Eye frame 0 source rect outside atlas", { sx: p, sy: H, sw: C, sh: b, atlasSize: [Y, E] });
        return;
      }
      t.drawImage(s, p, H, C, b, B, m, G, V);
    },
    [re, Me]
  ), lt = se(
    (t, g, s, r, y, p) => {
      if (!r.complete || !r.naturalWidth || !r.naturalHeight) return;
      const H = Math.max(0, Math.min(y, g.frames.length - 1)), C = g.frames[H];
      if (!C) return;
      const b = Kt(C), B = r.naturalWidth, m = r.naturalHeight, G = b.x, V = b.y, Y = Math.max(0, Math.min(G, B - 1)), E = Math.max(0, Math.min(V, m - 1)), P = Math.min(B, G + b.width), K = Math.min(m, V + b.height), U = Math.max(0, P - Y), z = Math.max(0, K - E);
      if (U < 1 || z < 1) {
        H === 0 && console.warn("TalkingHeadCanvas - Frame 0 source rect fully outside atlas; atlas size:", B, "x", m, "sourceRect:", b);
        return;
      }
      const j = zt(s, H), D = j.width / b.width, ee = j.height / b.height, te = C.widthLeft * D, Re = C.heightAbove * ee, be = typeof s.anchorX == "number" && !isNaN(s.anchorX) ? s.anchorX : tt.anchorX, le = typeof s.anchorY == "number" && !isNaN(s.anchorY) ? s.anchorY : tt.anchorY, Z = be - te, pe = le - Re, et = Z + (Y - G) * D, De = pe + (E - V) * ee, vt = U * D, Tt = z * ee;
      (isNaN(et) || isNaN(De) || et < -1e4 || De < -1e4) && console.error("TalkingHeadCanvas - Invalid destination position:", { dx: et, dy: De, dw: vt, dh: Tt, destAnchorX: be, destAnchorY: le, ovDest: s, sourceRect: b, destRect: j }), t.save(), t.globalAlpha = p, t.imageSmoothingEnabled = !me.current, t.imageSmoothingQuality = "low", me.current || (t.filter = "brightness(0.98) contrast(1.02) saturate(0.97)");
      try {
        t.drawImage(r, Y, E, U, z, et, De, vt, Tt);
      } finally {
        t.filter = "none", t.restore();
      }
    },
    []
    // stable – all data passed as arguments
  ), He = se(
    (t, g, s, r, y) => {
      const p = wt.current, H = Oe.current;
      p.forEach((C, b) => {
        const B = H[b];
        B && lt(t, C.atlas, C.dest, B, r, y);
      });
    },
    [lt]
  ), Ye = se(
    (t, g, s, r, y) => {
      if (!f) return;
      const p = re.frames[Math.max(0, Math.min(y, re.frames.length - 1))];
      t.strokeStyle = "#0066ff", t.lineWidth = 2, t.strokeRect(Me.x, Me.y, Me.width, Me.height), t.fillStyle = "rgba(0,0,0,0.85)", t.font = "bold 13px monospace", t.fillText(`Eye: ${(p == null ? void 0 : p.state) ?? "?"} (${y})`, 8, 18);
      const H = Math.max(0, Math.min(r, ve.frames.length - 1)), C = ve.frames[H];
      if (!C) return;
      const b = Kt(C), B = zt(ce, H), m = B.width / b.width, G = B.height / b.height, V = C.widthLeft * m, Y = C.heightAbove * G, E = typeof ce.anchorX == "number" && !isNaN(ce.anchorX) ? ce.anchorX : tt.anchorX, P = typeof ce.anchorY == "number" && !isNaN(ce.anchorY) ? ce.anchorY : tt.anchorY, K = E - V, U = P - Y, z = b.width * m, j = b.height * G;
      t.fillStyle = "#ff0000", t.beginPath(), t.arc(E, P, 5, 0, Math.PI * 2), t.fill(), t.fillStyle = "#00ff00", t.beginPath(), t.arc(E, P, 5, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(0, 255, 0, 0.1)", t.fillRect(K, U, z, j), t.strokeStyle = "#00ff00", t.lineWidth = 3, t.strokeRect(K, U, z, j), [
        `Mouth frame ${H}: ${C.viseme} (${C.phonemes})`,
        `Source: x=${b.x} y=${b.y} w=${b.width} h=${b.height}`,
        `Dest: x=${K.toFixed(0)} y=${U.toFixed(0)} w=${z.toFixed(0)} h=${j.toFixed(0)}`
      ].forEach((ee, te) => {
        t.fillText(ee, 8, 36 + te * 18);
      });
    },
    [f, ve, ce, re, Me]
  ), Bt = se(
    (t, g, s, r) => {
      const p = Math.round(Math.min(s, r) * 0.12), H = Math.round(Math.min(s, r) * 0.08), C = 3;
      let b = s, B = r, m = -1, G = -1;
      for (let E = 0; E < r; E++)
        for (let P = 0; P < s; P++) {
          const K = (E * s + P) * 4, U = t[K] - g[K], z = t[K + 1] - g[K + 1], j = t[K + 2] - g[K + 2];
          Math.abs(0.2126 * U + 0.7152 * z + 0.0722 * j) > 10 && (P < b && (b = P), P > m && (m = P), E < B && (B = E), E > G && (G = E));
        }
      if (m < 0) return new Float32Array(s * r).fill(1);
      b = Math.max(0, b - p), B = Math.max(0, B - p), m = Math.min(s, m + p), G = Math.min(r, G + p);
      let V = new Float32Array(s * r);
      for (let E = B; E < G; E++)
        for (let P = b; P < m; P++)
          V[E * s + P] = 1;
      if (H <= 0) return V;
      const Y = Math.max(1, H);
      for (let E = 0; E < C; E++) {
        const P = new Float32Array(s * r);
        for (let U = 0; U < r; U++) {
          const z = U * s, j = Y * 2 + 1;
          let D = 0;
          for (let ee = -Y; ee <= Y; ee++) D += V[z + Math.max(0, ee)];
          for (let ee = 0; ee < s; ee++)
            P[z + ee] = D / j, D -= V[z + Math.max(0, ee - Y)], D += V[z + Math.min(s - 1, ee + Y + 1)];
        }
        const K = new Float32Array(s * r);
        for (let U = 0; U < s; U++) {
          const z = Y * 2 + 1;
          let j = 0;
          for (let D = -Y; D <= Y; D++) j += P[Math.max(0, D) * s + U];
          for (let D = 0; D < r; D++)
            K[D * s + U] = j / z, j -= P[Math.max(0, D - Y) * s + U], j += P[Math.min(r - 1, D + Y + 1) * s + U];
        }
        V = K;
      }
      for (let E = 0; E < V.length; E++) V[E] = Math.min(1, Math.max(0, V[E]));
      return V;
    },
    []
  ), St = se(
    (t, g, s, r, y, p) => {
      if (!("OffscreenCanvas" in globalThis)) {
        He(t, g, s, r, 1), He(t, g, s, y, p);
        return;
      }
      for (const te of [mt, J, je])
        (!te.current || te.current.width !== g || te.current.height !== s) && (te.current = new OffscreenCanvas(g, s));
      const H = mt.current, C = J.current, b = je.current, B = H.getContext("2d", { willReadFrequently: !0 }), m = C.getContext("2d", { willReadFrequently: !0 });
      if (!B || !m) {
        He(t, g, s, r, 1), He(t, g, s, y, p);
        return;
      }
      B.clearRect(0, 0, g, s), m.clearRect(0, 0, g, s);
      const G = wt.current, V = Oe.current;
      G.forEach((te, Re) => {
        const be = V[Re];
        be && (lt(B, te.atlas, te.dest, be, r, 1), lt(m, te.atlas, te.dest, be, y, 1));
      });
      const Y = B.getImageData(0, 0, g, s), E = m.getImageData(0, 0, g, s), P = `${r}→${y}`;
      let K = xe.current.get(P);
      K || (K = Bt(Y.data, E.data, g, s), xe.current.set(P, K), xe.current.size > 200 && xe.current.delete(xe.current.keys().next().value));
      const U = B.createImageData(g, s), z = Y.data, j = E.data, D = U.data;
      for (let te = 0; te < g * s; te++) {
        const Re = K[te] * p, be = 1 - Re, le = te * 4;
        D[le] = z[le] * be + j[le] * Re, D[le + 1] = z[le + 1] * be + j[le + 1] * Re, D[le + 2] = z[le + 2] * be + j[le + 2] * Re, D[le + 3] = z[le + 3] * be + j[le + 3] * Re;
      }
      const ee = b.getContext("2d");
      ee && (ee.clearRect(0, 0, g, s), ee.putImageData(U, 0, 0), t.drawImage(b, 0, 0));
    },
    [Bt, He, lt]
  ), qe = se(
    (t, g, s, r) => {
      var y;
      It(t, g, s), (y = Pe.current) != null && y.complete && Pe.current.naturalWidth && Be(t, r);
    },
    [It, Be]
  ), At = se(
    (t, g, s, r, y) => {
      const p = de.current;
      (!$.current || r === k) && (p != null && p.complete) && p.naturalWidth ? qe(t, g, s, y) : (Je(t, g, s), He(t, g, s, r, 1), Be(t, y)), Ye(t, g, s, r, y);
    },
    [Je, Be, He, Ye, qe, k]
  ), Qe = se(() => {
    var be, le;
    const t = we.current;
    if (!t || !ue) return;
    const g = ve.frames.length, s = typeof w == "number", r = t.getContext("2d");
    if (!r) return;
    const y = t.width, p = t.height, H = Ze(), C = i && !isNaN(i.currentTime) ? i.currentTime : 0, b = bt;
    if (i && (i.paused || i.ended) && h.length > 0) {
      const Z = de.current;
      Z != null && Z.complete && Z.naturalWidth ? qe(r, y, p, b) : At(r, y, p, k, b), (be = Ue.current) == null || be.call(Ue, { audioTimeSec: C, syncOffsetSec: he, visemeIndex: k });
      return;
    }
    if (!s && i && i.ended && h.length === 0) {
      const Z = de.current;
      Z != null && Z.complete && Z.naturalWidth ? (qe(r, y, p, b), Ye(r, y, p, k, b)) : (Je(r, y, p), He(r, y, p, k, 1), Be(r, b), Ye(r, y, p, k, b)), (le = Ue.current) == null || le.call(Ue, { audioTimeSec: C, syncOffsetSec: he, visemeIndex: k }), ae.current = requestAnimationFrame(Qe);
      return;
    }
    if (Ue.current && performance.now() - Wt.current >= 100) {
      Wt.current = performance.now();
      const Z = Et();
      Ue.current({ audioTimeSec: C, syncOffsetSec: he, visemeIndex: Z });
    }
    if (s) {
      const Z = Math.max(0, Math.min(w, g - 1));
      At(r, y, p, Z, b), ae.current = requestAnimationFrame(Qe);
      return;
    }
    if (h.length > 0 && o) {
      const Z = Pt(), pe = Math.max(0, Math.min(Z.primaryIndex, g - 1)), et = Math.max(0, Math.min(Z.secondaryIndex, g - 1)), De = Math.max(0, Math.min(1, Z.primaryWeight));
      pe !== Ae.current && (We.current = Ae.current >= 0 ? Ae.current : pe, at.current = H, Ae.current = pe), pe !== fe.current && (fe.current = pe, x == null || x(pe), Ot(pe));
      const vt = H - at.current, Tt = Math.min(1, vt / In), Dt = Ct(Tt), Xt = !me.current && Dt < 1 && We.current >= 0 && We.current !== pe, rn = pe === k && De >= 0.9999 && !Xt, xt = de.current;
      rn && (xt != null && xt.complete) && xt.naturalWidth ? (qe(r, y, p, b), Ye(r, y, p, 0, b)) : (Je(r, y, p), Xt ? St(r, y, p, We.current, pe, Dt) : De >= 0.9999 || me.current ? He(r, y, p, pe, 1) : St(r, y, p, et, pe, De), Be(r, b), Ye(r, y, p, pe, b)), ae.current = requestAnimationFrame(Qe);
      return;
    }
    const m = Et();
    m !== Se.current && (ge.current = Se.current >= 0 ? Se.current : m, Se.current = m, Ke.current = H);
    const G = H - Ke.current, V = Math.min(1, G / $n), Y = Ct(V), E = Y < 1 && ge.current >= 0 && ge.current !== Se.current, P = `${ce.anchorX},${ce.anchorY},${ce.widthLeft},${ce.widthRight},${ce.heightAbove},${ce.heightBelow},${ce.heightAboveRow2 ?? ""},${ce.heightBelowRow2 ?? ""}`, K = P !== gt.current, U = ve.frames[m], z = U ? `${m}:${U.anchorX},${U.anchorY},${U.widthLeft},${U.widthRight},${U.heightAbove},${U.heightBelow}` : "", j = z !== pt.current, D = `${Me.x},${Me.y},${Me.width},${Me.height}|${re.frames.map((Z) => `${Z.x},${Z.y},${Z.width},${Z.height}`).join(";")}`, ee = D !== kt.current, te = b !== yt.current, Re = m !== fe.current || E || f || K || j || ee || te;
    m !== fe.current && (x == null || x(m), Ot(m)), K && (gt.current = P, fe.current = -1), j && (pt.current = z), ee && (kt.current = D), te && (yt.current = b), fe.current = m, Re && (E && !me.current ? (Je(r, y, p), St(r, y, p, ge.current, Se.current, Y), Be(r, b), Ye(r, y, p, m, b)) : At(r, y, p, m, b)), ae.current = requestAnimationFrame(Qe);
  }, [
    ue,
    Et,
    Pt,
    Ze,
    At,
    Je,
    Be,
    qe,
    He,
    Ye,
    It,
    f,
    x,
    ce,
    Me,
    re,
    w,
    ve,
    h.length,
    o,
    bt,
    he,
    k,
    St
  ]);
  ye(() => {
    if (!n) {
      de.current = null;
      return;
    }
    const t = new Image();
    t.crossOrigin = "";
    const g = n.startsWith("/") ? `${st}${n}` : n;
    return t.onload = () => {
      de.current = t, fe.current = -1;
    }, t.onerror = () => {
      de.current = null;
    }, t.src = g, () => {
      de.current = null;
    };
  }, [n]);
  const nn = it.map((t) => t.atlas.imageUrl).join("|");
  return ye(() => {
    ne(!1);
    let t = !1;
    const g = new Image(), s = new Image();
    g.crossOrigin = "", s.crossOrigin = "";
    const r = e ?? Gt, y = new Promise((m, G) => {
      g.onload = () => {
        t || (Ge({ width: g.naturalWidth, height: g.naturalHeight }), m());
      }, g.onerror = () => {
        t || G(new Error(`Failed to load ${r}`));
      }, g.src = r;
    }), p = wt.current, H = p.map(() => {
      const m = new Image();
      return m.crossOrigin = "", m;
    }), C = p.map((m, G) => {
      const V = H[G], Y = m.atlas.imageUrl.startsWith("/") ? `${st}${m.atlas.imageUrl}` : m.atlas.imageUrl;
      return new Promise((E, P) => {
        const K = (U, z) => {
          V.onload = () => E(), V.onerror = () => {
            t || (!z && !T && G === 0 && Y !== Lt ? (V.src = Lt, K(Lt, !0)) : P(new Error(`Failed to load ${m.atlas.imageUrl}`)));
          }, V.src = U;
        };
        K(Y, !1);
      });
    }), b = re.imageUrl.startsWith("/") ? `${st}${re.imageUrl}` : re.imageUrl, B = new Promise((m, G) => {
      s.onload = () => {
        m();
      }, s.onerror = () => {
        t || G(new Error(`Failed to load ${re.imageUrl}`));
      }, s.src = b;
    });
    return y.then(() => {
      if (!t)
        return Ce.current = g, Ne(null), Promise.all(C);
    }).then(() => {
      if (!t)
        return Oe.current = H, $e(null), B.then(() => {
          t || (Pe.current = s, yt.current = -1, dt(null));
        }).catch((m) => {
          console.debug("[TalkyHeads] Eye spritesheet not found (optional):", (m == null ? void 0 : m.message) ?? m), Pe.current = null;
        });
    }).then(() => {
      t || ne(!0);
    }).catch((m) => {
      t || (Ce.current ? ($e(m instanceof Error ? m.message : String(m)), ne(!0)) : Ne(m instanceof Error ? m.message : String(m)));
    }), () => {
      t = !0, Ce.current = null, Oe.current = [], Pe.current = null;
    };
  }, [nn, re.imageUrl, e]), ye(() => {
    Q == null || Q(ue);
  }, [ue, Q]), ye(() => {
    if (!ue || !ke) return;
    const t = we.current;
    if (!t) return;
    const g = u ?? ke.width, s = l ?? ke.height;
    return (t.width !== g || t.height !== s) && (t.width = g, t.height = s, fe.current = -1), Fe.current && (Fe.current.style.aspectRatio = c !== "circle" ? `${g} / ${s}` : ""), ft.current = performance.now(), yt.current = -1, ae.current = requestAnimationFrame(Qe), () => cancelAnimationFrame(ae.current);
  }, [ue, ke, u, l, c, Qe]), ye(() => {
    f && (ft.current = performance.now(), fe.current = -1);
  }, [f]), Le ? /* @__PURE__ */ Ee("div", { className: `flex items-center justify-center bg-gray-200 text-red-600 text-sm p-4 ${N}`, children: Le }) : /* @__PURE__ */ Xe(
    "div",
    {
      ref: Fe,
      className: `relative w-full min-h-[80px] rounded-lg overflow-hidden ${N}`,
      style: {
        position: "relative",
        width: "100%",
        minHeight: "80px",
        overflow: "hidden",
        backgroundColor: "transparent",
        ...c === "circle" ? { borderRadius: "50%" } : {}
      },
      children: [
        /* @__PURE__ */ Ee(
          "canvas",
          {
            ref: we,
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
        v && /* @__PURE__ */ Ee(
          "div",
          {
            className: "absolute inset-0 pointer-events-none select-none",
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 1,
              opacity: ue ? 0 : 1,
              transition: "opacity 200ms ease",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ Ee(
              "img",
              {
                src: v,
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
        f && /* @__PURE__ */ Xe(
          "div",
          {
            className: "absolute top-1 left-1 bg-black/70 text-green-400 text-xs font-mono px-2 py-1 rounded",
            style: { position: "absolute", top: 4, left: 4, zIndex: 10, fontSize: 11, fontFamily: "monospace", background: "rgba(0,0,0,0.7)", color: "#4ade80", padding: "2px 6px", borderRadius: 4 },
            children: [
              "mouth: ",
              en,
              " | eye: ",
              ((Yt = re.frames[bt]) == null ? void 0 : Yt.state) ?? "?",
              " (",
              bt,
              ")"
            ]
          }
        ),
        Te && /* @__PURE__ */ Xe(
          "div",
          {
            className: "absolute bottom-1 left-1 right-1 bg-amber-800/90 text-amber-100 text-xs px-2 py-1 rounded text-center",
            style: { position: "absolute", bottom: 4, left: 4, right: 4, zIndex: 10, fontSize: 11, background: "rgba(120,53,15,0.9)", color: "#fef3c7", padding: "4px 8px", borderRadius: 4, textAlign: "center" },
            children: [
              "Mouth image failed: check ",
              /* @__PURE__ */ Ee("code", { style: { background: "rgba(69,26,3,0.5)", padding: "0 2px" }, children: ve.imageUrl }),
              " in public/"
            ]
          }
        ),
        Ie && /* @__PURE__ */ Xe(
          "div",
          {
            className: "absolute bottom-8 left-1 right-1 bg-blue-900/90 text-blue-100 text-xs px-2 py-1 rounded text-center",
            style: { position: "absolute", bottom: 36, left: 4, right: 4, zIndex: 10, fontSize: 11, background: "rgba(30,58,138,0.9)", color: "#dbeafe", padding: "4px 8px", borderRadius: 4, textAlign: "center" },
            children: [
              "Eyes image failed: check ",
              /* @__PURE__ */ Ee("code", { style: { background: "rgba(23,37,84,0.5)", padding: "0 2px" }, children: re.imageUrl }),
              " in public/"
            ]
          }
        )
      ]
    }
  );
}
function Nt(e, n, a) {
  const c = e ? `${e}/` : "", i = c && n.startsWith(c) ? n.slice(c.length) : n;
  return `${a}/${i}`;
}
function Hn(e, n) {
  const a = Nt(e.group ?? "", e.base.file, n), c = e.parts.map((o) => {
    const u = o.atlasPages[0];
    if (!u) return null;
    const l = o.bboxOnBase, { tileW: f, tileH: d } = u, A = Math.round((f - l.w) / 2), T = Math.round((d - l.h) / 2), I = Nt(e.group ?? "", u.file, n), w = e.frames.map((W) => {
      const X = W.parts.find((S) => S.partIndex === o.partIndex), M = X ? X.atlasX + A : 0, O = X ? X.atlasY + T : 0;
      return {
        anchorX: M + Math.floor(l.w / 2),
        anchorY: O,
        widthLeft: Math.floor(l.w / 2),
        widthRight: Math.ceil(l.w / 2),
        heightAbove: 0,
        heightBelow: l.h,
        viseme: W.imageStem,
        phonemes: W.imageStem
      };
    });
    if (w.length === 0) return null;
    const x = {
      anchorX: l.x + Math.floor(l.w / 2),
      anchorY: l.y,
      widthLeft: Math.floor(l.w / 2),
      widthRight: Math.ceil(l.w / 2),
      heightAbove: 0,
      heightBelow: l.h
    };
    return { atlasConfig: { imageUrl: I, frames: w }, dest: x };
  }).filter((o) => o !== null);
  if (c.length === 0) return null;
  let i = null, h = null;
  if (e.eyes) {
    const o = e.eyes, u = /* @__PURE__ */ new Set(["open", "closed", "half", "smile", "surprised"]), l = o.states.filter((f) => u.has(f.state)).map((f) => ({ x: f.x, y: f.y, width: f.width, height: f.height, state: f.state }));
    l.length > 0 && (i = {
      imageUrl: Nt(e.group ?? "", o.file, n),
      frames: l
    }, h = { x: o.destX, y: o.destY, width: o.frameWidth, height: o.frameHeight });
  }
  return { overlays: c, baseImageUrl: a, eyeAtlasConfig: i, eyeDestRect: h };
}
const Ln = sn(
  function({
    avatarDir: n = "/avatars/Lucy",
    state: a = "IDLE",
    className: c = "",
    debug: i = !1,
    syncOffsetMs: h = 0,
    shape: o = "square",
    restImageScale: u = 1,
    disableBlending: l = !1,
    blinkEnabled: f = !0,
    onSpeakingChange: d
  }, A) {
    const [T, I] = q(null), [w, x] = q(null), [W, X] = q(null), [M, O] = q(null), [S, R] = q(!1), [L, _] = q(u), [N, oe] = q(null), [Q, he] = q(null), [ie, v] = q(!1), k = F(null), [we, Fe] = q(null), [ue, ne] = q([]), [Le, Ne] = q(!1), Te = F(null), $e = F(null), Ie = F(null), dt = F(null), ke = F(null), Ge = F(!1), Ce = F(!1);
    ye(() => {
      dt.current = M;
    }, [M]), ye(() => {
      ke.current = T;
    }, [T]), ye(() => {
      Ge.current = ie;
    }, [ie]), ye(() => {
      Ce.current = S;
    }, [S]);
    const de = se(() => {
      $e.current !== null && (clearTimeout($e.current), $e.current = null);
    }, []);
    ye(() => {
      const J = new Audio();
      return k.current = J, Fe(J), J.onended = () => {
        de(), Ne(!1), ne([]);
      }, () => {
        J.pause(), k.current = null;
      };
    }, [de]), ye(() => {
      let J = !1;
      X(null), I(null), x(null), O(null), oe(null), he(null), R(!0), Ie.current = null;
      const je = fetch(`${n}/sprite_manifest.json`).then(($) => {
        if (!$.ok) throw new Error(`HTTP ${$.status} loading sprite_manifest.json`);
        return $.json();
      }), xe = fetch(`${n}/viseme_map.json`).then(($) => $.ok ? $.json() : null).catch(() => null);
      return Promise.all([je, xe]).then(([$, me]) => {
        if (J) return;
        const ae = Hn($, n);
        if (!ae) {
          X("sprite_manifest.json has no valid parts (empty atlas?)");
          return;
        }
        I(ae.overlays.map((fe) => ({ atlas: fe.atlasConfig, dest: fe.dest }))), x(ae.baseImageUrl), typeof $.restImageScale == "number" ? _($.restImageScale) : _(u), ae.eyeAtlasConfig && oe(ae.eyeAtlasConfig), ae.eyeDestRect && he(ae.eyeDestRect), me && O(me);
      }).catch(($) => {
        J || X($ instanceof Error ? $.message : String($));
      }).finally(() => {
        J || R(!1);
      }), () => {
        J = !0;
      };
    }, [n]);
    const Oe = se(() => {
      Te.current && (URL.revokeObjectURL(Te.current), Te.current = null);
    }, []), Pe = se((J) => {
      v(J), J || console.debug("[TalkyHeads] canvas assets not ready yet; deferring playback if needed");
    }, []);
    ye(() => {
      if (ie && !S && Ie.current) {
        console.debug("[TalkyHeads] canvas assets ready, resuming deferred playback");
        const J = Ie.current;
        Ie.current = null, J();
      }
    }, [ie, S]), on(A, () => ({
      avatarDir: n,
      speak(J, je, xe) {
        const $ = k.current;
        if (!$) return;
        $.pause(), de(), Oe(), Ie.current = null;
        const me = URL.createObjectURL(je);
        Te.current = me;
        const ae = (ge) => {
          const Se = ge.length > 0 ? ge[ge.length - 1].t : 0, Ke = () => {
            ne(ge), Ne(!0), console.debug(`[TalkyHeads] speak: startPlayback events=${ge.length} lastT=${Se.toFixed(3)}s ready=${ie} t=${performance.now().toFixed(1)}ms`), $e.current = setTimeout(() => {
              Ne(!1), ne([]), $e.current = null;
            }, Se * 1e3 + 200), $.play().catch(console.warn);
          };
          if (!Ge.current || Ce.current) {
            console.debug("[TalkyHeads] speak: deferring playback until canvas + viseme map ready"), Ie.current = Ke;
            return;
          }
          Ke();
        }, fe = () => {
          var at;
          const ge = dt.current, Se = ke.current ?? T;
          if (xe && ge) {
            $.src = me;
            const Ae = Mn(xe, ge);
            ae(Ae);
            return;
          }
          if (xe) {
            $.src = me;
            const Ae = En(xe, An);
            ae(Ae);
            return;
          }
          if (ge) {
            $.src = me;
            const Ae = () => {
              const gt = isFinite($.duration) && $.duration > 0 ? $.duration : 2, pt = Fn(J, gt, ge);
              ae(pt), $.removeEventListener("loadedmetadata", Ae);
            };
            $.addEventListener("loadedmetadata", Ae), $.load();
            return;
          }
          const Ke = (at = Se == null ? void 0 : Se[0]) == null ? void 0 : at.atlas.frames.length;
          $.src = me;
          const We = () => {
            const Ae = isFinite($.duration) && $.duration > 0 ? $.duration : 2;
            ae(wn(J, Ae, Ke)), $.removeEventListener("loadedmetadata", We);
          };
          $.readyState >= HTMLMediaElement.HAVE_METADATA ? We() : $.addEventListener("loadedmetadata", We);
        };
        if (!Ge.current || Ce.current) {
          console.debug("[TalkyHeads] speak: waiting for canvas/viseme-map readiness", { canvasReady: Ge.current, visemeMapLoading: Ce.current }), Ie.current = fe;
          return;
        }
        fe();
      },
      stop() {
        var J;
        de(), (J = k.current) == null || J.pause(), Ne(!1), ne([]), Oe(), Ie.current = null;
      }
    }), [T, M, Oe, de, n]), ye(() => {
      d && d(Le);
    }, [Le, d]);
    const mt = a === "SPEAKING" || Le;
    return W ? /* @__PURE__ */ Xe(
      "div",
      {
        className: `flex items-center justify-center bg-gray-200 text-red-600 text-sm p-4 rounded ${c}`,
        children: [
          "TalkingHead error: ",
          W
        ]
      }
    ) : !T || !w ? /* @__PURE__ */ Ee(
      "div",
      {
        className: `flex items-center justify-center bg-gray-100 text-gray-400 text-sm p-4 rounded ${c}`,
        children: "Loading avatar…"
      }
    ) : /* @__PURE__ */ Ee(
      _n,
      {
        baseImageUrl: w,
        restImageUrl: `${n}/rest.webp`,
        restImageScale: L,
        shape: o,
        audioEl: we,
        visemeEvents: ue,
        speaking: mt,
        overlays: T,
        visemeMap: M ?? void 0,
        debug: i,
        syncOffsetMs: h,
        className: c,
        disableBlending: l,
        eyeAtlas: N ?? void 0,
        eyeDest: Q ?? void 0,
        blinkEnabled: f,
        onAssetsReady: Pe
      }
    );
  }
), Nn = "https://api.elevenlabs.io/v1";
async function Cn(e, n, a, c = "mp3", i = 1, h) {
  var W, X;
  const u = `${Nn}/text-to-speech/${a}/with-timestamps?output_format=${c === "mp3" ? "mp3_44100_128" : "pcm_44100"}`, l = await fetch(u, {
    method: "POST",
    headers: {
      "xi-api-key": n,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: e.slice(0, 4096),
      model_id: "eleven_multilingual_v2",
      voice_settings: { speed: Math.max(0.5, Math.min(2, i)) }
    }),
    signal: h
  });
  if (!l.ok) {
    const M = await l.text().catch(() => l.statusText);
    throw new Error(`ElevenLabs TTS failed (${l.status}): ${M}`);
  }
  const f = await l.json(), d = atob(f.audio_base64), A = new Uint8Array(d.length);
  for (let M = 0; M < d.length; M++) A[M] = d.charCodeAt(M);
  const T = c === "mp3" ? "audio/mpeg" : "audio/wav", I = new Blob([A], { type: T }), w = f.alignment ?? f.normalized_alignment ?? null, x = w && ((W = w.characters) == null ? void 0 : W.length) > 0 && ((X = w.character_start_times_seconds) == null ? void 0 : X.length) === w.characters.length ? w : null;
  return x ? (console.group(`[TalkyHeads] ElevenLabs alignment — "${e.slice(0, 60)}${e.length > 60 ? "…" : ""}"`), console.table(
    x.characters.map((M, O) => {
      var S, R;
      return {
        char: M,
        start_s: (S = x.character_start_times_seconds[O]) == null ? void 0 : S.toFixed(3),
        end_s: (R = x.character_end_times_seconds[O]) == null ? void 0 : R.toFixed(3)
      };
    })
  ), console.groupEnd()) : console.warn("[TalkyHeads] ElevenLabs returned no alignment — lip-sync will use text-based fallback."), { audioBlob: I, alignment: x };
}
async function Un(e, n, a = "en-US-Neural2-F", c = "en-US", i = "mp3", h) {
  const o = i === "mp3" ? "MP3" : "LINEAR16", u = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${n}`, l = await fetch(u, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: e.slice(0, 5e3) },
      voice: { languageCode: c, name: a },
      audioConfig: { audioEncoding: o }
    }),
    signal: h
  });
  if (!l.ok) {
    const w = await l.text().catch(() => l.statusText);
    throw new Error(`Google TTS failed (${l.status}): ${w}`);
  }
  const f = await l.json(), d = atob(f.audioContent), A = new Uint8Array(d.length);
  for (let w = 0; w < d.length; w++) A[w] = d.charCodeAt(w);
  const T = i === "mp3" ? "audio/mpeg" : "audio/wav";
  return { audioBlob: new Blob([A], { type: T }), alignment: null };
}
async function kn(e, n, a = "elevenlabs", c, i = "mp3", h, o, u) {
  var T;
  const l = { "Content-Type": "application/json" };
  o && (l["X-API-Key"] = o);
  const f = n.replace(/\/$/, "");
  if (a === "elevenlabs")
    try {
      const I = performance.now(), w = await fetch(`${f}/tts-with-timestamps`, {
        method: "POST",
        headers: l,
        body: JSON.stringify({ text: e, voice: c, format: i, speed: h }),
        signal: u
      }), x = performance.now(), W = w.headers.get("X-Cache") ?? "UNKNOWN";
      if (w.ok) {
        const X = await w.json();
        if (X.audio_base64) {
          const M = performance.now(), O = atob(X.audio_base64), S = new Uint8Array(O.length);
          for (let N = 0; N < O.length; N++) S[N] = O.charCodeAt(N);
          const R = performance.now(), L = i === "mp3" ? "audio/mpeg" : "audio/wav", _ = X.alignment ?? null;
          return console.debug(
            `[TalkyHeads] proxy /tts-with-timestamps [${W}] — fetch: ${(x - I).toFixed(0)}ms | decode: ${(R - M).toFixed(0)}ms | audio_b64_len: ${X.audio_base64.length} | align_chars: ${((T = _ == null ? void 0 : _.characters) == null ? void 0 : T.length) ?? "none"}`
          ), _ ? (console.groupCollapsed(`[TalkyHeads] proxy alignment — "${e.slice(0, 60)}${e.length > 60 ? "…" : ""}"`), console.table(
            _.characters.map((N, oe) => {
              var Q, he;
              return {
                char: N,
                start_s: (Q = _.character_start_times_seconds[oe]) == null ? void 0 : Q.toFixed(3),
                end_s: (he = _.character_end_times_seconds[oe]) == null ? void 0 : he.toFixed(3)
              };
            })
          ), console.groupEnd()) : console.warn("[TalkyHeads] proxy /tts-with-timestamps returned no alignment — lip-sync will use text-based fallback."), {
            audioBlob: new Blob([S], { type: L }),
            alignment: _
          };
        }
      }
    } catch {
    }
  const d = await fetch(`${f}/tts`, {
    method: "POST",
    headers: l,
    body: JSON.stringify({ text: e, provider: a, voice: c, format: i, speed: h }),
    signal: u
  });
  if (!d.ok) {
    const I = await d.text().catch(() => d.statusText);
    throw new Error(`TTS proxy failed (${d.status}): ${I}`);
  }
  return { audioBlob: await d.blob(), alignment: null };
}
function On(e) {
  const [n, a] = q(!1), [c, i] = q(null), h = F(null), o = se(() => {
    var l;
    (l = h.current) == null || l.abort(), h.current = null, a(!1);
  }, []);
  return { synthesize: se(
    async (l) => {
      o();
      const f = new AbortController();
      h.current = f, a(!0), i(null);
      try {
        let d;
        return e.mode === "proxy" ? d = await kn(
          l,
          e.proxyUrl,
          e.provider ?? "elevenlabs",
          e.voice,
          "mp3",
          e.speed,
          e.apiKey,
          f.signal
        ) : e.provider === "elevenlabs" ? d = await Cn(
          l,
          e.apiKey,
          e.voice ?? "",
          "mp3",
          e.speed ?? 1,
          f.signal
        ) : d = await Un(
          l,
          e.apiKey,
          e.voice,
          e.language,
          "mp3",
          f.signal
        ), a(!1), d;
      } catch (d) {
        if (d.name === "AbortError")
          throw a(!1), d;
        const A = d instanceof Error ? d.message : String(d);
        throw i(A), a(!1), d;
      }
    },
    [e, o]
  ), cancel: o, loading: n, error: c };
}
const nt = {
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
function Bn({
  avatarDir: e = "/avatars/Lucy",
  ttsConfig: n,
  placeholder: a = "Type something for the avatar to say…",
  className: c = "",
  style: i,
  debug: h = !1,
  shape: o,
  syncOffsetMs: u,
  disableBlending: l,
  restImageScale: f
}) {
  const d = F(null), [A, T] = q(""), [I, w] = q("IDLE"), { synthesize: x, loading: W, error: X } = On(n), M = se((L) => {
    w((_) => L ? "SPEAKING" : _ === "SPEAKING" ? "IDLE" : _);
  }, []), O = async () => {
    var _;
    const L = A.trim();
    if (!(!L || W))
      try {
        w("THINKING");
        const { audioBlob: N, alignment: oe } = await x(L);
        w("SPEAKING"), (_ = d.current) == null || _.speak(L, N, oe);
      } catch {
        w("IDLE");
      }
  }, S = (L) => {
    L.key === "Enter" && !L.shiftKey && (L.preventDefault(), O());
  }, R = {
    ...nt.speakBtn,
    ...W || !A.trim() ? nt.speakBtnDisabled : {}
  };
  return /* @__PURE__ */ Xe("div", { style: { ...nt.root, ...i }, className: c, children: [
    /* @__PURE__ */ Ee(
      Ln,
      {
        ref: d,
        avatarDir: e,
        state: I,
        debug: h,
        ...o !== void 0 && { shape: o },
        ...u !== void 0 && { syncOffsetMs: u },
        ...l !== void 0 && { disableBlending: l },
        ...f !== void 0 && { restImageScale: f },
        onSpeakingChange: M
      }
    ),
    /* @__PURE__ */ Xe("div", { style: nt.inputRow, children: [
      /* @__PURE__ */ Ee(
        "textarea",
        {
          value: A,
          onChange: (L) => T(L.target.value),
          onKeyDown: S,
          placeholder: a,
          rows: 2,
          disabled: W,
          style: {
            ...nt.textarea,
            opacity: W ? 0.6 : 1
          }
        }
      ),
      /* @__PURE__ */ Ee(
        "button",
        {
          onClick: O,
          disabled: W || !A.trim(),
          style: R,
          children: W ? "…" : "Speak"
        }
      )
    ] }),
    X && /* @__PURE__ */ Xe("p", { style: nt.error, children: [
      "TTS error: ",
      X
    ] })
  ] });
}
function Yn(e, n, a) {
  return n ? "SPEAKING" : e ? "THINKING" : a ? "LISTENING" : "IDLE";
}
export {
  Ln as TalkingHead,
  Bn as TalkingHeadWithTTS,
  Yn as deriveAvatarState,
  On as useTTS
};
//# sourceMappingURL=talky-heads-sdk.es.js.map
