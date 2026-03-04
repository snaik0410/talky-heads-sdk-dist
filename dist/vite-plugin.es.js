import e from "fs";
import a from "path";
function m(o = {}) {
  const { destDir: i = "public/avatars", copyAssets: t = !0 } = o;
  function r(s) {
    if (!t) return;
    const d = [
      a.join(s, "node_modules", "talky-heads-sdk", "assets", "avatars"),
      // Monorepo / workspace scenarios
      a.join(s, "..", "node_modules", "talky-heads-sdk", "assets", "avatars"),
      a.join(s, "..", "..", "node_modules", "talky-heads-sdk", "assets", "avatars")
    ];
    let c = null;
    for (const l of d)
      if (e.existsSync(l)) {
        c = l;
        break;
      }
    if (!c) {
      console.warn("[talky-heads] Could not find avatar assets in node_modules. Skipping copy.");
      return;
    }
    const p = a.join(s, i), y = a.join(c, "Lucy"), n = a.join(p, "Lucy");
    if (!e.existsSync(y)) {
      console.warn("[talky-heads] Lucy avatar not found in package assets. Skipping copy.");
      return;
    }
    if (e.existsSync(n) && e.existsSync(a.join(n, "sprite_manifest.json"))) {
      console.log("[talky-heads] Lucy avatar already in public/avatars/Lucy");
      return;
    }
    e.mkdirSync(n, { recursive: !0 }), u(y, n), console.log("[talky-heads] Copied Lucy avatar to", n);
  }
  return {
    name: "talky-heads-plugin",
    configResolved(s) {
      r(s.root);
    }
  };
}
function u(o, i) {
  e.mkdirSync(i, { recursive: !0 });
  for (const t of e.readdirSync(o, { withFileTypes: !0 })) {
    const r = a.join(o, t.name), s = a.join(i, t.name);
    t.isDirectory() ? u(r, s) : e.copyFileSync(r, s);
  }
}
export {
  m as default,
  m as talkyHeadsPlugin
};
//# sourceMappingURL=vite-plugin.es.js.map
