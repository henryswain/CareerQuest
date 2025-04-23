<template>
  <div class="contact-page">
    <div class="contact-container">
      <h1>Contact Us</h1>
      <p>Have questions or need assistance? We're here to help! Reach out to our team through any of the following channels:</p>
      
      <div class="contact-sections">
        <div class="contact-info">
          <h2>Get in Touch</h2>
          <p><strong>Email:</strong> CustomerHelpQuest@gmail.com</p>
          <p><strong>Phone:</strong> (206) 555-0123</p>
          <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM PST</p>
          <p><strong>Location:</strong> Iowa City, IA</p>
        </div>

        <div class="contact-form">
          <h2>Send us a Message</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" v-model="form.name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required>
            </div>
            
            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" v-model="form.subject" required>
            </div>
            
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="submit-button">Send Message</button>
          </form>
        </div>
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

<script setup>
import { ref } from 'vue';
import emailjs from '@emailjs/browser';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const handleSubmit = async () => {
  try {
    const templateParams = {
      from_name: form.value.name,
      from_email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    };

    await emailjs.send(
      'service_12b4n2q', // Replace with your EmailJS service ID
      'template_hhk4ocf', // Replace with your EmailJS template ID
      templateParams,
      'Or21MKARoNuuU9eG_' // Replace with your EmailJS public key
    );

    alert('Message sent successfully!');
    // Reset form after successful submission
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send message. Please try again.');
  }
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg_lightmode.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding-top: 50px;
}

.contact-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-container h1 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.contact-sections {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-top: 2rem;
}

.contact-info h2,
.contact-form h2 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.contact-info p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #0073b1;
  outline: none;
}

.submit-button {
  background-color: #0073b1;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #005d92;
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

@media (max-width: 768px) {
  .contact-sections {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 1.5rem;
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
</style>

<style>
.dark-mode .contact-page {
  background-image: url("@/assets/bg_darkmode.png");
}

.dark-mode .contact-container {
  background: rgba(51, 51, 51, 0.95);
}

.dark-mode .contact-container h1,
.dark-mode .contact-info h2,
.dark-mode .contact-form h2 {
  color: #ffffff;
}

.dark-mode .contact-info p,
.dark-mode .form-group label {
  color: #e0e0e0;
}

.dark-mode .form-group input,
.dark-mode .form-group textarea {
  background: #444;
  border-color: #555;
  color: #ffffff;
}

.dark-mode .form-group input:focus,
.dark-mode .form-group textarea:focus {
  border-color: #4db5ff;
}

.dark-mode .submit-button {
  background-color: #4db5ff;
}

.dark-mode .submit-button:hover {
  background-color: #3a8cc5;
}

.dark-mode .footer {
  background: rgba(51, 51, 51, 0.95);
  border-top-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .footer-links a {
  color: #e0e0e0;
}

.dark-mode .footer-links a:hover {
  color: #4db5ff;
  background: rgba(77, 181, 255, 0.1);
}

.dark-mode .footer-logo {
  content: url("@/assets/CQ_logo_darkmode.svg");
}
</style>