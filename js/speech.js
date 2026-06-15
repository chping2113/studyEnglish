var WordSpeech = (function () {
  var speechSynth = window.speechSynthesis;
  var wordAudio = new Audio();
  var cachedVoices = [];
  var voicesLoaded = false;

  var EN_FEMALE_PRIORITY = [
    'Jenny', 'Aria', 'Zira', 'Samantha', 'Susan', 'Michelle', 'Google US English Female'
  ];
  var EN_MALE_NAMES = ['David', 'Mark', 'Guy', 'James', 'Brian', 'Daniel', 'George'];
  var ZH_PRIORITY = ['Xiaoxiao', 'Xiaoyi', 'Yunxi', 'Huihui', 'Yaoyao', 'Kangkang'];

  function loadVoices() {
    if (!speechSynth) return;
    cachedVoices = speechSynth.getVoices();
    voicesLoaded = cachedVoices.length > 0;
  }

  if (speechSynth) {
    loadVoices();
    speechSynth.onvoiceschanged = loadVoices;
  }

  function isMaleVoice(name) {
    for (var i = 0; i < EN_MALE_NAMES.length; i++) {
      if (name.indexOf(EN_MALE_NAMES[i]) !== -1) return true;
    }
    return false;
  }

  function pickFemaleEnglishVoice() {
    var enUs = cachedVoices.filter(function (v) {
      return v.lang.indexOf('en-US') === 0 && !isMaleVoice(v.name);
    });
    for (var i = 0; i < EN_FEMALE_PRIORITY.length; i++) {
      for (var j = 0; j < enUs.length; j++) {
        if (enUs[j].name.indexOf(EN_FEMALE_PRIORITY[i]) !== -1) return enUs[j];
      }
    }
    return enUs[0] || null;
  }

  function pickVoice(langPrefix, priorities) {
    var matched = cachedVoices.filter(function (v) {
      return v.lang.indexOf(langPrefix) === 0;
    });
    for (var i = 0; i < priorities.length; i++) {
      for (var j = 0; j < matched.length; j++) {
        if (matched[j].name.indexOf(priorities[i]) !== -1) return matched[j];
      }
    }
    return matched[0] || null;
  }

  function stopWordAudio() {
    wordAudio.pause();
    wordAudio.currentTime = 0;
    wordAudio.onended = null;
    wordAudio.onerror = null;
    wordAudio.removeAttribute('src');
  }

  function playAudioUrl(url) {
    return new Promise(function (resolve, reject) {
      stopWordAudio();
      wordAudio.src = url;
      wordAudio.onended = resolve;
      wordAudio.onerror = reject;
      var played = wordAudio.play();
      if (played && played.catch) played.catch(reject);
    });
  }

  function speakWithSynth(text, lang, voice) {
    return new Promise(function (resolve) {
      if (!speechSynth) { resolve(); return; }
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      if (voice) utterance.voice = voice;
      utterance.rate = lang.indexOf('en') === 0 ? 0.85 : 0.9;
      utterance.pitch = 1.0;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      speechSynth.speak(utterance);
    });
  }

  function speakEnglishLocal(id) {
    return playAudioUrl('audio/en/' + id + '.mp3');
  }

  function speakEnglishTTS(word) {
    if (!voicesLoaded) loadVoices();
    var voice = pickFemaleEnglishVoice();
    return new Promise(function (resolve) {
      if (!speechSynth) { resolve(); return; }
      speechSynth.cancel();
      setTimeout(function () {
        speakWithSynth(word, 'en-US', voice).then(resolve);
      }, 100);
    });
  }

  function speakChinese(text) {
    if (!text) return Promise.resolve();
    if (!voicesLoaded) loadVoices();
    var voice = pickVoice('zh', ZH_PRIORITY);
    return speakWithSynth(text, 'zh-CN', voice);
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function speakEnglishSentence(text) {
    if (!text) return Promise.resolve();
    if (!voicesLoaded) loadVoices();
    var voice = pickFemaleEnglishVoice();
    return new Promise(function (resolve) {
      if (!speechSynth) { resolve(); return; }
      setTimeout(function () {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.78;
        utterance.pitch = 1.0;
        if (voice) utterance.voice = voice;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        speechSynth.speak(utterance);
      }, 100);
    });
  }

  function speakWords(id, english, chinese, sentenceEn, sentenceZh) {
    stopWordAudio();
    if (speechSynth) speechSynth.cancel();

    return speakEnglishLocal(id)
      .catch(function () { return speakEnglishTTS(english); })
      .then(function () { return delay(300); })
      .then(function () { return speakChinese(chinese); })
      .then(function () { return delay(400); })
      .then(function () { return speakEnglishSentence(sentenceEn); })
      .then(function () { return delay(300); })
      .then(function () { return speakChinese(sentenceZh || ''); });
  }

  return {
    speakWords: speakWords,
    stop: function () {
      stopWordAudio();
      if (speechSynth) speechSynth.cancel();
    }
  };
})();
