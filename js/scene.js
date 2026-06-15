var SceneApp = (function () {
  var items = [];
  var zones = [];
  var currentItem = null;
  var currentZone = 'all';
  var playSessionId = 0;
  var playTimeoutId = null;
  var audioPlayer = new Audio();

  var container, zoneTabs, modal, modalIcon, modalEnglish, modalChinese;
  var modalSentenceEn, modalSentenceZh, modalClose, modalBackdrop;
  var replayBtn, modalPrev, modalNext, modalIndex;
  var itemCountEl, visibleCountEl;

  function getFilteredItems() {
    if (currentZone === 'all') return items;
    return items.filter(function (item) { return item.zone === currentZone; });
  }

  function getItemIconHtml(item, sizeClass) {
    if (item.image) {
      return '<img class="' + sizeClass + ' item-img" src="' + item.image + '" alt="' + item.chinese + '">';
    }
    return '<span class="' + sizeClass + '">' + item.emoji + '</span>';
  }

  function renderZoneTabs() {
    zoneTabs.innerHTML = '';
    zones.forEach(function (zone) {
      var btn = document.createElement('button');
      btn.className = 'zone-tab' + (zone.id === currentZone ? ' active' : '');
      btn.type = 'button';
      btn.innerHTML = zone.icon + ' ' + zone.label;
      btn.addEventListener('click', function () {
        currentZone = zone.id;
        document.querySelectorAll('.zone-tab').forEach(function (t) {
          t.classList.remove('active');
        });
        btn.classList.add('active');
        renderItems();
      });
      zoneTabs.appendChild(btn);
    });
  }

  function renderItems() {
    var list = getFilteredItems();
    container.innerHTML = '';

    if (itemCountEl) itemCountEl.textContent = items.length;
    if (visibleCountEl) visibleCountEl.textContent = list.length;

    list.forEach(function (item) {
      var el = document.createElement('div');
      el.className = 'scene-item';
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', item.chinese + ' ' + item.english);
      el.innerHTML =
        getItemIconHtml(item, 'item-icon') +
        '<span class="item-label">' + item.chinese + '</span>';

      el.addEventListener('click', function () {
        el.classList.add('clicked');
        setTimeout(function () { el.classList.remove('clicked'); }, 500);
        openItem(item);
      });

      container.appendChild(el);
    });
  }

  function getCurrentIndex() {
    var list = getFilteredItems();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === currentItem.id) return i;
    }
    return 0;
  }

  function updateModalNav() {
    var list = getFilteredItems();
    var showNav = list.length > 1;
    modalPrev.style.visibility = showNav ? 'visible' : 'hidden';
    modalNext.style.visibility = showNav ? 'visible' : 'hidden';
    if (currentItem && modalIndex) {
      modalIndex.textContent = (getCurrentIndex() + 1) + ' / ' + list.length;
    }
  }

  function showModal(item) {
    modalIcon.innerHTML = getItemIconHtml(item, 'modal-item-icon');
    modalEnglish.textContent = item.english;
    modalChinese.textContent = item.chinese;
    modalSentenceEn.textContent = item.sentenceEn || '';
    modalSentenceZh.textContent = item.sentenceZh || '';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    updateModalNav();
  }

  function stopAll() {
    playSessionId++;
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    if (window.AudioFallback) AudioFallback.stop();
    WordSpeech.stop();
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      playTimeoutId = null;
    }
  }

  function speakItem(item) {
    WordSpeech.speakWords(
      item.id,
      item.english,
      item.chinese,
      item.sentenceEn,
      item.sentenceZh
    );
  }

  function openItem(item) {
    currentItem = item;
    showModal(item);
    stopAll();
    speakItem(item);
  }

  function navigateItem(delta) {
    var list = getFilteredItems();
    if (list.length <= 1 || !currentItem) return;
    var idx = getCurrentIndex();
    var nextIdx = (idx + delta + list.length) % list.length;
    openItem(list[nextIdx]);
  }

  function hideModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    stopAll();
  }

  function bindEvents() {
    modalClose.addEventListener('click', hideModal);
    modalBackdrop.addEventListener('click', hideModal);
    modalPrev.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      navigateItem(-1);
    });
    modalNext.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      navigateItem(1);
    });
    replayBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!currentItem) return;
      stopAll();
      speakItem(currentItem);
    });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('show')) return;
      if (e.key === 'Escape') hideModal();
      if (e.key === 'ArrowLeft') navigateItem(-1);
      if (e.key === 'ArrowRight') navigateItem(1);
    });
  }

  function init(config) {
    items = config.items;
    zones = config.zones;
    var sentences = config.sentences || {};

    items.forEach(function (item) {
      var s = sentences[item.id];
      if (s) {
        item.sentenceEn = s.en;
        item.sentenceZh = s.zh;
      }
    });

    container = document.getElementById('itemsContainer');
    zoneTabs = document.getElementById('zoneTabs');
    modal = document.getElementById('itemModal');
    modalIcon = document.getElementById('modalIcon');
    modalEnglish = document.getElementById('modalEnglish');
    modalChinese = document.getElementById('modalChinese');
    modalSentenceEn = document.getElementById('modalSentenceEn');
    modalSentenceZh = document.getElementById('modalSentenceZh');
    modalClose = document.getElementById('modalClose');
    modalBackdrop = document.getElementById('modalBackdrop');
    replayBtn = document.getElementById('replayBtn');
    modalPrev = document.getElementById('modalPrev');
    modalNext = document.getElementById('modalNext');
    modalIndex = document.getElementById('modalIndex');
    itemCountEl = document.getElementById('itemCount');
    visibleCountEl = document.getElementById('visibleCount');

    bindEvents();
    renderZoneTabs();
    renderItems();
  }

  return { init: init };
})();
