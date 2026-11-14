document.addEventListener("DOMContentLoaded", () => {
    const stars = document.getElementById("stars");
    const space = document.getElementById("space");

    const homeNavBtn = document.getElementById("homeNavBtn");
    const aboutBtn = document.getElementById("aboutBtn");
    const developersBtn = document.getElementById("developersBtn");
    const backToGameBtn = document.getElementById("backToGameBtn");

    const home = document.getElementById("home");
    const about = document.getElementById("about");
    const developers = document.getElementById("developers");

    const launch = document.getElementById("launchBtn");

    const moon = document.getElementById("moon");
    const spaceship = document.getElementById("spaceship");
    const penguin = document.getElementById("penguin");

    const delayed = document.getElementById("delayed");
    const delayedbtn = document.querySelector(".delayed-button");
    const delayedtxt = document.querySelector(".delayed-text");

    const lunarSurface = document.getElementById("lunarSurface");
    const dayDisplay = document.getElementById("dayDisplay");
    const timerDisplay = document.getElementById("timerDisplay");
    
    const dayActionBtn = document.getElementById("dayActionBtn");
    const resignBtn = document.getElementById("resignBtn");

    const questionModal = document.getElementById("questionModal");
    const questionTitle = document.getElementById("questionTitle");
    const questionText = document.getElementById("questionText");
    const answerButtons = document.getElementById("answerButtons");
    const penguinSpeech = document.getElementById("penguinSpeech");
    const redAlertOverlay = document.getElementById("redAlertOverlay");

    const minimizeModalBtn = document.getElementById("minimizeModalBtn");
    const reopenQuestionBtn = document.getElementById("reopenQuestionBtn");

    let currentDay = 1;
    const maxDays = 10;
    let gameStarted = false;
    let missionActive = false;
    let timerInterval = null;
    let timeLeft = 900; 
    let dayReady = true;

    let stats = {
        energy: 100,
        oxygen: 100,
        water: 100,
        radiation: 100,
        life: 100
    };

    let currentQuestionData = null;

    const questionPool = {
        1: [
            {
                title: "DAY 1: OUTPOST POWER TRADE-OFF",
                text: "Solar panel collectors are covered in lunar dust, dropping efficiency. Diverting auxiliary battery reserves cleans them instantly but risks power shortages.",
                choices: [
                    { text: "A) Divert capacitor reserves to thermal sweep", correct: true, targetStat: "energy" },
                    { text: "B) Ignore dust and run on reduced power", correct: false, targetStat: "energy" },
                    { text: "C) Shut down habitat heating entirely", correct: false, targetStat: "life" }
                ],
                penguin: "Commander! Dust is killing our solar input. We need an energy trade-off decision!"
            },
            {
                title: "DAY 1: POWER GRID BALANCING",
                text: "Engineering demands extra power for thermal regulation, straining the main battery bank.",
                choices: [
                    { text: "A) Recalibrate power distribution regulators", correct: true, targetStat: "energy" },
                    { text: "B) Overclock the main grid past safety limits", correct: false, targetStat: "energy" },
                    { text: "C) Disconnect environmental scrubbers", correct: false, targetStat: "oxygen" }
                ],
                penguin: "Power lines are overheating! Balance the grid carefully."
            }
        ],
        2: [
            {
                title: "DAY 2: WATER RECYCLING BOTTLENECK",
                text: "Greywater filtration is clogging, forcing a choice between slowing down output or bypassing safety filters.",
                choices: [
                    { text: "A) Initiate ultrasonic reverse osmosis backwash", correct: true, targetStat: "water" },
                    { text: "B) Bypass filters to maintain high flow rate", correct: false, targetStat: "water" },
                    { text: "C) Stop all water recycling temporarily", correct: false, targetStat: "water" }
                ],
                penguin: "Water recycling is backing up, Commander! How do we adjust the filters?"
            },
            {
                title: "DAY 2: HYDRO-VALVE PRESSURE",
                text: "Pressure spikes in the hydroponics water distribution line threaten to rupture pipe seals.",
                choices: [
                    { text: "A) Vent excess pressure through relief valves", correct: true, targetStat: "water" },
                    { text: "B) Seal all valves and ignore pressure gauges", correct: false, targetStat: "water" },
                    { text: "C) Divert water flow into life support systems", correct: false, targetStat: "life" }
                ],
                penguin: "Pipe pressure is getting critical in the water system!"
            }
        ],
        3: [
            {
                title: "DAY 3: OXYGEN SCRUBBER CAPACITY",
                text: "Habitat CO2 buildup is rising faster than scrubbers can process. Do we trade energy for faster fan speeds?",
                choices: [
                    { text: "A) Purge lithium hydroxide canisters & boost fans", correct: true, targetStat: "oxygen" },
                    { text: "B) Reduce habitat occupancy limits", correct: false, targetStat: "oxygen" },
                    { text: "C) Cut scrubber power to save electricity", correct: false, targetStat: "energy" }
                ],
                penguin: "Air quality is dropping! We must balance power and oxygen."
            },
            {
                title: "DAY 3: VENTILATION CIRCUIT STRAIN",
                text: "Air circulation motors are drawing excess current, risking circuit overload.",
                choices: [
                    { text: "A) Balance motor load across secondary circuits", correct: true, targetStat: "oxygen" },
                    { text: "B) Shut down ventilation in sleeping quarters", correct: false, targetStat: "oxygen" },
                    { text: "C) Ignore current spikes", correct: false, targetStat: "energy" }
                ],
                penguin: "Ventilation motors are working overtime, Commander."
            }
        ],
        4: [
            {
                title: "DAY 4: RADIATION SHIELDING TRADE-OFF",
                text: "Cosmic background radiation levels are spiking. Magnetic shielding requires high power input.",
                choices: [
                    { text: "A) Maximize magnetic deflector grids using reserve power", correct: true, targetStat: "radiation" },
                    { text: "B) Power down shields to preserve battery reserve", correct: false, targetStat: "radiation" },
                    { text: "C) Evacuate crew into unshielded corridors", correct: false, targetStat: "life" }
                ],
                penguin: "Radiation levels are climbing! We need magnetic shielding."
            },
            {
                title: "DAY 4: SENSOR ARRAY ALIGNMENT",
                text: "Radiation telemetry sensors are drifting due to solar wind bombardment.",
                choices: [
                    { text: "A) Recalibrate sensor gain and filter static", correct: true, targetStat: "radiation" },
                    { text: "B) Disconnect sensors to save power", correct: false, targetStat: "radiation" },
                    { text: "C) Reset core mainframe entirely", correct: false, targetStat: "energy" }
                ],
                penguin: "Telemetry sensors need alignment to track radiation flux."
            }
        ],
        5: [
            {
                title: "DAY 5: METEORITE IMPACT ON MODULE B!",
                text: "A devastating water meteorite has struck Module B1! Fire and hull breaches detected. Choose correct emergency engineering trade-off:",
                choices: [
                    { text: "A) Radiation & Energy shields lockdown", correct: true, targetStat: "radiation" },
                    { text: "B) Flush primary water coolant tanks completely", correct: false, targetStat: "water" },
                    { text: "C) Seal habitat airlocks and cut life support", correct: false, targetStat: "life" }
                ],
                penguin: "ALERT! Water meteorite impact on Module B1! Choose emergency repairs!"
            }
        ],
        6: [
            {
                title: "DAY 6: LIFE SUPPORT RECIRCULATION",
                text: "Life support pumps are losing prime pressure, threatening crew habitats.",
                choices: [
                    { text: "A) Prime pumps with secondary accumulator tanks", correct: true, targetStat: "life" },
                    { text: "B) Run pumps dry until pressure builds", correct: false, targetStat: "life" },
                    { text: "C) Shut down life support monitors", correct: false, targetStat: "oxygen" }
                ],
                penguin: "Life support pressure is fluctuating! We need stable recirculation."
            },
            {
                title: "DAY 6: HABITAT THERMAL CONTROL",
                text: "Internal base temperature regulation is drifting out of safe human tolerances.",
                choices: [
                    { text: "A) Recalibrate thermal exchange loops", correct: true, targetStat: "life" },
                    { text: "B) Open exterior airlock to cool down", correct: false, targetStat: "oxygen" },
                    { text: "C) Turn off all heating coils", correct: false, targetStat: "energy" }
                ],
                penguin: "Habitat temperature is getting unstable, Commander."
            }
        ],
        7: [
            {
                title: "DAY 7: DEEP SPACE TELEMETRY STATIC",
                text: "Interference is scrambling command signals, requiring power rerouting to clear channels.",
                choices: [
                    { text: "A) Calibrate sub-space frequency filters", correct: true, targetStat: "radiation" },
                    { text: "B) Power down communications dish", correct: false, targetStat: "energy" },
                    { text: "C) Overload transmitter amplifiers", correct: false, targetStat: "radiation" }
                ],
                penguin: "Static is blocking our data feeds! Clean the signal channels."
            }
        ],
        8: [
            {
                title: "DAY 8: HYDROPONICS CROP NUTRIENTS",
                text: "Hydroponic nitrogen levels are dropping, slowing food production in Module D.",
                choices: [
                    { text: "A) Inject organic nutrient compound mix", correct: true, targetStat: "water" },
                    { text: "B) Turn off grow lights to save power", correct: false, targetStat: "energy" },
                    { text: "C) Flush hydroponic vats with greywater", correct: false, targetStat: "water" }
                ],
                penguin: "Our space crops need a balanced nutrient injection!"
            }
        ],
        9: [
            {
                title: "DAY 9: CORRIDOR SEAL MICRO-FRACTURE",
                text: "A tiny meteorite impact caused a micro-fracture leaking cabin pressure in the connecting corridor.",
                choices: [
                    { text: "A) Apply polymer epoxy resin patch and pressurize", correct: true, targetStat: "oxygen" },
                    { text: "B) Seal off the entire corridor permanently", correct: false, targetStat: "life" },
                    { text: "C) Ignore the leak and rely on backup oxygen", correct: false, targetStat: "oxygen" }
                ],
                penguin: "Pressure leak detected in the corridor seal! Quick patch needed."
            }
        ],
        10: [
            {
                title: "DAY 10: FINAL EXTRACTION OVERRIDE",
                text: "All outpost systems must synchronize for final shuttle extraction and telemetry lockdown.",
                choices: [
                    { text: "A) Engage main thrusters and telemetry lock sequence", correct: true, targetStat: "life" },
                    { text: "B) Purge all remaining fuel reserves prematurely", correct: false, targetStat: "energy" },
                    { text: "C) Disconnect life support telemetry", correct: false, targetStat: "life" }
                ],
                penguin: "Commander! This is our final day! Secure our extraction!"
            }
        ]
    };

    function createStar() {
        if (!stars) return;
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        if (Math.random() < 0.15) star.classList.add("big");
        stars.appendChild(star);
    }

    function showPage(page) {
        if (home) home.classList.add("hidden");
        if (about) about.classList.add("hidden");
        if (developers) developers.classList.add("hidden");
        if (page) page.classList.remove("hidden");
    }

    function restoreSpaceElements() {
        if (stars) stars.classList.remove("hidden");
        if (space) space.classList.remove("hidden");
        if (penguin) penguin.classList.remove("hidden");
        if (moon) moon.classList.remove("hidden");
        if (spaceship) spaceship.classList.remove("hidden");
    }

    function hideSpaceElements() {
        if (penguin) penguin.classList.add("hidden");
        if (moon) moon.classList.add("hidden");
        if (spaceship) spaceship.classList.add("hidden");
    }

    function hideLunarSurface() {
        if (lunarSurface) lunarSurface.classList.add("hidden");
        if (missionActive && backToGameBtn) {
            backToGameBtn.classList.remove("hidden");
        }
    }

    function updateUI() {
        if (dayDisplay) dayDisplay.textContent = `DAY ${currentDay} / ${maxDays}`;
        
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            const bar = document.getElementById(id.replace("Value", "Bar"));
            if (el) el.textContent = val + "%";
            if (bar) bar.style.width = val + "%";
        };
        setVal("energyValue", stats.energy);
        setVal("oxygenValue", stats.oxygen);
        setVal("waterValue", stats.water);
        setVal("radiationValue", stats.radiation);
        setVal("lifeValue", stats.life);
    }

    function checkGameOver() {
        for (let key in stats) {
            if (stats[key] <= 0) {
                clearInterval(timerInterval);
                alert("MISSION FAILURE: System " + key.toUpperCase() + " reached 0%!");
                location.reload();
            }
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            let mins = Math.floor(timeLeft / 60);
            let secs = timeLeft % 60;
            if (timerDisplay) timerDisplay.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("TIME OUT! 15-minute mission window expired!");
                location.reload();
            }
        }, 1000);
    }

    function startDayCycle() {
        if (currentDay > maxDays) {
            clearInterval(timerInterval);
            alert("VICTORY! You successfully balanced outpost engineering trade-offs across 10 days!");
            location.reload();
            return;
        }

        updateUI();
        if (dayActionBtn) {
            dayActionBtn.textContent = `START DAY ${currentDay}`;
            dayActionBtn.disabled = false;
        }
        dayReady = true;
    }

    if (dayActionBtn) {
        dayActionBtn.addEventListener("click", () => {
            if (!dayReady) return;
            dayReady = false;
            dayActionBtn.disabled = true;

            if (currentDay === 5) {
                triggerMeteoriteEvent();
            } else {
                showDailyQuestion();
            }
        });
    }

    function triggerMeteoriteEvent() {
        if (redAlertOverlay) redAlertOverlay.classList.remove("hidden");
        
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            flashCount++;
            if (flashCount >= 10) {
                clearInterval(flashInterval);
                if (redAlertOverlay) redAlertOverlay.classList.add("hidden");
                
                const moduleBRoom = document.getElementById("moduleBRoom");
                const moduleBLabel = document.getElementById("moduleBLabel");
                const moduleBContent = document.getElementById("moduleBContent");
                const moduleBTable = document.getElementById("moduleBTable");
                const moduleBPipes = document.getElementById("moduleBPipes");
                const moduleBRack = document.getElementById("moduleBRack");
                const moduleBSub = document.getElementById("moduleBSub");

                if (moduleBRoom) moduleBRoom.classList.add("destroyed-module");
                if (moduleBLabel) moduleBLabel.textContent = "MODULE B1 - DESTROYED BY METEORITE";
                if (moduleBContent) moduleBContent.innerHTML = `<div class="scrap-metal">⚙️ 🔩 💥</div><div class="smoke-particle"></div>`;
                if (moduleBTable) moduleBTable.style.display = "none";
                if (moduleBPipes) moduleBPipes.style.display = "none";
                if (moduleBRack) moduleBRack.style.display = "none";
                if (moduleBSub) moduleBSub.textContent = "CRATER / DEBRIS ZONE";

                showDailyQuestion();
            }
        }, 500);
    }

    function showDailyQuestion() {
        const pool = questionPool[currentDay] || questionPool[1];
        currentQuestionData = pool[Math.floor(Math.random() * pool.length)];

        if (questionTitle) questionTitle.textContent = currentQuestionData.title;
        if (questionText) questionText.textContent = currentQuestionData.text;
        if (penguinSpeech) penguinSpeech.textContent = `🐧 "${currentQuestionData.penguin}"`;

        if (answerButtons) {
            answerButtons.innerHTML = "";
            currentQuestionData.choices.forEach(choice => {
                const btn = document.createElement("button");
                btn.className = "answer-btn";
                btn.textContent = choice.text;
                btn.addEventListener("click", () => handleAnswer(choice, true));
                answerButtons.appendChild(btn);
            });
        }

        if (questionModal) questionModal.classList.remove("hidden");
        if (reopenQuestionBtn) reopenQuestionBtn.classList.add("hidden");
    }

    if (minimizeModalBtn) {
        minimizeModalBtn.addEventListener("click", () => {
            if (questionModal) questionModal.classList.add("hidden");
            if (reopenQuestionBtn) reopenQuestionBtn.classList.remove("hidden");
        });
    }

    if (reopenQuestionBtn) {
        reopenQuestionBtn.addEventListener("click", () => {
            if (questionModal) questionModal.classList.remove("hidden");
            reopenQuestionBtn.classList.add("hidden");
        });
    }

    if (resignBtn) {
        resignBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to resign from this mission?")) {
                clearInterval(timerInterval);
                location.reload();
            }
        });
    }

    function handleAnswer(choice, answered) {
        if (questionModal) questionModal.classList.add("hidden");
        if (reopenQuestionBtn) reopenQuestionBtn.classList.add("hidden");

        let hitStat = choice.targetStat;

        if (answered && choice.correct) {
            stats[hitStat] = Math.max(0, stats[hitStat] - 20);

            const statKeys = Object.keys(stats);
            const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
            stats[randomStat] = Math.min(100, stats[randomStat] + 10);

            stats[hitStat] = Math.min(100, stats[hitStat] + 20);
        } else {
            const safeStats = Object.keys(stats).filter(k => stats[k] > 35);
            const target = safeStats.length > 0 ? safeStats[Math.floor(Math.random() * safeStats.length)] : hitStat;
            stats[target] = Math.max(0, stats[target] - 35);

            if (currentDay === 5) {
                stats.life = 25;
                alert("LOCKDOWN ENGAGED: Module B failed! Life Support dropped to 25%!");
            }
        }

        stats.water = Math.max(0, stats.water - 5);
        stats.life = Math.max(0, stats.life - 5);
        stats.energy = Math.max(0, stats.energy - 5);
        stats.oxygen = Math.max(0, stats.oxygen - 5);
        stats.radiation = Math.max(0, stats.radiation - 5);

        updateUI();
        checkGameOver();

        setTimeout(() => {
            currentDay++;
            startDayCycle();
        }, 12000);
    }

    for (let i = 0; i < 50; i++) createStar();

    if (homeNavBtn) {
        homeNavBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (delayed) delayed.classList.add("hidden");
            hideLunarSurface();
            restoreSpaceElements();
            showPage(home);
        });
    }

    if (aboutBtn) {
        aboutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (delayed) delayed.classList.add("hidden");
            hideLunarSurface();
            restoreSpaceElements();
            hideSpaceElements();
            showPage(about);
        });
    }

    if (developersBtn) {
        developersBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (delayed) delayed.classList.add("hidden");
            hideLunarSurface();
            restoreSpaceElements();
            hideSpaceElements();
            showPage(developers);
        });
    }

    if (backToGameBtn) {
        backToGameBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (home) home.classList.add("hidden");
            if (about) about.classList.add("hidden");
            if (developers) developers.classList.add("hidden");
            if (delayed) delayed.classList.add("hidden");
            if (stars) stars.classList.add("hidden");
            if (space) space.classList.add("hidden");
            hideSpaceElements();
            if (lunarSurface) lunarSurface.classList.remove("hidden");
            backToGameBtn.classList.add("hidden");
        });
    }

    if (launch) {
        launch.addEventListener("click", (e) => {
            e.preventDefault();
            if (missionActive) {
                alert("Sorry, but finish your first mission to start a new one!");
                return;
            }
            if (home) home.classList.add("hidden");
            hideSpaceElements();
            if (delayed) delayed.classList.remove("hidden");
            if (delayedtxt) delayedtxt.classList.remove("hidden");
            if (delayedbtn) delayedbtn.classList.remove("hidden");
        });
    }

    if (delayedbtn) {
        delayedbtn.addEventListener("click", (e) => {
            e.preventDefault();
            gameStarted = true;
            missionActive = true;
            if (delayed) delayed.classList.add("hidden");
            if (delayedtxt) delayedtxt.classList.add("hidden");
            if (delayedbtn) delayedbtn.classList.add("hidden");
            showPage(home);
            if (home) home.classList.add("hidden");

            hideSpaceElements();
            if (stars) stars.classList.add("hidden");
            if (space) space.classList.add("hidden");

            currentDay = 1;
            timeLeft = 900;
            stats = { energy: 100, oxygen: 100, water: 100, radiation: 100, life: 100 };
            updateUI();

            if (lunarSurface) lunarSurface.classList.remove("hidden");
            if (backToGameBtn) backToGameBtn.classList.add("hidden");

            startTimer();
            startDayCycle();
        });
    }
});