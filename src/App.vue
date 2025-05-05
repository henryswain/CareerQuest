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
import { Dropdown, Collapse } from 'bootstrap';

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

// Footer visibility tracking
const isFooterVisible = ref(true);
let lastScrollTop = 0;
let ticking = false;

Hub.listen('auth', async ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log("signed in");
      try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        localStorage.setItem('currentUserEmail', email);
        currentUserEmail.value = email;
        
        // Redirect to home page after sign in
        router.push('/home-page');
        
        // Close any modals
        const closeModal = document.getElementById("close-modal");
        if (closeModal) {
          closeModal.click();
        }
      } catch (error) {
        console.error("Error getting current user after sign in:", error);
      }
      break;

    case 'signedOut':
      console.log("signed out");
      localStorage.removeItem('currentUserEmail');
      currentUserEmail.value = null;
      
      // Redirect to home page after sign out
      router.push('/home-page');
      
      const closeModal = document.getElementById("close-modal");
      if (closeModal) {
        closeModal.click();
      }
      break;
  }
});

// Also update the goToAuthPage function to ensure proper routing
function goToAuthPage() {
  // Use replace instead of push to avoid back navigation issues
  router.replace({ path: '/auth' });
}

// Single signOut function - removed duplicate
async function signOut() {
  try {
    await amplifySignOut();
    console.log("Signed out successfully");
    // Redirect to home page after sign out
    router.push('/home-page');
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

function handleDropdownItemClick(action) {
  // Close the navbar collapse
  const navbarCollapse = document.getElementById('navbarNavMobile');
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    const bsCollapse = Collapse.getInstance(navbarCollapse);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  }
  
  // Execute the action
  if (typeof action === 'function') {
    action();
  }
}

function toggleDropdown() {
  const dropdownElement = document.getElementById('dropdownMenuButton');
  if (dropdownElement) {
    const dropdown = Dropdown.getOrCreateInstance(dropdownElement);
    dropdown.toggle();
  }
}

// Router and search handling
const router = useRouter();
const searchText = ref("");

async function handleSubmit() {
  router.replace({ path: '/find-jobs', query: { q: searchText.value } });
  await nextTick();
}

// Footer scroll handler
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
      
      if (scrollDirection === 'down' && isFooterVisible.value) {
        isFooterVisible.value = false;
      } else if (scrollDirection === 'up' && !isFooterVisible.value) {
        isFooterVisible.value = true;
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    });
    ticking = true;
  }
};

// Modify PayPal SDK loading function
function loadPayPalScript() {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=AfXN2AKlII2ctuOylHuBnHdkkzcPB-kqA8NIdz6Gw1c2nGOhqj-scGysrXaR_VGLrduOlACJAsU22o7K&currency=USD';
  script.async = true;
  
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
  
  if (navbarCollapse?.classList.contains('show') && 
      !navbarCollapse.contains(event.target) && 
      !navbarToggler?.contains(event.target)) {
    navbarToggler?.click();
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
  
  // Initialize mobile navbar collapse properly
  const initializeMobileNavbar = () => {
    const navbarToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNavMobile');
    
    if (navbarToggle && navbarCollapse) {
      
      if (navbarToggle._clickHandler) {
        navbarToggle.removeEventListener('click', navbarToggle._clickHandler);
      }
      
      // Create a new click handler
      const clickHandler = (e) => {
        e.preventDefault();
        
        const bsCollapse = Collapse.getInstance(navbarCollapse) || new Collapse(navbarCollapse, {
          toggle: false
        });
        
        bsCollapse.toggle();
      };
      
      // Store the handler for cleanup
      navbarToggle._clickHandler = clickHandler;
      
      // Add the event listener
      navbarToggle.addEventListener('click', clickHandler);
    }
  };
  
  // Force initialization of mobile dropdown after nextTick
  nextTick(() => {
    const initializeMobileDropdown = () => {
      const dropdownElementMobile = document.getElementById('dropdownMenuButtonMobile');
      
      if (dropdownElementMobile) {
        // Dispose of existing instance if any
        const existingInstance = Dropdown.getInstance(dropdownElementMobile);
        if (existingInstance) {
          existingInstance.dispose();
        }
        
        // Create new dropdown instance with proper config
        const dropdown = new Dropdown(dropdownElementMobile);
        
        // Add click handler
        dropdownElementMobile.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.toggle();
        });
        
        // Add touch handler for mobile devices
        dropdownElementMobile.addEventListener('touchstart', (e) => {
          e.preventDefault();
          dropdown.toggle();
        });
      }
    };
    
    // Initialize immediately
    initializeMobileDropdown();
    initializeMobileNavbar(); 
    
    // Also initialize on resize to mobile
    window.addEventListener('resize', () => {
      if (window.innerWidth < 992) {
        nextTick(() => {
          initializeMobileDropdown();
          initializeMobileNavbar(); 
        });
      }
    });
  });
  
  // Add event listeners
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScrollEvent, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
});
</script>

<template>
  <div id="app" style="position: relative;">
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
  

<nav class="navbar navbar-expand-lg navbar-light fixed-top d-lg-none custom-navbar">
  <div class="container-fluid">
    <router-link class="navbar_logo_container" to="/home-page">
      <img class="navbar_logo_img" alt="CareerQuest logo"/>
    </router-link>
    
    <!-- User info appears outside the collapsed menu -->
    <div class="d-flex align-items-center">
      <span v-if="currentUserEmail" class="navbar-text user-email me-2">
        Hello, {{ currentUserEmail.split('@')[0] }}
      </span>
      
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavMobile"
        aria-controls="navbarNavMobile"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    
    <div class="collapse navbar-collapse" id="navbarNavMobile">
      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link 
            class="navbarlink nav-link" 
            to="/find-jobs"
            @click="handleDropdownItemClick(() => router.push('/find-jobs'))"
          >
            Find Jobs
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            class="navbarlink nav-link" 
            to="/saved-jobs"
            @click="handleDropdownItemClick(() => router.push('/saved-jobs'))"
          >
            Saved Jobs
          </router-link>
        </li>
      </ul>
      
      <form class="d-flex my-2 w-100" @submit.prevent="handleSubmit">
        <input
          class="form-control me-2"
          type="text"
          v-model="searchText"
          placeholder="Search jobs..."
        />
        <button class="searchbutton btn btn-primary" type="submit">Search</button>
      </form>
      
      <!-- Account dropdown inside collapse -->
      <div class="dropdown mt-3 mb-2">
        <button 
          id="dropdownMenuButtonMobile"
          class="btn btn-secondary dropdown-toggle w-100" 
          type="button" 
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="me-2">Account</span>
          <img
            src="@/assets/user.png"
            style="max-height: 30px;"
            alt="User"
            class="rounded-circle"
          />
        </button>
        <ul class="dropdown-menu dropdown-menu-end w-100" aria-labelledby="dropdownMenuButtonMobile">
          <li>
            <router-link 
              class="dropdown-item" 
              to="/profile"
              @click="handleDropdownItemClick(() => router.push('/profile'))"
            >
              Profile
            </router-link>
          </li>
          <li>
            <router-link 
              class="dropdown-item" 
              to="/settings"
              @click="handleDropdownItemClick(() => router.push('/settings'))"
            >
              Settings
            </router-link>
          </li>
          <li><hr class="dropdown-divider" /></li>
          
          <li v-if="currentUserEmail">
            <button 
              class="dropdown-item" 
              @click="handleDropdownItemClick(signOut)"
              data-bs-dismiss="modal"
            >
              Sign Out
            </button>
          </li>
          <li v-else>
            <button
              type="button"
              class="dropdown-item"
              @click="handleDropdownItemClick(goToAuthPage)"
              data-bs-dismiss="modal"
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
            <h5 class="modal-title" id="premiumModalLabel">Upgrade to Premium (In Beta)</h5>
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
  <footer class="footer" :class="{ 'footer-hidden': !isFooterVisible }">
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