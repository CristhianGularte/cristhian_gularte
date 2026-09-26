/* =========================================================
   CRISTHIAN GULARTE — Interacciones del sitio
========================================================= */

(function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;


  /* =========================
     ENCABEZADO: fondo al hacer scroll
  ========================== */

  var header = document.querySelector('.site-header');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  if (header) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* =========================
     MENÚ MÓVIL
  ========================== */

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll', open);
  }

  if (header && toggle && menu) {

    toggle.addEventListener('click', function () {
      setMenu(!header.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 1081px)').addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });

  }


  /* =========================
     APARICIÓN SUAVE AL HACER SCROLL
  ========================== */

  var reveals = document.querySelectorAll('.reveal');

  if (!reduceMotion && hasObserver) {

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    reveals.forEach(function (element) {
      revealObserver.observe(element);
    });

  } else {

    reveals.forEach(function (element) {
      element.classList.add('is-visible');
    });

  }


  /* =========================
     VIDEOS EN LOOP
     Se descargan y reproducen sólo cuando están en pantalla.
  ========================== */

  var loops = document.querySelectorAll('video[data-autoplay]');

  function showControls(video) {
    video.controls = true;
  }

  if (reduceMotion || !hasObserver) {

    loops.forEach(showControls);

  } else {

    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;

        if (entry.isIntersecting) {
          var playing = video.play();
          // Si el navegador bloquea la reproducción automática (ej. ahorro de batería), se muestran los controles
          if (playing) playing.catch(function () { showControls(video); });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.2 });

    loops.forEach(function (video) {
      video.muted = true;
      videoObserver.observe(video);
    });

  }


  /* =========================
     VIDEO DE BIENVENIDA: botón de reproducción propio
  ========================== */

  document.querySelectorAll('.video-feature').forEach(function (wrapper) {
    var video = wrapper.querySelector('video');
    var button = wrapper.querySelector('.video-play');

    if (!video || !button) return;

    video.controls = false;

    button.addEventListener('click', function () {
      video.controls = true;
      var playing = video.play();
      if (playing) playing.catch(function () {});
    });

    video.addEventListener('play', function () {
      wrapper.classList.add('is-playing');
      video.controls = true;
    });
  });

})();
