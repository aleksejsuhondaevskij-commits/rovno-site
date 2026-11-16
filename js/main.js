// #ровно — скрипты лендинга
// 1. Кнопка «Показать ещё / Свернуть» в альбоме работ
// 2. Просмотр фото работ и студии (lightbox): стрелки, Esc, клик по фону
// 3. Шапка на телефоне прячется при прокрутке вниз
// 4. Стрелки прокрутки в ряду мастеров

(function () {
  'use strict';

  /* ---------- 1. «Показать ещё» в альбоме работ ---------- */

  var worksGrid = document.getElementById('works-grid');
  var moreButton = document.querySelector('.works-more');
  var moreText = moreButton.textContent;

  moreButton.addEventListener('click', function () {
    var isOpen = worksGrid.classList.toggle('is-collapsed') === false;
    moreButton.setAttribute('aria-expanded', isOpen);
    moreButton.textContent = isOpen ? 'Свернуть' : moreText;
  });

  /* ---------- 2. Lightbox: альбом работ и фото студии ---------- */

  var lightbox = document.getElementById('lb');
  var bigImage = lightbox.querySelector('img');
  var thumbs = [];          // фото текущего альбома
  var current = 0;
  var lastFocused = null;

  function show(index) {
    current = (index + thumbs.length) % thumbs.length;
    var source = thumbs[current].querySelector('img');
    bigImage.src = source.currentSrc || source.src;
    bigImage.alt = source.alt;
  }

  function open(list, index) {
    lastFocused = document.activeElement;
    thumbs = list;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lb-close').focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  // Каждый альбом листается отдельно
  ['#works-grid button', '.gallery .photo'].forEach(function (selector) {
    var list = Array.prototype.slice.call(document.querySelectorAll(selector));
    list.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () { open(list, index); });
    });
  });

  lightbox.querySelector('.lb-close').addEventListener('click', close);
  lightbox.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  lightbox.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });

  // Клик по тёмному фону вокруг фото закрывает просмотр
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowLeft') show(current - 1);
    else if (event.key === 'ArrowRight') show(current + 1);
  });
  /* ---------- 3. Шапка на телефоне: прячется при прокрутке вниз ---------- */

  var header = document.querySelector('.top');
  var mobile = window.matchMedia('(max-width: 800px)');
  var lastY = window.scrollY;

  function updateHeader() {
    var y = window.scrollY;
    if (!mobile.matches || y <= header.offsetHeight) {
      header.classList.remove('is-hidden');      // верх страницы или компьютер
    } else if (y > lastY + 4) {
      header.classList.add('is-hidden');         // листаем вниз
    } else if (y < lastY - 4) {
      header.classList.remove('is-hidden');      // листаем вверх
    }
    if (Math.abs(y - lastY) > 4) lastY = y;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });

  // При переходе по шапке с клавиатуры (Tab) она всегда видна
  header.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('focus', function () { header.classList.remove('is-hidden'); });
  });
  /* ---------- 4. Ряд мастеров: стрелки ---------- */

  var masters = document.querySelector('.masters');
  var prevButton = document.querySelector('.masters-prev');
  var nextButton = document.querySelector('.masters-next');

  function step() {
    var card = masters.querySelector('.master:not([hidden])');
    return card ? card.getBoundingClientRect().width + 14 : 300;
  }

  function updateArrows() {
    var max = masters.scrollWidth - masters.clientWidth;
    prevButton.disabled = masters.scrollLeft <= 6;
    nextButton.disabled = masters.scrollLeft >= max - 6;
    // Если все карточки помещаются, стрелки не нужны
    prevButton.parentElement.hidden = max <= 6;
  }

  prevButton.addEventListener('click', function () { masters.scrollBy({ left: -step() }); });
  nextButton.addEventListener('click', function () { masters.scrollBy({ left: step() }); });
  masters.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
})();
