(function () {
  const STORAGE_KEY = "workoutTracker.v5";
  const LEGACY_KEYS = ["workoutTracker.v4", "workoutTracker.v3", "workoutTracker.v2", "workoutTracker.v1"];

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

  const workoutCategories = [
    "All", "Favorites", "Recent", "Basketball Strength", "Explosive Power", "Vertical Jump",
    "Upper Body", "Lower Body", "Full Body", "Conditioning", "Recovery", "Core", "Mobility"
  ];
  const workoutDifficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const workoutDatabase = [
    workoutTemplate("db-lower-strength", "Basketball Lower Body Strength", "Basketball Strength", "Advanced", "60 min", ["Back Squat 5x5, rest 2-3 min", "Romanian Deadlift 4x8, rest 90 sec", "Bulgarian Split Squat 3x10 each leg", "Calf Raises 3x15", "Tibialis Raises 3x15"], "Heavy lower-body day for force production."),
    workoutTemplate("db-explosive-jump", "Explosive Jump Day", "Explosive Power", "Advanced", "50 min", ["Hang Clean 5x3, rest 2 min", "Box Jumps 5x5", "Depth Jumps 4x4", "Broad Jumps 4x5", "Sled Push 5 rounds"], "Keep every rep fast and crisp."),
    workoutTemplate("db-upper-power", "Upper Body Power", "Upper Body", "Intermediate", "55 min", ["Bench Press 5x5", "Pull-Ups 4xMax", "Dumbbell Bench 3x10", "Landmine Press 3x8 each side", "Farmer Carry 4 rounds"], "Build contact strength and upper-body power."),
    workoutTemplate("db-basketball-conditioning", "Basketball Conditioning", "Conditioning", "Advanced", "40 min", ["Suicides x10", "Assault Bike Intervals 8 rounds", "Tempo Runs 6x100m", "Agility Ladder 5 min", "Defensive Slides 6 rounds"], "Game-speed conditioning with full focus."),
    workoutTemplate("db-core-stability", "Core & Stability", "Core", "Beginner", "30 min", ["Plank 3x45 sec", "Side Plank 3x30 sec each", "Pallof Press 3x12", "Russian Twists 3x20", "Hanging Leg Raises 3x10"], "Brace hard and move with control."),
    workoutTemplate("db-vertical-base", "Vertical Jump Base", "Vertical Jump", "Intermediate", "45 min", ["Trap Bar Deadlift 4x5", "Split Squat 3x8 each", "Pogo Jumps 4x20", "Approach Jumps 5x3", "Calf Iso Holds 3x30 sec"], "Strength plus elastic ankle work."),
    workoutTemplate("db-speed-strength", "Speed Strength Primer", "Explosive Power", "Intermediate", "35 min", ["Power Clean 6x2", "Med Ball Chest Pass 4x5", "Med Ball Slam 4x6", "Band-Resisted Jumps 4x4", "Sprint Starts 6x10m"], "Low volume, high intent."),
    workoutTemplate("db-upper-hypertrophy", "Upper Body Builder", "Upper Body", "Intermediate", "50 min", ["Incline Bench Press 4x8", "Seated Row 4x10", "Dumbbell Shoulder Press 3x10", "Lat Pulldown 3x12", "Push-Ups 3xMax"], "Steady accessory work for durability."),
    workoutTemplate("db-lower-accessory", "Lower Body Accessories", "Lower Body", "Beginner", "40 min", ["Goblet Squat 4x10", "Single-Leg RDL 3x10 each", "Step-Ups 3x10 each", "Hamstring Curl 3x12", "Wall Sit 3x45 sec"], "Clean reps and balance side to side."),
    workoutTemplate("db-full-body-strength", "Full Body Strength", "Full Body", "Intermediate", "55 min", ["Front Squat 4x5", "Bench Press 4x6", "Pull-Ups 4xMax", "Kettlebell Swing 4x12", "Farmer Carry 3 rounds"], "Simple full-body strength day."),
    workoutTemplate("db-recovery-flow", "Recovery Flow", "Recovery", "Beginner", "25 min", ["Easy Bike 8 min", "Couch Stretch 2 min each", "Hamstring Stretch 2 min each", "Thoracic Rotation 2x10", "Foam Rolling 6 min"], "Keep it easy and leave fresher."),
    workoutTemplate("db-hip-mobility", "Hip & Ankle Mobility", "Mobility", "Beginner", "22 min", ["Ankle Mobility 3x10 each", "Hip Flexor Stretch 2 min each", "90/90 Switches 3x8", "Cossack Squat 3x6 each", "Deep Squat Hold 3x45 sec"], "Great before lower-body training."),
    workoutTemplate("db-core-rotation", "Rotational Core", "Core", "Intermediate", "32 min", ["Cable Chop 3x12 each", "Pallof Press 3x12 each", "Med Ball Rotational Throw 4x5 each", "Dead Bug 3x10 each", "Side Plank Reach 3x8 each"], "Control rotation before adding speed."),
    workoutTemplate("db-court-repeat", "Court Repeat Sprints", "Conditioning", "Intermediate", "35 min", ["Warm-Up Jog 5 min", "Full-Court Sprint 10 reps", "Backpedal to Sprint 6 reps", "Defensive Slide Shuttle 6 reps", "Cooldown Walk 5 min"], "Rest enough to keep quality high."),
    workoutTemplate("db-jump-landing", "Jump Landing Control", "Vertical Jump", "Beginner", "35 min", ["Snap Downs 4x5", "Box Jump 4x4", "Single-Leg Landing 3x5 each", "Lateral Bounds 3x6 each", "Calf Raises 3x15"], "Quiet landings, strong positions."),
    workoutTemplate("db-heavy-posterior", "Posterior Chain Strength", "Lower Body", "Advanced", "55 min", ["Deadlift 5x3", "Romanian Deadlift 4x6", "Hip Thrust 4x8", "Nordic Curl 3x5", "Back Extension 3x12"], "Heavy hinge day for power."),
    workoutTemplate("db-push-pull", "Push Pull Upper", "Upper Body", "Beginner", "42 min", ["Dumbbell Bench Press 4x10", "One-Arm Dumbbell Row 4x10 each", "Strict Press 3x8", "Chin-Ups 3xMax", "Face Pulls 3x15"], "Balanced upper-body session."),
    workoutTemplate("db-total-athlete", "Total Athlete Circuit", "Full Body", "Intermediate", "38 min", ["Kettlebell Swing 4x12", "Push-Ups 4x15", "Goblet Squat 4x12", "Battle Ropes 4x30 sec", "Plank 4x45 sec"], "Move well, rest 60-90 sec."),
    workoutTemplate("db-conditioning-engine", "Engine Builder", "Conditioning", "Beginner", "30 min", ["Bike 5 min easy", "Bike 10x30 sec hard / 60 sec easy", "Row 5 min steady", "Jump Rope 5 min", "Breathing Reset 3 min"], "Low impact conditioning."),
    workoutTemplate("db-basketball-strength-a", "Basketball Strength A", "Basketball Strength", "Intermediate", "50 min", ["Front Squat 4x5", "Bench Press 4x5", "Dumbbell Row 4x10", "Split Squat 3x8 each", "Pallof Press 3x12"], "A balanced in-season strength option."),
    workoutTemplate("db-basketball-strength-b", "Basketball Strength B", "Basketball Strength", "Intermediate", "48 min", ["Trap Bar Deadlift 4x4", "Landmine Press 4x8", "Pull-Ups 4xMax", "Step-Ups 3x8 each", "Farmer Carry 3 rounds"], "Strength without too much soreness."),
    workoutTemplate("db-power-clean-day", "Power Clean Technique", "Explosive Power", "Advanced", "45 min", ["Clean Pull 4x3", "Hang Clean 6x2", "Front Squat 3x3", "Box Jump 4x3", "Med Ball Slam 4x5"], "Stop sets before speed drops."),
    workoutTemplate("db-first-step", "First Step Quickness", "Explosive Power", "Intermediate", "30 min", ["Wall Drill 3x10 each", "Falling Starts 6x10m", "Lateral Push-Off 4x5 each", "Resisted Sprint 6x10m", "Pogo Jumps 3x20"], "Short, sharp acceleration work."),
    workoutTemplate("db-single-leg-strength", "Single-Leg Strength", "Lower Body", "Intermediate", "45 min", ["Bulgarian Split Squat 4x8 each", "Single-Leg RDL 4x8 each", "Lateral Lunge 3x10 each", "Step-Down 3x8 each", "Calf Raise 3x15 each"], "Build control and knee strength."),
    workoutTemplate("db-shoulder-care", "Shoulder Care", "Recovery", "Beginner", "24 min", ["Band Pull-Aparts 3x20", "External Rotation 3x15 each", "Scap Push-Ups 3x12", "Wall Slides 3x10", "Child's Pose Breathing 2 min"], "Easy prep for upper-body days."),
    workoutTemplate("db-mobility-reset", "Full Body Mobility Reset", "Mobility", "Beginner", "28 min", ["World's Greatest Stretch 2x5 each", "Thoracic Rotation 2x10 each", "Couch Stretch 2 min each", "Ankle Rocks 2x15 each", "Deep Squat Breathing 2 min"], "Use on off days or after practice."),
    workoutTemplate("db-abs-finisher", "10-Min Core Finisher", "Core", "Beginner", "10 min", ["Hollow Hold 3x30 sec", "Bicycle Crunches 3x20", "Leg Raises 3x12", "Plank Shoulder Taps 3x20", "Dead Bug 2x10 each"], "Quick finisher after lifting."),
    workoutTemplate("db-full-body-power", "Full Body Power", "Full Body", "Advanced", "50 min", ["Power Snatch 5x2", "Push Press 5x3", "Jump Squat 4x5", "Pull-Ups 4xMax", "Sled Push 6 rounds"], "Explosive full-body session."),
    workoutTemplate("db-tempo-lower", "Tempo Lower Body", "Lower Body", "Intermediate", "46 min", ["Tempo Back Squat 4x6", "Romanian Deadlift 3x8", "Walking Lunges 3x12 each", "Leg Curl 3x12", "Tibialis Raises 3x20"], "Slow eccentrics, strong positions."),
    workoutTemplate("db-game-day-primer", "Game Day Primer", "Recovery", "Beginner", "18 min", ["Easy Bike 4 min", "Dynamic Warm-Up 5 min", "Pogo Jumps 3x10", "Approach Jumps 3x2", "Band Pull-Aparts 2x15"], "Feel springy, not tired.")
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

  const defaultState = {
    version: 5,
    settings: {
      darkMode: false,
      units: "lb"
    },
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
    workouts: [],
    workoutFavorites: [],
    workoutHistory: [],
    logs: []
  };

  let state = loadState();
  let activeView = "track";
  let chartPoints = [];
  let toastTimer = null;
  let activeCategoryFilter = "All";
  let activeLibraryTab = "All";
  let activePickerTab = "All";
  let activeWorkoutCategory = "All";
  let activeWorkoutDifficulty = "All";
  let activeDatabaseWorkoutId = null;
  let workoutTimer = {
    kind: null,
    startedAt: null,
    duration: 0,
    intervalId: null
  };
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
      "quickExerciseButtons", "logMovementSelect", "logForm",
      "logDate", "logFields", "autofillSuggestions", "logEffort", "effortValue",
      "logNotes", "duplicateLastWorkout", "recentResults", "progressMovementSelect",
      "progressBest", "progressPreviousBest", "progressTrend", "progressChart",
      "chartTooltip", "movementHistory", "movementForm", "movementId",
      "movementName", "movementCategory", "movementPrimaryMetric", "movementFavorite",
      "cancelMovementEdit", "benchmarkButtons", "workoutBuilderDetails", "workoutForm", "workoutId", "workoutName",
      "workoutFormat", "workoutRounds", "workoutMovements", "cancelWorkoutEdit", "workoutList",
      "databaseWorkoutDetail", "workoutBrowse", "workoutSearch", "workoutDifficultyFilters",
      "workoutCategoryFilters", "favoriteWorkoutChips", "recentWorkoutChips", "databaseWorkoutList",
      "movementList", "darkModeToggle", "unitSelect", "exportData",
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
    els.workoutSearch.addEventListener("input", renderWorkoutDatabase);

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

    els.workoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveWorkout();
    });

    els.cancelWorkoutEdit.addEventListener("click", resetWorkoutForm);

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
    renderSummary();
    renderMovementSelects();
    renderQuickButtons();
    renderLogFields(false);
    renderAutofillSuggestions();
    renderRecentResults();
    renderWorkoutDatabase();
    renderBenchmarkButtons();
    renderWorkoutList();
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
    if (view === "workouts") renderWorkoutDatabase();
  }

  function renderSummary() {
    const logs = activeLogs();
    const completedWorkouts = state.workoutHistory || [];
    els.totalSessions.textContent = logs.length + completedWorkouts.length;
    els.thisWeekSessions.textContent = logs.filter((log) => isThisWeek(log.date)).length + completedWorkouts.filter((entry) => isThisWeek(entry.date)).length;
    els.trackedMovements.textContent = state.movements.length;
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

    if (usesSetLogger(movement)) {
      els.logFields.appendChild(renderSetLogger(recent));
    }

    movement.metrics.forEach((metric) => {
      if (usesSetLogger(movement) && ["sets", "reps", "weight"].includes(metric)) return;
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

    const addSetButton = els.logFields.querySelector("[data-action='add-set']");
    if (addSetButton) {
      addSetButton.addEventListener("click", () => addSetRow());
    }

    if (shouldFocus) {
      requestAnimationFrame(() => {
        const firstInput = els.logFields.querySelector("input");
        if (firstInput) firstInput.focus();
      });
    }
  }

  function renderSetLogger(recent) {
    const wrapper = document.createElement("section");
    wrapper.className = "set-logger";
    wrapper.innerHTML = `
      <div class="set-logger-heading">
        <span>Sets</span>
        <button class="small-button" type="button" data-action="add-set">Add Set</button>
      </div>
      <div class="set-row set-row-labels" aria-hidden="true">
        <span>Set</span>
        <span>Reps</span>
        <span>Weight</span>
      </div>
      <div class="set-rows" id="setRows"></div>
    `;

    const recentSets = Array.isArray(recent?.values?.setDetails) ? recent.values.setDetails : [];
    const starterSets = recentSets.length ? recentSets : [{ reps: "", weight: "" }, { reps: "", weight: "" }, { reps: "", weight: "" }];
    starterSets.forEach((set) => appendSetRow(wrapper.querySelector("#setRows"), set));
    return wrapper;
  }

  function addSetRow() {
    const rows = document.getElementById("setRows");
    if (!rows) return;
    appendSetRow(rows, { reps: "", weight: "" });
    const lastInput = rows.querySelector(".set-row:last-child input");
    if (lastInput) lastInput.focus();
  }

  function appendSetRow(container, set) {
    const rowNumber = container.querySelectorAll(".set-row").length + 1;
    const row = document.createElement("div");
    row.className = "set-row";
    row.innerHTML = `
      <span>${rowNumber}</span>
      <input type="text" inputmode="decimal" data-set-reps placeholder="8" value="${escapeHtml(set.reps || "")}" autocomplete="off">
      <input type="text" inputmode="decimal" data-set-weight placeholder="135" value="${escapeHtml(set.weight || "")}" autocomplete="off">
    `;
    container.appendChild(row);
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
    if (Array.isArray(log.values?.setDetails) && document.getElementById("setRows")) {
      const rows = document.getElementById("setRows");
      rows.innerHTML = "";
      log.values.setDetails.forEach((set) => appendSetRow(rows, set));
    }
    Object.entries(log.values || {}).forEach(([metric, value]) => {
      if (metric === "setDetails") return;
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

  function renderWorkoutDatabase() {
    renderWorkoutFilters();
    renderWorkoutShortcutChips();
    renderDatabaseWorkoutList();
    renderDatabaseWorkoutDetail();
  }

  function renderWorkoutFilters() {
    els.workoutDifficultyFilters.innerHTML = workoutDifficulties.map((difficulty) => `
      <button class="library-tab ${difficulty === activeWorkoutDifficulty ? "is-active" : ""}" type="button" data-workout-difficulty="${difficulty}">${difficulty}</button>
    `).join("");
    els.workoutCategoryFilters.innerHTML = workoutCategories.map((category) => `
      <button class="chip ${category === activeWorkoutCategory ? "is-active" : ""}" type="button" data-workout-category="${category}">${category}</button>
    `).join("");

    els.workoutDifficultyFilters.querySelectorAll("[data-workout-difficulty]").forEach((button) => {
      button.addEventListener("click", () => {
        activeWorkoutDifficulty = button.dataset.workoutDifficulty;
        renderWorkoutDatabase();
      });
    });

    els.workoutCategoryFilters.querySelectorAll("[data-workout-category]").forEach((button) => {
      button.addEventListener("click", () => {
        activeWorkoutCategory = button.dataset.workoutCategory;
        renderWorkoutDatabase();
      });
    });
  }

  function renderWorkoutShortcutChips() {
    const favorites = state.workoutFavorites.map(getDatabaseWorkout).filter(Boolean).slice(0, 10);
    const recentIds = [...new Set(state.workoutHistory.slice().sort((a, b) => b.completedAt - a.completedAt).map((entry) => entry.workoutId))];
    const recent = recentIds.map(getDatabaseWorkout).filter(Boolean).slice(0, 10);

    els.favoriteWorkoutChips.innerHTML = favorites.length
      ? favorites.map((workout) => workoutChip(workout)).join("")
      : '<p class="empty-state">Favorite workouts appear here.</p>';
    els.recentWorkoutChips.innerHTML = recent.length
      ? recent.map((workout) => workoutChip(workout)).join("")
      : '<p class="empty-state">Completed workouts appear here.</p>';

    [els.favoriteWorkoutChips, els.recentWorkoutChips].forEach((container) => {
      container.querySelectorAll("[data-database-workout]").forEach((button) => {
        button.addEventListener("click", () => openDatabaseWorkout(button.dataset.databaseWorkout));
      });
    });
  }

  function renderDatabaseWorkoutList() {
    const workouts = getFilteredDatabaseWorkouts();
    if (!workouts.length) {
      els.databaseWorkoutList.innerHTML = '<p class="empty-state">No workouts match those filters.</p>';
      return;
    }

    els.databaseWorkoutList.innerHTML = workouts.map((workout) => {
      const completed = state.workoutHistory.filter((entry) => entry.workoutId === workout.id).length;
      const isFavorite = state.workoutFavorites.includes(workout.id);
      return `
        <article class="database-workout-card">
          <button type="button" class="database-workout-main" data-open-workout="${workout.id}">
            <span class="category-badge ${difficultyClass(workout.difficulty)}">${escapeHtml(workout.difficulty)}</span>
            <strong>${escapeHtml(workout.name)}</strong>
            <span>${escapeHtml(workout.category)} &middot; ${escapeHtml(workout.duration)} &middot; ${completed} completed</span>
          </button>
          <button class="favorite-button ${isFavorite ? "is-on" : ""}" type="button" data-favorite-workout="${workout.id}" aria-label="Favorite workout">${isFavorite ? "Pin" : "+"}</button>
        </article>
      `;
    }).join("");

    els.databaseWorkoutList.querySelectorAll("[data-open-workout]").forEach((button) => {
      button.addEventListener("click", () => openDatabaseWorkout(button.dataset.openWorkout));
    });
    els.databaseWorkoutList.querySelectorAll("[data-favorite-workout]").forEach((button) => {
      button.addEventListener("click", () => toggleDatabaseWorkoutFavorite(button.dataset.favoriteWorkout));
    });
  }

  function renderDatabaseWorkoutDetail() {
    const workout = getDatabaseWorkout(activeDatabaseWorkoutId);
    if (!workout) {
      els.databaseWorkoutDetail.hidden = true;
      els.workoutBrowse.hidden = false;
      stopWorkoutTimer();
      return;
    }

    els.workoutBrowse.hidden = true;
    els.databaseWorkoutDetail.hidden = false;
    const completed = state.workoutHistory.filter((entry) => entry.workoutId === workout.id).length;
    const isFavorite = state.workoutFavorites.includes(workout.id);
    els.databaseWorkoutDetail.innerHTML = `
      <button class="small-button detail-back-button" type="button" data-action="back-workouts">Back</button>
      <div class="section-heading compact">
        <div>
          <h2>${escapeHtml(workout.name)}</h2>
          <p>${escapeHtml(workout.category)} &middot; ${escapeHtml(workout.difficulty)} &middot; ${escapeHtml(workout.duration)} &middot; ${completed} completed</p>
        </div>
      </div>
      ${workout.notes ? `<p class="workout-note">${escapeHtml(workout.notes)}</p>` : ""}
      <div class="workout-detail-actions">
        <button class="primary-button" type="button" data-action="start-workout">Start Workout</button>
        <button class="secondary-button" type="button" data-action="rest-timer">Rest 60s</button>
        <button class="secondary-button" type="button" data-action="favorite-workout">${isFavorite ? "Unfavorite" : "Favorite"}</button>
      </div>
      <div class="workout-timer" id="workoutTimerDisplay">Ready</div>
      <div class="workout-exercise-list">
        ${workout.exercises.map((exercise, index) => `
          <label class="workout-exercise-row">
            <input type="checkbox" data-workout-check="${index}">
            <span>
              <strong>${escapeHtml(exercise.name)}</strong>
              <small>${escapeHtml(exercise.prescription)}</small>
            </span>
          </label>
        `).join("")}
      </div>
      <label class="field">
        <span>Result or notes</span>
        <textarea id="databaseWorkoutResult" rows="3" placeholder="Finished all sets, weights used, time, how it felt..."></textarea>
      </label>
      <button class="primary-button" type="button" data-action="complete-workout">Complete Workout</button>
    `;

    els.databaseWorkoutDetail.querySelector("[data-action='back-workouts']").addEventListener("click", closeDatabaseWorkout);
    els.databaseWorkoutDetail.querySelector("[data-action='start-workout']").addEventListener("click", startWorkoutTimer);
    els.databaseWorkoutDetail.querySelector("[data-action='rest-timer']").addEventListener("click", () => startRestTimer(60));
    els.databaseWorkoutDetail.querySelector("[data-action='favorite-workout']").addEventListener("click", () => toggleDatabaseWorkoutFavorite(workout.id));
    els.databaseWorkoutDetail.querySelector("[data-action='complete-workout']").addEventListener("click", () => completeDatabaseWorkout(workout.id));
    updateWorkoutTimerDisplay();
  }

  function openDatabaseWorkout(id) {
    activeDatabaseWorkoutId = id;
    stopWorkoutTimer();
    renderWorkoutDatabase();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeDatabaseWorkout() {
    activeDatabaseWorkoutId = null;
    stopWorkoutTimer();
    renderWorkoutDatabase();
  }

  function getFilteredDatabaseWorkouts() {
    const query = normalizeName(els.workoutSearch.value);
    return workoutDatabase
      .filter((workout) => {
        if (activeWorkoutCategory === "Favorites") return state.workoutFavorites.includes(workout.id);
        if (activeWorkoutCategory === "Recent") return state.workoutHistory.some((entry) => entry.workoutId === workout.id);
        if (activeWorkoutCategory !== "All" && workout.category !== activeWorkoutCategory) return false;
        return true;
      })
      .filter((workout) => activeWorkoutDifficulty === "All" || workout.difficulty === activeWorkoutDifficulty)
      .filter((workout) => !query || searchableDatabaseWorkoutText(workout).includes(query))
      .sort((a, b) => {
        const aFav = state.workoutFavorites.includes(a.id);
        const bFav = state.workoutFavorites.includes(b.id);
        if (aFav !== bFav) return aFav ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  function toggleDatabaseWorkoutFavorite(id) {
    if (state.workoutFavorites.includes(id)) {
      state.workoutFavorites = state.workoutFavorites.filter((item) => item !== id);
    } else {
      state.workoutFavorites.push(id);
    }
    saveState();
    renderWorkoutDatabase();
  }

  function completeDatabaseWorkout(id) {
    const workout = getDatabaseWorkout(id);
    if (!workout) return;

    const checked = Array.from(els.databaseWorkoutDetail.querySelectorAll("[data-workout-check]"))
      .filter((input) => input.checked)
      .map((input) => Number(input.dataset.workoutCheck));
    const result = document.getElementById("databaseWorkoutResult")?.value.trim() || "";

    state.workoutHistory.push({
      id: makeId(),
      workoutId: workout.id,
      completedAt: Date.now(),
      date: localDate(),
      checked,
      result,
      elapsedSeconds: workoutTimer.kind === "workout" && workoutTimer.startedAt
        ? Math.max(0, Math.floor((Date.now() - workoutTimer.startedAt) / 1000))
        : null
    });

    saveState();
    stopWorkoutTimer();
    activeDatabaseWorkoutId = null;
    renderAll();
    setView("workouts");
    showToast("Workout complete!");
  }

  function startWorkoutTimer() {
    stopWorkoutTimer();
    workoutTimer = {
      kind: "workout",
      startedAt: Date.now(),
      duration: 0,
      intervalId: window.setInterval(updateWorkoutTimerDisplay, 1000)
    };
    updateWorkoutTimerDisplay();
  }

  function startRestTimer(seconds) {
    stopWorkoutTimer();
    workoutTimer = {
      kind: "rest",
      startedAt: Date.now(),
      duration: seconds,
      intervalId: window.setInterval(updateWorkoutTimerDisplay, 1000)
    };
    updateWorkoutTimerDisplay();
  }

  function stopWorkoutTimer() {
    if (workoutTimer.intervalId) window.clearInterval(workoutTimer.intervalId);
    workoutTimer = { kind: null, startedAt: null, duration: 0, intervalId: null };
  }

  function updateWorkoutTimerDisplay() {
    const display = document.getElementById("workoutTimerDisplay");
    if (!display) return;
    if (!workoutTimer.kind || !workoutTimer.startedAt) {
      display.textContent = "Ready";
      return;
    }

    const elapsed = Math.max(0, Math.floor((Date.now() - workoutTimer.startedAt) / 1000));
    if (workoutTimer.kind === "rest") {
      const remaining = Math.max(0, workoutTimer.duration - elapsed);
      display.textContent = remaining ? `Rest ${formatTimer(remaining)}` : "Rest done";
      if (!remaining) {
        window.clearInterval(workoutTimer.intervalId);
        workoutTimer.intervalId = null;
      }
      return;
    }

    display.textContent = `Workout ${formatTimer(elapsed)}`;
  }

  function workoutChip(workout) {
    return `<button class="chip" type="button" data-database-workout="${workout.id}">${escapeHtml(workout.name)}</button>`;
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

  function renderWorkoutList() {
    els.workoutList.innerHTML = "";

    if (!state.workouts.length) {
      els.workoutList.innerHTML = '<p class="empty-state">Save a workout like 4 rounds for time, then log it whenever you repeat it.</p>';
      return;
    }

    state.workouts.forEach((workout) => {
      const logs = logsForWorkout(workout.id);
      const best = getBestWorkoutResult(workout);
      const card = document.createElement("article");
      card.className = "workout-card";
      card.innerHTML = `
        <div>
          <h3>${escapeHtml(workout.name)}</h3>
          <p>${escapeHtml(workoutSummary(workout))}</p>
          <ol>${workout.movements.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>
          <p>${logs.length} logged${Number.isFinite(best) ? ` &middot; Best ${escapeHtml(formatWorkoutResult(workout, best))}` : ""}</p>
        </div>
        <div class="movement-actions">
          <button type="button" data-action="log">Log</button>
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      `;
      card.querySelector('[data-action="log"]').addEventListener("click", () => logWorkout(workout.id));
      card.querySelector('[data-action="edit"]').addEventListener("click", () => editWorkout(workout.id));
      card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteWorkout(workout.id));
      els.workoutList.appendChild(card);
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
    els.darkModeToggle.checked = state.settings.darkMode;
    els.unitSelect.value = state.settings.units;
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
    showToast(isPr ? "Saved! New PR." : "Saved!");
  }

  function collectLogValues(movement) {
    const values = {};
    if (usesSetLogger(movement)) {
      const setDetails = Array.from(document.querySelectorAll("#setRows .set-row"))
        .map((row) => ({
          reps: row.querySelector("[data-set-reps]")?.value.trim() || "",
          weight: row.querySelector("[data-set-weight]")?.value.trim() || ""
        }))
        .filter((set) => set.reps || set.weight);

      values.setDetails = setDetails;
      values.sets = setDetails.length ? String(setDetails.length) : "";
      values.reps = setDetails.map((set) => set.reps).filter(Boolean).join(", ");
      values.weight = setDetails.map((set) => set.weight).filter(Boolean).join(", ");
    }

    movement.metrics.forEach((metric) => {
      if (usesSetLogger(movement) && ["sets", "reps", "weight"].includes(metric)) return;
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
    if (usesSetLogger(movement)) {
      const rows = document.getElementById("setRows");
      if (rows) {
        rows.innerHTML = "";
        [{ reps: "", weight: "" }, { reps: "", weight: "" }, { reps: "", weight: "" }]
          .forEach((set) => appendSetRow(rows, set));
      }
    }
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

  function saveWorkout() {
    const movements = els.workoutMovements.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!els.workoutName.value.trim() || !movements.length) {
      alert("Add a workout name and at least one movement.");
      return;
    }

    const workout = {
      id: els.workoutId.value || makeId(),
      name: els.workoutName.value.trim(),
      format: els.workoutFormat.value,
      rounds: els.workoutRounds.value.trim(),
      movements,
      createdAt: Date.now()
    };

    const existingIndex = state.workouts.findIndex((item) => item.id === workout.id);
    if (existingIndex >= 0) {
      state.workouts[existingIndex] = { ...state.workouts[existingIndex], ...workout };
    } else {
      state.workouts.push(workout);
    }

    saveState();
    resetWorkoutForm();
    renderAll();
    showToast("Workout saved");
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

  function editWorkout(id) {
    const workout = getWorkout(id);
    if (!workout) return;

    els.workoutId.value = workout.id;
    els.workoutName.value = workout.name;
    els.workoutFormat.value = workout.format || "time";
    els.workoutRounds.value = workout.rounds || "";
    els.workoutMovements.value = (workout.movements || []).join("\n");
    els.workoutBuilderDetails.open = true;
    els.workoutName.focus();
  }

  function resetWorkoutForm() {
    els.workoutId.value = "";
    els.workoutForm.reset();
    els.workoutFormat.value = "time";
    els.workoutBuilderDetails.open = false;
  }

  function deleteWorkout(id) {
    const workout = getWorkout(id);
    if (!workout) return;

    const logCount = state.logs.filter((log) => log.workoutId === id).length;
    const message = logCount
      ? `Delete ${workout.name} and its ${logCount} saved result(s)?`
      : `Delete ${workout.name}?`;

    if (!confirm(message)) return;

    state.workouts = state.workouts.filter((item) => item.id !== id);
    state.logs = state.logs.filter((log) => log.workoutId !== id);
    saveState();
    renderAll();
  }

  function logWorkout(id) {
    const workout = getWorkout(id);
    if (!workout) return;

    const label = workout.format === "time"
      ? "Enter your finish time, like 12:34"
      : "Enter your result, like 7 rounds + 12 reps";
    const result = prompt(`${workout.name}\n${label}`);
    if (!result || !result.trim()) return;

    const notes = prompt("Any notes? Leave blank if not.") || "";
    const currentValue = workoutResultValue(workout, result);
    const previousBest = getBestWorkoutResult(workout);
    const isPr = isNewBestWorkout(workout, currentValue, previousBest);

    state.logs.push({
      id: makeId(),
      workoutId: workout.id,
      date: localDate(),
      values: { result: result.trim() },
      effort: 7,
      notes: notes.trim(),
      createdAt: Date.now(),
      resultValue: Number.isFinite(currentValue) ? currentValue : null,
      previousBest: Number.isFinite(previousBest) ? previousBest : null,
      pr: isPr
    });

    saveState();
    renderAll();
    showToast(isPr ? "Saved! New PR." : "Saved!");
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

  function renderLogList(container, logs, allowDelete) {
    container.innerHTML = "";

    if (!logs.length) {
      container.innerHTML = '<p class="empty-state">Start by choosing an exercise and logging your first result.</p>';
      return;
    }

    logs.forEach((log) => {
      const movement = getMovement(log.movementId);
      const workout = getWorkout(log.workoutId);
      const currentValue = movement ? metricValue(movement, log) : workout ? workoutResultValue(workout, log.values?.result) : NaN;
      const previousBest = Number.isFinite(log.previousBest)
        ? log.previousBest
        : movement ? getBestBeforeLog(movement, log) : getBestWorkoutBeforeLog(workout, log);
      const isPr = movement ? isNewBest(movement, currentValue, previousBest) : workout && isNewBestWorkout(workout, currentValue, previousBest);
      const title = movement ? movement.name : workout ? workout.name : "Deleted workout";
      const card = document.createElement("article");
      card.className = "result-card";
      card.innerHTML = `
        <div>
          <h3>${escapeHtml(title)} ${isPr ? '<span class="pr-badge">PR</span>' : ""}</h3>
          <div class="result-values">${formatValuePills(log)}</div>
          <p class="result-meta">${formatDate(log.date)} &middot; Effort ${log.effort}/10</p>
          ${movement && Number.isFinite(currentValue) ? `<p class="result-meta">Current ${formatMetricValue(movement, currentValue)} &middot; Previous best ${formatMetricValue(movement, previousBest)}</p>` : ""}
          ${workout && Number.isFinite(currentValue) ? `<p class="result-meta">Current ${escapeHtml(formatWorkoutResult(workout, currentValue))} &middot; Previous best ${escapeHtml(formatWorkoutResult(workout, previousBest))}</p>` : ""}
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
    if (!confirm("Clear every exercise, custom workout, and workout result?")) return;
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
    const setValues = bestSetValues(values);
    const weight = parseNumber(values.weight);
    const reps = parseNumber(values.reps);

    if (movement.primaryMetric === "estimatedMax") {
      if (setValues) return Math.round(setValues.weight * (1 + setValues.reps / 30));
      if (!Number.isFinite(weight) || !Number.isFinite(reps)) return NaN;
      return Math.round(weight * (1 + reps / 30));
    }

    if (movement.primaryMetric === "weight" && setValues) return setValues.weight;
    if (movement.primaryMetric === "reps" && setValues) return setValues.reps;
    if (movement.primaryMetric === "time") return parseTime(values.time);
    return parseNumber(values[movement.primaryMetric]);
  }

  function bestSetValues(values) {
    if (!Array.isArray(values?.setDetails)) return null;
    return values.setDetails.reduce((best, set) => {
      const reps = parseNumber(set.reps);
      const weight = parseNumber(set.weight);
      if (!Number.isFinite(reps) || !Number.isFinite(weight)) return best;
      const estimatedMax = weight * (1 + reps / 30);
      if (!best || estimatedMax > best.estimatedMax) return { reps, weight, estimatedMax };
      return best;
    }, null);
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

  function workoutResultValue(workout, result) {
    if (!workout || !result) return NaN;
    if (workout.format === "time") return parseTime(result);
    return parseNumber(result);
  }

  function getBestWorkoutResult(workout) {
    if (!workout) return NaN;
    const values = logsForWorkout(workout.id)
      .map((log) => workoutResultValue(workout, log.values?.result))
      .filter(Number.isFinite);
    if (!values.length) return NaN;
    return workout.format === "time" ? Math.min(...values) : Math.max(...values);
  }

  function getBestWorkoutBeforeLog(workout, log) {
    if (!workout) return NaN;
    const values = logsForWorkout(workout.id)
      .filter((item) => item.createdAt < log.createdAt)
      .map((item) => workoutResultValue(workout, item.values?.result))
      .filter(Number.isFinite);
    if (!values.length) return NaN;
    return workout.format === "time" ? Math.min(...values) : Math.max(...values);
  }

  function isNewBestWorkout(workout, currentValue, previousBest) {
    if (!Number.isFinite(currentValue)) return false;
    if (!Number.isFinite(previousBest)) return true;
    return workout.format === "time"
      ? currentValue < previousBest
      : currentValue > previousBest;
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

  function formatWorkoutResult(workout, value) {
    if (!Number.isFinite(value)) return "--";
    return workout.format === "time" ? formatSeconds(value) : String(round(value));
  }

  function formatValuePills(log) {
    if (Array.isArray(log.values?.setDetails) && log.values.setDetails.length) {
      return log.values.setDetails.map((set, index) => (
        `<span class="value-pill">Set ${index + 1}: ${escapeHtml(set.reps || "-")} reps @ ${escapeHtml(set.weight || "-")}</span>`
      )).join("");
    }

    return Object.entries(log.values || {})
      .filter((entry) => entry[1])
      .map(([key, value]) => `<span class="value-pill">${metricLabels[key] || "Result"} ${escapeHtml(value)}</span>`)
      .join("") || '<span class="value-pill">No numbers entered</span>';
  }

  function formatPlainValues(log) {
    if (Array.isArray(log.values?.setDetails) && log.values.setDetails.length) {
      return `${log.values.setDetails.length} sets`;
    }

    return Object.entries(log.values || {})
      .filter((entry) => entry[1])
      .map(([key, value]) => `${metricLabels[key] || "Result"} ${value}`)
      .join(", ");
  }

  function workoutSummary(workout) {
    const labels = {
      time: "For time",
      amrap: "AMRAP",
      emom: "EMOM",
      rounds: "Rounds/reps",
      custom: "Custom"
    };
    return [workout.rounds, labels[workout.format] || "Workout"].filter(Boolean).join(" · ");
  }

  function searchableDatabaseWorkoutText(workout) {
    return normalizeName(`${workout.name} ${workout.category} ${workout.difficulty} ${workout.duration} ${workout.notes || ""} ${workout.exercises.map((exercise) => `${exercise.name} ${exercise.prescription}`).join(" ")}`);
  }

  function difficultyClass(difficulty) {
    if (difficulty === "Beginner") return "bodyweight";
    if (difficulty === "Advanced") return "performance";
    return "strength";
  }

  function formatTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function formatMetricNames(movement) {
    return movement.metrics.map((metric) => metricLabels[metric]).join(", ");
  }

  function usesSetLogger(movement) {
    return movement.metrics.includes("reps") && movement.metrics.includes("weight");
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

  function activeLogs() {
    return state.logs.slice()
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  function logsForMovement(movementId) {
    return activeLogs()
      .filter((log) => log.movementId === movementId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function logsForWorkout(workoutId) {
    return activeLogs()
      .filter((log) => log.workoutId === workoutId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function latestLogForMovement(movementId) {
    return activeLogs().find((log) => log.movementId === movementId);
  }

  function getMovement(id) {
    return state.movements.find((movement) => movement.id === id);
  }

  function getWorkout(id) {
    return state.workouts.find((workout) => workout.id === id);
  }

  function getDatabaseWorkout(id) {
    return workoutDatabase.find((workout) => workout.id === id);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) return normalizeState(saved);
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }

    for (const key of LEGACY_KEYS) {
      try {
        const legacy = JSON.parse(localStorage.getItem(key));
        if (legacy) return normalizeState(legacy);
      } catch (error) {
        localStorage.removeItem(key);
      }
    }

    return normalizeState(null);
  }

  function normalizeState(input) {
    const base = structuredCloneSafe(defaultState);
    base.movements = mergeExerciseLibrary(base.movements);
    if (!input || !Array.isArray(input.movements) || !Array.isArray(input.logs)) return base;

    return {
      version: 5,
      settings: {
        darkMode: Boolean(input.settings?.darkMode),
        units: input.settings?.units === "kg" ? "kg" : "lb"
      },
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
      workouts: Array.isArray(input.workouts) ? input.workouts.map((workout) => ({
        id: workout.id || makeId(),
        name: workout.name || "Custom Workout",
        format: ["time", "amrap", "emom", "rounds", "custom"].includes(workout.format) ? workout.format : "time",
        rounds: workout.rounds || "",
        movements: Array.isArray(workout.movements)
          ? workout.movements.filter(Boolean).map(String)
          : String(workout.movements || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
        createdAt: Number(workout.createdAt || Date.now())
      })) : [],
      workoutFavorites: Array.isArray(input.workoutFavorites)
        ? input.workoutFavorites.filter((id) => Boolean(getDatabaseWorkout(id)))
        : [],
      workoutHistory: Array.isArray(input.workoutHistory) ? input.workoutHistory.map((entry, index) => ({
        id: entry.id || makeId(),
        workoutId: entry.workoutId,
        completedAt: Number(entry.completedAt || Date.now() + index),
        date: entry.date || localDate(),
        checked: Array.isArray(entry.checked) ? entry.checked.map(Number).filter(Number.isFinite) : [],
        result: entry.result || "",
        elapsedSeconds: Number.isFinite(Number(entry.elapsedSeconds)) ? Number(entry.elapsedSeconds) : null
      })).filter((entry) => Boolean(getDatabaseWorkout(entry.workoutId))) : [],
      logs: input.logs.map((log, index) => ({
        id: log.id || makeId(),
        movementId: log.movementId,
        workoutId: log.workoutId,
        date: log.date || localDate(),
        values: normalizeLogValues(log.values),
        effort: Number(log.effort || 7),
        notes: log.notes || "",
        createdAt: Number(log.createdAt || Date.now() + index),
        resultValue: log.resultValue ?? null,
        previousBest: log.previousBest ?? null,
        pr: Boolean(log.pr)
      }))
    };
  }

  function normalizeLogValues(values) {
    const normalized = values && typeof values === "object" ? { ...values } : {};
    if (Array.isArray(normalized.setDetails)) {
      normalized.setDetails = normalized.setDetails
        .map((set) => ({
          reps: String(set?.reps || "").trim(),
          weight: String(set?.weight || "").trim()
        }))
        .filter((set) => set.reps || set.weight);
    }
    return normalized;
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

  function round(value) {
    return Math.round(value * 10) / 10;
  }

  function makeId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function workoutTemplate(id, name, category, difficulty, duration, lines, notes) {
    return {
      id,
      name,
      category,
      difficulty,
      duration,
      exercises: lines.map((line) => {
        const parts = line.split(",");
        return {
          name: parts.shift().trim(),
          prescription: parts.join(",").trim() || "Complete with quality reps"
        };
      }),
      notes
    };
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
