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
  import { Authenticator } from "@aws-amplify/ui-vue";
  import "@aws-amplify/ui-vue/styles.css";
  </script>
  
  <style scoped>
  .authentication-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
  }
  </style>