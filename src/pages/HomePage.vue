<template>
  <div class="home-page">
    <div class="CareerQuest">
      <div class="center-logo-area">
        <h1 class="main-title">CareerQuest</h1>
        <h2 class="subtitle">Your Path to Success</h2>
        <p class="description">
          Welcome to CareerQuest, your trusted partner in finding the perfect job. We're here to help you navigate the job market, connect with employers, and grow your career.
          </p>
    </div>
  </div>

    <!-- Featured Jobs Section -->
    <div class="featured-jobs-section">
      <h2 class="featured-title">Featured Opportunities</h2>
      <div class="jobs-container">
        <div class="job-card">
          <div class="job-header">
            <h3>Senior Software Engineer</h3>
            <span class="company">TechCorp Inc.</span>
          </div>
          <p class="job-description">Join our innovative team building next-gen cloud solutions. Remote friendly.</p>
          <div class="job-footer">
            <span class="location">📍 Seattle, WA</span>
            <span class="salary">💰 $130K - $180K</span>
          </div>
        </div>

        <div class="job-card">
          <div class="job-header">
            <h3>UX/UI Designer</h3>
            <span class="company">DesignHub</span>
          </div>
          <p class="job-description">Create beautiful, intuitive experiences for millions of users worldwide.</p>
          <div class="job-footer">
            <span class="location">📍 San Francisco, CA</span>
            <span class="salary">💰 $90K - $140K</span>
          </div>
        </div>

        <div class="job-card">
          <div class="job-header">
            <h3>Data Scientist</h3>
            <span class="company">Analytics Pro</span>
          </div>
          <p class="job-description">Turn big data into actionable insights. AI/ML experience required.</p>
          <div class="job-footer">
            <span class="location">📍 New York, NY</span>
            <span class="salary">💰 $115K - $165K</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <h2 class="faq-title">Got Questions?</h2>
      <div class="faq-container">
        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(0)" :class="{ 'active': activeIndex === 0 }">
            How does CareerQuest help me find jobs?
            <span class="arrow">&#9662;</span>
          </button>
          <div class="faq-answer" :class="{ 'show': activeIndex === 0 }">
            CareerQuest uses advanced AI matching to connect your skills and preferences with the perfect job opportunities. Our platform analyzes your profile and suggests positions that align with your career goals.
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(1)" :class="{ 'active': activeIndex === 1 }">
            Is CareerQuest free to use?
            <span class="arrow">&#9662;</span>
          </button>
          <div class="faq-answer" :class="{ 'show': activeIndex === 1 }">
            Yes! CareerQuest is completely free for job seekers. Create your profile, browse jobs, and apply to positions without any cost. Premium features are available for enhanced job search capabilities.
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(2)" :class="{ 'active': activeIndex === 2 }">
            How do I get started?
            <span class="arrow">&#9662;</span>
          </button>
          <div class="faq-answer" :class="{ 'show': activeIndex === 2 }">
            Getting started is easy! Simply create your profile, upload your resume, and set your job preferences. Our system will immediately begin matching you with relevant opportunities.
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(3)" :class="{ 'active': activeIndex === 3 }">
            What makes CareerQuest different?
            <span class="arrow">&#9662;</span>
          </button>
          <div class="faq-answer" :class="{ 'show': activeIndex === 3 }">
            CareerQuest stands out with its personalized approach, AI-powered job matching, and comprehensive career development tools. We focus on quality matches rather than quantity of listings.
          </div>
        </div>
      </div>
    </div>

    <!-- <footer class="footer">
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
    </footer> -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, defineProps, watch, computed } from 'vue';

const darkMode = ref(false);
// loads user settings from localStorage
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
// Watch for changes to darkmode and apply accordingly
watch(darkMode, applyDarkMode);
// On component mount, load user settings and apply dark mode
onMounted(() => {
  loadSettings();
  applyDarkMode();
});

const activeIndex = ref(null);

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg_lightmode.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding-top: 80px;
}

.center-logo-area {
  text-align: center;
  padding: 6rem 2rem;
  margin: 2rem auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 40px;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.center-logo-area::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.main-title {
  font-size: 5rem;
  font-weight: 900;
  color: #0073b1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.description {
  font-size: 1.3rem;
  color: #333333;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Update dark mode styles */
.dark-mode .main-title {
  color: #7bc5ec;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 115, 177, 0.6);
}

.dark-mode .subtitle {
  color: #ffffff;
}

.dark-mode .description {
  color: #cccccc;
}

.faq-section {
  padding: 2rem;
  width: 100%;
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.faq-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #7bc5ec;
  margin-bottom: 2rem;
}

.faq-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: 0 1rem;
  color: #444;
  line-height: 1.6;
}

.faq-answer.show {
  max-height: 500px;
  padding: 1rem;
  margin: 0.5rem 0;
}

.faq-question:hover,
.faq-question.active {
  color: #0073b1;
}

.arrow {
  transition: transform 0.3s ease;
}

.faq-question.active .arrow {
  transform: rotate(180deg);
}

/* Featured Jobs Section */
.featured-jobs-section {
  width: 100%;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.featured-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #0073b1;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.job-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.job-header h3 {
  font-size: 1.4rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.company {
  color: #0073b1;
  font-weight: 600;
  font-size: 1.1rem;
}

.job-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  min-height: 3.2em;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
}

/* Footer Styles */
.footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.footer-section:nth-child(1) {
  justify-content: flex-start;
}

.footer-section:nth-child(2) {
  justify-content: center;
}

.footer-section:nth-child(3) {
  justify-content: flex-end;
}

.footer-logo {
  height: 40px;
  width: auto;
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
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #0073b1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .center-logo-area {
    padding: 4rem 1.5rem;
    margin: 1rem;
    border-radius: 30px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .description {
    font-size: 1.1rem;
  }

  .featured-jobs-section {
    padding: 3rem 1rem;
  }

  .featured-title {
    font-size: 2rem;
  }

  .jobs-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .footer-section {
    justify-content: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}

/* Dark Mode */
.dark-mode .home-page {
  background-image: url("@/assets/bg_darkmode.png");
}

.dark-mode .center-logo-area {
  background: linear-gradient(135deg, rgba(0, 115, 177, 0.3), rgba(0, 160, 220, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.dark-mode .main-title {
  color: #b2dbf1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 115, 177, 0.6);
}

.dark-mode .subtitle {
  color: #ffffff;
}

.dark-mode .description {
  color: #cccccc;
}

.dark-mode .faq-section {
  background: rgba(33, 33, 33, 0.9);
}

.dark-mode .faq-title {
  color: #b2dbf1;
}

.dark-mode .faq-question {
  color: #fff;
}

.dark-mode .faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-mode .faq-answer {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.dark-mode .featured-jobs-section {
  background: linear-gradient(135deg, rgba(0, 115, 177, 0.2), rgba(0, 160, 220, 0.1));
}

.dark-mode .featured-title {
  color: #b2dbf1;
}

.dark-mode .job-card {
  background: rgba(33, 33, 33, 0.9);
}

.dark-mode .job-header h3 {
  color: #ffffff;
}

.dark-mode .company {
  color: #7bc5ec;
}

.dark-mode .job-description {
  color: #cccccc;
}

.dark-mode .job-footer {
  color: #b0bec5;
}
</style>

