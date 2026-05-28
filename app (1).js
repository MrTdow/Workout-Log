(function () {
  const STORAGE_KEY = "workoutTracker.v2";
  const LEGACY_KEY = "workoutTracker.v1";

  const metricLabels = {
    sets: "Sets",
    reps: "Reps",
    weight: "Weight",
    time: "Time",
    distance: "Distance"
  };

  const metricPlaceholders = {
    sets: "3",
    reps: "8",
    weight: "135",
    time: "12:30 or 12.5",
    distance: "1.5"
  };

  const benchmarkWorkouts = [
    { name: "Fran", metrics: ["time"], primaryMetric: "time" },
    { name: "Murph", metrics: ["time"], primaryMetric: "time" },
    { name: "Cindy", metrics: ["reps"], primaryMetric: "reps" },
    { name: "Grace", metrics: ["time"], primaryMetric: "time" },
    { name: "Helen", metrics: ["time"], primaryMetric: "time" },
    { name: "Annie", metrics: ["time"], primaryMetric: "time" },
    { name: "Diane", metrics: ["time"], primaryMetric: "time" },
    { name: "Fight Gone Bad", metrics: ["reps"], primaryMetric: "reps" }
  ];

  const libraryTabs = ["All", "Favorites", "Recent", "Strength", "Cardio", "Benchmarks"];
  const categoryIconText = {
    Strength: "ST",
    "Olympic Lifting": "OL",
    Bodyweight: "BW",
    Cardio: "CD",
    Conditioning: "CN",
    Core: "CR",
    Mobility: "MO",
    Plyometrics: "PL",
    Dumbbell: "DB",
    Kettlebell: "KB",
    Machine: "MC",
    "Sports Performance": "SP",
    Benchmark: "BM"
  };

  const categoryBadgeClass = {
    Strength: "strength",
    "Olympic Lifting": "olympic",
    Bodyweight: "bodyweight",
    Cardio: "cardio",
    Conditioning: "conditioning",
    Core: "core",
    Mobility: "mobility",
    Plyometrics: "plyo",
    Dumbbell: "dumbbell",
    Kettlebell: "kettlebell",
    Machine: "machine",
    "Sports Performance": "performance",
    Benchmark: "benchmark"
  };

  const aliasMap = {
    "Bench Press": ["bench", "chest press"],
    "Incline Bench Press": ["incline bench", "incline"],
    "Back Squat": ["squat", "backsquat"],
    "Front Squat": ["front squat", "fs"],
    "Deadlift": ["dl", "pull"],
    "Romanian Deadlift": ["rdl"],
    "Strict Press": ["press", "shoulder press"],
    "Push Press": ["press"],
    "Power Clean": ["clean", "pc"],
    "Squat Clean": ["clean", "full clean"],
    "Hang Clean": ["clean", "hc"],
    "Clean and Jerk": ["clean", "jerk", "c and j", "cnj"],
    "Power Snatch": ["snatch"],
    "Squat Snatch": ["snatch", "full snatch"],
    "Hang Snatch": ["snatch"],
    "Pull-ups": ["pullups", "pull up"],
    "Push-ups": ["pushups", "push up"],
    "Toes-to-Bar": ["t2b", "toes to bar"],
    "Handstand Push-ups": ["hspu"],
    "Mile Run": ["run", "1 mile"],
    "400m Run": ["run", "400"],
    "800m Run": ["run", "800"],
    "5k Run": ["run", "5k"],
    "Bike Calories": ["bike", "cal bike"],
    "Row Calories": ["row", "cal row"],
    "Assault Bike": ["bike", "assault"],
    "Echo Bike": ["bike", "echo"],
    "Kettlebell Swing": ["kb swing", "swing"],
    "Dumbbell Snatch": ["db snatch"],
    "Farmer Carry": ["farmers carry", "carry"],
    "Vertical Jump": ["vert"],
    "Broad Jump": ["jump"],
    "Shuttle Run": ["shuttle", "agility"],
    "Sled Push": ["sled"],
    "Sled Pull": ["sled"]
  };

  const exerciseLibrary = [
    ...strength(["Back Squat", "Front Squat", "Overhead Squat", "Deadlift", "Romanian Deadlift", "Bench Press", "Incline Bench Press", "Strict Press", "Push Press", "Split Jerk", "Sumo Deadlift", "Hip Thrust", "Bulgarian Split Squat"]),
    ...olympic(["Power Clean", "Squat Clean", "Hang Clean", "Power Snatch", "Squat Snatch", "Hang Snatch", "Clean and Jerk", "Snatch Pull", "Clean Pull"]),
    ...bodyweight(["Push-ups", "Pull-ups", "Chin-ups", "Sit-ups", "Air Squats", "Lunges", "Burpees", "Handstand Push-ups", "Dips", "Toes-to-Bar", "Box Jumps"]),
    ...cardio(["Mile Run", "400m Run", "800m Run", "5k Run", "Bike Calories", "Row Calories", "Jump Rope", "Assault Bike", "Echo Bike"]),
    ...conditioning(["AMRAP", "EMOM", "Interval Workout", "Circuit Workout", "Wall Balls", "Battle Ropes", "Sandbag Carry", "Medicine Ball Slams"]),
    ...core(["Plank", "Russian Twists", "Leg Raises", "Hollow Hold", "V-Ups", "Side Plank", "Dead Bug", "Bicycle Crunches"]),
    ...mobility(["Hamstring Stretch", "Couch Stretch", "Shoulder Mobility", "Ankle Mobility", "Hip Flexor Stretch", "Thoracic Rotation", "Foam Rolling"]),
    ...plyometrics(["Skater Jumps", "Tuck Jumps", "Depth Jumps", "Lateral Bounds", "Pogo Jumps"]),
    ...dumbbell(["Dumbbell Bench Press", "Dumbbell Snatch", "Dumbbell Clean and Press", "Farmer Carry", "Dumbbell Row", "Dumbbell Lunges", "Dumbbell Thruster"]),
    ...kettlebell(["Kettlebell Swing", "Goblet Squat", "Turkish Get-Up", "Kettlebell Clean", "Kettlebell Press", "Kettlebell Snatch"]),
    ...machine(["Leg Press", "Lat Pulldown", "Seated Row", "Leg Curl", "Leg Extension", "Cable Row", "Chest Press Machine", "Smith Machine Squat"]),
    ...sportsPerformance(["Broad Jump", "Vertical Jump", "Sprint Time", "Shuttle Run", "Agility Ladder", "Sled Push", "Sled Pull", "Pro Agility", "Flying 10", "Medicine Ball Throw"]),
    ...benchmarkWorkouts.map((workout) => ({
      name: workout.name,
      category: "Benchmark",
      primaryMetric: workout.primaryMetric,
      metrics: workout.metrics
    }))
  ];

  const defaultAthleteId = makeId();
  const defaultState = {
    version: 2,
    activeAthleteId: defaultAthleteId,
    settings: {
      darkMode: false,
      units: "lb",
      coachMode: false
    },
    athletes: [
      { id: defaultAthleteId, name: "My Profile" }
    ],
    movements: [
      {
        id: makeId(),
        name: "Back Squat",
        category: "Strength",
        primaryMetric: "estimatedMax",
        metrics: ["sets", "reps", "weight"],
        favorite: true
      },
      {
        id: makeId(),
        name: "Mile Run",
        category: "Cardio",
        primaryMetric: "time",
        metrics: ["time", "distance"],
        favorite: true
      },
      {
        id: makeId(),
        name: "Push-ups",
        category: "Bodyweight",
        primaryMetric: "reps",
        metrics: ["sets", "reps"],
        favorite: false
      }
    ],
    logs: []
  };

  let state = loadState();
  let activeView = "track";
  let chartPoints = [];
  let toastTimer = null;
  let activeCategoryFilter = "All";
  let activeLibraryTab = "All";
  let activePickerTab = "All";
  let swipeStart = null;

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    applySettings();
    els.logDate.value = localDate();
    bindEvents();
    renderAll();
    saveState();
    registerServiceWorker();
  }

  function cacheElements() {
    [
      "totalSessions", "thisWeekSessions", "trackedMovements", "quickAddMovement",
      "activeAthleteAvatar", "athleteSelect", "coachModeToggle", "coachPanel",
      "coachGrid", "quickExerciseButtons", "logMovementSelect", "logForm",
      "logDate", "logFields", "autofillSuggestions", "logEffort", "effortValue",
      "logNotes", "duplicateLastWorkout", "recentResults", "progressMovementSelect",
      "progressBest", "progressPreviousBest", "progressTrend", "progressChart",
      "chartTooltip", "movementHistory", "movementForm", "movementId",
      "movementName", "movementCategory", "movementPrimaryMetric", "movementFavorite",
      "cancelMovementEdit", "benchmarkButtons", "movementList", "athleteForm",
      "athleteName", "profileList", "darkModeToggle", "unitSelect", "exportData",
      "importData", "clearData", "stickySaveResult", "toast", "openMovementPicker",
      "movementPicker", "closeMovementPicker", "pickerSearch", "pickerFavorites",
      "pickerRecent", "pickerMostUsed", "pickerResults", "movementSearch", "categoryFilters",
      "libraryTabs", "pickerTabs", "libraryMostUsed"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    document.querySelectorAll("[data-nav]").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.nav));
    });

    els.quickAddMovement.addEventListener("click", () => {
      setView("movements");
      resetMovementForm();
      els.movementName.focus();
    });

    els.athleteSelect.addEventListener("change", () => {
      state.activeAthleteId = els.athleteSelect.value;
      saveState();
      renderAll();
      showToast(`Switched to ${activeAthlete().name}`);
    });

    els.coachModeToggle.addEventListener("change", () => {
      state.settings.coachMode = els.coachModeToggle.checked;
      saveState();
      renderAll();
    });

    els.logMovementSelect.addEventListener("change", () => {
      renderLogFields(true);
      renderAutofillSuggestions();
    });

    els.openMovementPicker.addEventListener("click", openMovementPicker);
    els.closeMovementPicker.addEventListener("click", closeMovementPicker);
    els.pickerSearch.addEventListener("input", renderMovementPicker);
    els.movementSearch.addEventListener("input", renderMovementList);
    els.movementPicker.addEventListener("click", (event) => {
      if (event.target === els.movementPicker) closeMovementPicker();
    });

    els.progressMovementSelect.addEventListener("change", renderProgress);

    els.logEffort.addEventListener("input", () => {
      els.effortValue.textContent = els.logEffort.value;
    });

    els.logForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveLog();
    });

    els.stickySaveResult.addEventListener("click", () => {
      if (activeView === "track") saveLog();
    });

    els.duplicateLastWorkout.addEventListener("click", duplicatePreviousWorkout);

    els.movementForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveMovement();
    });

    els.cancelMovementEdit.addEventListener("click", resetMovementForm);

    els.athleteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addAthlete();
    });

    els.darkModeToggle.addEventListener("change", () => {
      state.settings.darkMode = els.darkModeToggle.checked;
      saveState();
      applySettings();
    });

    els.unitSelect.addEventListener("change", () => {
      state.settings.units = els.unitSelect.value;
      saveState();
      renderAll();
    });

    els.exportData.addEventListener("click", exportBackup);
    els.importData.addEventListener("change", importBackup);
    els.clearData.addEventListener("click", clearAllData);

    els.progressChart.addEventListener("pointermove", showChartTooltip);
    els.progressChart.addEventListener("pointerleave", () => {
      els.chartTooltip.hidden = true;
    });

    window.addEventListener("resize", debounce(renderProgress, 150));
  }

  function renderAll() {
    ensureValidSelections();
    renderAthletes();
    renderSummary();
    renderCoachPanel();
    renderMovementSelects();
    renderQuickButtons();
    renderLogFields(false);
    renderAutofillSuggestions();
    renderRecentResults();
    renderBenchmarkButtons();
    renderLibraryTabs();
    renderCategoryFilters();
    renderMostUsedSections();
    renderMovementList();
    renderMovementPicker();
    renderProgress();
    renderSettings();
    setView(activeView);
  }

  function setView(view) {
    activeView = view;
    document.querySelectorAll(".view").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.view === view);
    });
    document.querySelectorAll("[data-nav]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.nav === view);
    });
    els.stickySaveResult.hidden = view !== "track";
    if (view === "progress") renderProgress();
  }

  function renderAthletes() {
    els.athleteSelect.innerHTML = state.athletes
      .map((athlete) => `<option value="${athlete.id}">${escapeHtml(athlete.name)}</option>`)
      .join("");
    els.athleteSelect.value = state.activeAthleteId;
    els.activeAthleteAvatar.textContent = initials(activeAthlete().name);
  }

  function renderSummary() {
    const logs = activeLogs();
    els.totalSessions.textContent = logs.length;
    els.thisWeekSessions.textContent = logs.filter((log) => isThisWeek(log.date)).length;
    els.trackedMovements.textContent = state.movements.length;
  }

  function renderCoachPanel() {
    els.coachPanel.hidden = !state.settings.coachMode;
    if (!state.settings.coachMode) return;

    els.coachGrid.innerHTML = state.athletes.map((athlete) => {
      const logs = logsForAthlete(athlete.id);
      return `
        <article class="coach-card">
          <strong>${escapeHtml(initials(athlete.name))}</strong>
          <p>${escapeHtml(athlete.name)}</p>
          <p>${logs.length} sessions</p>
        </article>
      `;
    }).join("");
  }

  function renderMovementSelects() {
    const previousLogSelection = els.logMovementSelect.value;
    const previousProgressSelection = els.progressMovementSelect.value;
    const options = sortMovements(state.movements)
      .map((movement) => `<option value="${movement.id}">${escapeHtml(movement.name)}</option>`)
      .join("");

    els.logMovementSelect.innerHTML = options || "<option>No exercises yet</option>";
    els.progressMovementSelect.innerHTML = options || "<option>No exercises yet</option>";

    els.logMovementSelect.value = getMovement(previousLogSelection)
      ? previousLogSelection
      : state.movements[0]?.id || "";
    els.progressMovementSelect.value = getMovement(previousProgressSelection)
      ? previousProgressSelection
      : state.movements[0]?.id || "";
  }

  function renderQuickButtons() {
    const movementIds = new Set();
    const recentIds = activeLogs()
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((log) => log.movementId);

    [...state.movements.filter((movement) => movement.favorite).map((movement) => movement.id), ...recentIds]
      .forEach((id) => {
        if (movementIds.size < 8 && getMovement(id)) movementIds.add(id);
      });

    const buttons = Array.from(movementIds).map((id) => quickMovementButton(getMovement(id)));
    els.quickExerciseButtons.innerHTML = buttons.join("") || '<p class="empty-state">Favorite an exercise to make it appear here.</p>';

    els.quickExerciseButtons.querySelectorAll("[data-movement-id]").forEach((button) => {
      button.addEventListener("click", () => selectMovement(button.dataset.movementId));
    });
  }

  function quickMovementButton(movement) {
    return `
      <button class="chip ${movement.favorite ? "is-favorite" : ""}" type="button" data-movement-id="${movement.id}">
        ${movement.favorite ? "Fav " : ""}${escapeHtml(movement.name)}
      </button>
    `;
  }

  function selectMovement(id) {
    els.logMovementSelect.value = id;
    renderLogFields(true);
    renderAutofillSuggestions();
  }

  function renderLogFields(shouldFocus) {
    const movement = currentLogMovement();
    els.logFields.innerHTML = "";

    if (!movement) {
      els.logForm.querySelector(".primary-button").disabled = true;
      return;
    }

    els.logForm.querySelector(".primary-button").disabled = false;
    const recent = latestLogForMovement(movement.id);

    movement.metrics.forEach((metric) => {
      const label = document.createElement("label");
      label.className = "field";
      label.innerHTML = `
        <span>${metricLabels[metric]}</span>
        <input
          type="text"
          inputmode="decimal"
          id="log-${metric}"
          placeholder="${recent?.values?.[metric] || metricPlaceholders[metric]}"
          autocomplete="off"
        >
      `;
      els.logFields.appendChild(label);
    });

    if (shouldFocus) {
      requestAnimationFrame(() => {
        const firstInput = els.logFields.querySelector("input");
        if (firstInput) firstInput.focus();
      });
    }
  }

  function renderAutofillSuggestions() {
    const movement = currentLogMovement();
    const recent = movement ? latestLogForMovement(movement.id) : null;
    if (!recent) {
      els.autofillSuggestions.innerHTML = "";
      return;
    }

    els.autofillSuggestions.innerHTML = `
      <button class="suggestion-chip" type="button" data-action="fill-last">Use last: ${formatPlainValues(recent)}</button>
    `;
    els.autofillSuggestions.querySelector("[data-action='fill-last']").addEventListener("click", () => fillFromLog(recent));
  }

  function fillFromLog(log) {
    Object.entries(log.values || {}).forEach(([metric, value]) => {
      const input = document.getElementById(`log-${metric}`);
      if (input) input.value = value;
    });
    els.logEffort.value = log.effort || 7;
    els.effortValue.textContent = els.logEffort.value;
    showToast("Previous values filled in");
  }

  function renderRecentResults() {
    renderLogList(els.recentResults, activeLogs().slice(0, 8), true);
  }

  function renderProgress() {
    const movement = currentProgressMovement();
    const logs = movement ? logsForMovement(movement.id).reverse() : [];
    const stats = getProgressStats(movement, logs);

    els.progressBest.textContent = stats.bestLabel;
    els.progressPreviousBest.textContent = stats.previousBestLabel;
    els.progressTrend.textContent = stats.trendLabel;
    els.progressTrend.className = stats.trendClass;

    drawChart(movement, logs);
    renderLogList(els.movementHistory, logs.slice().reverse(), true);
  }

  function renderBenchmarkButtons() {
    els.benchmarkButtons.innerHTML = benchmarkWorkouts.map((benchmark) => `
      <button class="chip" type="button" data-benchmark="${benchmark.name}">${benchmark.name}</button>
    `).join("");

    els.benchmarkButtons.querySelectorAll("[data-benchmark]").forEach((button) => {
      button.addEventListener("click", () => addOrSelectBenchmark(button.dataset.benchmark));
    });
  }

  function renderCategoryFilters() {
    const categories = ["All", ...new Set(state.movements.map((movement) => movement.category || "Uncategorized"))];
    els.categoryFilters.innerHTML = categories.map((category) => `
      <button class="chip ${category === activeCategoryFilter ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
    `).join("");

    els.categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategoryFilter = button.dataset.category;
        renderCategoryFilters();
        renderMovementList();
      });
    });
  }

  function renderLibraryTabs() {
    els.libraryTabs.innerHTML = renderTabButtons(activeLibraryTab, "library");
    els.pickerTabs.innerHTML = renderTabButtons(activePickerTab, "picker");

    els.libraryTabs.querySelectorAll("[data-library-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeLibraryTab = button.dataset.libraryTab;
        activeCategoryFilter = "All";
        renderLibraryTabs();
        renderCategoryFilters();
        renderMovementList();
      });
    });

    els.pickerTabs.querySelectorAll("[data-picker-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activePickerTab = button.dataset.pickerTab;
        renderLibraryTabs();
        renderMovementPicker();
      });
    });
  }

  function renderTabButtons(activeTab, scope) {
    return libraryTabs.map((tab) => `
      <button class="library-tab ${tab === activeTab ? "is-active" : ""}" type="button" data-${scope}-tab="${tab}">${tab}</button>
    `).join("");
  }

  function renderMostUsedSections() {
    const mostUsed = getMostUsedMovements().slice(0, 10);
    const markup = mostUsed.length
      ? mostUsed.map((movement) => pickerChip(movement)).join("")
      : '<p class="empty-state">Most used exercises appear after logging.</p>';
    els.libraryMostUsed.innerHTML = markup;

    els.libraryMostUsed.querySelectorAll("[data-pick-movement]").forEach((button) => {
      button.addEventListener("click", () => {
        setView("track");
        selectMovement(button.dataset.pickMovement);
      });
    });
  }

  function renderMovementList() {
    els.movementList.innerHTML = "";

    if (!state.movements.length) {
      els.movementList.innerHTML = '<p class="empty-state">Add your first exercise above.</p>';
      return;
    }

    const query = normalizeName(els.movementSearch.value);
    const visibleMovements = getFilteredMovements(activeLibraryTab, query)
      .filter((movement) => activeCategoryFilter === "All" || (movement.category || "Uncategorized") === activeCategoryFilter)
      .slice(0, 140);

    if (!visibleMovements.length) {
      els.movementList.innerHTML = '<p class="empty-state">No exercises match that search.</p>';
      return;
    }

    visibleMovements.forEach((movement) => {
      const sessions = activeLogs().filter((log) => log.movementId === movement.id).length;
      const card = document.createElement("article");
      card.className = `movement-card is-library swipe-card ${movement.favorite ? "is-favorite" : ""}`;
      card.dataset.movementId = movement.id;
      card.innerHTML = `
        <div class="swipe-hint swipe-hint-left">Quick Log</div>
        <div class="swipe-hint swipe-hint-right">Favorite</div>
        <div class="movement-thumb ${badgeClass(movement)}">${exerciseIcon(movement)}</div>
        <div>
          <h3>${movement.favorite ? '<span class="pr-badge">Favorite</span> ' : ""}${escapeHtml(movement.name)}</h3>
          <div class="card-badge-row">
            <span class="category-badge ${badgeClass(movement)}">${escapeHtml(movement.category || "Other")}</span>
            <span class="standard-badge">${escapeHtml(movementStandard(movement))}</span>
          </div>
          <p>${escapeHtml(exerciseDescription(movement))}</p>
          <p>${formatMetricNames(movement)} &middot; ${sessions} logged</p>
        </div>
        <div class="movement-actions">
          <button type="button" data-action="log">Log</button>
          <button type="button" data-action="favorite">${movement.favorite ? "Unpin" : "Pin"}</button>
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      `;
      card.querySelector('[data-action="log"]').addEventListener("click", () => {
        setView("track");
        selectMovement(movement.id);
      });
      card.querySelector('[data-action="favorite"]').addEventListener("click", () => toggleFavorite(movement.id));
      card.querySelector('[data-action="edit"]').addEventListener("click", () => editMovement(movement.id));
      card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteMovement(movement.id));
      bindSwipe(card, movement.id);
      els.movementList.appendChild(card);
    });
  }

  function openMovementPicker() {
    els.pickerSearch.value = "";
    renderMovementPicker();
    if (typeof els.movementPicker.showModal === "function") {
      els.movementPicker.showModal();
    } else {
      els.movementPicker.setAttribute("open", "");
    }
    requestAnimationFrame(() => els.pickerSearch.focus());
  }

  function closeMovementPicker() {
    if (typeof els.movementPicker.close === "function") {
      els.movementPicker.close();
    } else {
      els.movementPicker.removeAttribute("open");
    }
  }

  function renderMovementPicker() {
    if (!els.pickerResults) return;
    const query = normalizeName(els.pickerSearch.value);
    const favorites = sortMovements(state.movements).filter((movement) => movement.favorite).slice(0, 12);
    const recentIds = [...new Set(activeLogs().map((log) => log.movementId))].slice(0, 10);
    const recent = recentIds.map(getMovement).filter(Boolean);
    const mostUsed = getMostUsedMovements().slice(0, 10);
    const results = getFilteredMovements(activePickerTab, query).slice(0, 120);

    els.pickerFavorites.innerHTML = favorites.length
      ? favorites.map((movement) => pickerChip(movement)).join("")
      : '<p class="empty-state">Pin exercises to show them here.</p>';
    els.pickerRecent.innerHTML = recent.length
      ? recent.map((movement) => pickerChip(movement)).join("")
      : '<p class="empty-state">Recent exercises appear after logging.</p>';
    els.pickerMostUsed.innerHTML = mostUsed.length
      ? mostUsed.map((movement) => pickerChip(movement)).join("")
      : '<p class="empty-state">Most used exercises appear after logging.</p>';
    els.pickerResults.innerHTML = renderGroupedMovementCards(results);

    els.movementPicker.querySelectorAll("[data-pick-movement]").forEach((button) => {
      button.addEventListener("click", () => {
        selectMovement(button.dataset.pickMovement);
        closeMovementPicker();
      });
    });

    els.movementPicker.querySelectorAll("[data-toggle-favorite]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(button.dataset.toggleFavorite);
      });
    });

    els.movementPicker.querySelectorAll(".swipe-card[data-movement-id]").forEach((card) => {
      bindSwipe(card, card.dataset.movementId);
    });
  }

  function pickerChip(movement) {
    return `<button class="chip ${movement.favorite ? "is-favorite" : ""}" type="button" data-pick-movement="${movement.id}">${exerciseIcon(movement)} ${escapeHtml(movement.name)}</button>`;
  }

  function renderGroupedMovementCards(movements) {
    if (!movements.length) return '<p class="empty-state">No exercises match that search.</p>';
    const groups = new Map();
    movements.forEach((movement) => {
      const category = movement.category || "Uncategorized";
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(movement);
    });

    return Array.from(groups.entries()).map(([category, items]) => `
      <section class="category-group">
        <h3 class="category-title">${escapeHtml(category)}</h3>
        ${items.map((movement) => `
          <article class="exercise-card swipe-card" data-movement-id="${movement.id}">
            <div class="swipe-hint swipe-hint-left">Quick Log</div>
            <div class="swipe-hint swipe-hint-right">Favorite</div>
            <div class="movement-thumb ${badgeClass(movement)}">${exerciseIcon(movement)}</div>
            <span>
              <strong>${escapeHtml(movement.name)}</strong>
              <span class="card-badge-row">
                <span class="category-badge ${badgeClass(movement)}">${escapeHtml(movement.category || "Other")}</span>
                <span class="standard-badge">${escapeHtml(movementStandard(movement))}</span>
              </span>
              <span>${escapeHtml(exerciseDescription(movement))}</span>
            </span>
            <div class="exercise-card-actions">
              <button class="small-button" type="button" data-pick-movement="${movement.id}">Log</button>
              <button class="favorite-button ${movement.favorite ? "is-on" : ""}" type="button" data-toggle-favorite="${movement.id}" aria-label="Toggle favorite">${movement.favorite ? "Pin" : "+"}</button>
            </div>
          </article>
        `).join("")}
      </section>
    `).join("");
  }

  function renderSettings() {
    els.coachModeToggle.checked = state.settings.coachMode;
    els.darkModeToggle.checked = state.settings.darkMode;
    els.unitSelect.value = state.settings.units;
    els.profileList.innerHTML = state.athletes.map((athlete) => `
      <article class="profile-card">
        <div class="avatar">${escapeHtml(initials(athlete.name))}</div>
        <strong>${escapeHtml(athlete.name)}</strong>
        <button class="secondary-button" type="button" data-athlete="${athlete.id}">Use</button>
      </article>
    `).join("");

    els.profileList.querySelectorAll("[data-athlete]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeAthleteId = button.dataset.athlete;
        saveState();
        renderAll();
      });
    });
  }

  function saveLog() {
    const movement = currentLogMovement();
    if (!movement) {
      alert("Add an exercise before logging a workout.");
      return;
    }

    const values = collectLogValues(movement);
    const currentValue = metricValue(movement, { values });
    const previousBest = getBestNumeric(movement, logsForMovement(movement.id));
    const isPr = isNewBest(movement, currentValue, previousBest);

    const log = {
      id: makeId(),
      athleteId: state.activeAthleteId,
      movementId: movement.id,
      date: els.logDate.value || localDate(),
      values,
      effort: Number(els.logEffort.value),
      notes: els.logNotes.value.trim(),
      createdAt: Date.now(),
      resultValue: Number.isFinite(currentValue) ? currentValue : null,
      previousBest: Number.isFinite(previousBest) ? previousBest : null,
      pr: isPr
    };

    state.logs.push(log);
    saveState();
    clearLogForm(movement);
    renderAll();
    showToast(isPr ? "Saved. New PR!" : "Workout result saved");
  }

  function collectLogValues(movement) {
    const values = {};
    movement.metrics.forEach((metric) => {
      const input = document.getElementById(`log-${metric}`);
      values[metric] = input ? input.value.trim() : "";
    });
    return values;
  }

  function clearLogForm(movement) {
    movement.metrics.forEach((metric) => {
      const input = document.getElementById(`log-${metric}`);
      if (input) input.value = "";
    });
    els.logNotes.value = "";
  }

  function saveMovement() {
    const selectedMetrics = Array.from(document.querySelectorAll('input[name="metric"]:checked'))
      .map((input) => input.value);

    if (!selectedMetrics.length) {
      alert("Choose at least one field to track for this exercise.");
      return;
    }

    const movement = {
      id: els.movementId.value || makeId(),
      name: els.movementName.value.trim(),
      category: els.movementCategory.value.trim(),
      primaryMetric: els.movementPrimaryMetric.value,
      metrics: selectedMetrics,
      favorite: els.movementFavorite.checked
    };

    if (!movement.name) return;

    const existingIndex = state.movements.findIndex((item) => item.id === movement.id);
    if (existingIndex >= 0) {
      state.movements[existingIndex] = movement;
    } else {
      state.movements.push(movement);
      els.logMovementSelect.value = movement.id;
      els.progressMovementSelect.value = movement.id;
    }

    saveState();
    resetMovementForm();
    renderAll();
    showToast("Exercise saved");
  }

  function toggleFavorite(id) {
    const movement = getMovement(id);
    if (!movement) return;
    movement.favorite = !movement.favorite;
    saveState();
    renderQuickButtons();
    renderMovementList();
    renderMovementPicker();
  }

  function editMovement(id) {
    const movement = getMovement(id);
    if (!movement) return;

    els.movementId.value = movement.id;
    els.movementName.value = movement.name;
    els.movementCategory.value = movement.category || "";
    els.movementPrimaryMetric.value = movement.primaryMetric;
    els.movementFavorite.checked = Boolean(movement.favorite);
    document.querySelectorAll('input[name="metric"]').forEach((input) => {
      input.checked = movement.metrics.includes(input.value);
    });
    els.movementName.focus();
  }

  function resetMovementForm() {
    els.movementId.value = "";
    els.movementForm.reset();
    ["sets", "reps", "weight"].forEach((metric) => {
      const input = document.querySelector(`input[name="metric"][value="${metric}"]`);
      if (input) input.checked = true;
    });
    els.movementPrimaryMetric.value = "estimatedMax";
    els.movementFavorite.checked = false;
  }

  function deleteMovement(id) {
    const movement = getMovement(id);
    if (!movement) return;

    const logCount = state.logs.filter((log) => log.movementId === id).length;
    const message = logCount
      ? `Delete ${movement.name} and its ${logCount} saved result(s)?`
      : `Delete ${movement.name}?`;

    if (!confirm(message)) return;

    state.movements = state.movements.filter((item) => item.id !== id);
    state.logs = state.logs.filter((log) => log.movementId !== id);
    saveState();
    renderAll();
  }

  function addOrSelectBenchmark(name) {
    const existing = state.movements.find((movement) => movement.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setView("track");
      selectMovement(existing.id);
      return;
    }

    const benchmark = benchmarkWorkouts.find((item) => item.name === name);
    const movement = {
      id: makeId(),
      name: benchmark.name,
      category: "Benchmark",
      primaryMetric: benchmark.primaryMetric,
      metrics: benchmark.metrics,
      favorite: true
    };
    state.movements.push(movement);
    saveState();
    renderAll();
    setView("track");
    selectMovement(movement.id);
    showToast(`${name} added to exercises`);
  }

  function duplicatePreviousWorkout() {
    const movement = currentLogMovement();
    const previous = movement ? latestLogForMovement(movement.id) : activeLogs()[0];
    if (!previous) {
      showToast("No previous workout to duplicate yet");
      return;
    }
    if (movement && previous.movementId !== movement.id) {
      els.logMovementSelect.value = previous.movementId;
      renderLogFields(false);
    }
    fillFromLog(previous);
  }

  function addAthlete() {
    const name = els.athleteName.value.trim();
    if (!name) return;
    const athlete = { id: makeId(), name };
    state.athletes.push(athlete);
    state.activeAthleteId = athlete.id;
    els.athleteName.value = "";
    saveState();
    renderAll();
    showToast(`${name} added`);
  }

  function renderLogList(container, logs, allowDelete) {
    container.innerHTML = "";

    if (!logs.length) {
      container.innerHTML = '<p class="empty-state">No results logged yet.</p>';
      return;
    }

    logs.forEach((log) => {
      const movement = getMovement(log.movementId);
      const currentValue = movement ? metricValue(movement, log) : NaN;
      const previousBest = Number.isFinite(log.previousBest)
        ? log.previousBest
        : getBestBeforeLog(movement, log);
      const isPr = movement && isNewBest(movement, currentValue, previousBest);
      const athlete = getAthlete(log.athleteId);
      const card = document.createElement("article");
      card.className = "result-card";
      card.innerHTML = `
        <div>
          <h3>${escapeHtml(movement ? movement.name : "Deleted exercise")} ${isPr ? '<span class="pr-badge">PR</span>' : ""}</h3>
          <div class="result-values">${formatValuePills(log)}</div>
          <p class="result-meta">${formatDate(log.date)} &middot; ${escapeHtml(athlete.name)} &middot; Effort ${log.effort}/10</p>
          ${movement && Number.isFinite(currentValue) ? `<p class="result-meta">Current ${formatMetricValue(movement, currentValue)} &middot; Previous best ${formatMetricValue(movement, previousBest)}</p>` : ""}
          ${log.notes ? `<p class="result-meta">${escapeHtml(log.notes)}</p>` : ""}
        </div>
      `;

      if (allowDelete) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Delete";
        button.addEventListener("click", () => deleteLog(log.id));
        card.appendChild(button);
      }

      container.appendChild(card);
    });
  }

  function deleteLog(id) {
    if (!confirm("Delete this workout result?")) return;
    state.logs = state.logs.filter((log) => log.id !== id);
    saveState();
    renderAll();
  }

  function exportBackup() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workout-tracker-backup-${localDate()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = normalizeState(JSON.parse(reader.result));
        saveState();
        applySettings();
        renderAll();
        showToast("Backup imported");
      } catch (error) {
        alert("That backup file could not be imported.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function clearAllData() {
    if (!confirm("Clear every athlete, exercise, and workout result?")) return;
    state = normalizeState(null);
    saveState();
    applySettings();
    renderAll();
  }

  function drawChart(movement, logs) {
    const canvas = els.progressChart;
    const panel = canvas.parentElement;
    const ratio = window.devicePixelRatio || 1;
    const cssWidth = Math.max(panel.clientWidth - 32, 280);
    const cssHeight = 270;
    canvas.width = Math.round(cssWidth * ratio);
    canvas.height = Math.round(cssHeight * ratio);
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    chartPoints = [];

    const styles = getComputedStyle(document.body);
    ctx.fillStyle = styles.getPropertyValue("--surface").trim();
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    if (!movement || logs.length < 2) {
      drawEmptyChart(ctx, cssWidth, cssHeight, "Log this exercise twice to see a chart.");
      return;
    }

    const values = logs
      .map((log) => ({ log, value: metricValue(movement, log) }))
      .filter((point) => Number.isFinite(point.value));

    if (values.length < 2) {
      drawEmptyChart(ctx, cssWidth, cssHeight, "Not enough numeric results yet.");
      return;
    }

    const padding = { top: 28, right: 18, bottom: 46, left: 42 };
    const min = Math.min(...values.map((point) => point.value));
    const max = Math.max(...values.map((point) => point.value));
    const range = max - min || 1;
    const accent = styles.getPropertyValue("--accent").trim();
    const line = styles.getPropertyValue("--line").trim();
    const muted = styles.getPropertyValue("--muted").trim();
    const ink = styles.getPropertyValue("--ink").trim();

    ctx.strokeStyle = line;
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 3; i += 1) {
      const y = padding.top + i * ((cssHeight - padding.top - padding.bottom) / 3);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(cssWidth - padding.right, y);
      ctx.stroke();
    }

    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    values.forEach((point, index) => {
      const x = padding.left + (index / (values.length - 1)) * (cssWidth - padding.left - padding.right);
      const y = cssHeight - padding.bottom - ((point.value - min) / range) * (cssHeight - padding.top - padding.bottom);
      chartPoints.push({ x, y, value: point.value, log: point.log, movement });
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    chartPoints.forEach((point) => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = muted;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    chartPoints.forEach((point, index) => {
      if (index === 0 || index === chartPoints.length - 1 || chartPoints.length <= 4) {
        ctx.fillText(shortDate(point.log.date), point.x, cssHeight - 16);
      }
    });

    ctx.fillStyle = ink;
    ctx.font = "13px Arial";
    ctx.textAlign = "left";
    ctx.fillText(formatMetricValue(movement, max), padding.left, 18);
    ctx.fillText(formatMetricValue(movement, min), padding.left, cssHeight - 30);
  }

  function drawEmptyChart(ctx, width, height, message) {
    const muted = getComputedStyle(document.body).getPropertyValue("--muted").trim();
    ctx.fillStyle = muted;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, width / 2, height / 2);
  }

  function showChartTooltip(event) {
    if (!chartPoints.length) return;
    const rect = els.progressChart.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nearest = chartPoints
      .map((point) => ({ point, distance: Math.hypot(point.x - x, point.y - y) }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (!nearest || nearest.distance > 38) {
      els.chartTooltip.hidden = true;
      return;
    }

    const { point } = nearest;
    els.chartTooltip.innerHTML = `${formatDate(point.log.date)}<br>${formatMetricValue(point.movement, point.value)}`;
    els.chartTooltip.style.left = `${point.x + 16}px`;
    els.chartTooltip.style.top = `${point.y}px`;
    els.chartTooltip.hidden = false;
  }

  function getProgressStats(movement, logs) {
    if (!movement || !logs.length) {
      return { bestLabel: "--", previousBestLabel: "--", trendLabel: "--", trendClass: "" };
    }

    const values = logs.map((log) => metricValue(movement, log)).filter((value) => Number.isFinite(value));
    const current = values[values.length - 1];
    const previousValues = values.slice(0, -1);
    const best = getBestFromValues(movement, values);
    const previousBest = getBestFromValues(movement, previousValues);
    const trend = getTrend(movement, values);

    return {
      bestLabel: formatMetricValue(movement, best),
      previousBestLabel: formatMetricValue(movement, previousBest),
      trendLabel: trend.label,
      trendClass: trend.className,
      current
    };
  }

  function getTrend(movement, values) {
    if (values.length < 3) return { label: "Stable", className: "trend-badge" };
    const lastThree = values.slice(-3);
    const first = lastThree[0];
    const last = lastThree[lastThree.length - 1];
    const delta = movement.primaryMetric === "time" ? first - last : last - first;
    const threshold = Math.max(Math.abs(first) * 0.02, 0.5);
    if (delta > threshold) return { label: "Improving", className: "trend-badge good" };
    if (delta < -threshold) return { label: "Declining", className: "trend-badge warn" };
    return { label: "Stable", className: "trend-badge" };
  }

  function metricValue(movement, log) {
    const values = log.values || {};
    const weight = parseNumber(values.weight);
    const reps = parseNumber(values.reps);

    if (movement.primaryMetric === "estimatedMax") {
      if (!Number.isFinite(weight) || !Number.isFinite(reps)) return NaN;
      return Math.round(weight * (1 + reps / 30));
    }

    if (movement.primaryMetric === "time") return parseTime(values.time);
    return parseNumber(values[movement.primaryMetric]);
  }

  function isNewBest(movement, currentValue, previousBest) {
    if (!Number.isFinite(currentValue)) return false;
    if (!Number.isFinite(previousBest)) return true;
    return movement.primaryMetric === "time"
      ? currentValue < previousBest
      : currentValue > previousBest;
  }

  function getBestNumeric(movement, logs) {
    return getBestFromValues(movement, logs.map((log) => metricValue(movement, log)).filter(Number.isFinite));
  }

  function getBestBeforeLog(movement, log) {
    if (!movement) return NaN;
    const prior = logsForMovement(movement.id).filter((item) => item.createdAt < log.createdAt);
    return getBestNumeric(movement, prior);
  }

  function getBestFromValues(movement, values) {
    if (!movement || !values.length) return NaN;
    return movement.primaryMetric === "time" ? Math.min(...values) : Math.max(...values);
  }

  function formatMetricValue(movement, value) {
    if (!Number.isFinite(value)) return "--";
    if (movement.primaryMetric === "time") return formatSeconds(value);
    if (movement.primaryMetric === "distance") return `${round(value)} mi`;
    if (movement.primaryMetric === "weight" || movement.primaryMetric === "estimatedMax") {
      return `${round(value)} ${state.settings.units}`;
    }
    return String(round(value));
  }

  function formatValuePills(log) {
    return Object.entries(log.values || {})
      .filter((entry) => entry[1])
      .map(([key, value]) => `<span class="value-pill">${metricLabels[key]} ${escapeHtml(value)}</span>`)
      .join("") || '<span class="value-pill">No numbers entered</span>';
  }

  function formatPlainValues(log) {
    return Object.entries(log.values || {})
      .filter((entry) => entry[1])
      .map(([key, value]) => `${metricLabels[key]} ${value}`)
      .join(", ");
  }

  function formatMetricNames(movement) {
    return movement.metrics.map((metric) => metricLabels[metric]).join(", ");
  }

  function sortMovements(movements) {
    const recentRank = getRecentMovementRank();
    const usage = getMovementUsageMap();
    return movements.slice().sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      const aRecent = recentRank.has(a.id) ? recentRank.get(a.id) : 9999;
      const bRecent = recentRank.has(b.id) ? recentRank.get(b.id) : 9999;
      if (aRecent !== bRecent) return aRecent - bRecent;
      const usageCompare = (usage.get(b.id) || 0) - (usage.get(a.id) || 0);
      if (usageCompare) return usageCompare;
      return a.name.localeCompare(b.name);
    });
  }

  function searchableMovementText(movement) {
    return normalizeName(`${movement.name} ${movement.category} ${movement.metrics.join(" ")} ${(movement.aliases || []).join(" ")} ${exerciseDescription(movement)}`);
  }

  function getFilteredMovements(tab, query) {
    return sortMovements(state.movements)
      .filter((movement) => tabMatchesMovement(tab, movement))
      .filter((movement) => !query || searchableMovementText(movement).includes(query));
  }

  function tabMatchesMovement(tab, movement) {
    if (tab === "Favorites") return Boolean(movement.favorite);
    if (tab === "Recent") return getRecentMovementRank().has(movement.id);
    if (tab === "Strength") return ["Strength", "Olympic Lifting", "Dumbbell", "Kettlebell", "Machine"].includes(movement.category);
    if (tab === "Cardio") return ["Cardio", "Conditioning"].includes(movement.category);
    if (tab === "Benchmarks") return movement.category === "Benchmark";
    return true;
  }

  function getRecentMovementRank() {
    const rank = new Map();
    activeLogs().forEach((log) => {
      if (!rank.has(log.movementId)) rank.set(log.movementId, rank.size);
    });
    return rank;
  }

  function getMovementUsageMap() {
    const usage = new Map();
    activeLogs().forEach((log) => {
      usage.set(log.movementId, (usage.get(log.movementId) || 0) + 1);
    });
    return usage;
  }

  function getMostUsedMovements() {
    const usage = getMovementUsageMap();
    return state.movements
      .filter((movement) => usage.has(movement.id))
      .sort((a, b) => (usage.get(b.id) || 0) - (usage.get(a.id) || 0) || a.name.localeCompare(b.name));
  }

  function movementStandard(movement) {
    if (movement.primaryMetric === "time") return movement.metrics.includes("distance") ? "Time + distance" : "Time";
    if (movement.primaryMetric === "distance") return "Distance";
    if (movement.primaryMetric === "reps") return "Reps";
    if (movement.metrics.includes("weight")) return `${state.settings.units.toUpperCase()} + reps`;
    return formatMetricNames(movement);
  }

  function exerciseDescription(movement) {
    if (movement.description) return movement.description;
    if (movement.category === "Strength") return "Track sets, reps, and load for progressive strength work.";
    if (movement.category === "Olympic Lifting") return "Explosive barbell lift focused on speed, power, and technique.";
    if (movement.category === "Bodyweight") return "Body-control movement usually scored by quality reps.";
    if (movement.category === "Cardio") return "Aerobic effort tracked by time, distance, or calories.";
    if (movement.category === "Conditioning") return "Workout-style effort where pace, time, and notes matter.";
    if (movement.category === "Core") return "Midline strength movement for trunk control and stability.";
    if (movement.category === "Mobility") return "Range-of-motion drill tracked by time and consistency.";
    if (movement.category === "Plyometrics") return "Explosive jump or rebound movement for power.";
    if (movement.category === "Dumbbell") return "Dumbbell movement tracked by load, reps, and control.";
    if (movement.category === "Kettlebell") return "Kettlebell movement tracked by load, reps, and rhythm.";
    if (movement.category === "Machine") return "Machine-based lift tracked by load and reps.";
    if (movement.category === "Sports Performance") return "Athletic performance test for speed, power, or agility.";
    if (movement.category === "Benchmark") return "Named workout used to compare performance over time.";
    return "Custom movement saved in your exercise library.";
  }

  function exerciseIcon(movement) {
    return categoryIconText[movement.category] || "EX";
  }

  function badgeClass(movement) {
    return categoryBadgeClass[movement.category] || "custom";
  }

  function bindSwipe(card, movementId) {
    card.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      swipeStart = { id: movementId, x: event.clientX, y: event.clientY, card };
      card.setPointerCapture?.(event.pointerId);
    });

    card.addEventListener("pointermove", (event) => {
      if (!swipeStart || swipeStart.card !== card) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      if (Math.abs(dy) > Math.abs(dx)) return;
      const clamped = Math.max(-76, Math.min(76, dx));
      card.style.transform = `translateX(${clamped}px)`;
      card.classList.toggle("swiping-right", dx > 34);
      card.classList.toggle("swiping-left", dx < -34);
    });

    card.addEventListener("pointerup", (event) => finishSwipe(event, card, movementId));
    card.addEventListener("pointercancel", () => resetSwipeCard(card));
  }

  function finishSwipe(event, card, movementId) {
    if (!swipeStart || swipeStart.card !== card) return;
    const dx = event.clientX - swipeStart.x;
    resetSwipeCard(card);
    if (dx > 70) {
      toggleFavorite(movementId);
      showToast("Favorite updated");
    } else if (dx < -70) {
      setView("track");
      selectMovement(movementId);
      closeMovementPicker();
      showToast("Ready to log");
    }
  }

  function resetSwipeCard(card) {
    swipeStart = null;
    card.style.transform = "";
    card.classList.remove("swiping-right", "swiping-left");
  }

  function mergeExerciseLibrary(movements) {
    const merged = movements.slice();
    const existingNames = new Set(merged.map((movement) => normalizeName(movement.name)));

    exerciseLibrary.forEach((exercise) => {
      const key = normalizeName(exercise.name);
      if (existingNames.has(key)) return;
      existingNames.add(key);
      merged.push({
        id: makeId(),
        name: exercise.name,
        category: exercise.category,
        primaryMetric: exercise.primaryMetric,
        metrics: exercise.metrics,
        favorite: false,
        builtIn: true,
        aliases: exercise.aliases || aliasesFor(exercise.name),
        description: exercise.description || ""
      });
    });

    return merged;
  }

  function strength(names) {
    return names.map((name) => libraryExercise(name, "Strength", ["sets", "reps", "weight"], "estimatedMax"));
  }

  function olympic(names) {
    return names.map((name) => libraryExercise(name, "Olympic Lifting", ["sets", "reps", "weight"], "estimatedMax"));
  }

  function bodyweight(names) {
    return names.map((name) => libraryExercise(name, "Bodyweight", ["reps"], "reps"));
  }

  function cardio(names) {
    return names.map((name) => libraryExercise(name, "Cardio", ["time", "distance"], "time"));
  }

  function conditioning(names) {
    return names.map((name) => libraryExercise(name, "Conditioning", ["time"], "time"));
  }

  function core(names) {
    return names.map((name) => {
      const isHold = /plank|hold/i.test(name);
      return libraryExercise(name, "Core", isHold ? ["time"] : ["reps"], isHold ? "time" : "reps");
    });
  }

  function mobility(names) {
    return names.map((name) => libraryExercise(name, "Mobility", ["time"], "time"));
  }

  function plyometrics(names) {
    return names.map((name) => libraryExercise(name, "Plyometrics", ["reps", "distance"], "distance"));
  }

  function dumbbell(names) {
    return names.map((name) => libraryExercise(name, "Dumbbell", ["sets", "reps", "weight"], "estimatedMax"));
  }

  function kettlebell(names) {
    return names.map((name) => libraryExercise(name, "Kettlebell", ["sets", "reps", "weight"], "estimatedMax"));
  }

  function machine(names) {
    return names.map((name) => libraryExercise(name, "Machine", ["sets", "reps", "weight"], "weight"));
  }

  function sportsPerformance(names) {
    return names.map((name) => {
      if (/time|sprint|shuttle|agility/i.test(name)) return libraryExercise(name, "Sports Performance", ["time", "distance"], "time");
      if (/sled/i.test(name)) return libraryExercise(name, "Sports Performance", ["time", "distance", "weight"], "time");
      return libraryExercise(name, "Sports Performance", ["distance"], "distance");
    });
  }

  function libraryExercise(name, category, metrics, primaryMetric) {
    return {
      name,
      category,
      metrics,
      primaryMetric,
      aliases: aliasesFor(name),
      description: defaultDescription(category)
    };
  }

  function aliasesFor(name) {
    const aliases = aliasMap[name] || [];
    const cleanMatch = /clean/i.test(name) ? ["clean"] : [];
    const snatchMatch = /snatch/i.test(name) ? ["snatch"] : [];
    return [...new Set([...aliases, ...cleanMatch, ...snatchMatch])];
  }

  function defaultDescription(category) {
    const movement = { category };
    return exerciseDescription(movement);
  }

  function currentLogMovement() {
    return getMovement(els.logMovementSelect.value) || state.movements[0];
  }

  function currentProgressMovement() {
    return getMovement(els.progressMovementSelect.value) || state.movements[0];
  }

  function activeAthlete() {
    return getAthlete(state.activeAthleteId);
  }

  function activeLogs() {
    return logsForAthlete(state.activeAthleteId);
  }

  function logsForAthlete(athleteId) {
    return state.logs
      .filter((log) => log.athleteId === athleteId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  function logsForMovement(movementId) {
    return activeLogs()
      .filter((log) => log.movementId === movementId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function latestLogForMovement(movementId) {
    return activeLogs().find((log) => log.movementId === movementId);
  }

  function getMovement(id) {
    return state.movements.find((movement) => movement.id === id);
  }

  function getAthlete(id) {
    return state.athletes.find((athlete) => athlete.id === id) || state.athletes[0] || { id: "", name: "Athlete" };
  }

  function ensureValidSelections() {
    if (!state.athletes.some((athlete) => athlete.id === state.activeAthleteId)) {
      state.activeAthleteId = state.athletes[0]?.id || makeId();
    }
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) return normalizeState(saved);
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }

    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
      if (legacy) return normalizeState(legacy);
    } catch (error) {
      localStorage.removeItem(LEGACY_KEY);
    }

    return normalizeState(null);
  }

  function normalizeState(input) {
    const base = structuredCloneSafe(defaultState);
    base.movements = mergeExerciseLibrary(base.movements);
    if (!input || !Array.isArray(input.movements) || !Array.isArray(input.logs)) return base;

    const athleteId = input.activeAthleteId || base.activeAthleteId;
    const athletes = Array.isArray(input.athletes) && input.athletes.length
      ? input.athletes
      : [{ id: athleteId, name: "My Profile" }];

    return {
      version: 2,
      activeAthleteId: athleteId,
      settings: {
        darkMode: Boolean(input.settings?.darkMode),
        units: input.settings?.units === "kg" ? "kg" : "lb",
        coachMode: Boolean(input.settings?.coachMode)
      },
      athletes,
      movements: mergeExerciseLibrary(input.movements.map((movement) => ({
        id: movement.id || makeId(),
        name: movement.name || "Exercise",
        category: movement.category || "",
        primaryMetric: movement.primaryMetric || "estimatedMax",
        metrics: Array.isArray(movement.metrics) && movement.metrics.length ? movement.metrics : ["sets", "reps", "weight"],
        favorite: Boolean(movement.favorite),
        builtIn: Boolean(movement.builtIn),
        aliases: Array.isArray(movement.aliases) ? movement.aliases : aliasesFor(movement.name),
        description: movement.description || ""
      }))),
      logs: input.logs.map((log, index) => ({
        id: log.id || makeId(),
        athleteId: log.athleteId || athleteId,
        movementId: log.movementId,
        date: log.date || localDate(),
        values: log.values || {},
        effort: Number(log.effort || 7),
        notes: log.notes || "",
        createdAt: Number(log.createdAt || Date.now() + index),
        resultValue: log.resultValue ?? null,
        previousBest: log.previousBest ?? null,
        pr: Boolean(log.pr)
      }))
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applySettings() {
    document.body.classList.toggle("dark", Boolean(state.settings.darkMode));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", state.settings.darkMode ? "#101812" : "#2f7d58");
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
  }

  function localDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  }

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function shortDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function isThisWeek(value) {
    const today = new Date();
    const date = new Date(`${value}T00:00:00`);
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return date >= start && date < end;
  }

  function parseNumber(value) {
    const number = Number(String(value || "").replace(/[^0-9.-]/g, ""));
    return Number.isFinite(number) ? number : NaN;
  }

  function parseTime(value) {
    const clean = String(value || "").trim();
    if (!clean) return NaN;
    if (clean.includes(":")) {
      const parts = clean.split(":").map(Number);
      if (parts.some((part) => !Number.isFinite(part))) return NaN;
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parseNumber(clean) * 60;
  }

  function formatSeconds(value) {
    const seconds = Math.round(value);
    const minutes = Math.floor(seconds / 60);
    const remainder = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function initials(name) {
    return String(name || "A")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "A";
  }

  function round(value) {
    return Math.round(value * 10) / 10;
  }

  function makeId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function debounce(fn, wait) {
    let timer = null;
    return function (...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeName(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
