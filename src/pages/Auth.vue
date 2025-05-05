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
  import { Hub } from 'aws-amplify/utils';
  import { getCurrentUser } from "aws-amplify/auth";

  Hub.listen('auth', async ({ payload }) => {
   // if the user is signed in
   try {
     const { userId } = await getCurrentUser();
     switch (payload.event) {
       case 'signedIn':
         console.log("signed in")
         fetch(`https://gm4pbbszg2.execute-api.us-east-2.amazonaws.com/dev/add_user_id_to_user-data?id=${userId}`)
         document.getElementById("close-modal").click()
         document.getElementById("desktop-auth-state").textContent = "Sign Out"
         document.getElementById("mobile-auth-state").textContent = "Sign Out"
         break;
     }
   }
   // otherwise
   catch {
     switch (payload.event) {
       case 'signedOut':
         console.log("signed out")
         document.getElementById("close-modal").click()
         document.getElementById("desktop-auth-state").textContent = "Sign in"
         document.getElementById("mobile-auth-state").textContent = "Sign in"
         break;
     }
   }
 });
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
  :deep(:root) {
    --amplify-components-authenticator-router-box-shadow: none !important;
    --amplify-components-authenticator-router-border-width: 0 !important;
    --amplify-components-input-focus-border-color: #0073b1d !important;
    --amplify-components-fieldcontrol-focus-box-shadow: 0 0 0 1px #0073b1 !important
  }

  :deep([data-amplify-authenticator] [data-amplify-router]) {
    background-color: rgb(241, 241, 241) !important;
  }

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

  :deep(.amplify-heading--3) {
    color: #1a1a1a;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  :deep(.amplify-label) {
    color: #444;
  }
  :deep(.amplify-button.amplify-button--primary) {
    background-color: #0073b1;
  }

  :deep(.amplify-button.amplify-button--primary:hover) {
    background-color: #005d92;
  }

  :deep(.amplify-tabs__item) {
    color: rgba(0, 0, 0, 0.5);
  }

  :deep(.amplify-tabs__item:hover) {
    color: #0073b1 !important;
  }

  :deep(.amplify-tabs__item--active) {
    color: #0073b1 !important;
    border-color: #0073b1 !important;
  }
  </style>