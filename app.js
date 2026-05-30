(function () {
  const STORAGE_KEY = "workoutTracker.v6";
  const LEGACY_KEYS = ["workoutTracker.v5", "workoutTracker.v4", "workoutTracker.v3", "workoutTracker.v2", "workoutTracker.v1"];

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
    "All", "Favorites", "Recent", "Basketball Performance", "CrossFit", "Bodybuilding",
    "Powerlifting", "Olympic Weightlifting", "General Strength", "Athletic Performance",
    "Running", "Conditioning", "Mobility", "Stretching", "Recovery", "Core Training",
    "Home Workouts", "Functional Fitness"
  ];
  const workoutDifficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const workoutBlueprints = [
    workoutGroup("Basketball Performance", "Court, weights, bands, cones", ["basketball", "speed", "jump"], [
      ["Lower Body Strength", "Advanced", "60 min", "Build lower-body force for stronger drives and rebounds.", ["Back Squat 5x5, rest 2-3 min", "Romanian Deadlift 4x8, rest 90 sec", "Bulgarian Split Squat 3x10 each leg, rest 75 sec", "Calf Raises 3x15, rest 45 sec", "Tibialis Raises 3x15, rest 45 sec"]],
      ["Vertical Jump Day", "Advanced", "50 min", "Train elastic power and max jump output.", ["Hang Clean 5x3, rest 2 min", "Box Jumps 5x5, rest 90 sec", "Depth Jumps 4x4, rest 90 sec", "Broad Jumps 4x5, rest 75 sec", "Sled Push 5 rounds, rest 90 sec"]],
      ["Explosive Power", "Intermediate", "45 min", "Move light to moderate loads with speed.", ["Trap Bar Jump 5x3, rest 90 sec", "Med Ball Slam 4x6, rest 60 sec", "Push Press 4x4, rest 90 sec", "Lateral Bounds 4x5 each, rest 60 sec", "Sprint Starts 6x10m, rest 60 sec"]],
      ["First Step Quickness", "Intermediate", "35 min", "Improve short acceleration and change of direction.", ["Wall Drill 3x10 each, rest 30 sec", "Falling Starts 6x10m, rest 60 sec", "Lateral Push-Off 4x5 each, rest 45 sec", "Resisted Sprint 6x10m, rest 75 sec", "Pogo Jumps 3x20, rest 45 sec"]],
      ["Core Stability", "Beginner", "30 min", "Build trunk control for contact and landing.", ["Dead Bug 3x10 each, rest 30 sec", "Side Plank 3x30 sec each, rest 30 sec", "Pallof Press 3x12 each, rest 45 sec", "Farmer Carry 4x40m, rest 60 sec", "Hollow Hold 3x30 sec, rest 45 sec"]],
      ["Upper Body Contact Strength", "Intermediate", "50 min", "Build strength for finishes, screens, and body control.", ["Bench Press 5x5, rest 2 min", "Pull-Ups 4xMax, rest 90 sec", "Landmine Press 3x8 each, rest 75 sec", "Dumbbell Row 3x10 each, rest 75 sec", "Farmer Carry 4 rounds, rest 60 sec"]],
      ["In-Season Strength", "Intermediate", "38 min", "Maintain strength without creating heavy soreness.", ["Front Squat 3x4, rest 2 min", "Bench Press 3x5, rest 90 sec", "Trap Bar Deadlift 3x3, rest 2 min", "Split Squat 2x8 each, rest 60 sec", "Band Pull-Aparts 2x20, rest 30 sec"]],
      ["Off-Season Strength", "Advanced", "65 min", "Build a bigger strength base away from games.", ["Back Squat 5x5, rest 2-3 min", "Deadlift 4x4, rest 2-3 min", "Dumbbell Bench 4x8, rest 90 sec", "Walking Lunges 3x12 each, rest 75 sec", "Weighted Plank 3x45 sec, rest 60 sec"]],
      ["Conditioning Day", "Advanced", "40 min", "Repeat hard court efforts with quality movement.", ["Suicides x10, rest 60 sec", "Assault Bike 8x20 sec, rest 70 sec", "Tempo Runs 6x100m, rest 45 sec", "Agility Ladder 5 min", "Defensive Slides 6 rounds, rest 45 sec"]],
      ["Game Day Primer", "Beginner", "18 min", "Feel warm, springy, and ready without fatigue.", ["Easy Bike 4 min", "Dynamic Warm-Up 5 min", "Pogo Jumps 3x10, rest 30 sec", "Approach Jumps 3x2, rest 45 sec", "Band Pull-Aparts 2x15, rest 30 sec"]]
    ]),
    workoutGroup("CrossFit", "Barbell, pull-up bar, rower or bike, kettlebell", ["crossfit", "metcon", "engine"], [
      ["Simple Engine", "Beginner", "24 min", "Build steady conditioning with simple movements.", ["Row 500m, rest 60 sec", "Air Squats 4x20, rest 30 sec", "Kettlebell Swings 4x15, rest 45 sec", "Sit-Ups 4x20, rest 30 sec"]],
      ["Full Body Burner", "Intermediate", "30 min", "Hit full-body volume at a strong pace.", ["AMRAP 20 min", "10 Dumbbell Thrusters", "12 Box Jumps", "14 Push-Ups", "200m Run"]],
      ["Barbell Grind", "Advanced", "35 min", "Practice barbell cycling under fatigue.", ["Deadlift 5x5, rest 90 sec", "Hang Power Clean 5x3, rest 90 sec", "Push Jerk 5x3, rest 90 sec", "Burpees 5x10, rest 60 sec"]],
      ["Bike Burn", "Intermediate", "26 min", "Use intervals to push repeatable intensity.", ["Assault Bike 10x30 sec hard, rest 60 sec", "Wall Balls 5x15, rest 45 sec", "Plank 5x40 sec, rest 30 sec"]],
      ["Mini Murph", "Intermediate", "35 min", "Practice a shorter bodyweight hero-style workout.", ["Run 800m", "Pull-Ups 50 reps", "Push-Ups 100 reps", "Air Squats 150 reps", "Run 800m"]],
      ["Fran Style", "Advanced", "15 min", "Train fast thrusters and pulling volume.", ["21 Thrusters, rest as needed", "21 Pull-Ups", "15 Thrusters", "15 Pull-Ups", "9 Thrusters and 9 Pull-Ups"]],
      ["Cindy Style", "Beginner", "20 min", "Keep rounds smooth and repeatable.", ["AMRAP 20 min", "5 Pull-Ups", "10 Push-Ups", "15 Air Squats"]],
      ["Explosive Athlete", "Advanced", "28 min", "Blend power movements with short conditioning.", ["Power Clean 6x2, rest 90 sec", "Box Jump 6x5, rest 60 sec", "Row Sprint 6x150m, rest 75 sec", "Toes-to-Bar 4x10, rest 60 sec"]],
      ["Gym Grinder", "Intermediate", "32 min", "Grind through mixed gym movements.", ["5 rounds", "12 Dumbbell Snatches", "15 Wall Balls", "12 Toes-to-Bar", "250m Row, rest 60 sec"]],
      ["AMRAP 20", "Intermediate", "20 min", "Score quality rounds in twenty minutes.", ["AMRAP 20 min", "10 Kettlebell Swings", "10 Burpees", "10 Goblet Squats", "200m Run"]]
    ]),
    workoutGroup("Bodybuilding", "Dumbbells, machines, cables, bench", ["hypertrophy", "pump", "muscle"], [
      ["Chest Day", "Intermediate", "55 min", "Build chest size with presses and flyes.", ["Bench Press 4x8, rest 90 sec", "Incline Dumbbell Press 4x10, rest 75 sec", "Cable Fly 3x12, rest 60 sec", "Push-Ups 3xMax, rest 60 sec"]],
      ["Back Day", "Intermediate", "55 min", "Train lats, upper back, and rows.", ["Pull-Ups 4xMax, rest 90 sec", "Barbell Row 4x8, rest 90 sec", "Lat Pulldown 3x12, rest 60 sec", "Seated Row 3x12, rest 60 sec", "Face Pulls 3x15, rest 45 sec"]],
      ["Leg Day", "Advanced", "65 min", "Build quad, hamstring, and glute volume.", ["Back Squat 4x8, rest 2 min", "Leg Press 4x12, rest 90 sec", "Romanian Deadlift 4x10, rest 90 sec", "Leg Curl 3x12, rest 60 sec", "Calf Raises 4x15, rest 45 sec"]],
      ["Shoulder Day", "Intermediate", "45 min", "Build shoulders with presses and raises.", ["Dumbbell Shoulder Press 4x10, rest 75 sec", "Lateral Raise 4x12, rest 45 sec", "Rear Delt Fly 3x15, rest 45 sec", "Upright Row 3x10, rest 60 sec"]],
      ["Arm Day", "Beginner", "40 min", "Simple biceps and triceps volume.", ["Barbell Curl 4x10, rest 60 sec", "Cable Pressdown 4x12, rest 60 sec", "Hammer Curl 3x12, rest 45 sec", "Overhead Triceps Extension 3x12, rest 45 sec"]],
      ["Push Day", "Intermediate", "55 min", "Train chest, shoulders, and triceps.", ["Incline Bench Press 4x8, rest 90 sec", "Dumbbell Bench 3x10, rest 75 sec", "Strict Press 3x8, rest 90 sec", "Dips 3xMax, rest 60 sec", "Lateral Raise 3x15, rest 45 sec"]],
      ["Pull Day", "Intermediate", "55 min", "Train back, rear delts, and biceps.", ["Deadlift 3x5, rest 2 min", "Pull-Ups 4xMax, rest 90 sec", "Chest-Supported Row 4x10, rest 75 sec", "Face Pulls 3x15, rest 45 sec", "Dumbbell Curl 3x12, rest 45 sec"]],
      ["Upper Body Pump", "Beginner", "42 min", "Get quality upper-body volume with moderate load.", ["Dumbbell Bench 3x12, rest 60 sec", "Lat Pulldown 3x12, rest 60 sec", "Seated Dumbbell Press 3x12, rest 60 sec", "Cable Row 3x12, rest 60 sec", "Pushdowns 3x15, rest 45 sec"]],
      ["Lower Body Hypertrophy", "Intermediate", "52 min", "Build legs with controlled reps.", ["Front Squat 4x8, rest 90 sec", "Walking Lunge 3x12 each, rest 75 sec", "Hip Thrust 4x10, rest 75 sec", "Leg Extension 3x15, rest 45 sec", "Calf Raises 4x15, rest 45 sec"]],
      ["Full Body Hypertrophy", "Intermediate", "58 min", "Train major muscle groups in one session.", ["Goblet Squat 4x12, rest 75 sec", "Dumbbell Bench 4x10, rest 75 sec", "Seated Row 4x10, rest 75 sec", "Romanian Deadlift 3x10, rest 90 sec", "Lateral Raise 3x15, rest 45 sec"]]
    ]),
    workoutGroup("Powerlifting", "Squat rack, bench, barbell, plates", ["powerlifting", "strength", "barbell"], [
      ["Squat Focus", "Advanced", "60 min", "Build squat strength with accessories.", ["Back Squat 5x3, rest 3 min", "Pause Squat 3x3, rest 2 min", "Romanian Deadlift 3x8, rest 90 sec", "Leg Press 3x10, rest 90 sec"]],
      ["Bench Focus", "Advanced", "55 min", "Build stronger pressing and lockout.", ["Bench Press 5x3, rest 3 min", "Close-Grip Bench 4x5, rest 2 min", "Dumbbell Row 4x10, rest 75 sec", "Triceps Pressdown 3x15, rest 45 sec"]],
      ["Deadlift Focus", "Advanced", "60 min", "Improve pulling strength and posterior chain.", ["Deadlift 5x3, rest 3 min", "Deficit Deadlift 3x3, rest 2 min", "Hip Thrust 4x8, rest 90 sec", "Back Extension 3x12, rest 60 sec"]],
      ["5x5 Strength", "Intermediate", "60 min", "Use simple volume for strength progress.", ["Back Squat 5x5, rest 2 min", "Bench Press 5x5, rest 2 min", "Barbell Row 5x5, rest 90 sec", "Plank 3x60 sec, rest 45 sec"]],
      ["Heavy Triple Day", "Advanced", "50 min", "Practice heavy triples with control.", ["Back Squat 4x3, rest 3 min", "Bench Press 4x3, rest 3 min", "Deadlift 3x3, rest 3 min", "Band Pull-Aparts 3x20, rest 30 sec"]],
      ["Pause Squat Day", "Intermediate", "50 min", "Build positions and power out of the bottom.", ["Pause Squat 5x3, rest 2 min", "Front Squat 3x5, rest 2 min", "Bulgarian Split Squat 3x8 each, rest 75 sec", "Dead Bug 3x10 each, rest 30 sec"]],
      ["Speed Bench Day", "Intermediate", "45 min", "Move the bar fast with repeatable form.", ["Speed Bench 8x3, rest 60 sec", "Incline Dumbbell Press 3x10, rest 75 sec", "Chest-Supported Row 4x10, rest 75 sec", "Face Pulls 3x15, rest 45 sec"]],
      ["Posterior Chain Day", "Advanced", "55 min", "Strengthen the muscles that drive the pull.", ["Romanian Deadlift 4x6, rest 2 min", "Good Morning 3x8, rest 90 sec", "Hamstring Curl 4x10, rest 60 sec", "Farmer Carry 4x40m, rest 60 sec"]],
      ["Max Effort Lower", "Advanced", "65 min", "Work up to a heavy lower-body effort.", ["Back Squat 1x3 heavy, rest as needed", "Back-Off Squat 3x5, rest 2 min", "Deadlift 3x3, rest 3 min", "Walking Lunge 3x10 each, rest 75 sec"]],
      ["Max Effort Upper", "Advanced", "60 min", "Work up to a heavy upper-body effort.", ["Bench Press 1x3 heavy, rest as needed", "Close-Grip Bench 3x5, rest 2 min", "Pull-Ups 4xMax, rest 90 sec", "Seated Row 4x10, rest 75 sec"]]
    ]),
    workoutGroup("Olympic Weightlifting", "Barbell, bumper plates, platform, blocks", ["olympic lifting", "technique", "power"], [
      ["Clean Technique", "Intermediate", "45 min", "Dial in clean positions and turnover.", ["Clean Pull 4x3, rest 90 sec", "Hang Clean 6x2, rest 90 sec", "Front Squat 4x3, rest 2 min", "Tall Clean 3x3, rest 60 sec"]],
      ["Snatch Technique", "Intermediate", "45 min", "Build snatch timing and overhead position.", ["Snatch Pull 4x3, rest 90 sec", "Hang Snatch 6x2, rest 90 sec", "Overhead Squat 4x3, rest 2 min", "Snatch Balance 3x3, rest 90 sec"]],
      ["Clean Pull Day", "Advanced", "42 min", "Strengthen the clean pull path.", ["Clean Pull 5x3, rest 2 min", "Clean Deadlift 4x4, rest 2 min", "Front Squat 3x3, rest 2 min", "Box Jump 4x3, rest 60 sec"]],
      ["Snatch Pull Day", "Advanced", "42 min", "Build stronger snatch extension.", ["Snatch Pull 5x3, rest 2 min", "Snatch Deadlift 4x4, rest 2 min", "Overhead Squat 3x3, rest 2 min", "Broad Jump 4x3, rest 60 sec"]],
      ["Jerk Technique", "Intermediate", "40 min", "Practice dip, drive, and stable lockout.", ["Push Press 4x4, rest 90 sec", "Power Jerk 5x2, rest 90 sec", "Split Jerk 5x2, rest 2 min", "Jerk Recovery 3x3, rest 90 sec"]],
      ["Power Clean Day", "Advanced", "50 min", "Train explosive clean power.", ["Power Clean 6x2, rest 2 min", "Clean Pull 4x3, rest 2 min", "Front Squat 4x3, rest 2 min", "Med Ball Slam 4x5, rest 45 sec"]],
      ["Hang Snatch Day", "Intermediate", "45 min", "Improve speed under the bar.", ["Muscle Snatch 3x4, rest 60 sec", "Hang Snatch 6x2, rest 90 sec", "Snatch Balance 4x2, rest 90 sec", "Overhead Squat 3x4, rest 90 sec"]],
      ["Front Squat + Clean", "Advanced", "55 min", "Pair clean skill with front squat strength.", ["Clean 6x2, rest 2 min", "Front Squat 5x3, rest 2 min", "Clean Pull 3x3, rest 2 min", "Plank 3x60 sec, rest 45 sec"]],
      ["Overhead Stability", "Beginner", "35 min", "Build stable shoulders and overhead control.", ["Overhead Squat 4x5, rest 90 sec", "Snatch Grip Press 3x8, rest 75 sec", "Waiter Carry 4x30m, rest 60 sec", "Wall Slides 3x12, rest 30 sec"]],
      ["Full Olympic Session", "Advanced", "70 min", "Practice snatch, clean, jerk, and squat work.", ["Snatch 6x2, rest 2 min", "Clean and Jerk 6x1, rest 2 min", "Front Squat 4x3, rest 2 min", "Snatch Pull 3x3, rest 2 min"]]
    ]),
    workoutGroup("General Strength", "Dumbbells, barbell, kettlebell, bench", ["strength", "fitness", "basic"], [
      ["Full Body Strength", "Intermediate", "55 min", "Build simple strength across the whole body.", ["Front Squat 4x5, rest 2 min", "Bench Press 4x6, rest 90 sec", "Pull-Ups 4xMax, rest 90 sec", "Kettlebell Swing 4x12, rest 60 sec", "Farmer Carry 3 rounds, rest 60 sec"]],
      ["Beginner Strength A", "Beginner", "40 min", "Learn basic strength movements.", ["Goblet Squat 3x10, rest 60 sec", "Push-Ups 3xMax, rest 60 sec", "Dumbbell Row 3x10 each, rest 60 sec", "Plank 3x30 sec, rest 30 sec"]],
      ["Beginner Strength B", "Beginner", "40 min", "Build confidence with simple lifts.", ["Trap Bar Deadlift 3x5, rest 90 sec", "Dumbbell Bench 3x10, rest 60 sec", "Lat Pulldown 3x10, rest 60 sec", "Step-Ups 3x8 each, rest 60 sec"]],
      ["Dumbbell Strength", "Intermediate", "45 min", "Use dumbbells for strong full-body work.", ["Dumbbell Squat 4x10, rest 75 sec", "Dumbbell Bench 4x8, rest 75 sec", "Dumbbell Row 4x10 each, rest 75 sec", "Dumbbell RDL 3x10, rest 75 sec"]],
      ["Kettlebell Strength", "Intermediate", "42 min", "Train strength with kettlebell basics.", ["Goblet Squat 4x10, rest 75 sec", "Kettlebell Swing 5x12, rest 60 sec", "Kettlebell Press 3x8 each, rest 75 sec", "Suitcase Carry 4x30m, rest 60 sec"]],
      ["Upper/Lower Split", "Intermediate", "50 min", "Blend upper and lower strength in one session.", ["Back Squat 4x6, rest 2 min", "Incline Bench 4x8, rest 90 sec", "Romanian Deadlift 3x8, rest 90 sec", "Seated Row 3x10, rest 75 sec"]],
      ["Posterior Chain", "Intermediate", "45 min", "Strengthen glutes, hamstrings, and back.", ["Deadlift 4x5, rest 2 min", "Hip Thrust 4x8, rest 90 sec", "Back Extension 3x12, rest 60 sec", "Hamstring Curl 3x12, rest 60 sec"]],
      ["Push/Pull Strength", "Intermediate", "45 min", "Balance pressing and pulling strength.", ["Bench Press 4x6, rest 90 sec", "Barbell Row 4x8, rest 90 sec", "Strict Press 3x6, rest 90 sec", "Pull-Ups 3xMax, rest 90 sec"]],
      ["Squat Rack Day", "Advanced", "55 min", "Make the most of a rack and barbell.", ["Back Squat 5x5, rest 2 min", "Front Squat 3x5, rest 2 min", "Strict Press 4x6, rest 90 sec", "Barbell Lunges 3x8 each, rest 75 sec"]],
      ["Bench + Back", "Intermediate", "48 min", "Pair pressing strength with upper-back work.", ["Bench Press 5x5, rest 2 min", "Pull-Ups 4xMax, rest 90 sec", "Dumbbell Bench 3x10, rest 75 sec", "Cable Row 4x10, rest 75 sec"]]
    ]),
    workoutGroup("Athletic Performance", "Cones, sled, medicine ball, weights", ["athlete", "power", "agility"], [
      ["Total Athlete Circuit", "Intermediate", "38 min", "Build athletic work capacity.", ["Kettlebell Swing 4x12, rest 45 sec", "Push-Ups 4x15, rest 45 sec", "Goblet Squat 4x12, rest 45 sec", "Battle Ropes 4x30 sec, rest 45 sec", "Plank 4x45 sec, rest 30 sec"]],
      ["Speed Strength Primer", "Intermediate", "35 min", "Prime fast strength and low-volume power.", ["Power Clean 6x2, rest 90 sec", "Med Ball Chest Pass 4x5, rest 45 sec", "Med Ball Slam 4x6, rest 45 sec", "Band-Resisted Jumps 4x4, rest 60 sec", "Sprint Starts 6x10m, rest 60 sec"]],
      ["Jump Landing Control", "Beginner", "35 min", "Own safe, quiet landings.", ["Snap Downs 4x5, rest 45 sec", "Box Jump 4x4, rest 60 sec", "Single-Leg Landing 3x5 each, rest 45 sec", "Lateral Bounds 3x6 each, rest 45 sec", "Calf Raises 3x15, rest 45 sec"]],
      ["Acceleration Day", "Intermediate", "34 min", "Improve first steps and sprint mechanics.", ["A-Skips 3x20m, rest 30 sec", "Wall Drives 3x10 each, rest 30 sec", "Falling Starts 8x10m, rest 60 sec", "Sled Push 6x15m, rest 75 sec"]],
      ["Agility Circuit", "Intermediate", "36 min", "Train cuts, brakes, and re-acceleration.", ["Pro Agility 6 reps, rest 60 sec", "L Drill 5 reps, rest 60 sec", "Cone Shuffle 4x20 sec, rest 40 sec", "Backpedal to Sprint 6 reps, rest 60 sec"]],
      ["Power Endurance", "Advanced", "42 min", "Repeat explosive efforts while tired.", ["Broad Jump 5x3, rest 60 sec", "Med Ball Throw 5x5, rest 45 sec", "Sled Push 8x20m, rest 60 sec", "Assault Bike 6x20 sec, rest 70 sec"]],
      ["Single-Leg Power", "Intermediate", "40 min", "Build unilateral power and control.", ["Single-Leg Box Jump 4x3 each, rest 60 sec", "Split Squat Jump 4x5 each, rest 60 sec", "Single-Leg RDL 3x8 each, rest 75 sec", "Lateral Bounds 4x5 each, rest 60 sec"]],
      ["Medicine Ball Power", "Beginner", "30 min", "Use medicine ball throws for simple power.", ["Med Ball Chest Pass 5x5, rest 45 sec", "Med Ball Slam 5x5, rest 45 sec", "Rotational Throw 4x5 each, rest 45 sec", "Overhead Throw 4x5, rest 45 sec"]],
      ["Reactive Footwork", "Intermediate", "30 min", "Improve fast feet and reaction work.", ["Jump Rope 4x60 sec, rest 30 sec", "Agility Ladder 6 min", "Mirror Shuffle 6x20 sec, rest 40 sec", "Sprint Reaction 8 reps, rest 45 sec"]],
      ["Athletic Deload", "Beginner", "28 min", "Stay sharp while reducing stress.", ["Tempo Run 8 min easy", "Mobility Flow 8 min", "Pogo Jumps 3x10, rest 30 sec", "Light Med Ball Throws 3x5, rest 45 sec"]]
    ]),
    workoutGroup("Running", "Running shoes, track or open route", ["running", "speed", "endurance"], [
      ["Easy Run", "Beginner", "30 min", "Build aerobic base at a comfortable pace.", ["Easy Run 25 min", "Walk Cooldown 5 min", "Optional Strides 4x15 sec, rest 45 sec"]],
      ["Tempo Run", "Intermediate", "34 min", "Train comfortably hard aerobic pace.", ["Easy Jog 8 min", "Tempo Run 4x4 min, rest 2 min easy", "Strides 4x20 sec, rest 45 sec", "Cooldown 5 min"]],
      ["Sprint Intervals", "Advanced", "28 min", "Practice fast sprint efforts with full rest.", ["Warm-Up Jog 8 min", "Sprint 8x60m, rest 90 sec", "Walk Cooldown 5 min"]],
      ["Hill Sprints", "Advanced", "30 min", "Build power and sprint mechanics uphill.", ["Warm-Up 10 min", "Hill Sprint 8x12 sec, walk back rest", "Easy Jog 6 min", "Mobility 4 min"]],
      ["400m Repeats", "Intermediate", "45 min", "Build speed endurance with track repeats.", ["Warm-Up Jog 10 min", "400m Run x6, rest 90 sec", "Cooldown Jog 8 min"]],
      ["800m Repeats", "Advanced", "55 min", "Improve longer interval tolerance.", ["Warm-Up Jog 10 min", "800m Run x5, rest 2 min", "Cooldown Jog 10 min"]],
      ["Mile Test", "Intermediate", "25 min", "Test one-mile fitness.", ["Warm-Up Jog 8 min", "Strides 4x20 sec, rest 45 sec", "Mile Run 1x, record time", "Cooldown Walk 5 min"]],
      ["5K Prep", "Intermediate", "45 min", "Build rhythm for a strong 5K.", ["Easy Run 10 min", "Run 3x8 min at 5K effort, rest 3 min easy", "Cooldown 8 min"]],
      ["Recovery Run", "Beginner", "25 min", "Move easy and recover between harder sessions.", ["Easy Jog 20 min", "Walk 3 min", "Light Stretch 2 min"]],
      ["Speed Endurance", "Advanced", "40 min", "Hold speed for longer sprint intervals.", ["Warm-Up 10 min", "200m Run x8, rest 90 sec", "100m Float x4, rest 60 sec", "Cooldown 8 min"]]
    ]),
    workoutGroup("Conditioning", "Bike, rower, kettlebell, dumbbells", ["conditioning", "engine", "work capacity"], [
      ["Assault Bike Intervals", "Intermediate", "24 min", "Build repeatable high-intensity output.", ["Assault Bike 10x30 sec hard, rest 60 sec", "Easy Pedal 5 min", "Breathing Reset 3 min"]],
      ["EMOM Conditioning", "Intermediate", "20 min", "Stay on the minute and manage fatigue.", ["EMOM 20 min", "Min 1: 12 Kettlebell Swings", "Min 2: 10 Burpees", "Min 3: 14 Wall Balls", "Min 4: Rest"]],
      ["Circuit Conditioning", "Beginner", "30 min", "Use simple circuits for steady sweat.", ["4 rounds", "15 Air Squats", "12 Push-Ups", "15 Sit-Ups", "200m Run, rest 60 sec"]],
      ["Sprint Conditioning", "Advanced", "32 min", "Repeat hard sprints with quality.", ["Warm-Up 8 min", "Sprint 10x100m, rest 60 sec", "Cooldown Walk 6 min"]],
      ["Legs and Lungs", "Advanced", "28 min", "Challenge lower body and breathing.", ["5 rounds", "20 Walking Lunges", "15 Wall Balls", "12 Box Jumps", "250m Row, rest 60 sec"]],
      ["Burpee Burner", "Intermediate", "18 min", "Use burpees for a short, tough finisher.", ["Burpees 10-9-8-7-6-5-4-3-2-1", "Air Squats 10 reps after each set", "Rest as needed"]],
      ["Kettlebell Conditioning", "Intermediate", "25 min", "Move a kettlebell with steady pace.", ["5 rounds", "15 Kettlebell Swings", "10 Goblet Squats", "8 Kettlebell Press each", "Rest 60 sec"]],
      ["Full Body Sweat", "Beginner", "26 min", "Simple mixed conditioning for any day.", ["4 rounds", "Jump Rope 60 sec", "Dumbbell Thruster 12 reps", "Mountain Climbers 30 sec", "Rest 60 sec"]],
      ["Core Conditioning", "Intermediate", "22 min", "Blend core work and breathing.", ["4 rounds", "Plank 45 sec", "Russian Twists 20 reps", "Row 250m", "Rest 60 sec"]],
      ["Low Impact Conditioning", "Beginner", "30 min", "Build conditioning without pounding joints.", ["Bike 5 min easy", "Bike 8x45 sec moderate, rest 45 sec", "Farmer Carry 5x40m, rest 45 sec", "Cooldown Walk 5 min"]]
    ]),
    workoutGroup("Mobility", "Mat, band, foam roller", ["mobility", "range", "movement"], [
      ["Full Body Mobility", "Beginner", "25 min", "Open common tight areas from training.", ["World's Greatest Stretch 2x5 each", "Thoracic Rotation 2x10 each", "Deep Squat Hold 3x45 sec", "Shoulder CARs 2x8 each", "Breathing 3 min"]],
      ["Hip Mobility", "Beginner", "20 min", "Improve hip range for squats and sport.", ["90/90 Switches 3x8", "Hip Flexor Stretch 2 min each", "Cossack Squat 3x6 each", "Pigeon Stretch 90 sec each"]],
      ["Ankle Mobility", "Beginner", "18 min", "Build ankle range for squats, jumps, and running.", ["Ankle Rocks 3x15 each", "Knee-to-Wall 3x10 each", "Calf Stretch 2 min each", "Tibialis Raises 3x15"]],
      ["Shoulder Mobility", "Beginner", "20 min", "Improve overhead and pressing positions.", ["Band Dislocates 3x12", "Wall Slides 3x10", "Thread the Needle 2x10 each", "Lat Stretch 2 min each"]],
      ["Thoracic Reset", "Beginner", "18 min", "Restore upper-back rotation.", ["Open Books 3x10 each", "Foam Roller Extensions 3x8", "Quadruped Rotation 3x8 each", "Child's Pose Breathing 2 min"]],
      ["Squat Mobility", "Intermediate", "22 min", "Prep hips and ankles for better squats.", ["Goblet Squat Hold 4x45 sec", "Ankle Rocks 3x12 each", "Cossack Squat 3x6 each", "Hip Airplanes 2x6 each"]],
      ["Overhead Mobility", "Intermediate", "24 min", "Prep shoulders for overhead lifting.", ["PVC Pass-Through 3x12", "Lat Stretch 2 min each", "Overhead Squat Hold 4x30 sec", "Scap Push-Ups 3x12"]],
      ["Runner Mobility", "Beginner", "20 min", "Open calves, hips, and hamstrings after running.", ["Calf Stretch 2 min each", "Hamstring Floss 2x12 each", "Couch Stretch 2 min each", "Glute Bridge 3x12"]],
      ["Desk Reset Mobility", "Beginner", "15 min", "Undo stiffness from sitting.", ["Neck CARs 2x5 each", "Thoracic Rotation 2x10 each", "Hip Flexor Stretch 90 sec each", "Deep Breathing 2 min"]],
      ["Pre-Lift Mobility", "Beginner", "16 min", "Quick prep before strength training.", ["Dynamic Lunge 2x8 each", "Band Pull-Aparts 2x20", "Ankle Rocks 2x12 each", "Bodyweight Squat 2x10"]]
    ]),
    workoutGroup("Stretching", "Mat, strap or towel", ["stretching", "flexibility", "cooldown"], [
      ["Hamstring Stretch", "Beginner", "12 min", "Ease hamstring tightness.", ["Supine Hamstring Stretch 2 min each", "Toe Touch Breathing 2 min", "Down Dog Pedal 2x60 sec", "Easy Walk 2 min"]],
      ["Back Recovery", "Beginner", "18 min", "Calm the back with gentle movement.", ["Child's Pose 2 min", "Cat-Cow 3x10", "Open Book 2x10 each", "Knees-to-Chest 2 min", "Breathing 3 min"]],
      ["Post-Leg Day Stretch", "Beginner", "22 min", "Downshift after a hard lower-body day.", ["Couch Stretch 2 min each", "Pigeon Stretch 2 min each", "Hamstring Stretch 2 min each", "Calf Stretch 90 sec each"]],
      ["Game Day Warm-Up", "Beginner", "15 min", "Move dynamically before competition.", ["High Knees 2x20m", "Butt Kicks 2x20m", "Lateral Shuffle 2x20m", "World's Greatest Stretch 2x5 each", "Pogo Jumps 2x10"]],
      ["Recovery Flow", "Beginner", "25 min", "Relax and restore with easy positions.", ["Easy Bike 5 min", "Couch Stretch 2 min each", "Hamstring Stretch 2 min each", "Thoracic Rotation 2x10", "Breathing 4 min"]],
      ["Deep Stretch", "Beginner", "30 min", "Hold longer stretches to unwind.", ["Pigeon Stretch 3 min each", "Frog Stretch 3 min", "Lat Stretch 2 min each", "Forward Fold 3 min", "Box Breathing 4 min"]],
      ["Upper Body Stretch", "Beginner", "16 min", "Open chest, lats, and shoulders.", ["Doorway Pec Stretch 2 min each", "Lat Stretch 2 min each", "Triceps Stretch 90 sec each", "Wrist Stretch 2 min"]],
      ["Lower Body Stretch", "Beginner", "20 min", "Stretch hips, quads, hamstrings, and calves.", ["Hip Flexor Stretch 2 min each", "Quad Stretch 2 min each", "Hamstring Stretch 2 min each", "Calf Stretch 2 min each"]],
      ["Evening Stretch", "Beginner", "18 min", "Use low-intensity stretching before bed.", ["Forward Fold 2 min", "Supine Twist 2 min each", "Happy Baby 2 min", "Box Breathing 5 min"]],
      ["Quick Cooldown", "Beginner", "10 min", "A fast cooldown after training.", ["Walk 3 min", "Couch Stretch 60 sec each", "Lat Stretch 60 sec each", "Hamstring Stretch 60 sec each", "Breathing 2 min"]]
    ]),
    workoutGroup("Recovery", "Bike, foam roller, band, mat", ["recovery", "easy", "restore"], [
      ["Recovery Flow", "Beginner", "25 min", "Leave the session feeling better than when you started.", ["Easy Bike 8 min", "Foam Roll Quads 2 min", "Hip Flexor Stretch 2 min each", "Thoracic Rotation 2x10 each", "Breathing Reset 4 min"]],
      ["Back Recovery", "Beginner", "18 min", "Reduce stiffness with gentle movement.", ["Cat-Cow 3x10", "Child's Pose Breathing 3 min", "Open Book 2x10 each", "Glute Bridge 3x12", "Walk 5 min"]],
      ["Shoulder Care", "Beginner", "24 min", "Support shoulders after pressing or throwing.", ["Band Pull-Aparts 3x20", "External Rotation 3x15 each", "Scap Push-Ups 3x12", "Wall Slides 3x10", "Child's Pose Breathing 2 min"]],
      ["Light Flush Ride", "Beginner", "22 min", "Get blood moving without fatigue.", ["Bike 18 min easy", "Calf Stretch 90 sec each", "Breathing 2 min"]],
      ["Post-Run Recovery", "Beginner", "20 min", "Recover calves, hips, and hamstrings.", ["Walk 5 min", "Calf Stretch 2 min each", "Hamstring Stretch 2 min each", "Hip Flexor Stretch 2 min each"]],
      ["Post-Lift Reset", "Beginner", "20 min", "Cool down after strength training.", ["Easy Row 5 min", "Foam Roll Back 2 min", "Pigeon Stretch 90 sec each", "Lat Stretch 90 sec each", "Box Breathing 4 min"]],
      ["Rest Day Movement", "Beginner", "30 min", "Stay loose on a non-training day.", ["Walk 20 min", "World's Greatest Stretch 2x5 each", "Ankle Rocks 2x12 each", "Breathing 3 min"]],
      ["Knee-Friendly Recovery", "Beginner", "20 min", "Move gently around sore knees.", ["Bike 8 min easy", "Spanish Squat Hold 4x30 sec, rest 30 sec", "Tibialis Raises 3x15", "Calf Stretch 2 min each"]],
      ["Sleep Prep Recovery", "Beginner", "15 min", "Downshift the nervous system.", ["Forward Fold 2 min", "Supine Twist 2 min each", "Legs Up Wall 4 min", "Box Breathing 5 min"]],
      ["Travel Recovery", "Beginner", "18 min", "Loosen up after sitting or travel.", ["Walk 5 min", "Hip Flexor Stretch 90 sec each", "Thoracic Rotation 2x10 each", "Calf Raises 2x20", "Breathing 3 min"]]
    ]),
    workoutGroup("Core Training", "Mat, cable or band, medicine ball", ["core", "stability", "abs"], [
      ["Core Stability", "Beginner", "30 min", "Brace better for lifting and sport.", ["Plank 3x45 sec, rest 30 sec", "Side Plank 3x30 sec each, rest 30 sec", "Pallof Press 3x12 each, rest 45 sec", "Dead Bug 3x10 each, rest 30 sec"]],
      ["Plank Builder", "Beginner", "18 min", "Build basic plank endurance.", ["Front Plank 4x30 sec, rest 30 sec", "Side Plank 3x25 sec each, rest 30 sec", "Plank Shoulder Tap 3x20, rest 45 sec"]],
      ["Rotational Core", "Intermediate", "32 min", "Train rotation with control.", ["Cable Chop 3x12 each, rest 45 sec", "Med Ball Rotational Throw 4x5 each, rest 45 sec", "Russian Twists 3x20, rest 45 sec", "Side Plank Reach 3x8 each, rest 45 sec"]],
      ["Anti-Rotation Core", "Intermediate", "28 min", "Resist movement and hold strong positions.", ["Pallof Press 4x12 each, rest 45 sec", "Suitcase Carry 4x30m each, rest 60 sec", "Dead Bug 3x10 each, rest 30 sec", "Bear Crawl 4x20m, rest 60 sec"]],
      ["Hanging Core", "Advanced", "25 min", "Train strong abs and grip from the bar.", ["Hanging Knee Raise 4x10, rest 60 sec", "Toes-to-Bar 4x8, rest 75 sec", "Hollow Hold 4x30 sec, rest 45 sec", "Dead Hang 3x45 sec, rest 45 sec"]],
      ["Athletic Core", "Intermediate", "30 min", "Blend core control and power.", ["Med Ball Slam 4x8, rest 45 sec", "Pallof Press 3x12 each, rest 45 sec", "Farmer Carry 4x40m, rest 60 sec", "Plank 3x60 sec, rest 45 sec"]],
      ["10-Min Abs", "Beginner", "10 min", "Quick abs finisher.", ["Hollow Hold 3x30 sec, rest 20 sec", "Bicycle Crunches 3x20, rest 20 sec", "Leg Raises 3x12, rest 20 sec", "Plank 1x60 sec"]],
      ["Low Back Strength", "Beginner", "25 min", "Build support around the low back.", ["Bird Dog 3x10 each, rest 30 sec", "Glute Bridge 4x12, rest 45 sec", "Back Extension 3x12, rest 60 sec", "Side Plank 3x25 sec each, rest 30 sec"]],
      ["Medicine Ball Core", "Intermediate", "24 min", "Use medicine ball power for core training.", ["Med Ball Slam 5x6, rest 45 sec", "Rotational Throw 4x5 each, rest 45 sec", "Med Ball Sit-Up 3x12, rest 45 sec", "Overhead Carry 3x30m, rest 60 sec"]],
      ["Bodyweight Core", "Beginner", "20 min", "Simple core work with no equipment.", ["Sit-Ups 4x15, rest 30 sec", "Leg Raises 4x10, rest 30 sec", "Mountain Climbers 4x30 sec, rest 30 sec", "Side Plank 3x30 sec each, rest 30 sec"]]
    ]),
    workoutGroup("Home Workouts", "Bodyweight, jump rope, optional dumbbells", ["home", "bodyweight", "simple"], [
      ["No Equipment Full Body", "Beginner", "24 min", "Train anywhere with bodyweight movements.", ["Air Squats 4x20, rest 45 sec", "Push-Ups 4x12, rest 45 sec", "Reverse Lunges 4x10 each, rest 45 sec", "Plank 4x30 sec, rest 30 sec"]],
      ["Push-Up/Squat Circuit", "Beginner", "18 min", "Use two simple moves for steady work.", ["10 rounds", "10 Push-Ups", "15 Air Squats", "Rest 30 sec"]],
      ["Core at Home", "Beginner", "15 min", "Quick core session with no equipment.", ["Dead Bug 3x10 each, rest 30 sec", "Plank 3x45 sec, rest 30 sec", "Bicycle Crunches 3x20, rest 30 sec", "Side Plank 2x30 sec each, rest 30 sec"]],
      ["Jump Rope Conditioning", "Intermediate", "20 min", "Build foot speed and conditioning.", ["Jump Rope 10x60 sec, rest 30 sec", "Air Squats 5x15, rest 30 sec", "Push-Ups 5x10, rest 30 sec"]],
      ["Bodyweight Legs", "Intermediate", "25 min", "Train legs at home without weights.", ["Tempo Air Squat 4x15, rest 45 sec", "Reverse Lunge 4x12 each, rest 45 sec", "Single-Leg Glute Bridge 3x12 each, rest 45 sec", "Wall Sit 3x60 sec, rest 45 sec"]],
      ["Beginner Home Workout", "Beginner", "20 min", "A simple starter workout for consistency.", ["3 rounds", "12 Air Squats", "8 Push-Ups", "12 Glute Bridges", "30 sec Plank, rest 60 sec"]],
      ["Advanced Home Workout", "Advanced", "32 min", "Push bodyweight intensity at home.", ["5 rounds", "20 Jump Squats", "15 Push-Ups", "20 Walking Lunges", "10 Burpees, rest 60 sec"]],
      ["Hotel Room Workout", "Intermediate", "22 min", "Train in a small space while traveling.", ["4 rounds", "15 Air Squats", "12 Push-Ups", "12 Reverse Lunges each", "30 sec Mountain Climbers, rest 60 sec"]],
      ["20-Min Sweat", "Intermediate", "20 min", "Fast full-body sweat session.", ["AMRAP 20 min", "10 Burpees", "20 Air Squats", "15 Sit-Ups", "30 Jumping Jacks"]],
      ["Mobility at Home", "Beginner", "18 min", "Stay loose with a simple at-home flow.", ["World's Greatest Stretch 2x5 each", "Couch Stretch 90 sec each", "Thoracic Rotation 2x10 each", "Forward Fold 2 min"]]
    ]),
    workoutGroup("Functional Fitness", "Dumbbells, kettlebells, sled, sandbag", ["functional", "carry", "work capacity"], [
      ["Farmer Carry Day", "Intermediate", "35 min", "Build grip, trunk, and carry strength.", ["Farmer Carry 6x40m, rest 60 sec", "Goblet Squat 4x10, rest 60 sec", "Push-Ups 4x15, rest 45 sec", "Suitcase Carry 4x30m each, rest 60 sec"]],
      ["Sled Push Day", "Advanced", "34 min", "Build leg drive and conditioning.", ["Sled Push 8x20m, rest 75 sec", "Reverse Sled Drag 6x20m, rest 60 sec", "Walking Lunges 3x12 each, rest 60 sec", "Plank 3x45 sec, rest 30 sec"]],
      ["Kettlebell Flow", "Intermediate", "28 min", "Move smoothly through kettlebell patterns.", ["Kettlebell Clean 4x6 each, rest 45 sec", "Kettlebell Press 4x6 each, rest 45 sec", "Kettlebell Swing 4x15, rest 45 sec", "Goblet Squat 4x10, rest 45 sec"]],
      ["Dumbbell Complex", "Advanced", "25 min", "Use one pair of dumbbells for hard work.", ["5 rounds", "6 Dumbbell Deadlifts", "6 Dumbbell Cleans", "6 Dumbbell Front Squats", "6 Dumbbell Push Press, rest 90 sec"]],
      ["Sandbag Workout", "Intermediate", "32 min", "Train odd-object strength.", ["Sandbag Clean 5x5, rest 60 sec", "Sandbag Carry 5x40m, rest 60 sec", "Sandbag Squat 4x10, rest 60 sec", "Burpees 4x10, rest 60 sec"]],
      ["Full Body Functional", "Intermediate", "36 min", "Blend carries, hinges, pushes, and squats.", ["Kettlebell Swing 4x15, rest 45 sec", "Farmer Carry 4x40m, rest 60 sec", "Dumbbell Thruster 4x10, rest 60 sec", "Row 4x250m, rest 60 sec"]],
      ["Grip Strength", "Beginner", "28 min", "Build grip and forearm endurance.", ["Dead Hang 5x30 sec, rest 45 sec", "Farmer Carry 5x30m, rest 60 sec", "Plate Pinch 4x30 sec, rest 45 sec", "Wrist Curl 3x15, rest 45 sec"]],
      ["Odd Object Carry", "Intermediate", "30 min", "Carry awkward loads with strong posture.", ["Sandbag Carry 6x30m, rest 60 sec", "Bear Hug Carry 5x30m, rest 60 sec", "Suitcase Carry 4x30m each, rest 60 sec", "Goblet Squat 3x12, rest 60 sec"]],
      ["Athletic Circuit", "Intermediate", "30 min", "Move through functional athletic patterns.", ["4 rounds", "Sled Push 20m", "Dumbbell Snatch 10 each", "Box Step-Ups 12 each", "Battle Ropes 30 sec, rest 75 sec"]],
      ["Work Capacity Day", "Advanced", "40 min", "Build the ability to keep working.", ["AMRAP 30 min", "500m Row", "20 Kettlebell Swings", "15 Push-Ups", "Farmer Carry 40m"]]
    ])
  ];
  const workoutDatabase = buildWorkoutDatabase();

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
    version: 6,
    settings: {
      darkMode: false,
      units: "lb"
    },
    profile: {
      name: "",
      bodyWeight: ""
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
    todayWorkout: null,
    logs: []
  };

  let state = loadState();
  let activeView = "today";
  let chartPoints = [];
  let toastTimer = null;
  let activeCategoryFilter = "All";
  let activeLibraryTab = "All";
  let activePickerTab = "All";
  let activeWorkoutCategory = "All";
  let activeWorkoutDifficulty = "All";
  let activeDatabaseWorkoutId = null;
  let selectingWorkoutForToday = false;
  let todayBuilderExercises = [];
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
      "todayPicker", "chooseWorkoutDatabase", "createCustomTodayWorkout", "todayCustomBuilder",
      "todayWorkoutName", "todayWorkoutCategory", "todayExerciseSelect", "todayExerciseNotes", "addTodayExercise",
      "todayExerciseRounds", "todayExerciseSets", "todayExerciseReps", "todayExerciseTime", "todayExerciseWeight", "todayExerciseRest",
      "todayBuilderList", "saveTodayCustomWorkout", "cancelTodayCustomWorkout", "todayActiveWorkout",
      "quickExerciseButtons", "logMovementSelect", "logForm",
      "logDate", "logFields", "autofillSuggestions", "logEffort", "effortValue",
      "logNotes", "duplicateLastWorkout", "recentResults", "progressMovementSelect",
      "progressBest", "progressPreviousBest", "progressTrend", "progressChart",
      "chartTooltip", "movementHistory", "movementForm", "movementId",
      "movementName", "movementCategory", "movementPrimaryMetric", "movementFavorite",
      "cancelMovementEdit", "benchmarkButtons", "workoutBuilderDetails", "workoutForm", "workoutId", "workoutName", "workoutCategory",
      "workoutFormat", "workoutRounds", "workoutMovements", "workoutMovementSelect", "workoutMoveRounds", "workoutMoveSets", "workoutMoveReps",
      "workoutMoveTime", "workoutMoveWeight", "workoutMoveRest", "addWorkoutMovement", "cancelWorkoutEdit", "workoutList",
      "databaseWorkoutDetail", "workoutBrowse", "closeWorkoutBrowse", "workoutSearch", "workoutDifficultyFilters",
      "workoutCategoryFilters", "favoriteWorkoutChips", "recentWorkoutChips", "databaseWorkoutList",
      "movementList", "profileName", "profileBodyWeight", "darkModeToggle", "unitSelect", "exportData",
      "importData", "clearData", "stickySaveResult", "toast", "openMovementPicker",
      "movementPicker", "closeMovementPicker", "pickerSearch", "pickerFavorites",
      "pickerRecent", "pickerMostUsed", "pickerResults", "movementSearch", "categoryFilters",
      "libraryTabs", "pickerTabs", "libraryMostUsed", "statTotalWorkouts", "statTotalExercises",
      "statTotalPrs", "statCurrentStreak", "statLongestStreak", "statFavoriteExercise",
      "statTopCategory", "statFirstWorkoutDate"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    document.querySelectorAll("[data-nav]").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.nav));
    });

    els.quickAddMovement.addEventListener("click", () => {
      setView("add");
      resetMovementForm();
      els.movementName.focus();
    });

    els.chooseWorkoutDatabase.addEventListener("click", () => {
      selectingWorkoutForToday = true;
      activeDatabaseWorkoutId = null;
      els.workoutBrowse.hidden = false;
      els.databaseWorkoutDetail.hidden = true;
      renderWorkoutDatabase();
      els.workoutSearch.focus();
      els.workoutBrowse.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Choose a workout for today");
    });

    els.closeWorkoutBrowse.addEventListener("click", () => {
      selectingWorkoutForToday = false;
      activeDatabaseWorkoutId = null;
      els.workoutBrowse.hidden = true;
      els.databaseWorkoutDetail.hidden = true;
      showToast("Workout database closed");
    });

    els.createCustomTodayWorkout.addEventListener("click", () => {
      selectingWorkoutForToday = false;
      els.workoutBrowse.hidden = true;
      els.databaseWorkoutDetail.hidden = true;
      els.todayCustomBuilder.hidden = false;
      els.todayPicker.hidden = true;
      renderTodayBuilderList();
      els.todayWorkoutName.focus();
    });

    els.addTodayExercise.addEventListener("click", addTodayBuilderExercise);
    els.saveTodayCustomWorkout.addEventListener("click", saveCustomTodayWorkout);
    els.cancelTodayCustomWorkout.addEventListener("click", cancelCustomTodayWorkout);

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

    els.addWorkoutMovement.addEventListener("click", addWorkoutMovementLine);
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

    [els.profileName, els.profileBodyWeight].forEach((input) => {
      input.addEventListener("input", () => {
        state.profile.name = els.profileName.value.trim();
        state.profile.bodyWeight = els.profileBodyWeight.value.trim();
        saveState();
      });
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
    ensureTodayWorkoutDate();
    renderSummary();
    renderMovementSelects();
    renderTodayExerciseSelect();
    renderWorkoutCategorySelects();
    renderToday();
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
    if (view === "today") renderWorkoutDatabase();
  }

  function renderSummary() {
    const logs = activeLogs();
    const completedWorkouts = state.workoutHistory || [];
    els.totalSessions.textContent = logs.length + completedWorkouts.length;
    els.thisWeekSessions.textContent = logs.filter((log) => isThisWeek(log.date)).length + completedWorkouts.filter((entry) => isThisWeek(entry.date)).length;
    els.trackedMovements.textContent = state.movements.length;
  }

  function renderTodayExerciseSelect() {
    const options = sortMovements(state.movements)
      .map((movement) => `<option value="${movement.id}">${escapeHtml(movement.name)}</option>`)
      .join("");
    [els.todayExerciseSelect, els.workoutMovementSelect].forEach((select) => {
      if (!select) return;
      const previous = select.value;
      select.innerHTML = options;
      if (getMovement(previous)) select.value = previous;
    });
  }

  function renderWorkoutCategorySelects() {
    const categories = workoutCategories.filter((category) => !["All", "Favorites", "Recent"].includes(category));
    const options = categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
    [els.todayWorkoutCategory, els.workoutCategory].forEach((select) => {
      if (!select) return;
      const previous = select.value;
      select.innerHTML = options;
      select.value = categories.includes(previous) ? previous : "General Strength";
    });
  }

  function renderToday() {
    const todayWorkout = getTodayWorkout();
    els.todayCustomBuilder.hidden = true;
    els.todayPicker.hidden = Boolean(todayWorkout);
    els.todayActiveWorkout.hidden = !todayWorkout;
    if (!selectingWorkoutForToday) {
      els.workoutBrowse.hidden = true;
      els.databaseWorkoutDetail.hidden = true;
    }

    if (!todayWorkout) {
      renderTodayBuilderList();
      return;
    }

    els.todayActiveWorkout.innerHTML = `
      <div class="section-heading compact">
        <div>
          <h2>${escapeHtml(todayWorkout.name)}</h2>
          <p>${escapeHtml(todayWorkout.category || "Custom")} ${todayWorkout.difficulty ? `&middot; ${escapeHtml(todayWorkout.difficulty)}` : ""} ${todayWorkout.duration ? `&middot; ${escapeHtml(todayWorkout.duration)}` : ""} ${todayWorkout.equipment ? `&middot; ${escapeHtml(todayWorkout.equipment)}` : ""}</p>
        </div>
      </div>
      ${todayWorkout.goal ? `<p class="workout-note"><strong>Goal:</strong> ${escapeHtml(todayWorkout.goal)}</p>` : ""}
      <div class="today-workout-actions">
        <button class="primary-button" type="button" data-action="today-start">Start Workout</button>
        <button class="secondary-button" type="button" data-action="today-clear">Clear/Change Workout</button>
      </div>
      <div class="workout-exercise-list">
        ${todayWorkout.exercises.map((exercise, index) => `
          <label class="today-exercise-row">
            <input type="checkbox" data-today-check="${index}" ${todayWorkout.checked?.includes(index) ? "checked" : ""}>
            <span>
              <strong>${escapeHtml(exercise.name)}</strong>
              <small>${escapeHtml(exercise.prescription || "")}</small>
            </span>
            <textarea data-today-result="${index}" rows="2" placeholder="Notes/results">${escapeHtml(todayWorkout.results?.[index] || "")}</textarea>
          </label>
        `).join("")}
      </div>
      <button class="primary-button" type="button" data-action="today-finish">Finish Workout</button>
    `;

    els.todayActiveWorkout.querySelector("[data-action='today-start']").addEventListener("click", startWorkoutTimer);
    els.todayActiveWorkout.querySelector("[data-action='today-clear']").addEventListener("click", clearTodayWorkout);
    els.todayActiveWorkout.querySelector("[data-action='today-finish']").addEventListener("click", finishTodayWorkout);
    els.todayActiveWorkout.querySelectorAll("[data-today-check], [data-today-result]").forEach((field) => {
      field.addEventListener("change", saveTodayProgress);
      field.addEventListener("input", saveTodayProgress);
    });
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
    const recentIds = [...new Set(state.workoutHistory
      .filter((entry) => isThisWeek(entry.date))
      .sort((a, b) => b.completedAt - a.completedAt)
      .map((entry) => entry.workoutId))];
    const recent = recentIds.map(getDatabaseWorkout).filter(Boolean).slice(0, 10);

    els.favoriteWorkoutChips.innerHTML = favorites.length
      ? favorites.map((workout) => workoutChip(workout)).join("")
      : '<p class="empty-state">Favorite workouts appear here.</p>';
    els.recentWorkoutChips.innerHTML = recent.length
      ? recent.map((workout) => workoutChip(workout)).join("")
      : '<p class="empty-state">Workouts completed this week appear here.</p>';

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
      const sourceLabel = workout.source === "custom" ? "Custom" : workout.difficulty;
      return `
        <article class="database-workout-card">
          <button type="button" class="database-workout-main" data-open-workout="${workout.id}">
            <span class="category-badge ${difficultyClass(workout.difficulty)}">${escapeHtml(sourceLabel)}</span>
            <strong>${escapeHtml(workout.name)}</strong>
            <span>${escapeHtml(workout.category)} &middot; ${escapeHtml(workout.duration)} &middot; ${escapeHtml(workout.equipment || "No equipment")} &middot; ${completed} completed</span>
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
      els.workoutBrowse.hidden = !selectingWorkoutForToday;
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
      ${workout.goal ? `<p class="workout-note"><strong>Goal:</strong> ${escapeHtml(workout.goal)}</p>` : ""}
      ${workout.equipment ? `<p class="workout-note"><strong>Equipment:</strong> ${escapeHtml(workout.equipment)}</p>` : ""}
      ${workout.notes ? `<p class="workout-note">${escapeHtml(workout.notes)}</p>` : ""}
      ${workout.tags?.length ? `<div class="card-badge-row">${workout.tags.map((tag) => `<span class="standard-badge">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="workout-detail-actions">
        <button class="primary-button" type="button" data-action="use-today">Set as Today's Workout</button>
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
    els.databaseWorkoutDetail.querySelector("[data-action='use-today']").addEventListener("click", () => setDatabaseWorkoutForToday(workout.id));
    els.databaseWorkoutDetail.querySelector("[data-action='start-workout']").addEventListener("click", startWorkoutTimer);
    els.databaseWorkoutDetail.querySelector("[data-action='rest-timer']").addEventListener("click", () => startRestTimer(60));
    els.databaseWorkoutDetail.querySelector("[data-action='favorite-workout']").addEventListener("click", () => toggleDatabaseWorkoutFavorite(workout.id));
    els.databaseWorkoutDetail.querySelector("[data-action='complete-workout']").addEventListener("click", () => completeDatabaseWorkout(workout.id));
    updateWorkoutTimerDisplay();
  }

  function openDatabaseWorkout(id) {
    if (selectingWorkoutForToday) {
      setDatabaseWorkoutForToday(id);
      return;
    }
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

  function setDatabaseWorkoutForToday(id) {
    const workout = getDatabaseWorkout(id);
    if (!workout) return;
    state.todayWorkout = {
      date: localDate(),
      source: "database",
      workoutId: workout.id,
      name: workout.name,
      category: workout.category,
      difficulty: workout.difficulty,
      duration: workout.duration,
      equipment: workout.equipment || "",
      goal: workout.goal || "",
      notes: workout.notes || "",
      tags: Array.isArray(workout.tags) ? [...workout.tags] : [],
      exercises: workout.exercises.map((exercise) => ({ ...exercise })),
      checked: [],
      results: {},
      startedAt: null
    };
    selectingWorkoutForToday = false;
    activeDatabaseWorkoutId = null;
    els.workoutBrowse.hidden = true;
    els.databaseWorkoutDetail.hidden = true;
    saveState();
    renderAll();
    setView("today");
    showToast("Today's workout is set");
  }

  function addTodayBuilderExercise() {
    const movement = getMovement(els.todayExerciseSelect.value);
    if (!movement) return;
    const prescription = buildExercisePrescription("todayExercise", formatMetricNames(movement));
    todayBuilderExercises.push({
      name: movement.name,
      prescription
    });
    clearExercisePrescriptionFields("todayExercise");
    renderTodayBuilderList();
  }

  function addWorkoutMovementLine() {
    const movement = getMovement(els.workoutMovementSelect.value);
    if (!movement) return;
    const prescription = buildExercisePrescription("workoutMove", "");
    const line = `${movement.name}${prescription ? `, ${prescription}` : ""}`;
    const current = els.workoutMovements.value.trim();
    els.workoutMovements.value = current ? `${current}\n${line}` : line;
    clearExercisePrescriptionFields("workoutMove");
    showToast("Movement added");
  }

  function renderTodayBuilderList() {
    if (!els.todayBuilderList) return;
    els.todayBuilderList.innerHTML = todayBuilderExercises.length
      ? todayBuilderExercises.map((exercise, index) => `
        <article class="today-builder-item">
          <span><strong>${escapeHtml(exercise.name)}</strong><small>${escapeHtml(exercise.prescription)}</small></span>
          <button type="button" data-remove-today-exercise="${index}">Remove</button>
        </article>
      `).join("")
      : '<p class="empty-state">Add exercises from the library to build today\'s workout.</p>';

    els.todayBuilderList.querySelectorAll("[data-remove-today-exercise]").forEach((button) => {
      button.addEventListener("click", () => {
        todayBuilderExercises.splice(Number(button.dataset.removeTodayExercise), 1);
        renderTodayBuilderList();
      });
    });
  }

  function saveCustomTodayWorkout() {
    const name = els.todayWorkoutName.value.trim();
    if (!name || !todayBuilderExercises.length) {
      alert("Add a workout name and at least one exercise.");
      return;
    }

    const category = els.todayWorkoutCategory.value || "General Strength";
    const savedWorkoutId = makeId();
    const savedWorkout = {
      id: savedWorkoutId,
      name,
      category,
      format: "custom",
      rounds: "",
      movements: todayBuilderExercises.map((exercise) => `${exercise.name}${exercise.prescription ? `, ${exercise.prescription}` : ""}`),
      duration: "Custom",
      equipment: "Custom",
      goal: "Complete your custom workout.",
      notes: "Created from the Today tab.",
      tags: ["custom", normalizeName(category)].filter(Boolean),
      createdAt: Date.now()
    };

    state.todayWorkout = {
      date: localDate(),
      source: "custom",
      workoutId: customDatabaseWorkoutId(savedWorkoutId),
      name,
      category,
      difficulty: "",
      duration: "",
      equipment: "",
      goal: "",
      notes: "",
      tags: ["custom"],
      exercises: todayBuilderExercises.map((exercise) => ({ ...exercise })),
      checked: [],
      results: {},
      startedAt: null
    };
    state.workouts.push(savedWorkout);
    todayBuilderExercises = [];
    els.todayWorkoutName.value = "";
    els.todayExerciseNotes.value = "";
    clearExercisePrescriptionFields("todayExercise");
    saveState();
    renderAll();
    showToast("Today's workout is set");
  }

  function cancelCustomTodayWorkout() {
    todayBuilderExercises = [];
    els.todayWorkoutName.value = "";
    els.todayExerciseNotes.value = "";
    clearExercisePrescriptionFields("todayExercise");
    selectingWorkoutForToday = false;
    els.workoutBrowse.hidden = true;
    els.databaseWorkoutDetail.hidden = true;
    els.todayCustomBuilder.hidden = true;
    els.todayPicker.hidden = false;
    renderTodayBuilderList();
  }

  function getTodayWorkout() {
    return state.todayWorkout?.date === localDate() ? state.todayWorkout : null;
  }

  function ensureTodayWorkoutDate() {
    if (state.todayWorkout && state.todayWorkout.date !== localDate()) {
      state.todayWorkout = null;
      saveState();
    }
  }

  function saveTodayProgress() {
    const todayWorkout = getTodayWorkout();
    if (!todayWorkout) return;
    todayWorkout.checked = Array.from(els.todayActiveWorkout.querySelectorAll("[data-today-check]"))
      .filter((input) => input.checked)
      .map((input) => Number(input.dataset.todayCheck));
    todayWorkout.results = {};
    els.todayActiveWorkout.querySelectorAll("[data-today-result]").forEach((field) => {
      if (field.value.trim()) todayWorkout.results[field.dataset.todayResult] = field.value.trim();
    });
    saveState();
  }

  function clearTodayWorkout() {
    if (!confirm("Clear today's workout and choose another?")) return;
    state.todayWorkout = null;
    stopWorkoutTimer();
    saveState();
    renderAll();
  }

  function finishTodayWorkout() {
    const todayWorkout = getTodayWorkout();
    if (!todayWorkout) return;
    saveTodayProgress();
    state.workoutHistory.push({
      id: makeId(),
      workoutId: todayWorkout.workoutId || `custom-${makeId()}`,
      workoutName: todayWorkout.name,
      source: todayWorkout.source,
      completedAt: Date.now(),
      date: localDate(),
      checked: todayWorkout.checked || [],
      results: todayWorkout.results || {},
      result: Object.values(todayWorkout.results || {}).filter(Boolean).join(" | "),
      elapsedSeconds: todayWorkout.startedAt ? Math.max(0, Math.floor((Date.now() - todayWorkout.startedAt) / 1000)) : null,
      workoutSnapshot: todayWorkout
    });
    state.todayWorkout = null;
    stopWorkoutTimer();
    saveState();
    renderAll();
    showToast("Workout completed!");
  }

  function getFilteredDatabaseWorkouts() {
    const query = normalizeName(els.workoutSearch.value);
    return getAvailableDatabaseWorkouts()
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

  function getAvailableDatabaseWorkouts() {
    return [...workoutDatabase, ...state.workouts.map(customWorkoutToDatabaseWorkout)];
  }

  function customWorkoutToDatabaseWorkout(workout) {
    return {
      id: customDatabaseWorkoutId(workout.id),
      source: "custom",
      name: workout.name || "Custom Workout",
      category: workout.category || "General Strength",
      difficulty: workout.difficulty || "Beginner",
      duration: workout.duration || workout.rounds || "Custom",
      equipment: workout.equipment || "Custom",
      goal: workout.goal || "Complete your saved custom workout.",
      notes: workout.notes || "Custom workout saved on this device.",
      tags: Array.from(new Set(["custom", normalizeName(workout.category || "General Strength"), ...(workout.tags || [])].filter(Boolean))),
      exercises: (workout.movements || []).map(customWorkoutLineToExercise)
    };
  }

  function customWorkoutLineToExercise(line) {
    const parts = String(line || "").split(",");
    return {
      name: parts.shift().trim() || "Exercise",
      prescription: parts.join(",").trim() || "Complete as written"
    };
  }

  function customDatabaseWorkoutId(id) {
    return `custom-${id}`;
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
    setView("today");
    showToast("Workout complete!");
  }

  function startWorkoutTimer() {
    stopWorkoutTimer();
    const todayWorkout = getTodayWorkout();
    if (activeView === "today" && todayWorkout && !todayWorkout.startedAt) {
      todayWorkout.startedAt = Date.now();
      saveState();
    }
    workoutTimer = {
      kind: "workout",
      startedAt: todayWorkout?.startedAt || Date.now(),
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
          <p>${escapeHtml(workout.category || "General Strength")} &middot; ${escapeHtml(workoutSummary(workout))}</p>
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
    const stats = calculateSettingsStats();
    els.profileName.value = state.profile.name || "";
    els.profileBodyWeight.value = state.profile.bodyWeight || "";
    els.darkModeToggle.checked = state.settings.darkMode;
    els.unitSelect.value = state.settings.units;
    els.statTotalWorkouts.textContent = stats.totalWorkouts;
    els.statTotalExercises.textContent = stats.totalExercises;
    els.statTotalPrs.textContent = stats.totalPrs;
    els.statCurrentStreak.textContent = `${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`;
    els.statLongestStreak.textContent = `${stats.longestStreak} day${stats.longestStreak === 1 ? "" : "s"}`;
    els.statFavoriteExercise.textContent = stats.favoriteExercise;
    els.statTopCategory.textContent = stats.topCategory;
    els.statFirstWorkoutDate.textContent = stats.firstDate;
  }

  function calculateSettingsStats() {
    const logs = activeLogs();
    const workoutHistory = state.workoutHistory || [];
    const datedEntries = [
      ...logs.map((log) => log.date).filter(Boolean),
      ...workoutHistory.map((entry) => entry.date).filter(Boolean)
    ];
    return {
      totalWorkouts: workoutHistory.length + logs.filter((log) => log.workoutId).length,
      totalExercises: logs.length,
      totalPrs: logs.filter((log) => log.pr).length,
      currentStreak: workoutStreak(datedEntries).current,
      longestStreak: workoutStreak(datedEntries).longest,
      favoriteExercise: favoriteExerciseName(logs),
      topCategory: mostUsedWorkoutCategory(workoutHistory),
      firstDate: datedEntries.length ? formatDate(datedEntries.sort()[0]) : "--"
    };
  }

  function workoutStreak(dates) {
    const unique = [...new Set(dates)].sort();
    if (!unique.length) return { current: 0, longest: 0 };
    let longest = 1;
    let run = 1;
    for (let index = 1; index < unique.length; index += 1) {
      const previous = new Date(`${unique[index - 1]}T00:00:00`);
      const current = new Date(`${unique[index]}T00:00:00`);
      const dayGap = Math.round((current - previous) / 86400000);
      run = dayGap === 1 ? run + 1 : 1;
      longest = Math.max(longest, run);
    }
    const today = localDate();
    const yesterday = offsetDate(-1);
    let currentStreak = 0;
    if (unique.includes(today) || unique.includes(yesterday)) {
      let cursor = unique.includes(today) ? today : yesterday;
      while (unique.includes(cursor)) {
        currentStreak += 1;
        cursor = offsetDate(-currentStreak, unique.includes(today) ? today : yesterday);
      }
    }
    return { current: currentStreak, longest };
  }

  function favoriteExerciseName(logs) {
    const counts = new Map();
    logs.forEach((log) => counts.set(log.movementId, (counts.get(log.movementId) || 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? getMovement(top[0])?.name || "--" : "--";
  }

  function mostUsedWorkoutCategory(history) {
    const counts = new Map();
    history.forEach((entry) => {
      const category = entry.workoutSnapshot?.category || getDatabaseWorkout(entry.workoutId)?.category || "Custom";
      counts.set(category, (counts.get(category) || 0) + 1);
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "--";
  }

  function offsetDate(days, from = localDate()) {
    const date = new Date(`${from}T00:00:00`);
    date.setDate(date.getDate() + days);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
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
    const category = els.movementCategory.value || "Strength";
    const tracking = defaultTrackingForCategory(category);

    const movement = {
      id: els.movementId.value || makeId(),
      name: els.movementName.value.trim(),
      category,
      primaryMetric: tracking.primaryMetric,
      metrics: tracking.metrics,
      favorite: false
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

  function defaultTrackingForCategory(category) {
    if (["Cardio", "Conditioning"].includes(category)) return { metrics: ["time", "distance"], primaryMetric: "time" };
    if (["Bodyweight", "Core"].includes(category)) return { metrics: ["sets", "reps"], primaryMetric: "reps" };
    if (["Mobility", "Benchmark"].includes(category)) return { metrics: ["time"], primaryMetric: "time" };
    if (["Plyometrics", "Sports Performance"].includes(category)) return { metrics: ["reps", "distance"], primaryMetric: "distance" };
    return { metrics: ["sets", "reps", "weight"], primaryMetric: "estimatedMax" };
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
      category: els.workoutCategory.value || "General Strength",
      format: els.workoutFormat.value,
      rounds: els.workoutRounds.value.trim(),
      movements,
      duration: els.workoutRounds.value.trim() || "Custom",
      equipment: "Custom",
      goal: "Complete your saved custom workout.",
      notes: "Custom workout saved on this device.",
      tags: ["custom", normalizeName(els.workoutCategory.value || "General Strength")].filter(Boolean),
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

  function buildExercisePrescription(prefix, fallback) {
    const rounds = valueFor(`${prefix}Rounds`);
    const sets = valueFor(`${prefix}Sets`);
    const reps = valueFor(`${prefix}Reps`);
    const time = valueFor(`${prefix}Time`);
    const weight = valueFor(`${prefix}Weight`);
    const rest = valueFor(`${prefix}Rest`);
    const notes = prefix === "todayExercise" ? els.todayExerciseNotes.value.trim() : "";
    const parts = [];

    if (rounds) parts.push(`${rounds} round${rounds === "1" ? "" : "s"}`);
    if (sets && reps) {
      parts.push(`${sets}x${reps}`);
    } else {
      if (sets) parts.push(`${sets} set${sets === "1" ? "" : "s"}`);
      if (reps) parts.push(`${reps} rep${reps === "1" ? "" : "s"}`);
    }
    if (time) parts.push(time);
    if (weight) parts.push(weight);
    if (rest) parts.push(`rest ${rest}`);
    if (notes) parts.push(notes);

    return parts.join(", ") || fallback || "Complete with quality reps";
  }

  function valueFor(id) {
    return String(els[id]?.value || "").trim();
  }

  function clearExercisePrescriptionFields(prefix) {
    ["Rounds", "Sets", "Reps", "Time", "Weight", "Rest"].forEach((suffix) => {
      if (els[`${prefix}${suffix}`]) els[`${prefix}${suffix}`].value = "";
    });
    if (prefix === "todayExercise") els.todayExerciseNotes.value = "";
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
    els.movementCategory.value = "Strength";
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
    els.workoutCategory.value = workout.category || "General Strength";
    els.workoutFormat.value = workout.format || "time";
    els.workoutRounds.value = workout.rounds || "";
    els.workoutMovements.value = (workout.movements || []).join("\n");
    els.workoutBuilderDetails.open = true;
    els.workoutName.focus();
  }

  function resetWorkoutForm() {
    els.workoutId.value = "";
    els.workoutForm.reset();
    els.workoutCategory.value = "General Strength";
    els.workoutFormat.value = "time";
    clearExercisePrescriptionFields("workoutMove");
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
    return normalizeName(`${workout.name} ${workout.category} ${workout.difficulty} ${workout.duration} ${workout.equipment || ""} ${workout.goal || ""} ${workout.notes || ""} ${(workout.tags || []).join(" ")} ${workout.exercises.map((exercise) => `${exercise.name} ${exercise.prescription}`).join(" ")}`);
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
    return getAvailableDatabaseWorkouts().find((workout) => workout.id === id);
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
      version: 6,
      settings: {
        darkMode: Boolean(input.settings?.darkMode),
        units: input.settings?.units === "kg" ? "kg" : "lb"
      },
      profile: {
        name: input.profile?.name || "",
        bodyWeight: input.profile?.bodyWeight || ""
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
        category: workout.category || "General Strength",
        format: ["time", "amrap", "emom", "rounds", "custom"].includes(workout.format) ? workout.format : "time",
        rounds: workout.rounds || "",
        movements: Array.isArray(workout.movements)
          ? workout.movements.filter(Boolean).map(String)
          : String(workout.movements || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
        duration: workout.duration || workout.rounds || "Custom",
        equipment: workout.equipment || "Custom",
        goal: workout.goal || "Complete your saved custom workout.",
        notes: workout.notes || "",
        tags: Array.isArray(workout.tags) ? workout.tags.map(String) : ["custom"],
        createdAt: Number(workout.createdAt || Date.now())
      })) : [],
      workoutFavorites: Array.isArray(input.workoutFavorites)
        ? input.workoutFavorites.filter(Boolean).map(String)
        : [],
      workoutHistory: Array.isArray(input.workoutHistory) ? input.workoutHistory.map((entry, index) => ({
        id: entry.id || makeId(),
        workoutId: entry.workoutId,
        workoutName: entry.workoutName || workoutDatabase.find((workout) => workout.id === entry.workoutId)?.name || "",
        source: entry.source || (String(entry.workoutId || "").startsWith("custom-") ? "custom" : "database"),
        completedAt: Number(entry.completedAt || Date.now() + index),
        date: entry.date || localDate(),
        checked: Array.isArray(entry.checked) ? entry.checked.map(Number).filter(Number.isFinite) : [],
        results: entry.results && typeof entry.results === "object" ? entry.results : {},
        result: entry.result || "",
        elapsedSeconds: Number.isFinite(Number(entry.elapsedSeconds)) ? Number(entry.elapsedSeconds) : null,
        workoutSnapshot: entry.workoutSnapshot || null
      })) : [],
      todayWorkout: normalizeTodayWorkout(input.todayWorkout),
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

  function normalizeTodayWorkout(workout) {
    if (!workout || typeof workout !== "object" || !Array.isArray(workout.exercises)) return null;
    return {
      date: workout.date || localDate(),
      source: workout.source === "database" ? "database" : "custom",
      workoutId: workout.workoutId || "",
      name: workout.name || "Today's Workout",
      category: workout.category || "Custom",
      difficulty: workout.difficulty || "",
      duration: workout.duration || "",
      equipment: workout.equipment || "",
      goal: workout.goal || "",
      notes: workout.notes || "",
      tags: Array.isArray(workout.tags) ? workout.tags.map(String) : [],
      exercises: workout.exercises.map((exercise) => ({
        name: exercise.name || "Exercise",
        prescription: exercise.prescription || ""
      })),
      checked: Array.isArray(workout.checked) ? workout.checked.map(Number).filter(Number.isFinite) : [],
      results: workout.results && typeof workout.results === "object" ? workout.results : {},
      startedAt: Number.isFinite(Number(workout.startedAt)) ? Number(workout.startedAt) : null
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

  function round(value) {
    return Math.round(value * 10) / 10;
  }

  function makeId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function workoutGroup(category, equipment, tags, workouts) {
    return { category, equipment, tags, workouts };
  }

  function buildWorkoutDatabase() {
    return workoutBlueprints.flatMap((group) => group.workouts.map((workout) => {
      const [name, difficulty, duration, goal, lines, notes, extraTags = []] = workout;
      return workoutTemplate({
        id: `db-${slugify(`${group.category}-${name}`)}`,
        name,
        category: group.category,
        difficulty,
        duration,
        equipment: group.equipment,
        goal,
        lines,
        notes: notes || "Complete with quality movement. Record loads, times, or notes after training.",
        tags: [...group.tags, ...extraTags, difficulty.toLowerCase()]
      });
    }));
  }

  function workoutTemplate({ id, name, category, difficulty, duration, equipment, goal, lines, notes, tags }) {
    return {
      id,
      name,
      category,
      difficulty,
      duration,
      equipment,
      goal,
      exercises: lines.map((line) => {
        const parts = line.split(",");
        return {
          name: parts.shift().trim(),
          prescription: parts.join(",").trim() || "Complete with quality reps"
        };
      }),
      notes,
      tags: Array.from(new Set(tags || []))
    };
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
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
