<template>
    <div class="authentication-page">
      <authenticator style="margin-left: auto; margin-right: auto; display: block;">
        <template v-slot="{ user, signOut }">
          <h1>Hello {{ user.username }}!</h1>
          <button class="btn btn-primary" @click="signOut">Sign Out</button>
        </template>
      </authenticator>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { Authenticator } from "@aws-amplify/ui-vue";
  import "@aws-amplify/ui-vue/styles.css";
  import '@/assets/dark-mode.css';
  import '@/assets/light-mode.css';

  // Ensure dark mode styles are applied on component mount
  onMounted(() => {
    // Check if dark mode is enabled in localStorage
    const userSettings = localStorage.getItem('userSettings');
    if (userSettings) {
      const settings = JSON.parse(userSettings);
      if (settings.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.add('light-mode');
      }
    }
  });
  </script>
  
  <style scoped>
  .authentication-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--light-bg);
  }

  /* AWS Amplify UI overrides for light mode */
  :deep(.amplify-button--primary) {
    background-color: var(--light-button);
  }

  :deep(.amplify-button--primary:hover) {
    background-color: var(--light-button-hover);
  }

  :deep(.amplify-input) {
    background-color: var(--light-surface);
    border-color: var(--light-border);
    color: var(--light-text-primary);
  }
  </style>