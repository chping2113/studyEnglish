/**
 * 宝贝英语阅读打卡 — 数据层 + 渲染 + 交互 + 动画
 * localStorage key: stage_{stageId}_book_{bookIndex}_day_{dayIndex}
 */

const DAYS_PER_BOOK = 6;
const LAST_VISIT_KEY = "reading_checkin_last_visit";
const CELEBRATED_STAGES_KEY = "reading_checkin_celebrated_stages";

const DAY_LABELS = {
  0: { short: "听全本", full: "📖扫码听全本 → 指图 → 翻到游戏页看一遍" },
  1: { short: "问位置", full: "📖再听全本 → 问\"XX在哪里？\"（中文问，孩子指图）→ 试做连线游戏" },
  2: { short: "停指图", full: "📖听音频，读到关键词暂停 → 让孩子指对应图 → 完成游戏页" },
  3: { short: "跟读词", full: "📖听音频 → 鼓励跟读最简单的词 → 再玩一次游戏" },
  4: { short: "翻复述", full: "📖听音频，孩子尝试自己翻页 → 用中文复述故事 → 画一个喜欢的角色" },
  5: { short: "回顾书", full: "📖完整听一遍 → 回顾全书（能指认封面书名就算过关）→ 换下一本" }
};

const CIRCLE_NUMS = ["①", "②", "③", "④", "⑤", "⑥"];
const CONFETTI_EMOJIS = ["🎊", "🎉", "✨", "🌟", "🎈", "💫", "🎁"];

const APP_DATA = {
  stages: [
    {
      id: 1,
      name: "《巴蒂英语启蒙分级绘本》第1级上",
      emoji: "📚",
      startDay: 1,
      endDay: 60,
      totalDays: 60,
      books: [
        "Silly Billy · 淘气羊比利",
        "Tricky Mouse · 调皮的老鼠",
        "Hungry Ducks · 饥饿的鸭子：面包守卫战",
        "Hop It! · 大闹菜园：偷吃胡萝卜的兔子",
        "What a Muddle! · 外星活宝：穿衣大作战",
        "Alien in the Park · 外星活宝：公园大作战",
        "Junk Car · 变废为“宝”：破烂汽车",
        "Mice Mischief · 老鼠的恶作剧",
        "Be Careful, Monkey · 猴子，小心！",
        "No Teasing Elephants · 不要惹大象"
      ]
    },
    {
      id: 2,
      name: "《巴蒂英语启蒙分级绘本》第1级下",
      emoji: "📖",
      startDay: 61,
      endDay: 120,
      totalDays: 60,
      books: [
        "Wake Up, Cow! · 奶牛，醒醒！",
        "At the Market · 大高个和小矮人：逛超市",
        "Oops! Ouch! Yuck! · 大高个和小矮人：去农场",
        "Trouble for Jack · 杰克的麻烦",
        "Trouble for Monkey · 猴子的麻烦",
        "What a Mess! · 真是乱糟糟",
        "A Flea on Me · 可恶的跳蚤",
        "Lucky Escape · 幸运脱险",
        "Cave Cat · 洞穴里的猫",
        "Run, Robot! · 奔跑吧，机器人！"
      ]
    },
    {
      id: 3,
      name: "《巴蒂英语启蒙分级绘本》第2级上 + 引入《培生》",
      emoji: "🌟",
      startDay: 121,
      endDay: 180,
      totalDays: 60,
      books: [
        "Lucky Fish · 幸运的鱼儿",
        "Lazy Jack · 爱偷懒的杰克",
        "Sorry, Snake! · 蛇，抱歉哦！",
        "Out with Aliens: Park Fun 2 · 外星活宝：公园大作战 2",
        "What a House · 变废为“宝”：破烂房子",
        "Look Out, Jack! · 杰克，小心！",
        "Catching Fox · 智捕狐狸",
        "Down, Down! · 惊险降落！",
        "Clever Mouse · 聪明的老鼠",
        "Fun with Aliens · 外星活宝：餐厅恶作剧",
        "Juggling · 杂耍",
        "Greedy Giant · 贪吃的巨人",
        "Curly and the cherries · 科利和樱桃",
        "Happy birthday Josie · 生日快乐，乔茜",
        "Goodnight Josie · 晚安，乔茜"
      ]
    },
    {
      id: 4,
      name: "《培生启明星》第3级",
      emoji: "⭐",
      startDay: 181,
      endDay: 240,
      totalDays: 60,
      books: Array.from({ length: 10 }, (_, i) => `培生 Level 3-${i + 1}`)
    },
    {
      id: 5,
      name: "《培生启明星》第4级",
      emoji: "🌟",
      startDay: 241,
      endDay: 300,
      totalDays: 60,
      books: Array.from({ length: 10 }, (_, i) => `培生 Level 4-${i + 1}`)
    },
    {
      id: 6,
      name: "《培生启明星》第5级",
      emoji: "🏆",
      startDay: 301,
      endDay: 360,
      totalDays: 60,
      books: Array.from({ length: 10 }, (_, i) => `培生 Level 5-${i + 1}`)
    }
  ],

  dailyTips: [
    DAY_LABELS[0].full,
    DAY_LABELS[1].full,
    DAY_LABELS[2].full,
    DAY_LABELS[3].full,
    DAY_LABELS[4].full,
    DAY_LABELS[5].full
  ]
};

let currentStageId = null;
let viewBookIndex = 0;

function checkKey(stageId, bookIndex, dayIndex) {
  return `stage_${stageId}_book_${bookIndex}_day_${dayIndex}`;
}

function getStageById(stageId) {
  return APP_DATA.stages.find((s) => s.id === stageId) || null;
}

function isDayChecked(stageId, bookIndex, dayIndex) {
  return localStorage.getItem(checkKey(stageId, bookIndex, dayIndex)) === "true";
}

function getCurrentStage(day) {
  const stage = APP_DATA.stages.find((s) => day >= s.startDay && day <= s.endDay);
  return stage ? stage.id : null;
}

function getBookIndex(stageId, dayInStage) {
  const stage = getStageById(stageId);
  if (!stage || dayInStage < 1) return 0;
  const maxIndex = Math.max(0, stage.books.length - 1);
  const index = Math.floor((dayInStage - 1) / DAYS_PER_BOOK);
  return Math.min(index, maxIndex);
}

function getDayInBook(stageId, dayInStage) {
  if (dayInStage < 1) return 0;
  const stage = getStageById(stageId);
  if (!stage) return 0;

  const rawIndex = Math.floor((dayInStage - 1) / DAYS_PER_BOOK);
  const maxIndex = Math.max(0, stage.books.length - 1);
  if (rawIndex > maxIndex) return DAYS_PER_BOOK - 1;
  return (dayInStage - 1) % DAYS_PER_BOOK;
}

function getTodayTip(stageId, dayInStage) {
  return getTodayFullTip(dayInStage);
}

function getTodayFullTip(dayInStage) {
  const dayInBook = (Math.max(1, dayInStage) - 1) % DAYS_PER_BOOK;
  return DAY_LABELS[dayInBook].full;
}

function getAllLabels() {
  return Array.from({ length: DAYS_PER_BOOK }, (_, i) => DAY_LABELS[i].short);
}

function loadProgress(stageId) {
  const stage = getStageById(stageId);
  const result = {};
  if (!stage) return result;

  stage.books.forEach((_, bookIndex) => {
    for (let dayIndex = 0; dayIndex < DAYS_PER_BOOK; dayIndex++) {
      result[`${bookIndex}_${dayIndex}`] = isDayChecked(stageId, bookIndex, dayIndex);
    }
  });
  return result;
}

function toggleCheck(stageId, bookIndex, dayIndex) {
  const wasComplete = isBookComplete(stageId, bookIndex);
  const key = checkKey(stageId, bookIndex, dayIndex);
  const next = localStorage.getItem(key) !== "true";
  if (next) {
    localStorage.setItem(key, "true");
  } else {
    localStorage.removeItem(key);
  }

  const nowComplete = isBookComplete(stageId, bookIndex);
  if (!wasComplete && nowComplete) {
    showBookCompleteToast(bookIndex + 1);
  }
  if (isStageComplete(stageId)) {
    showStageCelebration(stageId);
  }
  return next;
}

function markChecked(stageId, bookIndex, dayIndex) {
  const wasComplete = isBookComplete(stageId, bookIndex);
  localStorage.setItem(checkKey(stageId, bookIndex, dayIndex), "true");

  const nowComplete = isBookComplete(stageId, bookIndex);
  if (!wasComplete && nowComplete) {
    showBookCompleteToast(bookIndex + 1);
  }
  if (isStageComplete(stageId)) {
    showStageCelebration(stageId);
  }
}

function getBookProgress(stageId, bookIndex) {
  let count = 0;
  for (let dayIndex = 0; dayIndex < DAYS_PER_BOOK; dayIndex++) {
    if (isDayChecked(stageId, bookIndex, dayIndex)) count++;
  }
  return count;
}

function getCompletedBooksCount(stageId) {
  const stage = getStageById(stageId);
  if (!stage) return 0;
  return stage.books.filter((_, i) => isBookComplete(stageId, i)).length;
}

function getStageProgress(stageId) {
  const stage = getStageById(stageId);
  if (!stage) return 0;
  let total = 0;
  stage.books.forEach((_, bookIndex) => {
    total += getBookProgress(stageId, bookIndex);
  });
  return total;
}

function isBookComplete(stageId, bookIndex) {
  return getBookProgress(stageId, bookIndex) === DAYS_PER_BOOK;
}

function isStageComplete(stageId) {
  const stage = getStageById(stageId);
  if (!stage || stage.books.length === 0) return false;
  return stage.books.every((_, bookIndex) => isBookComplete(stageId, bookIndex));
}

function isStageUnlocked(stageId) {
  if (stageId === 1) return true;
  const prev = getStageById(stageId - 1);
  if (!prev) return true;
  return isStageComplete(stageId - 1) || getStageProgress(stageId) > 0;
}

function getActiveStageId() {
  for (const stage of APP_DATA.stages) {
    if (!isStageComplete(stage.id)) return stage.id;
  }
  return APP_DATA.stages[APP_DATA.stages.length - 1].id;
}

function resetStage(stageId) {
  const stage = getStageById(stageId);
  if (!stage) return false;

  const ok = window.confirm(
    `确定要重置「${stage.emoji} ${stage.name}」的全部打卡记录吗？此操作不可恢复。`
  );
  if (!ok) return false;

  stage.books.forEach((_, bookIndex) => {
    for (let dayIndex = 0; dayIndex < DAYS_PER_BOOK; dayIndex++) {
      localStorage.removeItem(checkKey(stageId, bookIndex, dayIndex));
    }
  });

  const celebrated = getCelebratedStages().filter((id) => id !== stageId);
  localStorage.setItem(CELEBRATED_STAGES_KEY, JSON.stringify(celebrated));
  return true;
}

function getFocusPosition(stageId) {
  const stage = getStageById(stageId);
  if (!stage) return { bookIndex: 0, dayIndex: 0, dayInStage: 1 };

  for (let bookIndex = 0; bookIndex < stage.books.length; bookIndex++) {
    for (let dayIndex = 0; dayIndex < DAYS_PER_BOOK; dayIndex++) {
      if (!isDayChecked(stageId, bookIndex, dayIndex)) {
        const dayInStage = Math.min(
          bookIndex * DAYS_PER_BOOK + dayIndex + 1,
          stage.totalDays
        );
        return { bookIndex, dayIndex, dayInStage };
      }
    }
  }

  const lastBook = stage.books.length - 1;
  return {
    bookIndex: lastBook,
    dayIndex: DAYS_PER_BOOK - 1,
    dayInStage: Math.min(stage.books.length * DAYS_PER_BOOK, stage.totalDays)
  };
}

function getStageStatus(stageId) {
  if (isStageComplete(stageId)) return { key: "done", text: "已完成" };
  if (getStageProgress(stageId) > 0) return { key: "doing", text: "进行中" };
  return { key: "todo", text: "未开始" };
}

function getTodayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getCelebratedStages() {
  try {
    return JSON.parse(localStorage.getItem(CELEBRATED_STAGES_KEY) || "[]");
  } catch {
    return [];
  }
}

function markStageCelebrated(stageId) {
  const list = getCelebratedStages();
  if (!list.includes(stageId)) {
    list.push(stageId);
    localStorage.setItem(CELEBRATED_STAGES_KEY, JSON.stringify(list));
  }
}

/** 每天首次打开：检测今日打卡状态并显示鼓励语 */
function checkDailyWelcome() {
  const today = getTodayDateStr();
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  localStorage.setItem(LAST_VISIT_KEY, today);

  const banner = document.getElementById("daily-banner");
  if (!banner) return;

  if (lastVisit === today) {
    banner.classList.add("hidden");
    return;
  }

  const activeId = getActiveStageId();
  if (isStageComplete(activeId)) {
    banner.textContent = "🏆 太棒了！所有阶段都已完成，宝贝真是阅读小达人！";
    banner.classList.remove("hidden");
    return;
  }

  const focus = getFocusPosition(activeId);
  const todayDone = isDayChecked(activeId, focus.bookIndex, focus.dayIndex);

  if (todayDone) {
    const messages = [
      "🌟 今日任务已完成，宝贝真棒！明天继续加油哦～",
      "🎉 今天已经打卡啦，休息一下吧，明天见！",
      "💪 坚持就是胜利，今日阅读已完成，给你点赞！"
    ];
    banner.textContent = messages[new Date().getDay() % messages.length];
  } else {
    const stage = getStageById(activeId);
    banner.textContent = `📖 新的一天！${stage.emoji} ${stage.name} 等你来打卡～`;
  }
  banner.classList.remove("hidden");
}

function showPage(pageId, { animate = true } = {}) {
  const page = document.getElementById(pageId);
  if (!page) return;

  // 已在当前页：不重置透明度，避免打卡时整页闪动
  if (page.classList.contains("active") && page.style.display !== "none") {
    return;
  }

  document.querySelectorAll(".page").forEach((el) => {
    el.classList.remove("active");
    if (el.id !== pageId) {
      el.style.display = "none";
      el.style.opacity = "";
    }
  });

  page.style.display = "block";
  if (!animate) {
    page.classList.add("active");
    page.style.opacity = "1";
    return;
  }

  page.style.opacity = "0";
  requestAnimationFrame(() => {
    page.classList.add("active");
    page.style.opacity = "1";
  });
}

function animateDotClick(circleEl) {
  if (!circleEl) return;
  circleEl.classList.remove("dot-bounce");
  void circleEl.offsetWidth;
  circleEl.classList.add("dot-bounce");
}

function showBookCompleteToast(bookNum) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = `🎉 完成第${bookNum}本书！`;
  toast.classList.add("show");

  clearTimeout(showBookCompleteToast._timer);
  showBookCompleteToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function showStageCelebration(stageId) {
  const celebrated = getCelebratedStages();
  if (celebrated.includes(stageId)) return;

  const stage = getStageById(stageId);
  const overlay = document.getElementById("celebration");
  const container = document.getElementById("confetti-container");
  const textEl = document.getElementById("celebration-text");
  if (!overlay || !container) return;

  markStageCelebrated(stageId);
  textEl.textContent = `🎊 恭喜完成 ${stage.emoji} ${stage.name}！`;

  container.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const item = document.createElement("span");
    item.className = "confetti-item";
    item.textContent = CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length];
    item.style.left = `${Math.random() * 100}%`;
    item.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    item.style.animationDelay = `${Math.random() * 1.5}s`;
    container.appendChild(item);
  }

  overlay.classList.add("show");

  const close = () => {
    overlay.classList.remove("show");
    container.innerHTML = "";
    overlay.removeEventListener("click", close);
  };
  overlay.addEventListener("click", close);
}

function renderHome() {
  const list = document.getElementById("stage-list");
  if (!list) return;

  list.innerHTML = APP_DATA.stages
    .map((s) => {
      const done = getStageProgress(s.id);
      const total = s.books.length * DAYS_PER_BOOK;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const status = getStageStatus(s.id);
      const booksDone = getCompletedBooksCount(s.id);
      const locked = !isStageUnlocked(s.id);

      return `
        <button type="button" class="stage-card${locked ? " is-locked" : ""}" data-stage="${s.id}" data-locked="${locked}">
          <div class="stage-card-top">
            <span class="stage-emoji">${locked ? "🔒" : s.emoji}</span>
            <div>
              <div class="stage-name">${s.name}</div>
              <div class="stage-meta">计划 Day ${s.startDay}–${s.endDay} · ${s.books.length} 本书</div>
              <span class="stage-status ${status.key}">${status.text}</span>
            </div>
          </div>
          <div class="stage-progress-bar">
            <div class="stage-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="stage-footer">
            <span>${done} / ${total} 天已打卡</span>
            <span class="stage-books-done">📖 ${booksDone}/${s.books.length}本完成</span>
          </div>
        </button>`;
    })
    .join("");

  list.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stageId = Number(btn.dataset.stage);
      if (btn.dataset.locked === "true" && getStageProgress(stageId) === 0) {
        alert("🔒 该阶段还未开始，请先完成前一阶段");
        return;
      }
      openStage(stageId);
    });
  });
}

function renderBookList(stageId, focusBookIndex, viewIndex, { scroll = false } = {}) {
  const stage = getStageById(stageId);
  const listEl = document.getElementById("book-list");
  if (!stage || !listEl) return;

  listEl.innerHTML = stage.books
    .map((name, i) => {
      const progress = getBookProgress(stageId, i);
      const complete = progress === DAYS_PER_BOOK;
      const isCurrent = i === focusBookIndex;
      const isViewing = i === viewIndex;
      const classes = ["book-card"];
      if (isViewing) classes.push("is-viewing");
      if (isCurrent) classes.push("is-current");
      if (complete) classes.push("is-complete");

      let statusText = "";
      if (isViewing && isCurrent) statusText = " · 当前在读";
      else if (isViewing) statusText = " · 正在查看";
      else if (isCurrent) statusText = " · 当前在读";

      const prefix = complete ? "✅ " : isViewing ? "📖 " : isCurrent ? "📌 " : "";

      return `
        <button type="button" class="${classes.join(" ")}" data-book-index="${i}">
          <span class="book-card-num">${i + 1}</span>
          <div class="book-card-content">
            <div class="book-card-name">${prefix}${name}</div>
            <div class="book-card-meta">${progress}/6 天${statusText}</div>
          </div>
        </button>`;
    })
    .join("");

  listEl.querySelectorAll("[data-book-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      viewBookIndex = Number(btn.dataset.bookIndex);
      renderDetail(stageId, { scrollBooks: true });
    });
  });

  if (scroll) {
    const viewingCard = listEl.querySelector(".is-viewing");
    if (viewingCard) {
      viewingCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
}

function renderDetail(stageId, { scrollBooks = false } = {}) {
  const stage = getStageById(stageId);
  if (!stage) return;

  currentStageId = stageId;
  const focus = getFocusPosition(stageId);

  if (viewBookIndex < 0 || viewBookIndex >= stage.books.length) {
    viewBookIndex = focus.bookIndex;
  }

  const bookIndex = viewBookIndex;
  const bookName = stage.books[bookIndex];
  const isViewingFocusBook = bookIndex === focus.bookIndex;
  const todayDayIndex = isViewingFocusBook ? focus.dayIndex : 0;
  const dayInStage = isViewingFocusBook
    ? focus.dayInStage
    : Math.min(bookIndex * DAYS_PER_BOOK + 1, stage.totalDays);

  const todayChecked = isDayChecked(stageId, bookIndex, todayDayIndex);
  const tip = DAY_LABELS[todayDayIndex].full;
  const labels = getAllLabels();

  document.getElementById("detail-day-bar").textContent =
    `📅 第${dayInStage}天 / 共${stage.totalDays}天`;
  document.getElementById("nav-stage").textContent = `${stage.emoji} ${stage.name}`;
  document.getElementById("nav-book").textContent = bookName;

  const card = document.getElementById("today-card");
  const cardTitle = document.getElementById("today-card-title");
  const cardBody = document.getElementById("today-card-body");

  if (isViewingFocusBook) {
    cardTitle.textContent = `📌 今日任务 · 第${todayDayIndex + 1}天/共6天`;
    if (todayChecked) {
      card.classList.add("is-done");
      cardBody.innerHTML = `<div class="today-card-done-msg">✅ 今日已完成！</div>`;
    } else {
      card.classList.remove("is-done");
      cardBody.textContent = tip;
    }
  } else {
    card.classList.remove("is-done");
    cardTitle.textContent = `📖 浏览中 · ${bookName}`;
    cardBody.textContent = `正在查看第 ${bookIndex + 1} 本书。点击下方圆点可补打卡；点「回到当前」可回到今日进度。`;
  }

  const dotsRow = document.getElementById("dots-row");
  dotsRow.innerHTML = labels
    .map((label, dayIndex) => {
      const done = isDayChecked(stageId, bookIndex, dayIndex);
      const isToday = isViewingFocusBook && dayIndex === todayDayIndex;
      const classes = ["dot-item"];
      if (done) classes.push("is-done");
      if (isToday) classes.push("is-today");

      return `
        <button type="button" class="${classes.join(" ")}"
          data-book="${bookIndex}" data-day="${dayIndex}"
          aria-label="第${dayIndex + 1}天 ${label}">
          <span class="dot-num">${CIRCLE_NUMS[dayIndex]}</span>
          <span class="dot-circle"></span>
          <span class="dot-label">${label}</span>
        </button>`;
    })
    .join("");

  dotsRow.querySelectorAll(".dot-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const b = Number(btn.dataset.book);
      const d = Number(btn.dataset.day);
      animateDotClick(btn.querySelector(".dot-circle"));
      toggleCheck(stageId, b, d);
      setTimeout(() => renderDetail(stageId), 180);
    });
  });

  const actionArea = document.getElementById("action-area");
  if (isViewingFocusBook && !todayChecked) {
    actionArea.innerHTML = `<button type="button" class="btn-checkin" id="btn-checkin">✅ 打卡今日</button>`;
    document.getElementById("btn-checkin").addEventListener("click", () => {
      markChecked(stageId, bookIndex, todayDayIndex);
      viewBookIndex = getFocusPosition(stageId).bookIndex;
      renderDetail(stageId);
    });
  } else if (isViewingFocusBook && todayChecked) {
    actionArea.innerHTML = `<div class="encourage">🎉 今日已完成，明天继续加油！</div>`;
  } else {
    const doneCount = getBookProgress(stageId, bookIndex);
    actionArea.innerHTML = `
      <div class="encourage">本书进度 ${doneCount}/6 · 可点击圆点补卡</div>
      <button type="button" class="btn-checkin" id="btn-goto-focus" style="margin-top:10px">📖 回到当前进度</button>`;
    document.getElementById("btn-goto-focus").addEventListener("click", () => {
      viewBookIndex = focus.bookIndex;
      renderDetail(stageId, { scrollBooks: true });
    });
  }

  document.getElementById("btn-prev-book").disabled = bookIndex <= 0;
  document.getElementById("btn-next-book").disabled = bookIndex >= stage.books.length - 1;

  renderBookList(stageId, focus.bookIndex, bookIndex, { scroll: scrollBooks });
  showPage("page-detail");
}

function openStage(stageId) {
  if (!isStageUnlocked(stageId) && getStageProgress(stageId) === 0) {
    alert("🔒 该阶段还未开始，请先完成前一阶段");
    return;
  }
  const focus = getFocusPosition(stageId);
  viewBookIndex = focus.bookIndex;
  renderDetail(stageId, { scrollBooks: true });
}

function goHome() {
  currentStageId = null;
  showPage("page-home");
  renderHome();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-back").addEventListener("click", goHome);

  document.getElementById("btn-reset").addEventListener("click", () => {
    if (currentStageId != null && resetStage(currentStageId)) {
      viewBookIndex = 0;
      renderDetail(currentStageId);
      renderHome();
    }
  });

  document.getElementById("btn-prev-book").addEventListener("click", () => {
    if (viewBookIndex > 0) {
      viewBookIndex -= 1;
      renderDetail(currentStageId);
    }
  });

  document.getElementById("btn-next-book").addEventListener("click", () => {
    const stage = getStageById(currentStageId);
    if (stage && viewBookIndex < stage.books.length - 1) {
      viewBookIndex += 1;
      renderDetail(currentStageId);
    }
  });

  checkDailyWelcome();
  renderHome();

  const activeId = getActiveStageId();
  if (isStageComplete(activeId) && !getCelebratedStages().includes(activeId)) {
    showStageCelebration(activeId);
  }
});

window.APP_DATA = APP_DATA;
window.DAY_LABELS = DAY_LABELS;
window.getCurrentStage = getCurrentStage;
window.getBookIndex = getBookIndex;
window.getDayInBook = getDayInBook;
window.getTodayTip = getTodayTip;
window.getTodayFullTip = getTodayFullTip;
window.getAllLabels = getAllLabels;
window.loadProgress = loadProgress;
window.toggleCheck = toggleCheck;
window.getBookProgress = getBookProgress;
window.getStageProgress = getStageProgress;
window.isBookComplete = isBookComplete;
window.isStageComplete = isStageComplete;
window.resetStage = resetStage;
window.renderHome = renderHome;
window.renderDetail = renderDetail;
window.openStage = openStage;
window.goHome = goHome;
