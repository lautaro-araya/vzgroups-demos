/* ================================================================
   VZGroups — Demo C · Carrito de compras (solo demostración)
   Estado en sessionStorage: se reinicia al cerrar la pestaña.
   No hay backend, no se transmite ni se guarda nada fuera del navegador.
   ================================================================ */
(function (global) {
  "use strict";

  var KEY = "vz-cart";
  var DESPACHO = 4990;          // despacho en zona de cobertura
  var DESPACHO_GRATIS_DESDE = 50000;
  var IVA = 0.19;               // los precios ya vienen con IVA incluido

  /* ---------------- almacenamiento ---------------- */

  function read() {
    try {
      var raw = JSON.parse(sessionStorage.getItem(KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try { sessionStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    paint();
  }

  /* ---------------- operaciones ---------------- */

  function add(p) {
    var items = read();
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].sku === p.sku) { found = items[i]; break; }
    }
    if (found) { found.qty += (p.qty || 1); }
    else {
      items.push({
        sku: p.sku, nombre: p.nombre, cat: p.cat,
        precio: p.precio, unidad: p.unidad || "", qty: p.qty || 1
      });
    }
    write(items);
    return items;
  }

  function setQty(sku, qty) {
    var items = read().map(function (i) {
      if (i.sku === sku) i.qty = Math.max(1, Math.min(99, qty));
      return i;
    });
    write(items);
    return items;
  }

  function remove(sku) {
    write(read().filter(function (i) { return i.sku !== sku; }));
  }

  function clear() { write([]); }

  /* ---------------- cálculos ---------------- */

  function count() {
    return read().reduce(function (a, i) { return a + i.qty; }, 0);
  }

  function subtotal() {
    return read().reduce(function (a, i) { return a + i.precio * i.qty; }, 0);
  }

  function despacho() {
    var s = subtotal();
    if (s === 0) return 0;
    return s >= DESPACHO_GRATIS_DESDE ? 0 : DESPACHO;
  }

  function total() { return subtotal() + despacho(); }

  // Los precios incluyen IVA: lo desglosamos hacia atrás, como en una boleta chilena.
  function ivaIncluido() { return Math.round(total() - total() / (1 + IVA)); }

  function clp(n) {
    return "$" + Math.round(n).toLocaleString("es-CL");
  }

  /* ---------------- pintado en la página ---------------- */

  function paint() {
    var n = count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.hidden = false;
    });
    document.querySelectorAll("[data-cart-empty-hide]").forEach(function (el) {
      el.hidden = n === 0;
    });
    document.querySelectorAll("[data-cart-empty-show]").forEach(function (el) {
      el.hidden = n !== 0;
    });
  }

  /* ---------------- botones "Agregar al carro" ---------------- */

  function wireAddButtons() {
    var toast = document.querySelector("[data-toast]");
    var t;
    document.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".card");
        add({
          sku: card.getAttribute("data-sku"),
          nombre: card.getAttribute("data-name"),
          cat: card.getAttribute("data-cat-label") || "",
          precio: parseInt(card.getAttribute("data-price"), 10),
          unidad: card.getAttribute("data-unit") || ""
        });
        if (!toast) return;
        toast.textContent = card.getAttribute("data-name") + " agregado al carro";
        toast.classList.add("show");
        clearTimeout(t);
        t = setTimeout(function () { toast.classList.remove("show"); }, 2000);
      });
    });
  }

  /* ---------------- arranque ---------------- */

  function init() {
    paint();
    wireAddButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.VZCart = {
    read: read, add: add, setQty: setQty, remove: remove, clear: clear,
    count: count, subtotal: subtotal, despacho: despacho, total: total,
    ivaIncluido: ivaIncluido, clp: clp, paint: paint,
    DESPACHO_GRATIS_DESDE: DESPACHO_GRATIS_DESDE
  };
})(window);
