/**
 * CaloTrack - Vanilla Calorie & Macro Tracker
 * Pure HTML, CSS, and JS. No frameworks, no external libraries.
 * Persistent storage via browser LocalStorage.
 */

(function () {
  'use strict';

  // ==========================================================================
  // Storage Keys & Constants
  // ==========================================================================
  const STORAGE_KEY_DATA = 'calotrack_logs_v1';
  const STORAGE_KEY_PROFILE = 'calotrack_profile_v1';

  const DEFAULT_PROFILE = {
    calorieGoal: 2000,
    proteinGoal: 140,
    carbsGoal: 200,
    fatGoal: 65
  };

  const PRESET_FOODS = [
    { name: '2 Scrambled Eggs', calories: 140, protein: 12, carbs: 1, fat: 10, meal: 'breakfast' },
    { name: 'Oatmeal & Berries', calories: 250, protein: 7, carbs: 48, fat: 4, meal: 'breakfast' },
    { name: 'Medium Banana', calories: 105, protein: 1, carbs: 27, fat: 0.3, meal: 'snacks' },
    { name: 'Chicken Breast (150g)', calories: 248, protein: 46, carbs: 0, fat: 5, meal: 'lunch' },
    { name: 'Cooked White Rice (1 cup)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, meal: 'lunch' },
    { name: 'Half Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, meal: 'lunch' },
    { name: 'Grilled Salmon (150g)', calories: 310, protein: 34, carbs: 0, fat: 18, meal: 'dinner' },
    { name: 'Whey Protein Shake', calories: 130, protein: 25, carbs: 3, fat: 2, meal: 'snacks' },
    { name: 'Greek Salad', calories: 210, protein: 5, carbs: 10, fat: 16, meal: 'dinner' },
    { name: 'Greek Yogurt (1 cup)', calories: 130, protein: 15, carbs: 6, fat: 4, meal: 'snacks' }
  ];

  // ==========================================================================
  // State Management
  // ==========================================================================
  let trackerData = {};
  let userProfile = { ...DEFAULT_PROFILE };
  let currentDate = getTodayDateString();

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const datePicker = document.getElementById('datePicker');
  const prevDateBtn = document.getElementById('prevDateBtn');
  const nextDateBtn = document.getElementById('nextDateBtn');
  const todayBtn = document.getElementById('todayBtn');

  const consumedCaloriesEl = document.getElementById('consumedCalories');
  const targetCaloriesEl = document.getElementById('targetCalories');
  const remainingCaloriesEl = document.getElementById('remainingCalories');
  const calorieProgressBar = document.getElementById('calorieProgressBar');
  const calorieBudgetStatus = document.getElementById('calorieBudgetStatus');

  const proteinConsumedEl = document.getElementById('proteinConsumed');
  const proteinTargetEl = document.getElementById('proteinTarget');
  const proteinProgress = document.getElementById('proteinProgress');

  const carbsConsumedEl = document.getElementById('carbsConsumed');
  const carbsTargetEl = document.getElementById('carbsTarget');
  const carbsProgress = document.getElementById('carbsProgress');

  const fatConsumedEl = document.getElementById('fatConsumed');
  const fatTargetEl = document.getElementById('fatTarget');
  const fatProgress = document.getElementById('fatProgress');

  const presetChipsContainer = document.getElementById('presetChipsContainer');

  const foodEntryForm = document.getElementById('foodEntryForm');
  const mealTypeSelect = document.getElementById('mealTypeSelect');
  const foodNameInput = document.getElementById('foodNameInput');
  const foodCaloriesInput = document.getElementById('foodCaloriesInput');
  const foodProteinInput = document.getElementById('foodProteinInput');
  const foodCarbsInput = document.getElementById('foodCarbsInput');
  const foodFatInput = document.getElementById('foodFatInput');

  // Modal elements
  const settingsModal = document.getElementById('settingsModal');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const goalsForm = document.getElementById('goalsForm');
  const goalCaloriesInput = document.getElementById('goalCalories');
  const goalProteinInput = document.getElementById('goalProtein');
  const goalCarbsInput = document.getElementById('goalCarbs');
  const goalFatInput = document.getElementById('goalFat');

  const exportDataBtn = document.getElementById('exportDataBtn');
  const importFileInput = document.getElementById('importFileInput');
  const clearTodayBtn = document.getElementById('clearTodayBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');

  // ==========================================================================
  // Date Helpers
  // ==========================================================================
  function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function shiftDate(dateStr, daysOffset) {
    const parts = dateStr.split('-');
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    date.setDate(date.getDate() + daysOffset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ==========================================================================
  // Storage Management
  // ==========================================================================
  function loadFromStorage() {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (storedProfile) {
        userProfile = Object.assign({}, DEFAULT_PROFILE, JSON.parse(storedProfile));
      }

      const storedData = localStorage.getItem(STORAGE_KEY_DATA);
      if (storedData) {
        trackerData = JSON.parse(storedData);
      } else {
        // First time initialization: seed today with sample foods to immediately demonstrate the app
        seedInitialDemoData();
      }
    } catch (err) {
      console.error('Error reading localStorage data:', err);
      trackerData = {};
      userProfile = { ...DEFAULT_PROFILE };
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(trackerData));
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }

  function seedInitialDemoData() {
    const today = getTodayDateString();
    trackerData = {
      [today]: [
        {
          id: 'demo-1',
          meal: 'breakfast',
          name: '2 Scrambled Eggs & Whole Wheat Toast',
          calories: 280,
          protein: 16,
          carbs: 22,
          fat: 14
        },
        {
          id: 'demo-2',
          meal: 'breakfast',
          name: 'Black Coffee & Banana',
          calories: 110,
          protein: 1.5,
          carbs: 28,
          fat: 0.5
        },
        {
          id: 'demo-3',
          meal: 'lunch',
          name: 'Grilled Chicken Breast with Steamed Brown Rice',
          calories: 450,
          protein: 48,
          carbs: 45,
          fat: 6
        }
      ]
    };
    saveToStorage();
  }

  // ==========================================================================
  // Render & Calculation Functions
  // ==========================================================================
  function renderAll() {
    // 1. Sync Date Inputs
    datePicker.value = currentDate;
    const isToday = currentDate === getTodayDateString();
    todayBtn.style.opacity = isToday ? '1' : '0.7';

    // 2. Fetch day's logs
    const dayEntries = trackerData[currentDate] || [];

    // 3. Compute Totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const mealCategories = {
      breakfast: { count: 0, calories: 0, items: [] },
      lunch: { count: 0, calories: 0, items: [] },
      dinner: { count: 0, calories: 0, items: [] },
      snacks: { count: 0, calories: 0, items: [] }
    };

    dayEntries.forEach(item => {
      const cal = Number(item.calories) || 0;
      const p = Number(item.protein) || 0;
      const c = Number(item.carbs) || 0;
      const f = Number(item.fat) || 0;

      totalCalories += cal;
      totalProtein += p;
      totalCarbs += c;
      totalFat += f;

      const category = mealCategories[item.meal] ? item.meal : 'snacks';
      mealCategories[category].count += 1;
      mealCategories[category].calories += cal;
      mealCategories[category].items.push(item);
    });

    // 4. Update Calorie Overview Stats
    consumedCaloriesEl.textContent = Math.round(totalCalories).toLocaleString();
    targetCaloriesEl.textContent = Math.round(userProfile.calorieGoal).toLocaleString();

    const calorieDiff = userProfile.calorieGoal - totalCalories;
    const calPercentage = Math.min((totalCalories / userProfile.calorieGoal) * 100, 100);

    calorieProgressBar.style.width = `${calPercentage}%`;

    if (calorieDiff >= 0) {
      calorieProgressBar.style.backgroundColor = '#4f46e5'; // Primary Indigo
      calorieBudgetStatus.innerHTML = `Remaining: <strong id="remainingCalories" style="color:#10b981;">${Math.round(calorieDiff).toLocaleString()}</strong> kcal`;
    } else {
      calorieProgressBar.style.backgroundColor = '#ef4444'; // Red over-budget
      calorieBudgetStatus.innerHTML = `Over budget by: <strong id="remainingCalories" style="color:#ef4444;">${Math.abs(Math.round(calorieDiff)).toLocaleString()}</strong> kcal`;
    }

    // 5. Update Macronutrients Overview
    proteinConsumedEl.textContent = Math.round(totalProtein);
    proteinTargetEl.textContent = userProfile.proteinGoal;
    const pPercent = Math.min((totalProtein / userProfile.proteinGoal) * 100, 100);
    proteinProgress.style.width = `${pPercent}%`;

    carbsConsumedEl.textContent = Math.round(totalCarbs);
    carbsTargetEl.textContent = userProfile.carbsGoal;
    const cPercent = Math.min((totalCarbs / userProfile.carbsGoal) * 100, 100);
    carbsProgress.style.width = `${cPercent}%`;

    fatConsumedEl.textContent = Math.round(totalFat);
    fatTargetEl.textContent = userProfile.fatGoal;
    const fPercent = Math.min((totalFat / userProfile.fatGoal) * 100, 100);
    fatProgress.style.width = `${fPercent}%`;

    // 6. Update Each Meal List
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(category => {
      const catData = mealCategories[category];
      const countEl = document.getElementById(`count-${category}`);
      const calEl = document.getElementById(`calories-${category}`);
      const listEl = document.getElementById(`list-${category}`);

      countEl.textContent = `${catData.count} item${catData.count === 1 ? '' : 's'}`;
      calEl.textContent = `${Math.round(catData.calories).toLocaleString()} kcal`;

      listEl.innerHTML = '';

      if (catData.items.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'empty-state-text';
        emptyEl.textContent = `No items logged for ${category} yet.`;
        listEl.appendChild(emptyEl);
      } else {
        catData.items.forEach(item => {
          const row = document.createElement('div');
          row.className = 'food-item-row';

          const left = document.createElement('div');
          left.className = 'item-left';

          const nameSpan = document.createElement('span');
          nameSpan.className = 'item-name';
          nameSpan.textContent = item.name;
          left.appendChild(nameSpan);

          const macrosDiv = document.createElement('div');
          macrosDiv.className = 'item-macros-tags';

          if (item.protein !== undefined && item.protein !== null && item.protein !== '') {
            const pTag = document.createElement('span');
            pTag.className = 'macro-tag tag-p';
            pTag.textContent = `P: ${item.protein}g`;
            macrosDiv.appendChild(pTag);
          }

          if (item.carbs !== undefined && item.carbs !== null && item.carbs !== '') {
            const cTag = document.createElement('span');
            cTag.className = 'macro-tag tag-c';
            cTag.textContent = `C: ${item.carbs}g`;
            macrosDiv.appendChild(cTag);
          }

          if (item.fat !== undefined && item.fat !== null && item.fat !== '') {
            const fTag = document.createElement('span');
            fTag.className = 'macro-tag tag-f';
            fTag.textContent = `F: ${item.fat}g`;
            macrosDiv.appendChild(fTag);
          }

          left.appendChild(macrosDiv);

          const right = document.createElement('div');
          right.className = 'item-right';

          const calBadge = document.createElement('span');
          calBadge.className = 'item-cal-badge';
          calBadge.textContent = `${item.calories} kcal`;
          right.appendChild(calBadge);

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-item-btn';
          deleteBtn.title = 'Delete item';
          deleteBtn.innerHTML = '&times;';
          deleteBtn.addEventListener('click', () => deleteFoodItem(item.id));
          right.appendChild(deleteBtn);

          row.appendChild(left);
          row.appendChild(right);
          listEl.appendChild(row);
        });
      }
    });
  }

  // ==========================================================================
  // Food Actions
  // ==========================================================================
  function addFoodItem(meal, name, calories, protein, carbs, fat) {
    if (!trackerData[currentDate]) {
      trackerData[currentDate] = [];
    }

    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      meal: meal,
      name: name.trim(),
      calories: Math.round(Number(calories)),
      protein: protein !== '' ? parseFloat(protein) : 0,
      carbs: carbs !== '' ? parseFloat(carbs) : 0,
      fat: fat !== '' ? parseFloat(fat) : 0
    };

    trackerData[currentDate].push(newItem);
    saveToStorage();
    renderAll();
  }

  function deleteFoodItem(itemId) {
    if (!trackerData[currentDate]) return;
    trackerData[currentDate] = trackerData[currentDate].filter(item => item.id !== itemId);
    saveToStorage();
    renderAll();
  }

  // ==========================================================================
  // Preset Chips Rendering & Interaction
  // ==========================================================================
  function renderPresetChips() {
    presetChipsContainer.innerHTML = '';
    PRESET_FOODS.forEach(preset => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'preset-chip';
      chip.innerHTML = `${preset.name} <span class="chip-cal">${preset.calories} kcal</span>`;

      chip.addEventListener('click', () => {
        // Pre-fill form fields
        mealTypeSelect.value = preset.meal || 'lunch';
        foodNameInput.value = preset.name;
        foodCaloriesInput.value = preset.calories;
        foodProteinInput.value = preset.protein;
        foodCarbsInput.value = preset.carbs;
        foodFatInput.value = preset.fat;

        // Visual flash to indicate prefill
        foodNameInput.focus();
        foodNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      presetChipsContainer.appendChild(chip);
    });
  }

  // ==========================================================================
  // Settings & Modal Handlers
  // ==========================================================================
  function openSettings() {
    goalCaloriesInput.value = userProfile.calorieGoal;
    goalProteinInput.value = userProfile.proteinGoal;
    goalCarbsInput.value = userProfile.carbsGoal;
    goalFatInput.value = userProfile.fatGoal;
    settingsModal.classList.remove('hidden');
  }

  function closeSettings() {
    settingsModal.classList.add('hidden');
  }

  function handleSaveGoals(e) {
    e.preventDefault();
    userProfile.calorieGoal = parseInt(goalCaloriesInput.value, 10) || DEFAULT_PROFILE.calorieGoal;
    userProfile.proteinGoal = parseInt(goalProteinInput.value, 10) || DEFAULT_PROFILE.proteinGoal;
    userProfile.carbsGoal = parseInt(goalCarbsInput.value, 10) || DEFAULT_PROFILE.carbsGoal;
    userProfile.fatGoal = parseInt(goalFatInput.value, 10) || DEFAULT_PROFILE.fatGoal;

    saveToStorage();
    closeSettings();
    renderAll();
  }

  // Export JSON backup
  function exportData() {
    const backupObj = {
      profile: userProfile,
      logs: trackerData,
      exportDate: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `calotrack_backup_${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Import JSON backup
  function importData(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.logs) {
          trackerData = imported.logs;
        }
        if (imported.profile) {
          userProfile = Object.assign({}, DEFAULT_PROFILE, imported.profile);
        }
        saveToStorage();
        renderAll();
        closeSettings();
        alert('Data successfully imported!');
      } catch (err) {
        alert('Invalid JSON file format. Could not import.');
      }
    };
    reader.readAsText(file);
  }

  // Clear today's log
  function clearToday() {
    if (confirm(`Are you sure you want to clear all logged food items for ${currentDate}?`)) {
      trackerData[currentDate] = [];
      saveToStorage();
      renderAll();
      closeSettings();
    }
  }

  // Reset all data
  function resetAll() {
    if (confirm('Warning: This will permanently delete ALL stored days and reset your goals to default. Proceed?')) {
      trackerData = {};
      userProfile = { ...DEFAULT_PROFILE };
      saveToStorage();
      renderAll();
      closeSettings();
    }
  }

  // ==========================================================================
  // Event Listeners Setup
  // ==========================================================================
  function setupEventListeners() {
    // Date Navigation
    datePicker.addEventListener('change', (e) => {
      if (e.target.value) {
        currentDate = e.target.value;
        renderAll();
      }
    });

    prevDateBtn.addEventListener('click', () => {
      currentDate = shiftDate(currentDate, -1);
      renderAll();
    });

    nextDateBtn.addEventListener('click', () => {
      currentDate = shiftDate(currentDate, 1);
      renderAll();
    });

    todayBtn.addEventListener('click', () => {
      currentDate = getTodayDateString();
      renderAll();
    });

    // Form Submission
    foodEntryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const meal = mealTypeSelect.value;
      const name = foodNameInput.value;
      const calories = foodCaloriesInput.value;
      const protein = foodProteinInput.value;
      const carbs = foodCarbsInput.value;
      const fat = foodFatInput.value;

      if (!name || calories === '') return;

      addFoodItem(meal, name, calories, protein, carbs, fat);

      // Reset form but retain current meal selection
      foodNameInput.value = '';
      foodCaloriesInput.value = '';
      foodProteinInput.value = '';
      foodCarbsInput.value = '';
      foodFatInput.value = '';
      foodNameInput.focus();
    });

    // Modal Events
    openSettingsBtn.addEventListener('click', openSettings);
    closeSettingsBtn.addEventListener('click', closeSettings);
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettings();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !settingsModal.classList.contains('hidden')) {
        closeSettings();
      }
    });

    goalsForm.addEventListener('submit', handleSaveGoals);
    exportDataBtn.addEventListener('click', exportData);

    importFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importData(e.target.files[0]);
        importFileInput.value = '';
      }
    });

    clearTodayBtn.addEventListener('click', clearToday);
    clearAllBtn.addEventListener('click', resetAll);
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    loadFromStorage();
    renderPresetChips();
    setupEventListeners();
    renderAll();
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

