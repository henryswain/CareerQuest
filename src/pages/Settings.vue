<template>
  <div class="settings-page container mt-4">
    <h1>Settings</h1>
    
    <!-- Appearance Section -->
    <section class="settings-section">
      <h2>Appearance</h2>
      <div class="setting-group">
        <label for="darkModeToggle">Dark Mode:</label>
        <input id="darkModeToggle" type="checkbox" v-model="settings.darkMode" />
        <span>{{ settings.darkMode ? 'Enabled' : 'Disabled' }}</span>
      </div>
      <div class="setting-group">
        <label for="fontSizeRange">Font Size: {{ settings.fontSize }}%</label>
        <input
          id="fontSizeRange"
          type="range"
          min="80"
          max="150"
          step="5"
          v-model="settings.fontSize"
          @input="updateFontSize"
        />
      </div>
    </section>
    
    <!-- Job Settings Section -->
    <section class="settings-section">
      <h2>Job Settings</h2>
      <div class="setting-group">
        <label for="itemsPerPage">Jobs Per Page:</label>
        <select id="itemsPerPage" v-model="settings.itemsPerPage">
          <option v-for="num in [5, 10, 20, 50]" :key="num" :value="num">
            {{ num }}
          </option>
        </select>
      </div>
    </section>
    
    <!-- Notifications Section -->
    <section class="settings-section">
      <h2>Notifications</h2>
      <div class="setting-group">
        <label for="emailNotifications">Email Notifications:</label>
        <input id="emailNotifications" type="checkbox" v-model="settings.emailNotifications" />
        <span>{{ settings.emailNotifications ? 'Enabled' : 'Disabled' }}</span>
      </div>
      <div class="setting-group">
        <label for="pushNotifications">Push Notifications:</label>
        <input id="pushNotifications" type="checkbox" v-model="settings.pushNotifications" />
        <span>{{ settings.pushNotifications ? 'Enabled' : 'Disabled' }}</span>
      </div>
    </section>
    
    <!-- Language & Accessibility Section -->
    <section class="settings-section">
      <h2>Language & Accessibility</h2>
      <div class="setting-group">
        <label for="languageSelect">Language:</label>
        <select id="languageSelect" v-model="settings.language">
          <option value="en">English</option>
          <option value="es">Español</option>
          <!-- Add more languages if needed -->
        </select>
      </div>
    </section>
    
    <!-- Reset Section -->
    <section class="settings-section">
      <h2>Reset</h2>
      <button class="btn btn-danger" @click="resetSettings">
        Reset to Defaults
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// Define default settings
const defaultSettings = {
  darkMode: false,
  fontSize: 100,
  itemsPerPage: 10,
  emailNotifications: false,
  pushNotifications: false,
  language: 'en'
};

// Load settings from localStorage (or use defaults)
const loadSettings = () => {
  const savedSettings = localStorage.getItem('userSettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

const settings = ref(loadSettings());

// Persist settings changes in localStorage
watch(settings, (newVal) => {
  localStorage.setItem('userSettings', JSON.stringify(newVal));
}, { deep: true });

//  Watch for language changes to notify other parts of the app
watch(() => settings.value.language, (newLang) => {
  console.log('Language updated:', newLang);
   window.dispatchEvent(new CustomEvent('language-changed', { detail: newLang }));
});

// Apply dark mode by toggling a class on document body
const applyDarkMode = () => {
  if (settings.value.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

onMounted(() => {
  applyDarkMode();
  updateFontSize();
});

// Watch dark mode setting changes
watch(() => settings.value.darkMode, applyDarkMode);

// Update the root font size for accessibility
const updateFontSize = () => {
  document.documentElement.style.fontSize = settings.value.fontSize + '%';
};

// Reset settings to defaults and clear localStorage
const resetSettings = () => {
  localStorage.clear();
  alert('Settings reset to defaults.');
  settings.value = { ...defaultSettings };
  applyDarkMode();
  updateFontSize();
};
</script>

<!-- Scoped styles for the settings page layout -->
<style scoped>
.settings-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 80px;
}

.settings-section {
  margin-bottom: 2rem;
  padding: 20px;
  border: 1px solid rgba(0, 115, 177, 0.2);
  border-radius: 15px;
  background: rgba(249, 249, 249, 0.8);
  transition: all 0.3s ease;
}

.settings-section:hover {
  border-color: #0073b1;
  box-shadow: 0 2px 4px rgba(0, 115, 177, 0.1);
}

.setting-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

/* Add styles for checkbox container */
.setting-group:has(input[type="checkbox"]) {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
}

/* Style for the checkbox and its label */
input[type="checkbox"] {
  margin-left: auto;
  order: 2;
}

.setting-group span {
  order: 3;
  min-width: 70px;
  text-align: right;
}

.setting-group:hover {
  background-color: rgba(0, 115, 177, 0.05);
}

label {
  font-size: 1.1em;
  margin-right: 10px;
  color: #333;
  font-weight: 500;
}

select,
input[type="checkbox"],
input[type="range"] {
  font-size: 1em;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 8px;
  transition: all 0.2s ease;
}

select:hover,
input[type="checkbox"]:hover,
input[type="range"]:hover {
  border-color: #0073b1;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
}

h1 {
  color: #1a1a1a;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

h2 {
  color: #0073b1;
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
</style>

<style>
.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

.dark-mode .settings-page {
  background: rgba(51, 51, 51, 0.95);
  color: #ffffff;
}

.dark-mode .settings-section {
  background: rgba(68, 68, 68, 0.8);
  border-color: rgba(0, 115, 177, 0.3);
}

.dark-mode .settings-section:hover {
  border-color: #0073b1;
  box-shadow: 0 2px 4px rgba(0, 115, 177, 0.2);
}

.dark-mode .setting-group:hover {
  background-color: rgba(0, 115, 177, 0.1);
}

.dark-mode label,
.dark-mode select,
.dark-mode input,
.dark-mode button,
.dark-mode span {
  color: #ffffff;
}

.dark-mode h1 {
  color: #ffffff;
}

.dark-mode h2 {
  color: #0073b1;
}

.dark-mode select,
.dark-mode input[type="checkbox"],
.dark-mode input[type="range"] {
  background-color: #333;
  border-color: #444;
}

.dark-mode select:hover,
.dark-mode input[type="checkbox"]:hover,
.dark-mode input[type="range"]:hover {
  border-color: #0073b1;
}

.dark-mode .btn-danger {
  background-color: #b02a37;
}

.dark-mode .btn-danger:hover {
  background-color: #92222d;
}
</style>
