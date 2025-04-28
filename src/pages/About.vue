<template>
  <div class="about-page">
    <div class="about-container">
      <h1>About CareerQuest</h1>
      <p>If you're a college student—or know one—you understand how overwhelming it can be to navigate job boards, networking sites, and internship listings. That's why we built CareerQuest in 2025—to reimagine how, where, and why the next generation of talent starts their careers.</p>
      <p>We believe that career opportunities should be accessible to everyone, not just those with the right connections or from elite schools. The old model was broken—fragmented, impersonal, and often biased. CareerQuest changes that.</p>
      <p>Today's students—especially Gen Z—expect platforms that feel authentic, inclusive, and designed with them in mind. They've grown up in a world shaped by social media and fast-changing industries. They need more than job listings—they need inspiration, mentorship, and real connection.</p>
      <p>So we’ve built something new: a social-forward career platform that merges opportunity with community. CareerQuest connects students from hundreds of universities with employers who are actively invested in discovering and supporting emerging talent. From first-year students to graduating seniors, we help users explore, prepare for, and land jobs and internships tailored to their goals and interests.</p>
      <p><strong>This is CareerQuest—the modern way to launch your future.</strong></p>
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

</template>

<style scoped>
.about-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg_lightmode.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding-top: 50px;
}

.about-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.about-container h1 {
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.about-container p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.about-container p strong {
  color: #0073b1;
}

@media (max-width: 768px) {
  .about-container {
    margin: 1rem;
    padding: 1.5rem;
  }
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
</style>

<!-- Add dark mode support -->
<style>
.dark-mode .about-page {
  background-image: url("@/assets/bg_darkmode.png");
}

.dark-mode .about-container {
  background: rgba(51, 51, 51, 0.95);
}

.dark-mode .about-container h1 {
  color: #ffffff;
}

.dark-mode .about-container p {
  color: #e0e0e0;
}

.dark-mode .about-container p strong {
  color: #4db5ff;
}
</style>