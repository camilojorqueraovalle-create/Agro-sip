/* Agro-SIP — JS compartido: tema, nav móvil, desplegable, animaciones de scroll */
(function () {
  'use strict';

  /* ---- Tema ---- */
  var raiz = document.documentElement;
  /* Preferencia de tema recordada dentro de la sesión de navegación (sin almacenamiento persistente). */
  function leerTemaGuardado() {
    var m = document.cookie.match(/(?:^|; )agrosip_tema=(claro|oscuro)/);
    return m ? m[1] : null;
  }
  function guardarTema(v) {
    document.cookie = 'agrosip_tema=' + v + '; path=/; max-age=31536000; SameSite=Lax';
  }
  var guardado = leerTemaGuardado();
  if (guardado) raiz.setAttribute('data-tema', guardado);

  function esOscuro() {
    var t = raiz.getAttribute('data-tema');
    if (t) return t === 'oscuro';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function pintarBotonTema() {
    var btn = document.querySelector('.boton-tema');
    if (!btn) return;
    var oscuro = esOscuro();
    btn.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('title', oscuro ? 'Modo claro' : 'Modo oscuro');
    btn.innerHTML = oscuro
      ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    pintarBotonTema();

    var botonTema = document.querySelector('.boton-tema');
    if (botonTema) {
      botonTema.addEventListener('click', function () {
        var nuevo = esOscuro() ? 'claro' : 'oscuro';
        raiz.setAttribute('data-tema', nuevo);
        guardarTema(nuevo);
        pintarBotonTema();
      });
    }

    /* ---- Nav móvil ---- */
    var cabecera = document.querySelector('.cabecera');
    var hamburguesa = document.querySelector('.hamburguesa');
    if (cabecera && hamburguesa) {
      hamburguesa.addEventListener('click', function () {
        var abierto = cabecera.getAttribute('data-menu') === 'abierto';
        cabecera.setAttribute('data-menu', abierto ? 'cerrado' : 'abierto');
        hamburguesa.setAttribute('aria-expanded', String(!abierto));
      });
    }

    /* ---- Desplegable de servicios (escritorio) ---- */
    var desplegable = document.querySelector('.desplegable');
    if (desplegable) {
      var btn = desplegable.querySelector('.desplegable__btn');
      var cerrar = function () {
        desplegable.setAttribute('data-abierto', 'false');
        btn.setAttribute('aria-expanded', 'false');
      };
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var abierto = desplegable.getAttribute('data-abierto') === 'true';
        desplegable.setAttribute('data-abierto', abierto ? 'false' : 'true');
        btn.setAttribute('aria-expanded', String(!abierto));
      });
      desplegable.addEventListener('mouseenter', function () {
        if (window.innerWidth > 900) desplegable.setAttribute('data-abierto', 'true');
      });
      desplegable.addEventListener('mouseleave', function () {
        if (window.innerWidth > 900) cerrar();
      });
      document.addEventListener('click', function (ev) {
        if (!desplegable.contains(ev.target)) cerrar();
      });
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') cerrar();
      });
    }

    /* ---- Animaciones de scroll ---- */
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var elementos = document.querySelectorAll('.aparece');
    if (reduce || !('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada, i) {
        if (entrada.isIntersecting) {
          var el = entrada.target;
          var retraso = parseFloat(el.dataset.retraso || 0);
          setTimeout(function () { el.classList.add('visible'); }, retraso * 1000);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    elementos.forEach(function (el) { obs.observe(el); });
  });
})();
