<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <h1>Privacy Policy</h1>
      
      <div class="privacy-content">
        <p>Welcome to CareerQuest, a career services platform that connects students, schools, and employers to democratize the job finding experience, in college and beyond.</p>

        <p>From the very beginning, our goal has been to design privacy into our platform in a way that respects the rights of students, the obligations of colleges and universities, and the needs of employers. This policy (the "Privacy Policy") describes how CareerQuest ("CareerQuest", "we", "us", or "our") collects, uses, and shares your personal data. By "personal data", "personal information" or similar terms, we mean any data relating to an identified or identifiable natural person that is processed by us in accordance with this Privacy Policy and that is subject to applicable data privacy laws.</p>

        <h2>Scope of Privacy Policy</h2>
        <p>The Privacy Policy applies to your access and use of CareerQuest's user-facing application commonly known as "CareerQuest" and the features therein, websites, including without limitation the careerquest.com website, tools, data, and documentation (collectively the "Services"). This Privacy Policy is part of CareerQuest's Terms of Service. By using the Services, you agree to both our Terms of Service and this Privacy Policy; if you do not agree, please do not use the Services.</p>

        <h2>Personal Data We Collect</h2>
        <p>Users need to establish an account to fully access the Services. You can create an account on CareerQuest as:</p>
        <ul>
          <li>A student seeking a job or career advice</li>
          <li>A representative of an employer working with CareerQuest to find exciting new talent ("Employer Partner")</li>
          <li>A career center professional at a college or university working with CareerQuest ("University Partner")</li>
        </ul>

        <h2>Information From University Partners</h2>
        <p>When University Partners sign up for CareerQuest, they send us certain personal data about their students so that CareerQuest may pre-populate accounts to provide the Services. It is up to each University Partner to choose what information it shares, but this data may include the student's first and last name, mailing address, email address, major, and/or GPA. Where the Family Educational Rights and Privacy Act ("FERPA") applies to data shared by University Partners, it is processed in compliance with the statute.</p>

        <!-- ... Additional sections ... -->
      </div>
    </div>

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
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg_lightmode.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding-top: 50px;
}

.privacy-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.privacy-container h1 {
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.privacy-container h2 {
  color: #1a1a1a;
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.privacy-content p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.privacy-content ul {
  color: #444;
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.privacy-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* Footer styles */
.footer {
  margin-top: auto;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(157, 179, 221, 0.5);
  padding: 2rem 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

/* ... rest of footer styles ... */
</style>

<style>
/* Dark mode styles */
.dark-mode .privacy-page {
  background-image: url("@/assets/bg_darkmode.png");
}

.dark-mode .privacy-container {
  background: rgba(51, 51, 51, 0.95);
}

.dark-mode .privacy-container h1,
.dark-mode .privacy-container h2 {
  color: #ffffff;
}

.dark-mode .privacy-content p,
.dark-mode .privacy-content ul,
.dark-mode .privacy-content li {
  color: #e0e0e0;
}

/* ... rest of dark mode styles ... */
</style>