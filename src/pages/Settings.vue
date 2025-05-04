<template>
  <div class="settings-page container mt-4">
    <h1>Settings</h1>
    
    <!-- Appearance Section -->
    <section class="settings-section">
      <h2>Appearance</h2>
      <div class="setting-group">
        <label for="darkModeToggle">Dark Mode:</label>
        <input id="darkModeToggle" type="checkbox" v-model="darkMode" @change="updateSettings()"/>
        <span>{{ darkMode ? 'Enabled' : 'Disabled' }}</span>
      </div>
      <div class="setting-group">
        <label for="fontSizeRange">Font Size: {{ fontSize }}%</label>
        <input
          id="fontSizeRange"
          type="range"
          min="80"
          max="150"
          step="5"
          v-model="fontSize"
          @input="updateSettings()"
        />
        <!-- @input="updateFontSize" -->
      </div>
    </section>
    
    <!-- Job Settings Section -->
    <section class="settings-section">
      <h2>Job Settings</h2>
      <div class="setting-group">
        <label for="itemsPerPage">Jobs Per Page:</label>
        <select id="itemsPerPage" v-model="itemsPerPage" @change="updateSettings()">
          <option v-for="num in [5, 10, 20, 50]" :key="num" :value="num">
            {{ num }}
          </option>
        </select>
      </div>
    </section>
    
    <!-- Notifications Section -->
    <!-- <section class="settings-section">
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
    </section> -->
    
    <!-- Language & Accessibility Section -->
    <section class="settings-section">
      <h2>Language & Accessibility</h2>
      <div class="setting-group">
        <label for="languageSelect">Language:</label>
        <select id="languageSelect" v-model="currentLanguage" @change="updateSettings()">
          <option value="en">English</option>
          <option value="es">Español</option>
          <!-- Add more languages if needed -->
        </select>
      </div>
    </section>
    
    <!-- Reset Section -->
    <section class="settings-section">
      <h2>Reset</h2>
      <button class="btn btn-danger" @click="updateSettings(true)">
        Reset to Defaults
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import '@/assets/dark-mode.css';  // Add this import
import '@/assets/light-mode.css'; // Add this import for light mode

const currentLanguage = ref()
const fontSize = ref()
const darkMode = ref()
const itemsPerPage = ref()
// Define default settings
// const defaultSettings = {
//   darkMode: false,
//   fontSize: 100,
//   itemsPerPage: 10,
//   emailNotifications: false,
//   pushNotifications: false,
//   language: 'en'
// };

import { getCurrentUser } from 'aws-amplify/auth';



const loadSettings = async () => {
  console.log("loadSettings called")
    const { userId } = await getCurrentUser();
    console.log("userId: ", userId)
    const response = await fetch("https://7nzvzc1dd8.execute-api.us-east-2.amazonaws.com/dev/getting", {
      method: "POST",
      body: JSON.stringify({id: userId})
    })
    const result = await response.json()
    console.log("result: ", result)
    if (result.body == '[{}]') {
      console.log("result.body == '[{}]'")
      const response2 = await fetch("https://cceysg77wa.execute-api.us-east-2.amazonaws.com/dev/updating", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          reset_settings: true
        })
      })
      const result2 = await response2.json()
      console.log("result2: ", result2)
      await nextTick()
      const response3 = await fetch("https://7nzvzc1dd8.execute-api.us-east-2.amazonaws.com/dev/getting", {
        method: "POST",
        body: JSON.stringify({id: userId})
      })
      const result3 = await response3.json()
      console.log("result3: ", result3)
      console.log("result3.body: ", result3.body)
      let body = result3.body
      body = JSON.parse(body.slice(1, -1))
      console.log("body: ", body, " typeof body", typeof body)
      const resultAsJSON = body
      currentLanguage.value = resultAsJSON.language
      darkMode.value = resultAsJSON.dark_mode
      fontSize.value = resultAsJSON.font_size
      itemsPerPage.value = resultAsJSON.ipp
    }
    else {
      console.log("result.body != '[{}]'")
      const resultAsJSON = JSON.parse(result.body.slice(1, -1))
      console.log("resultAsJSON: ", resultAsJSON)
      currentLanguage.value = resultAsJSON.language
      darkMode.value = resultAsJSON.dark_mode
      fontSize.value = resultAsJSON.font_size
      itemsPerPage.value = resultAsJSON.ipp

    }
};
const updateSettings = async (resetSettings = false) => {
  console.log("updateSettings called")
  try {
    const { userId } = await getCurrentUser();
    console.log("userId: ", userId)
    console.log("reset_settings: ", resetSettings)
    console.log("dark_mode: ", darkMode.value)
    console.log("language: ", currentLanguage.value)
    console.log("fontSize: ", fontSize.value)
    console.log("itemsPerPage: ", itemsPerPage.value)
    const response = await fetch("https://cceysg77wa.execute-api.us-east-2.amazonaws.com/dev/updating", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        reset_settings: resetSettings,
        dark_mode: darkMode.value,
        language: currentLanguage.value,
        font_size: fontSize.value,
        ipp: itemsPerPage.value
      })
    })
    const result = await response.json()
    await nextTick()
    loadSettings()
    console.log("result: ", result)
  }
  catch (error) {
    console.log("error: ", error)
    alert("you must be signed in to change settings")
  }
} 

import { Hub } from 'aws-amplify/utils';

Hub.listen('auth', ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log('user have been signedIn successfully.');
      loadSettings()
      break;
    case 'signedOut':
      console.log('user have been signedOut successfully.');
      currentLanguage.value = "en"
      darkMode.value = false
      itemsPerPage.value = 25
      break;
  }
})
onMounted(async () => {
  console.log("onMounted called")
  loadSettings()
})

const applyDarkMode = () => {
  if (darkMode.value) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }
};

watch(() => darkMode.value, applyDarkMode);


// Update the root font size for accessibility
const updateFontSize = () => {
  document.documentElement.style.fontSize = fontSize.value + '%';
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


