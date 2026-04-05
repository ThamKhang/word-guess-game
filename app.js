const STORAGE_KEY = "vstep-b3-vocab-game-progress";
const SETTINGS_KEY = "vstep-b3-vocab-game-settings";
const DEFAULT_SPEECH_RATE = 0.9;

const PROGRAMS = {
  300: {
    title: "Lộ trình 300 từ nền tảng",
    description: "Bắt đầu với 300 từ cốt lõi theo các nhóm rất hay gặp trong VSTEP B1."
  },
  500: {
    title: "Lộ trình 500 từ mở rộng",
    description: "Mở rộng vốn từ thực dụng để nói và viết thành câu rõ ý hơn."
  },
  700: {
    title: "Lộ trình 700 từ học sâu hơn",
    description: "Tăng vốn từ theo nhóm chủ đề hay ra trong VSTEP B1/B1+."
  },
  1000: {
    title: "Lộ trình 1000 từ thành thạo cơ bản",
    description: "Xây vốn từ đủ rộng cho mô tả, nêu quan điểm, so sánh và viết đoạn."
  },
  2000: {
    title: "Lộ trình 2000 từ trung cấp",
    description: "Kế hoạch mở rộng tiếp theo cho giai đoạn B1+/B2."
  },
  3000: {
    title: "Lộ trình 3000 từ dài hạn",
    description: "Kế hoạch dài hạn để xây vốn từ lớn và dùng tiếng Anh linh hoạt hơn."
  }
};

const GROUP_TAXONOMY = {
  personal_life: {
    label: "Personal Life",
    sources: {
      Family: ["Family Basics", "Parenting & Care", "Home Duties", "Relationships", "Modern Family Life"],
      "Daily Life": ["Morning Routine", "Housework", "Shopping & Spending", "Free Time", "Independent Living"]
    }
  },
  education_learning: {
    label: "Education & Learning",
    sources: {
      Education: ["School Life", "Study Habits", "Exams & Results", "Language Learning", "Future Learning"]
    }
  },
  work_career: {
    label: "Work & Career",
    sources: {
      Work: ["Jobs", "Office Life", "Job Skills", "Career Growth", "Work Challenges"]
    }
  },
  health_lifestyle: {
    label: "Health & Lifestyle",
    sources: {
      Health: ["Healthy Habits", "Food & Fitness", "Common Illnesses", "Mental Health", "Healthcare"]
    }
  },
  technology_media: {
    label: "Technology & Media",
    sources: {
      Technology: ["Devices", "Internet Use", "Online Study", "Digital Life", "Tech Problems"],
      Communication: ["Daily Communication", "Speaking Skills", "Writing Skills", "Opinions & Discussion", "Confidence & Delivery"]
    }
  },
  travel_transport: {
    label: "Travel & Transport",
    sources: {
      Travel: ["Transport", "Planning a Trip", "Accommodation", "Tourist Activities", "Travel Experience"]
    }
  },
  society_community: {
    label: "Society & Community",
    sources: {
      Society: ["Community Life", "Public Services", "Social Problems", "Citizenship", "Community Action"]
    }
  },
  environment_green: {
    label: "Environment & Green Living",
    sources: {
      Environment: ["Pollution", "Green Habits", "Weather & Climate", "Nature Protection", "Environmental Action"]
    }
  }
};

const ENRICHED_WORD_BANK = enrichWordBank();

const state = {
  group: "All",
  subtopic: "All",
  mode: "flashcard",
  program: 300,
  currentFlashIndex: 0,
  currentQuiz: null,
  currentTyping: null,
  currentSpeaking: null,
  progress: loadProgress(),
  settings: loadSettings(),
  voices: [],
  selectedVoice: null
};

const elements = {
  totalWords: document.querySelector("#totalWords"),
  knownCount: document.querySelector("#knownCount"),
  streakCount: document.querySelector("#streakCount"),
  programTitle: document.querySelector("#programTitle"),
  programDescription: document.querySelector("#programDescription"),
  programProgressText: document.querySelector("#programProgressText"),
  programProgressFill: document.querySelector("#programProgressFill"),
  roadmapList: document.querySelector("#roadmapList"),
  groupFilter: document.querySelector("#groupFilter"),
  subtopicFilter: document.querySelector("#subtopicFilter"),
  modeSelect: document.querySelector("#modeSelect"),
  startNowBtn: document.querySelector("#startNowBtn"),
  jumpSpeakingBtn: document.querySelector("#jumpSpeakingBtn"),
  quickModes: [...document.querySelectorAll("[data-mode]")],
  programButtons: [...document.querySelectorAll("[data-program]")],
  voiceSelect: document.querySelector("#voiceSelect"),
  speechRateSelect: document.querySelector("#speechRateSelect"),
  previewVoiceBtn: document.querySelector("#previewVoiceBtn"),
  voiceStatus: document.querySelector("#voiceStatus"),
  voiceEngineChip: document.querySelector("#voiceEngineChip"),
  voiceNameChip: document.querySelector("#voiceNameChip"),
  shuffleBtn: document.querySelector("#shuffleBtn"),
  resetProgressBtn: document.querySelector("#resetProgressBtn"),
  flashcard: document.querySelector("#flashcard"),
  flashTopic: document.querySelector("#flashTopic"),
  flashWord: document.querySelector("#flashWord"),
  flashIpa: document.querySelector("#flashIpa"),
  flashTopicBack: document.querySelector("#flashTopicBack"),
  flashMeaning: document.querySelector("#flashMeaning"),
  flashPronounce: document.querySelector("#flashPronounce"),
  flashExample: document.querySelector("#flashExample"),
  flashTip: document.querySelector("#flashTip"),
  flipBtn: document.querySelector("#flipBtn"),
  speakFlashBtn: document.querySelector("#speakFlashBtn"),
  knownBtn: document.querySelector("#knownBtn"),
  nextFlashBtn: document.querySelector("#nextFlashBtn"),
  quizTopic: document.querySelector("#quizTopic"),
  quizPrompt: document.querySelector("#quizPrompt"),
  quizMeta: document.querySelector("#quizMeta"),
  quizChoices: document.querySelector("#quizChoices"),
  speakQuizBtn: document.querySelector("#speakQuizBtn"),
  nextQuizBtn: document.querySelector("#nextQuizBtn"),
  quizFeedback: document.querySelector("#quizFeedback"),
  typingTopic: document.querySelector("#typingTopic"),
  typingMeaning: document.querySelector("#typingMeaning"),
  typingExample: document.querySelector("#typingExample"),
  typingForm: document.querySelector("#typingForm"),
  typingInput: document.querySelector("#typingInput"),
  showAnswerBtn: document.querySelector("#showAnswerBtn"),
  speakTypingBtn: document.querySelector("#speakTypingBtn"),
  nextTypingBtn: document.querySelector("#nextTypingBtn"),
  typingFeedback: document.querySelector("#typingFeedback"),
  speakTopic: document.querySelector("#speakTopic"),
  speakWord: document.querySelector("#speakWord"),
  speakIpa: document.querySelector("#speakIpa"),
  speakMeaning: document.querySelector("#speakMeaning"),
  speakGuide: document.querySelector("#speakGuide"),
  playSpeakBtn: document.querySelector("#playSpeakBtn"),
  recordBtn: document.querySelector("#recordBtn"),
  nextSpeakBtn: document.querySelector("#nextSpeakBtn"),
  speechStatus: document.querySelector("#speechStatus"),
  panels: {
    flashcard: document.querySelector("#flashcardPanel"),
    quiz: document.querySelector("#quizPanel"),
    typing: document.querySelector("#typingPanel"),
    speaking: document.querySelector("#speakingPanel")
  }
};

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

init();

function init() {
  elements.totalWords.textContent = ENRICHED_WORD_BANK.length;
  renderGroupFilter();
  renderSubtopicFilter();
  elements.groupFilter.value = state.group;
  elements.subtopicFilter.value = state.subtopic;
  elements.modeSelect.value = state.mode;
  elements.speechRateSelect.value = String(state.settings.rate || DEFAULT_SPEECH_RATE);
  resetRound();
  attachEvents();
  initVoices();
  refreshAll();
}

function enrichWordBank() {
  const sourceLookup = {};

  Object.entries(GROUP_TAXONOMY).forEach(([groupKey, groupValue]) => {
    Object.entries(groupValue.sources).forEach(([sourceTopic, subtopics]) => {
      sourceLookup[sourceTopic] = {
        groupKey,
        groupLabel: groupValue.label,
        subtopics
      };
    });
  });

  const topicBuckets = {};
  WORD_BANK.forEach((item) => {
    if (!topicBuckets[item.topic]) {
      topicBuckets[item.topic] = [];
    }
    topicBuckets[item.topic].push(item);
  });

  const counters = {};
  return WORD_BANK.map((item) => {
    const meta = sourceLookup[item.topic];
    if (!counters[item.topic]) {
      counters[item.topic] = 0;
    }

    const index = counters[item.topic];
    counters[item.topic] += 1;

    const bucketSize = Math.max(1, Math.ceil(topicBuckets[item.topic].length / meta.subtopics.length));
    const subtopicIndex = Math.min(Math.floor(index / bucketSize), meta.subtopics.length - 1);

    return {
      ...item,
      sourceTopic: item.topic,
      groupKey: meta.groupKey,
      groupLabel: meta.groupLabel,
      subtopic: meta.subtopics[subtopicIndex]
    };
  });
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { known: {}, streak: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      known: parsed.known || {},
      streak: parsed.streak || 0
    };
  } catch {
    return { known: {}, streak: 0 };
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return { voiceURI: "", rate: DEFAULT_SPEECH_RATE };
    }
    const parsed = JSON.parse(raw);
    return {
      voiceURI: parsed.voiceURI || "",
      rate: Number(parsed.rate) || DEFAULT_SPEECH_RATE
    };
  } catch {
    return { voiceURI: "", rate: DEFAULT_SPEECH_RATE };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function getProgramWords() {
  return ENRICHED_WORD_BANK.slice(0, Math.min(state.program, ENRICHED_WORD_BANK.length));
}

function getFilteredWords() {
  return getProgramWords().filter((item) => {
    const matchGroup = state.group === "All" || item.groupKey === state.group;
    const matchSubtopic = state.subtopic === "All" || item.subtopic === state.subtopic;
    return matchGroup && matchSubtopic;
  });
}

function getAvailableSubtopics() {
  const byGroup = state.group === "All"
    ? getProgramWords()
    : getProgramWords().filter((item) => item.groupKey === state.group);
  return [...new Set(byGroup.map((item) => item.subtopic))];
}

function getKnownCountForCurrentProgram() {
  const programWordSet = new Set(getProgramWords().map((item) => item.word));
  return Object.keys(state.progress.known).filter((word) => programWordSet.has(word)).length;
}

function renderGroupFilter() {
  const groups = ["All", ...Object.keys(GROUP_TAXONOMY)];
  elements.groupFilter.innerHTML = groups
    .map((groupKey) => {
      const label = groupKey === "All" ? "Tất cả nhóm" : GROUP_TAXONOMY[groupKey].label;
      return `<option value="${groupKey}">${label}</option>`;
    })
    .join("");
}

function renderSubtopicFilter() {
  const options = ["All", ...getAvailableSubtopics()];
  elements.subtopicFilter.innerHTML = options
    .map((subtopic) => `<option value="${subtopic}">${subtopic === "All" ? "Tất cả topic nhỏ" : subtopic}</option>`)
    .join("");
}

function attachEvents() {
  elements.groupFilter.addEventListener("change", () => {
    state.group = elements.groupFilter.value;
    state.subtopic = "All";
    renderSubtopicFilter();
    elements.subtopicFilter.value = state.subtopic;
    resetRound();
    refreshAll();
  });

  elements.subtopicFilter.addEventListener("change", () => {
    state.subtopic = elements.subtopicFilter.value;
    resetRound();
    refreshAll();
  });

  elements.modeSelect.addEventListener("change", () => {
    state.mode = elements.modeSelect.value;
    switchMode();
    syncModeButtons();
  });

  elements.startNowBtn.addEventListener("click", () => {
    setMode("flashcard");
    document.querySelector(".study-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.jumpSpeakingBtn.addEventListener("click", () => {
    setMode("speaking");
    document.querySelector(".study-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.quickModes.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  elements.programButtons.forEach((button) => {
    button.addEventListener("click", () => setProgram(Number(button.dataset.program)));
  });

  elements.voiceSelect.addEventListener("change", () => {
    state.settings.voiceURI = elements.voiceSelect.value;
    state.selectedVoice = findVoiceByURI(state.settings.voiceURI) || pickBestVoice(state.voices);
    saveSettings();
    updateVoiceUI();
  });

  elements.speechRateSelect.addEventListener("change", () => {
    state.settings.rate = Number(elements.speechRateSelect.value) || DEFAULT_SPEECH_RATE;
    saveSettings();
    updateVoiceUI();
  });

  elements.previewVoiceBtn.addEventListener("click", () => {
    speak("Pronunciation practice for VSTEP speaking and writing.");
  });

  elements.shuffleBtn.addEventListener("click", () => {
    resetRound();
    refreshAll();
  });

  elements.resetProgressBtn.addEventListener("click", () => {
    state.progress = { known: {}, streak: 0 };
    saveProgress();
    refreshAll();
    setFeedback(elements.speechStatus, "Tiến độ đã được xóa. Bạn có thể bắt đầu lại từ đầu.");
  });

  elements.flipBtn.addEventListener("click", () => {
    elements.flashcard.classList.toggle("flipped");
  });

  elements.nextFlashBtn.addEventListener("click", () => {
    state.currentFlashIndex = randomIndex(getFilteredWords().length);
    renderFlashcard();
  });

  elements.knownBtn.addEventListener("click", () => {
    const word = getFilteredWords()[state.currentFlashIndex];
    if (!word) {
      return;
    }
    state.progress.known[word.word] = true;
    saveProgress();
    refreshStats();
    renderRoadmap();
    renderFlashcard();
  });

  elements.speakFlashBtn.addEventListener("click", () => speak(getFilteredWords()[state.currentFlashIndex]?.word));
  elements.speakQuizBtn.addEventListener("click", () => speak(state.currentQuiz?.answer.word));
  elements.speakTypingBtn.addEventListener("click", () => speak(state.currentTyping?.word));
  elements.playSpeakBtn.addEventListener("click", () => speak(state.currentSpeaking?.word));

  elements.nextQuizBtn.addEventListener("click", renderQuiz);
  elements.nextTypingBtn.addEventListener("click", renderTyping);
  elements.nextSpeakBtn.addEventListener("click", renderSpeaking);

  elements.showAnswerBtn.addEventListener("click", () => {
    if (!state.currentTyping) {
      return;
    }
    setFeedback(
      elements.typingFeedback,
      `Đáp án: ${state.currentTyping.word} ${state.currentTyping.ipa} - ${state.currentTyping.meaning}`
    );
  });

  elements.typingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = normalize(elements.typingInput.value);
    const target = normalize(state.currentTyping?.word || "");
    if (!target) {
      return;
    }

    if (answer === target) {
      state.progress.streak += 1;
      state.progress.known[state.currentTyping.word] = true;
      saveProgress();
      refreshStats();
      renderRoadmap();
      setFeedback(elements.typingFeedback, `Chính xác! ${state.currentTyping.word} ${state.currentTyping.ipa}`);
    } else {
      state.progress.streak = 0;
      saveProgress();
      refreshStats();
      setFeedback(elements.typingFeedback, `Chưa đúng. Đáp án đúng là ${state.currentTyping.word}.`);
    }
    elements.typingInput.value = "";
  });

  elements.recordBtn.addEventListener("click", startSpeakingCheck);
}

function resetRound() {
  state.currentFlashIndex = randomIndex(getFilteredWords().length);
  state.currentQuiz = null;
  state.currentTyping = null;
  state.currentSpeaking = null;
}

function refreshAll() {
  renderSubtopicFilter();
  elements.groupFilter.value = state.group;
  elements.subtopicFilter.value = state.subtopic;
  refreshStats();
  switchMode();
  syncModeButtons();
  syncProgramButtons();
  renderProgramMeta();
  renderRoadmap();
  updateVoiceUI();
  renderFlashcard();
  renderQuiz();
  renderTyping();
  renderSpeaking();
}

function refreshStats() {
  const knownCount = getKnownCountForCurrentProgram();
  elements.knownCount.textContent = knownCount;
  elements.streakCount.textContent = state.progress.streak;
  elements.programProgressText.textContent = `${knownCount} / ${state.program}`;
  elements.programProgressFill.style.width = `${Math.min((knownCount / state.program) * 100, 100)}%`;
}

function switchMode() {
  Object.entries(elements.panels).forEach(([mode, panel]) => {
    panel.classList.toggle("active", mode === state.mode);
  });
}

function setMode(mode) {
  state.mode = mode;
  elements.modeSelect.value = mode;
  switchMode();
  syncModeButtons();
}

function syncModeButtons() {
  elements.quickModes.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function setProgram(program) {
  state.program = program;
  renderSubtopicFilter();
  const subtopics = getAvailableSubtopics();
  if (state.subtopic !== "All" && !subtopics.includes(state.subtopic)) {
    state.subtopic = "All";
  }
  resetRound();
  syncProgramButtons();
  renderProgramMeta();
  renderRoadmap();
  refreshStats();
  renderFlashcard();
  renderQuiz();
  renderTyping();
  renderSpeaking();
}

function syncProgramButtons() {
  elements.programButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.program) === state.program);
  });
}

function renderProgramMeta() {
  const currentProgram = PROGRAMS[state.program] || PROGRAMS[300];
  const availableCount = Math.min(ENRICHED_WORD_BANK.length, state.program);
  const suffix =
    state.program <= ENRICHED_WORD_BANK.length
      ? "Bạn có thể học đầy đủ ngay trong app."
      : `Hiện app đang có ${ENRICHED_WORD_BANK.length} từ cốt lõi, phần còn lại là lộ trình mở rộng tiếp theo.`;
  elements.programTitle.textContent = currentProgram.title;
  elements.programDescription.textContent = `${currentProgram.description} ${suffix}`;
  elements.totalWords.textContent = availableCount;
}

function renderRoadmap() {
  elements.roadmapList.innerHTML = Object.entries(GROUP_TAXONOMY)
    .map(([groupKey, groupValue], index) => {
      const words = getProgramWords().filter((item) => item.groupKey === groupKey);
      const known = words.filter((item) => state.progress.known[item.word]).length;
      const percent = words.length ? Math.round((known / words.length) * 100) : 0;
      const activeClass = state.group === groupKey || (state.group === "All" && index === 0) ? "active" : "";
      const subtopics = [...new Set(words.map((item) => item.subtopic))];
      return `
        <button type="button" class="roadmap-item ${activeClass}" data-group="${groupKey}">
          <span class="roadmap-item-head">
            <strong>${groupValue.label}</strong>
            <span class="roadmap-badge">${words.length} từ</span>
          </span>
          <span class="feedback">${known}/${words.length} từ đã đánh dấu nhớ</span>
          <div class="mini-progress"><span style="width:${percent}%"></span></div>
          <div class="roadmap-subtopics">
            ${subtopics.slice(0, 5).map((subtopic) => {
              const active = state.subtopic === subtopic ? "active" : "";
              return `<span class="subtopic-chip ${active}">${subtopic}</span>`;
            }).join("")}
          </div>
        </button>
      `;
    })
    .join("");

  [...elements.roadmapList.querySelectorAll("[data-group]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.group = button.dataset.group;
      state.subtopic = "All";
      elements.groupFilter.value = state.group;
      renderSubtopicFilter();
      elements.subtopicFilter.value = state.subtopic;
      resetRound();
      refreshAll();
    });
  });
}

function renderFlashcard() {
  const words = getFilteredWords();
  if (!words.length) {
    return;
  }
  if (state.currentFlashIndex >= words.length) {
    state.currentFlashIndex = 0;
  }

  const item = words[state.currentFlashIndex];
  elements.flashcard.classList.remove("flipped");
  elements.flashTopic.textContent = `${item.groupLabel} • ${item.subtopic}`;
  elements.flashWord.textContent = item.word;
  elements.flashIpa.textContent = `${item.ipa} | nhóm gốc: ${item.sourceTopic}`;
  elements.flashTopicBack.textContent = `${item.groupLabel} • ${item.subtopic}`;
  elements.flashMeaning.textContent = item.meaning;
  elements.flashPronounce.textContent = `${item.word} ${item.ipa}`;
  elements.flashExample.textContent = `Ví dụ: ${item.example}`;
  elements.flashTip.textContent = `Mẹo phát âm: ${item.tip}`;
  elements.knownBtn.textContent = state.progress.known[item.word] ? "Đã đánh dấu" : "Đã nhớ";
}

function renderQuiz() {
  const words = getFilteredWords();
  if (words.length < 4) {
    return;
  }

  const answer = pickRandom(words);
  const choices = shuffle([answer, ...pickMany(words.filter((item) => item.word !== answer.word), 3)]);
  state.currentQuiz = { answer, choices };

  elements.quizTopic.textContent = `${answer.groupLabel} • ${answer.subtopic}`;
  elements.quizPrompt.textContent = `Nghĩa của "${answer.word}" là gì?`;
  elements.quizMeta.textContent = `${answer.ipa} | ${answer.example}`;
  setFeedback(elements.quizFeedback, "");
  elements.quizChoices.innerHTML = "";

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = choice.meaning;
    button.addEventListener("click", () => handleQuizChoice(button, choice, answer));
    elements.quizChoices.appendChild(button);
  });
}

function handleQuizChoice(button, choice, answer) {
  const allButtons = [...elements.quizChoices.querySelectorAll("button")];
  allButtons.forEach((btn) => (btn.disabled = true));

  if (choice.word === answer.word) {
    button.classList.add("correct");
    state.progress.streak += 1;
    state.progress.known[answer.word] = true;
    saveProgress();
    refreshStats();
    renderRoadmap();
    setFeedback(elements.quizFeedback, `Đúng rồi! ${answer.word} = ${answer.meaning}`);
  } else {
    button.classList.add("wrong");
    const correctButton = allButtons.find((btn) => btn.textContent === answer.meaning);
    if (correctButton) {
      correctButton.classList.add("correct");
    }
    state.progress.streak = 0;
    saveProgress();
    refreshStats();
    setFeedback(elements.quizFeedback, `Chưa đúng. ${answer.word} có nghĩa là "${answer.meaning}".`);
  }
}

function renderTyping() {
  const item = pickRandom(getFilteredWords());
  if (!item) {
    return;
  }
  state.currentTyping = item;
  elements.typingTopic.textContent = `${item.groupLabel} • ${item.subtopic}`;
  elements.typingMeaning.textContent = item.meaning;
  elements.typingExample.textContent = `Gợi ý: ${item.example}`;
  elements.typingInput.value = "";
  setFeedback(elements.typingFeedback, "");
}

function renderSpeaking() {
  const item = pickRandom(getFilteredWords());
  if (!item) {
    return;
  }
  state.currentSpeaking = item;
  elements.speakTopic.textContent = `${item.groupLabel} • ${item.subtopic}`;
  elements.speakWord.textContent = item.word;
  elements.speakIpa.textContent = item.ipa;
  elements.speakMeaning.textContent = `Nghĩa: ${item.meaning}. Ví dụ: ${item.example}`;
  elements.speakGuide.textContent = `Hướng dẫn: ${item.tip} Sau đó đọc chậm, rõ âm chính và âm cuối.`;
  setFeedback(
    elements.speechStatus,
    SpeechRecognitionAPI
      ? "Nhấn 'Nói thử' rồi đọc to từ vựng. Hệ thống sẽ so sánh kết quả nhận diện với từ mục tiêu."
      : "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Bạn vẫn có thể bấm 'Nghe mẫu' và tự luyện nói theo."
  );
}

function speak(text) {
  if (!text || !window.speechSynthesis) {
    setFeedback(elements.voiceStatus, "Trình duyệt này không hỗ trợ text to speech.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = state.settings.rate || DEFAULT_SPEECH_RATE;
  utterance.pitch = 1;

  if (state.selectedVoice) {
    utterance.voice = state.selectedVoice;
    utterance.lang = state.selectedVoice.lang || "en-US";
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function startSpeakingCheck() {
  if (!state.currentSpeaking) {
    return;
  }

  if (!SpeechRecognitionAPI) {
    setFeedback(
      elements.speechStatus,
      `Máy chưa hỗ trợ nhận diện giọng nói. Hãy nghe mẫu và tự đọc lại: ${state.currentSpeaking.word} ${state.currentSpeaking.ipa}`
    );
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript || "";
      const recognized = normalize(transcript);
      const target = normalize(state.currentSpeaking.word);

      if (recognized === target) {
        state.progress.streak += 1;
        state.progress.known[state.currentSpeaking.word] = true;
        saveProgress();
        refreshStats();
        renderRoadmap();
        setFeedback(
          elements.speechStatus,
          `Rất tốt! Hệ thống nghe được "${transcript}". Bạn đã đọc gần đúng từ ${state.currentSpeaking.word}.`
        );
      } else {
        state.progress.streak = 0;
        saveProgress();
        refreshStats();
        setFeedback(
          elements.speechStatus,
          `Hệ thống nghe được "${transcript}". Từ mục tiêu là "${state.currentSpeaking.word}". Hãy chú ý ${state.currentSpeaking.tip}`
        );
      }
    };

    recognition.onerror = () => {
      setFeedback(
        elements.speechStatus,
        "Không thể nhận diện giọng nói lúc này. Bạn thử lại ở nơi yên tĩnh hơn và đọc chậm hơn."
      );
    };

    recognition.onend = () => {
      elements.recordBtn.disabled = false;
      elements.recordBtn.textContent = "Nói thử";
    };
  }

  elements.recordBtn.disabled = true;
  elements.recordBtn.textContent = "Đang nghe...";
  setFeedback(elements.speechStatus, `Mời bạn đọc to: ${state.currentSpeaking.word}`);
  recognition.start();
}

function setFeedback(element, message) {
  element.textContent = message;
}

function initVoices() {
  if (!window.speechSynthesis) {
    updateVoiceUI();
    return;
  }

  const loadVoices = () => {
    const voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en"));
    state.voices = voices;
    state.selectedVoice = findVoiceByURI(state.settings.voiceURI) || pickBestVoice(voices);

    if (state.selectedVoice) {
      state.settings.voiceURI = state.selectedVoice.voiceURI;
      saveSettings();
    }

    renderVoiceSelect();
    updateVoiceUI();
  };

  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function renderVoiceSelect() {
  if (!state.voices.length) {
    elements.voiceSelect.innerHTML = '<option value="">Không có voice tiếng Anh nào</option>';
    return;
  }

  elements.voiceSelect.innerHTML = state.voices
    .map((voice) => {
      const quality = scoreVoice(voice) >= 80 ? "gợi ý" : "có sẵn";
      return `<option value="${voice.voiceURI}">${voice.name} - ${voice.lang} - ${quality}</option>`;
    })
    .join("");

  if (state.selectedVoice) {
    elements.voiceSelect.value = state.selectedVoice.voiceURI;
  }
}

function updateVoiceUI() {
  const selected = state.selectedVoice;
  const rate = state.settings.rate || DEFAULT_SPEECH_RATE;

  if (!window.speechSynthesis) {
    elements.voiceStatus.textContent = "Trình duyệt này không hỗ trợ text to speech.";
    elements.voiceEngineChip.textContent = "Nguồn: Không hỗ trợ";
    elements.voiceNameChip.textContent = "Giọng: Không có";
    return;
  }

  if (!selected) {
    elements.voiceStatus.textContent =
      "Chưa tìm thấy voice tiếng Anh trên trình duyệt. Nếu dùng Chrome hoặc Edge, hãy thử mở lại trang.";
    elements.voiceEngineChip.textContent = "Nguồn: Browser TTS";
    elements.voiceNameChip.textContent = "Giọng: Chưa tải xong";
    return;
  }

  elements.voiceStatus.textContent =
    `Đang ưu tiên voice ${selected.name} (${selected.lang}), mức chất lượng đánh giá: ${describeVoiceQuality(selected)}, tốc độ ${rate}.`;
  elements.voiceEngineChip.textContent = "Nguồn: Browser TTS";
  elements.voiceNameChip.textContent = `Giọng: ${selected.name}`;
}

function findVoiceByURI(voiceURI) {
  if (!voiceURI) {
    return null;
  }
  return state.voices.find((voice) => voice.voiceURI === voiceURI) || null;
}

function pickBestVoice(voices) {
  if (!voices.length) {
    return null;
  }
  return [...voices].sort((left, right) => scoreVoice(right) - scoreVoice(left))[0];
}

function scoreVoice(voice) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  let score = 0;

  if (voice.default) score += 10;
  if (voice.localService) score += 8;
  if (voice.lang === "en-US") score += 14;
  if (voice.lang === "en-GB") score += 12;
  if (name.includes("premium")) score += 35;
  if (name.includes("enhanced")) score += 35;
  if (name.includes("neural")) score += 40;
  if (name.includes("natural")) score += 25;
  if (name.includes("samantha")) score += 20;
  if (name.includes("ava")) score += 18;
  if (name.includes("allison")) score += 18;
  if (name.includes("daniel")) score += 18;
  if (name.includes("serena")) score += 18;
  if (name.includes("alex")) score += 15;
  if (name.includes("google")) score += 20;
  if (name.includes("microsoft")) score += 18;
  if (name.includes("zira")) score += 14;
  if (name.includes("aria")) score += 22;
  if (name.includes("jenny")) score += 22;
  if (name.includes("guy")) score += 20;

  return score;
}

function describeVoiceQuality(voice) {
  const score = scoreVoice(voice);
  if (score >= 80) {
    return "rất tốt";
  }
  if (score >= 55) {
    return "tốt";
  }
  return "cơ bản";
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function pickRandom(items) {
  if (!items.length) {
    return null;
  }
  return items[randomIndex(items.length)];
}

function randomIndex(length) {
  if (!length) {
    return 0;
  }
  return Math.floor(Math.random() * length);
}

function pickMany(items, count) {
  return shuffle([...items]).slice(0, count);
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}
