<template>
  <div id="app">
    <!-- Desktop navbar (Hidden on mobile)-->
    <nav class="navbar navbar-expand navbar-dark fixed-top d-none d-lg-flex">
      <div class="container-fluid">
        <!-- Left justified links -->
        <router-link class="navbar_logo_container" to="/home-page">
          <img class="navbar_logo_img" alt="CareerQuest logo"/>
        </router-link>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="navbarlink nav-link" to="/find-jobs">Find Jobs</router-link>
          </li>
          <li class="nav-item">
            <router-link class="navbarlink nav-link" to="/saved-jobs">Saved Jobs</router-link>
          </li>
        </ul>
        <!-- Right justified components -->
        <form class="d-flex me-3" @submit.prevent="handleSubmit">
          <input
            class="form-control me-2"
            type="text"
            v-model="searchText"
            placeholder="Search jobs..."
          />
          <button class="searchbutton btn btn-primary" type="text">Search</button>
        </form>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <img
              src="@/assets/user.png"
              style="max-height: 30px;"
              alt="User"
              class="rounded-circle"
            />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
            <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
            <li><hr class="dropdown-divider" /></li>
            <!-- <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
            <li><router-link class="dropdown-item" to="/register">Register</router-link></li>
            <li><router-link class="dropdown-item text-danger" to="/logout">Logout</router-link></li> -->
            <li>
              <!-- Auth sign in and sign out buttons -->
              <div>
                <button v-if="!isAuthenticated" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#authenticationModal">
                  Sign in/Sign up
                </button>
                <button v-else type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#authenticationModal">
                  Sign out
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Mobile navbar -->
     <!-- new navbar not yet implemented for mobile-->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top d-lg-none">
      <div class="container-fluid">
        <router-link class="navbar_logo_container" to="/home-page">
          <img class="navbar_logo_img" alt="CareerQuest logo"/>
        </router-link>
        <button
          class="navbar-toggler bg-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavMobile"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse flex-column align-items-center" id="navbarNavMobile">
          <ul class="navbar-nav mb-2 w-100 d-flex justify-content-center">
            <li class="nav-item">
              <router-link class="navbarlink nav-link" to="/find-jobs">Find Jobs</router-link>
            </li>
            <li class="nav-item">
              <router-link class="navbarlink nav-link" to="/saved-jobs">Saved Jobs</router-link>
            </li>
          </ul>
          <form class="d-flex me-3" @submit.prevent="handleSubmit">
            <input
              class="form-control me-2"
              type="text"
              v-model="searchText"
              placeholder="Search jobs..."
            />
            <button class="btn btn-outline-light" type="text">Search</button>
          </form>
          <div class="dropdown w-100 d-flex justify-content-end">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <img
                src="@/assets/user.png"
                style="max-height: 30px;"
                alt="User"
                class="rounded-circle"
              />
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <div>
                  <button
                    v-if="!isAuthenticated"
                    type="button"
                    class="btn btn-link"
                    data-bs-toggle="modal"
                    data-bs-target="#authenticationModal"
                  >
                    Login/Sign up
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn btn-link"
                    data-bs-toggle="modal"
                    data-bs-target="#authenticationModal"
                  >
                    Sign Out
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>


      <!-- authentication modal -->
  <div class="modal fade" id="authenticationModal" tabindex="-1" aria-labelledby="authenticationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Basic authenticator without slots -->
          <authenticator>
            <!-- AWS Amplify auth for login/signup -->
            <template v-slot="{ user, signOut }">
              <h1>Hello {{ user.username }}!</h1>
              <button class="btn btn-primary" @click="signOut">Sign Out</button>
            </template>
          </authenticator>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Close</button>
        </div>
      </div>
    </div>
  </div>


  <!-- main content  -->
    <div style="margin-top: 70px;">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import { Amplify } from 'aws-amplify';
  // import outputs from '../amplify_outputs.json';

  // Amplify.configure(outputs);


import originalConfig from '../amplify_outputs.json';

// Function to replace env variable placeholders
const resolveConfig = (config) => {
  const replacer = (_, value) => {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      const envKey = value.slice(2, -1);
      return import.meta.env[envKey] || '';
    }
    return value;
  };

  return JSON.parse(JSON.stringify(config, replacer));
};

const amplifyConfig = resolveConfig(originalConfig);

Amplify.configure(amplifyConfig)

import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';

const isAuthenticated = ref(false);

const closeModal = () => {
  // Function to close the modal programmatically

  console.log("close modal")

  // Select the element you want to fire the event on
  const modalElement = document.getElementById('authenticationModal');

  // Create the event, ensuring it matches the Bootstrap naming convention
  const event = new Event('dismiss.bs.modal', {
    bubbles: true, // Event will bubble up through the DOM tree
    cancelable: true // Event can be canceled
  });
  modalElement.dispatchEvent(event);
};

Hub.listen('auth', async ({ payload }) => {
  const { username, userId, signInDetails } = await getCurrentUser();
  switch (payload.event) {
    case 'signedIn':
      isAuthenticated.value = true;
      closeModal();
      break;
    case 'signedOut':
      isAuthenticated.value = false;
      closeModal();
      break;
    // ... other events
  }
});

// Router and search handling
const router = useRouter();
const searchText = ref("");

async function handleSubmit() {
  router.replace({ path: '/find-jobs', query: { q: searchText.value } });
  await nextTick();
}
</script>

<style scoped>
/* Styles for the navbar (desktop version) */
.navbar {
  z-index: 2000;
  background-color: #ffffff;
  border-bottom: 2px solid #a1a1a1;
  height: fit-content;
  padding: 10px;
}
/* Logo container and image styling */
.navbar_logo_container {
  padding: 0.5rem;
  transition: background-color .15s ease-in-out;
  border-radius: 50px;
  width: 150px;
}

.navbar_logo_img {
  content: url("@/assets/CQ_logo_lightmode.svg");
}

.navbar_logo_container:hover {
  color: #0073b1;
  background: rgba(0, 115, 177, 0.1);
}

.navbarlink {
  display: block;
  color: #272727;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: background-color .15s ease-in-out;
  border-radius: 50px;
}

.navbarlink:hover {
  color: #0073b1;
  background: rgba(0, 115, 177, 0.1);
}

.searchbutton {
  border-radius: 50px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";;
  font-size: 1rem;
  font-weight: 500;
}
</style>

<style>
.modal {
  z-index: 2100 !important;
}
.modal-backdrop {
  z-index: 2050 !important;
}
.modal-dialog {
  margin-top: 80px;
}
</style>

<!-- Darkmode overrides -->
<style>
.dark-mode .form-control,
.dark-mode input[type="text"],
.dark-mode input[type="email"],
.dark-mode input[type="search"],
.dark-mode input[type="password"],
.dark-mode select,
.dark-mode textarea,
.dark-mode .form-control {
  background-color: #444444 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}
.dark-mode .form-control::placeholder,
.dark-mode input[type="text"]::placeholder,
.dark-mode input[type="email"]::placeholder,
.dark-mode input[type="search"]::placeholder,
.dark-mode input[type="password"]::placeholder,
.dark-mode select::placeholder,
.dark-mode textarea::placeholder,
.dark-mode .form-control::placeholder {
  color: #cccccc !important;
}
.dark-mode .modal-content,
.dark-mode .modal-header,
.dark-mode .modal-body,
.dark-mode .modal-footer {
  background-color: #333333 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}
.dark-mode .btn-close {
  filter: invert(1);
}

/* Navbar overrides */
.dark-mode .navbar {
  background-color: #181818;
  border-bottom: #525151;
}

.dark-mode .navbar_logo_img {
  content: url("@/assets/CQ_logo_darkmode.svg");
}

.dark-mode .navbar_logo_container:hover {
  color: #0073b1;
  background: rgba(73, 142, 179, 0.2);
}

.dark-mode .navbarlink {
  color: #ffffff;
}

.dark-mode .navbarlink:hover {
  color: #b2dbf1;
  background: rgba(73, 142, 179, 0.2);
}

/* For Saved Jobs cards */
.dark-mode .saved-jobs-container,
.dark-mode .saved-jobs-container * {
  background-color: #333333 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}

/* For the Find Jobs page container */
.dark-mode .find-jobs-page,
.dark-mode .find-jobs-page * {
  background-color: #333333 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}

/* Dark mode OVR for ProfilePage */
.dark-mode .profile-container {
  background-color: #333333 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}

.dark-mode .profile-container * {
  color: #ffffff !important;
}

.dark-mode .profile-container .input-field,
.dark-mode .profile-container input,
.dark-mode .profile-container textarea,
.dark-mode .profile-container select {
  background-color: #444444 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}

.dark-mode .profile-container a {
  color: #ffffff !important;
  }

/* Darkmode for dropdown */
.dark-mode .dropdown-menu {
  background-color: #333333 !important; 
  border-color: #444444 !important;     
}

/* Changes dropdown text to white */
.dark-mode .dropdown-menu .dropdown-item {
  background-color: #333333 !important; 
  color: #ffffff !important;            
}

/* For sign up link */
.dark-mode .btn-link {
  color: #ffffff !important;
}


</style>
