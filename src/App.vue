<template>
  <div id="app" style="position: relative;">
    <!-- Desktop navbar (Hidden on mobile)-->
    <!-- Desktop navbar -->
    <nav class="navbar navbar-expand navbar-dark fixed-top d-none d-lg-flex">
  <div class="container-fluid">

    <!-- Left side -->
    <router-link class="navbar_logo_container" to="/home-page">
      <img class="navbar_logo_img" alt="CareerQuest logo" />
    </router-link>

    <ul class="navbar-nav me-auto">
      <li class="nav-item">
        <router-link class="navbarlink nav-link" to="/find-jobs">Find Jobs</router-link>
      </li>
      <li class="nav-item">
        <router-link class="navbarlink nav-link" to="/saved-jobs">Saved Jobs</router-link>
      </li>
    </ul>

    <!-- Right side -->
    <button
      class="Premium"
      id="premium-now"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#premiumModal"
    >
      Premium
    </button>

    <form class="d-flex me-3" @submit.prevent="handleSubmit">
      <input
        class="form-control me-2"
        type="text"
        v-model="searchText"
        placeholder="Search jobs..."
      />
      <button class="searchbutton btn btn-primary" type="submit">Search</button>
    </form>

    <!-- Sign in/display user email-->
    <div class="d-flex align-items-center me-3">
      <button
        v-if="!currentUserEmail"
        id="desktop-auth-state"
        type="button"
        class="auth-button"
        @click="goToAuthPage"
      >
        Sign in
      </button>
      <span v-else class="navbar-text user-email">
        Hello, {{ currentUserEmail }}
      </span>
    </div>

    <!-- Dropdown -->
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-center"
        type="button"
        id="dropdownMenuButton"
        @click="toggleDropdown"
      >
        <span class="me-2">Account</span>
        <img
          src="@/assets/user.png"
          style="max-height: 30px;"
          alt="User"
          class="rounded-circle"
        />
      </button>

      <ul v-if="!isMobile" class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
        <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
        <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
        <li><hr class="dropdown-divider" /></li>
        <li v-if="currentUserEmail">
          <button class="dropdown-item" @click="signOut">Sign Out</button>
        </li>
        <li v-else>
          <button
            id="desktop-auth-state"
            type="button"
            class="dropdown-item"
            data-bs-toggle="modal"
            data-bs-target="#authenticationModal"
          >
            Sign In
          </button>
        </li>
      </ul>

      <ul v-else class="dropdown-menu dropdown-menu-end">
        <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
        <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
        <li><hr class="dropdown-divider" /></li>
        <li v-if="currentUserEmail">
          <button class="dropdown-item" @click="signOut">Sign Out</button>
        </li>
        <li v-else>
          <button
            id="desktop-auth-state"
            type="button"
            class="dropdown-item"
            data-bs-toggle="modal"
            data-bs-target="#authenticationModal"
          >
            Sign In
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>


      <!-- Mobile navbar -->
      <!-- New navbar for mobile. Is not white and adopts new logo-->
      <nav class="navbar navbar-expand-lg navbar-light fixed-top d-lg-none custom-navbar">
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
            <button class="btn btn-outline-light" type="submit">Search</button>
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
              
              <li v-if="currentUserEmail">
                <button class="dropdown-item" @click="signOut">Sign Out</button>
              </li>
              <li v-else>
                <button
                  id="desktop-auth-state"
                  type="button"
                  class="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#authenticationModal"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

  <!-- Premium Modal -->
  <div class="modal fade" id="premiumModal" tabindex="-1" aria-labelledby="premiumModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="premiumModalLabel">Upgrade to Premium</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h4>Premium Benefits:</h4>
        <ul>
          <li>Unlimited job applications</li>
          <li>Priority application status</li>
          <li>Advanced job matching</li>
          <li>Early access to new jobs</li>
        </ul>
        <div class="price-section">
          <h5>Monthly Subscription: $9.99</h5>
        </div>
        <!-- PayPal Button Container -->
        <div id="paypal-button-container"></div>
      </div>
    </div>
  </div>
</div>

  <!-- main content  -->
    <div style="margin-top: 70px;">
      <router-view />
    </div>
  </div>

<!-- footer content -->
  <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <p class="copyright">&copy; 2025 CareerQuest, Inc</p>
          </div>

          <div class="footer-section">
            <img class="footer-logo" src="@/assets/CQ_logo_lightmode.svg" alt="CareerQuest Logo" />
          </div>

          <div class="footer-section">
            <ul class="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
            </ul>
          </div>
        </div>
    </footer>
</template>


<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import originalConfig from '../amplify_outputs.json';
import { fetchUserAttributes, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Dropdown } from 'bootstrap';


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

// Save user email locally
const currentUserEmail = ref(localStorage.getItem('currentUserEmail'));

Hub.listen('auth', async ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log("signed in");
      try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        localStorage.setItem('currentUserEmail', email); // Save email
        currentUserEmail.value = email;
      } catch (error) {
        console.error("Error getting current user after sign in:", error);
      }
      document.getElementById("close-modal").click();
      break;

    case 'signedOut':
      console.log("signed out");
      localStorage.removeItem('currentUserEmail'); // Get rid of it when signed out
      currentUserEmail.value = null;
      document.getElementById("close-modal").click();
      break;
  }
});

function goToAuthPage() {
  router.push({ path: '/auth' });
}


function toggleDropdown() {
  const dropdownElement = document.getElementById('dropdownMenuButton');
  if (dropdownElement) {
    const dropdown = Dropdown.getOrCreateInstance(dropdownElement);
    dropdown.toggle();
  }
}


async function signOut() {
  try {
    await amplifySignOut();
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Router and search handling
const router = useRouter();
const searchText = ref("");

async function handleSubmit() {
  router.replace({ path: '/find-jobs', query: { q: searchText.value } });
  await nextTick();
}


// Modify PayPal SDK loading function
function loadPayPalScript() {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=AfXN2AKlII2ctuOylHuBnHdkkzcPB-kqA8NIdz6Gw1c2nGOhqj-scGysrXaR_VGLrduOlACJAsU22o7K&currency=USD';
  script.async = true;
  
  // Add event listeners for script loading
  script.addEventListener('load', () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '9.99',
                currency_code: 'USD'
              },
              description: 'CareerQuest Premium Subscription'
            }]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log('Payment completed', order);
          const modal = document.getElementById('premiumModal');
          const bsModal = bootstrap.Modal.getInstance(modal);
          bsModal.hide();
          alert('Thank you for upgrading to Premium!');
        },
        onError: (err) => {
          console.error('PayPal payment error:', err);
          alert('There was an error processing your payment. Please try again.');
        }
      }).render('#paypal-button-container');
    }
  });

  script.addEventListener('error', (error) => {
    console.error('PayPal script loading error:', error);
  });

  document.body.appendChild(script);
}

const isMobile = ref(false);

onMounted(async () => {
  try {
    // Check for user sign in
    const attributes = await fetchUserAttributes();
    const email = attributes.email;
    console.log('Fetched email on page load:', email);
    if (email) {
      currentUserEmail.value = email;
      localStorage.setItem('currentUserEmail', email);
    }
  } catch (error) {
    console.error("Error fetching user on mount:", error);
  }
  
  loadPayPalScript();

  isMobile.value = window.innerWidth < 992;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 992;
  });
  // Mobile dropdown
  const dropdownElement = document.getElementById('dropdownMenuButton');
  if (dropdownElement) {
    new Dropdown(dropdownElement);
  }
  });

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

.auth-button {
  background-color: transparent;
  border: 2px solid #0073b1;
  color: #0073b1;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.auth-button:hover {
  background-color: rgba(0, 115, 177, 0.1);
  color: #0073b1;
}

/* Add to dark mode section */
.dark-mode .auth-button {
  border-color: #ffffff;
  color: #ffffff;
}

.dark-mode .auth-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.Premium {
  background-color: transparent;
  border: 2px solid #FFD700;
  color: #FFD700;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-right: 1rem;
}

.Premium:hover {
  background-color: rgba(255, 215, 0, 0.1);
  color: #FFD700;
}

/* Add to dark mode section */
.dark-mode .Premium {
  border-color: #FFD700;
  color: #FFD700;
}

.dark-mode .Premium:hover {
  background-color: rgba(255, 215, 0, 0.1);
  color: #FFD700;
}

/* Premium Modal Styles */
#premiumModal .modal-body {
  padding: 2rem;
}

#premiumModal .price-section {
  text-align: center;
  margin: 1.5rem 0;
}

#premiumModal ul {
  list-style-type: none;
  padding-left: 0;
}

#premiumModal ul li {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

#premiumModal ul li:before {
  content: '✓';
  color: #28a745;
  position: absolute;
  left: 0;
}

#paypal-button-container {
  margin-top: 1.5rem;
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

.user-email {
  font-weight: 500;
  color: black;
}

.dark-mode .user-email {
  color: white;
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

/* Add this to your dark mode overrides section */
.dark-mode .btn-secondary.dropdown-toggle {
  background-color: #333333 !important;
  color: #ffffff !important;
  border-color: #555555 !important;
}

.dark-mode .btn-secondary.dropdown-toggle:hover {
  background-color: #444444 !important;
  border-color: #666666 !important;
}

.dark-mode .btn-secondary.dropdown-toggle:active,
.dark-mode .btn-secondary.dropdown-toggle.show {
  background-color: #444444 !important;
  border-color: #666666 !important;
}
</style>


<style>
  /* override the default authentication styles to fit the CareerQuest theme */
  :root {
    --amplify-components-authenticator-router-box-shadow: none !important;
    --amplify-components-authenticator-router-border-width: 0 !important;
    --amplify-components-input-focus-border-color: #0073b1d !important;
    --amplify-components-fieldcontrol-focus-box-shadow: 0 0 0 1px #0073b1 !important
  }

  .amplify-heading--3 {
    color: #1a1a1a;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .amplify-label {
    color: #444;
  }
  .amplify-button.amplify-button--primary {
    background-color: #0073b1;
  }

  .amplify-button.amplify-button--primary:hover {
    background-color: #005d92;
  }

  .amplify-tabs__item {
    color: rgba(0, 0, 0, 0.5);
  }

  .amplify-tabs__item:hover {
    color: #0073b1;
  }

  .amplify-tabs__item--active {
    color: #0073b1;
    border-color: #0073b1;
  }


  .footer {
  /* margin-top: auto; */
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(157, 179, 221, 0.5);
  padding: 1rem 0;  /* Reduced from 2rem to 1rem */
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-logo {
  height: 30px;  /* Reduced from default size */
  width: auto;
}

.footer-links {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";;
  font-size: 1rem;
  font-weight: 500;
  font-size: 0.9rem;  /* Slightly smaller font size */
  transition: background-color .15s ease-in-out;
  border-radius: 50px;
}

.footer-links a:hover {
  color: #0073b1;
  background: rgba(0, 115, 177, 0.1);
}

.copyright {
  color: #666;
  font-size: 0.9rem;  /* Slightly smaller font size */
  margin: 0;
}

/* Dark mode overrides for footer */
.dark-mode .footer {
  background: rgba(24, 24, 24, 0.95);
  border-top: 1px solid rgba(85, 85, 85, 0.5);
}

.dark-mode .footer-links a,
.dark-mode .copyright {
  color: #aaa;
}

.dark-mode .footer-links a:hover {
  color: #fff;
}
</style>