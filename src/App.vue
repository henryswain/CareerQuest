<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import originalConfig from '../amplify_outputs.json';
import { fetchUserAttributes, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Dropdown } from 'bootstrap';

// Import the separate CSS files
import '@/assets/desktop-styles.css';
import '@/assets/mobile-styles.css';
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

// Event handler functions for cleanup
const handleScrollEvent = () => {
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  dropdowns.forEach(dropdown => {
    const button = dropdown.previousElementSibling;
    const dropdownInstance = Dropdown.getInstance(button);
    if (dropdownInstance) {
      dropdownInstance.hide();
    }
  });
};

const handleClickOutside = (event) => {
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  dropdowns.forEach(dropdown => {
    const button = dropdown.previousElementSibling;
    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
      const dropdownInstance = Dropdown.getInstance(button);
      if (dropdownInstance) {
        dropdownInstance.hide();
      }
    }
  });
  
  // Close mobile navbar menu when clicking outside
  const navbarCollapse = document.getElementById('navbarNavMobile');
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  if (navbarCollapse.classList.contains('show') && 
      !navbarCollapse.contains(event.target) && 
      !navbarToggler.contains(event.target)) {
    navbarToggler.click();
  }
};

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
  
  // Initialize both desktop and mobile dropdowns
  const dropdownElement = document.getElementById('dropdownMenuButton');
  if (dropdownElement) {
    new Dropdown(dropdownElement);
  }
  
  const dropdownElementMobile = document.getElementById('dropdownMenuButtonMobile');
  if (dropdownElementMobile) {
    new Dropdown(dropdownElementMobile);
  }
  
  // Ensure Bootstrap is aware of dynamic elements
  nextTick(() => {
    const triggerTabList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    triggerTabList.forEach(triggerEl => {
      new Dropdown(triggerEl);
    });
  });
  
  // Add event listeners
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScrollEvent, { passive: true });
});

// Clean up event listeners when component unmounts
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScrollEvent);
});
</script>

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
          aria-expanded="false"
          aria-controls="navbarNavMobile"
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
            <button class="searchbutton btn btn-primary" type="submit">Search</button>
          </form>
          <div class="dropdown w-100 d-flex justify-content-end">
            <button 
              id="dropdownMenuButtonMobile"
              class="btn btn-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="@/assets/user.png"
                style="max-height: 30px;"
                alt="User"
                class="rounded-circle"
              />
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonMobile">
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
            <p class="footer-copyright">&copy; 2025 CareerQuest, Inc</p>
          </div>

          <div class="footer-logo-section">
            <img class="navbar_logo_img" alt="CareerQuest logo" />
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

<style scoped>

</style>