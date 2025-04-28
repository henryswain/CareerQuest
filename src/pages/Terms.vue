<template>
  <div class="terms-page">
    <div class="terms-container">
      <h1>Terms of Service</h1>
      
      <div class="terms-content">
        <p>Welcome to CareerQuest! We are a career services platform that connects students and employers to democratize the job finding experience in college and beyond.</p>

        <p>These Terms of Service apply to your use of the services offered by CareerQuest ("CareerQuest" "we" "us" or "our"), including, without limitation, our user-facing application commonly known as "CareerQuest" and the features therein, websites, including, without limitation, the careerquest.com website, tools, data, and documentation (collectively, the "Services").</p>

        <div class="alert-box">
          <p>If you do not agree with these Terms of Service, including the Binding Arbitration Clause and a Class Action waiver included below, please discontinue using the Service.</p>
        </div>

        <h2>Changes to Terms</h2>
        <p>These Terms of Service will change over time. If we make minor changes to the Terms of Service without materially changing your rights, we will post the modified Terms of Service on our website. We will notify you by email, through the CareerQuest Service, or by presenting you with a new Terms of Service to accept if we make a modification that materially changes your rights.</p>

        <h2>Account Creation</h2>
        <p>You need to have an account to use CareerQuest. You can create an account on CareerQuest as:</p>
        <ul>
          <li>A student seeking a job or career advice</li>
          <li>An employer looking for exciting new talent</li>
          <li>A career center professional</li>
          <li>An unassociated individual account</li>
        </ul>
        <p>You agree not to misrepresent any information about yourself in creating or using an account.</p>

        <h2>Student Account Guidelines</h2>
        <p>For student users, your CareerQuest student profile is your first impression for employers around the country. As a rule of thumb, keep your content and communications on CareerQuest professional. Specifically, you are not allowed to post any violent, nude, discriminatory, hateful, or sexually suggestive photos or other similar content via the Service.</p>
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

<style scoped>
.terms-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg_lightmode.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding-top: 50px;
}

.terms-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.terms-container h1 {
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.terms-container h2 {
  color: #1a1a1a;
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.terms-content p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.terms-content ul {
  color: #444;
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.terms-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.alert-box {
  background: rgba(0, 115, 177, 0.1);
  border-left: 4px solid #0073b1;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 4px;
}

.alert-box p {
  color: #0073b1;
  margin: 0;
  font-weight: 500;
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

</style>

<style>
/* Dark mode styles */
.dark-mode .terms-page {
  background-image: url("@/assets/bg_darkmode.png");
}

.dark-mode .terms-container {
  background: rgba(51, 51, 51, 0.95);
}

.dark-mode .terms-container h1,
.dark-mode .terms-container h2 {
  color: #ffffff;
}

.dark-mode .terms-content p,
.dark-mode .terms-content ul,
.dark-mode .terms-content li {
  color: #e0e0e0;
}

.dark-mode .alert-box {
  background: rgba(77, 181, 255, 0.1);
  border-left-color: #4db5ff;
}

.dark-mode .alert-box p {
  color: #4db5ff;
}

</style>