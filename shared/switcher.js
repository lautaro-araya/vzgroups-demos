/* ============================================================
   VZGroups — inyector de la botonera de demos.
   Uso en cada demo:  <script src="../shared/switcher.js" data-demo="a" defer></script>
   Rutas relativas — compatible con GitHub Pages bajo /repo/.
   ============================================================ */
(function () {
  var current = document.currentScript
    ? document.currentScript.getAttribute("data-demo")
    : null;

  var demos = [
    { id: "a", letter: "A", name: "Holding Técnico", dir: "holding-tecnico" },
    { id: "b", letter: "B", name: "Institucional", dir: "institucional" },
    { id: "c", letter: "C", name: "E-commerce", dir: "ecommerce" }
  ];

  // Hoja de estilos de la botonera (junto a este script).
  // base = .../shared/ ; root = raíz del proyecto. Ambas se derivan del
  // src absoluto del script, así el switcher funciona a cualquier
  // profundidad (p. ej. /ecommerce/tienda/).
  var base = "";
  if (document.currentScript) {
    base = document.currentScript.src.replace(/switcher\.js.*$/, "");
  }
  var root = base.replace(/shared\/$/, "");
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = base + "switcher.css";
  document.head.appendChild(link);

  function build() {
    var nav = document.createElement("nav");
    nav.className = "vz-switcher";
    nav.setAttribute("aria-label", "Cambiar de demo");

    var label = document.createElement("span");
    label.className = "vz-switcher__label";
    label.textContent = "DEMOS";
    nav.appendChild(label);

    demos.forEach(function (d) {
      var a = document.createElement("a");
      a.className = "vz-switcher__btn";
      a.textContent = d.letter;
      a.setAttribute("data-name", d.name);
      if (d.id === current) {
        a.setAttribute("aria-current", "true");
        a.href = "#";
        a.addEventListener("click", function (e) { e.preventDefault(); });
        a.setAttribute("aria-label", d.name + " (demo actual)");
      } else {
        a.href = root + d.dir + "/";
        a.setAttribute("aria-label", "Ir a demo " + d.letter + ": " + d.name);
      }
      nav.appendChild(a);
    });

    document.body.appendChild(nav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
