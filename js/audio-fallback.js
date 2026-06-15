var AudioFallback = (function () {
  var ctx = null;
  var activeNodes = [];

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function trackNode(node) {
    activeNodes.push(node);
    node.onended = function () {
      var idx = activeNodes.indexOf(node);
      if (idx !== -1) activeNodes.splice(idx, 1);
    };
  }

  function stop() {
    activeNodes.forEach(function (node) {
      try {
        node.stop();
        node.disconnect();
      } catch (e) { /* already stopped */ }
    });
    activeNodes = [];
  }

  function playTone(freq, duration, type, volume, delay) {
    var ac = getCtx();
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.3, ac.currentTime + (delay || 0));
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (delay || 0) + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + (delay || 0));
    osc.stop(ac.currentTime + (delay || 0) + duration);
    trackNode(osc);
  }

  function playNoise(duration, volume, delay) {
    var ac = getCtx();
    var bufferSize = ac.sampleRate * duration;
    var buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    var source = ac.createBufferSource();
    source.buffer = buffer;
    var gain = ac.createGain();
    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    gain.gain.setValueAtTime(volume || 0.15, ac.currentTime + (delay || 0));
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (delay || 0) + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    source.start(ac.currentTime + (delay || 0));
    trackNode(source);
  }

  var synths = {
    lion: function () {
      playNoise(0.8, 0.2);
      playTone(80, 0.6, 'sawtooth', 0.25);
      playTone(60, 0.4, 'sawtooth', 0.2, 0.3);
    },
    elephant: function () {
      playTone(200, 0.3, 'sine', 0.3);
      playTone(150, 0.5, 'sine', 0.35, 0.2);
      playTone(100, 0.6, 'sine', 0.3, 0.5);
      playTone(80, 0.4, 'sine', 0.25, 0.8);
    },
    monkey: function () {
      for (var i = 0; i < 5; i++) {
        playTone(600 + i * 80, 0.08, 'square', 0.15, i * 0.12);
        playTone(800 + i * 60, 0.06, 'square', 0.12, i * 0.12 + 0.06);
      }
    },
    giraffe: function () {
      playTone(300, 0.2, 'sine', 0.2);
      playTone(250, 0.3, 'sine', 0.18, 0.15);
    },
    tiger: function () {
      playNoise(0.5, 0.18);
      playTone(100, 0.5, 'sawtooth', 0.3);
      playTone(70, 0.4, 'sawtooth', 0.25, 0.3);
    },
    zebra: function () {
      for (var i = 0; i < 3; i++) {
        playTone(400, 0.15, 'sawtooth', 0.2, i * 0.25);
        playTone(350, 0.2, 'sawtooth', 0.18, i * 0.25 + 0.1);
      }
    },
    panda: function () {
      playTone(180, 0.3, 'sine', 0.25);
      playTone(160, 0.4, 'sine', 0.22, 0.2);
    },
    penguin: function () {
      for (var i = 0; i < 4; i++) {
        playTone(500 + Math.random() * 200, 0.1, 'sine', 0.2, i * 0.18);
      }
    },
    bear: function () {
      playTone(120, 0.5, 'sawtooth', 0.25);
      playTone(90, 0.4, 'sawtooth', 0.2, 0.3);
      playTone(70, 0.3, 'sawtooth', 0.15, 0.6);
    },
    hippo: function () {
      playTone(80, 0.6, 'sawtooth', 0.3);
      playTone(60, 0.5, 'sawtooth', 0.25, 0.4);
      playNoise(0.3, 0.1, 0.5);
    },
    kangaroo: function () {
      for (var i = 0; i < 3; i++) {
        playTone(300, 0.1, 'sine', 0.2, i * 0.2);
      }
    },
    camel: function () {
      playTone(200, 0.3, 'sawtooth', 0.2);
      playTone(180, 0.4, 'sawtooth', 0.18, 0.25);
    },
    koala: function () {
      playTone(250, 0.2, 'sine', 0.2);
      playTone(220, 0.3, 'sine', 0.18, 0.15);
    },
    deer: function () {
      playTone(500, 0.12, 'sine', 0.2);
      playTone(600, 0.1, 'sine', 0.18, 0.15);
    },
    rabbit: function () {
      for (var r = 0; r < 4; r++) {
        playTone(800, 0.05, 'sine', 0.12, r * 0.1);
      }
    },
    crocodile: function () {
      playNoise(0.4, 0.15);
      playTone(90, 0.4, 'sawtooth', 0.25);
    },
    whale: function () {
      playTone(60, 0.8, 'sine', 0.3);
      playTone(50, 0.6, 'sine', 0.25, 0.5);
    },
    eagle: function () {
      playTone(700, 0.15, 'sine', 0.2);
      playTone(900, 0.12, 'sine', 0.18, 0.12);
    },
    squirrel: function () {
      for (var s = 0; s < 5; s++) {
        playTone(1000 + s * 50, 0.06, 'sine', 0.15, s * 0.08);
      }
    },
    snake: function () {
      playTone(200, 0.3, 'sawtooth', 0.15);
      playTone(250, 0.2, 'sawtooth', 0.12, 0.2);
    },
    rhino: function () {
      playTone(70, 0.5, 'sawtooth', 0.28);
      playNoise(0.3, 0.12, 0.2);
    },
    gorilla: function () {
      playTone(100, 0.4, 'sawtooth', 0.25);
      playTone(80, 0.3, 'sawtooth', 0.2, 0.25);
    },
    leopard: function () {
      playNoise(0.4, 0.15);
      playTone(120, 0.4, 'sawtooth', 0.25);
    },
    parrot: function () {
      for (var p = 0; p < 4; p++) {
        playTone(500 + p * 100, 0.1, 'sine', 0.2, p * 0.15);
      }
    },
    peacock: function () {
      playTone(600, 0.2, 'sine', 0.22);
      playTone(800, 0.15, 'sine', 0.18, 0.2);
    },
    turtle: function () {
      playTone(150, 0.2, 'sine', 0.15);
    },
    seal: function () {
      for (var se = 0; se < 3; se++) {
        playTone(400, 0.12, 'sine', 0.2, se * 0.2);
      }
    },
    goat: function () {
      playTone(350, 0.15, 'sawtooth', 0.2);
      playTone(400, 0.12, 'sawtooth', 0.18, 0.12);
    },
    goose: function () {
      playTone(300, 0.2, 'sawtooth', 0.22);
      playTone(350, 0.15, 'sawtooth', 0.18, 0.18);
    },
    turkey: function () {
      playTone(250, 0.15, 'sawtooth', 0.2);
      playTone(280, 0.2, 'sawtooth', 0.18, 0.15);
    },
    buffalo: function () {
      playTone(80, 0.5, 'sawtooth', 0.28);
      playNoise(0.2, 0.1, 0.3);
    },
    flamingo: function () {
      playTone(550, 0.15, 'sine', 0.18);
    },
    swan: function () {
      playTone(450, 0.25, 'sine', 0.2);
      playTone(500, 0.2, 'sine', 0.18, 0.2);
    },
    shark: function () {
      playTone(50, 0.6, 'sawtooth', 0.2);
    },
    octopus: function () {
      for (var o = 0; o < 3; o++) {
        playTone(200 + o * 30, 0.15, 'sine', 0.15, o * 0.18);
      }
    },
    crab: function () {
      for (var c = 0; c < 4; c++) {
        playTone(700, 0.05, 'square', 0.12, c * 0.1);
      }
    },
    hamster: function () {
      for (var h = 0; h < 5; h++) {
        playTone(900, 0.04, 'sine', 0.1, h * 0.08);
      }
    },
    mouse: function () {
      playTone(1000, 0.06, 'sine', 0.12);
      playTone(1100, 0.05, 'sine', 0.1, 0.08);
    },
    raccoon: function () {
      playTone(350, 0.15, 'sawtooth', 0.18);
      playTone(400, 0.12, 'sawtooth', 0.15, 0.12);
    },
    otter: function () {
      for (var ot = 0; ot < 3; ot++) {
        playTone(450, 0.1, 'sine', 0.18, ot * 0.15);
      }
    },
    bat: function () {
      playTone(800, 0.08, 'sine', 0.15);
      playTone(900, 0.06, 'sine', 0.12, 0.06);
    },
    lizard: function () {
      playTone(300, 0.1, 'sawtooth', 0.12);
    },
    default: function () {
      playTone(400, 0.15, 'sine', 0.2);
      playTone(500, 0.15, 'sine', 0.18, 0.18);
      playTone(450, 0.2, 'sine', 0.15, 0.35);
    }
  };

  return {
    play: function (animalId) {
      stop();
      var fn = synths[animalId] || synths.default;
      if (fn) fn();
    },
    stop: stop,
    duration: 1500
  };
})();
