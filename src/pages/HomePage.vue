<template>
  <div class="home-page">
    <br>
    <div class="center-logo-area">
      <!-- Logo is handled by CSS content property -->
      <img class="home-page-logo" alt="Company Logo" />
      <br>
      <h4>Taking your job search to new heights</h4>
      <br>
    </div>

    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="carousel-content">
            <h2>Find Your Dream Job</h2>
            <p>Browse through thousands of opportunities tailored to your skills and experience.</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="carousel-content">
            <h2>Smart Job Matching</h2>
            <p>Our AI-powered system matches you with the most relevant positions.</p>
          </div>
        </div>

        <div class="carousel-item">
          <div class="carousel-content">
            <h2>Track Your Progress</h2>
            <p>Keep track of your applications and interviews all in one place.</p>
          </div>
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Add Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <p class="copyright">&copy; 2024 CareerQuest, Inc</p>
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
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, defineProps, watch, computed } from 'vue';

const darkMode = ref(false);

const loadSettings = () => {
  const savedSettings = localStorage.getItem('userSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    darkMode.value = settings.darkMode || false;
  }
};

// Apply dark mode 
const applyDarkMode = () => {
  if (darkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

watch(darkMode, applyDarkMode);

onMounted(() => {
  loadSettings();
  applyDarkMode();
});

</script>

<!-- Scoped style for homepage -->
<style scoped>
.home-page {
  background-image: url("@/assets/bg_lightmode.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 50px;
}

.center-logo-area {
  backdrop-filter: blur(6px);
  margin: 20px auto;
  width: 80%;
  max-width: 800px;
  text-align: center;
  border-radius: 50px;
  border: 2px solid #9db3dd;
  padding: 20px;
}

.home-page-logo {
  content: url("@/assets/CQ_logo_lightmode.svg");
  width: 100%;
  max-width: 600px;
  height: auto;
  padding: 20px;
}

.carousel {
  width: 90%;
  max-width: 1200px;
  margin: 3rem auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.carousel-item {
  height: 400px;
}

.carousel-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 3rem;
}

.carousel-content h2 {
  font-size: 3.2rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.carousel-content p {
  font-size: 1.4rem;
  color: #444;
  max-width: 800px;
  line-height: 1.6;
}

.carousel-control-prev,
.carousel-control-next {
  width: 10%;
  opacity: 0.8;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  padding: 2rem;
  transition: transform 0.2s;
}

.carousel-control-prev-icon:hover,
.carousel-control-next-icon:hover {
  transform: scale(1.1);
}

.carousel-indicators {
  bottom: 20px;
}

.carousel-indicators button {
  background-color: rgba(0, 0, 0, 0.5);
  height: 4px;
  width: 40px;
  margin: 0 8px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.carousel-indicators .active {
  background-color: #0073b1;
  width: 50px;
}

.footer {
  margin-top: auto;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(157, 179, 221, 0.5);
  padding: 2rem 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3rem;
}

.footer-logo {
  height: 40px;
  width: auto;
  transition: opacity 0.2s;
  display: block;
  margin: 0 auto;
}

.footer-section:nth-child(2) {
  justify-content: center;
  display: flex;
  align-items: center;
}

.footer-logo:hover {
  opacity: 0.8;
}

.footer-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.footer-links a {
  color: #444;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.footer-links a:hover {
  color: #0073b1;
  background: rgba(0, 115, 177, 0.1);
}

@media (max-width: 768px) {
  .carousel-item {
    height: 300px;
  }

  .carousel-content h2 {
    font-size: 2.4rem;
  }

  .carousel-content p {
    font-size: 1.1rem;
  }

  .footer-content {
    padding: 0 1.5rem;
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>

<!-- Global dark mode overrides -->
<style>
.dark-mode {
  color: #ffffff;
}
.dark-mode .home-page {
  background-color: #121212;
  background-image: url("src/assets/bg_darkmode.png");
  background-repeat: no-repeat;
  background-size:cover;
}

.dark-mode .home-page-logo {
  content: url("@/assets/CQ_logo_darkmode.svg");
}

.dark-mode .center-logo-area {
  border: 2px solid #ffffff;
}

</style>
