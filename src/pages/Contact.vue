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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import emailjs from '@emailjs/browser';
import '@/assets/dark-mode.css';
import '@/assets/light-mode.css';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});


import { Hub } from 'aws-amplify/utils';
const darkMode = ref(false);
const fontSize = ref()// Apply dark mode 
const currentLanguage = ref("en");
const itemsPerPage = ref("25")

const applyDarkMode = () => {
  if (darkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};
// Watch for changes to darkmode and apply accordingly
watch(darkMode, applyDarkMode);
import { getCurrentUser } from "aws-amplify/auth";



const loadSettings = async () => {
  console.log("loadSettings called")
    const { userId } = await getCurrentUser();
    console.log("userId: ", userId)
    const response = await fetch("https://7nzvzc1dd8.execute-api.us-east-2.amazonaws.com/dev/getting", {
      method: "POST",
      body: JSON.stringify({id: userId})
    })
    const result = await response.json()
    console.log("result: ", result)
    if (result.body == '[{}]') {
      console.log("result.body == '[{}]'")
      const response2 = await fetch("https://cceysg77wa.execute-api.us-east-2.amazonaws.com/dev/updating", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          reset_settings: true
        })
      })
      const result2 = await response2.json()
      console.log("result2: ", result2)
      await nextTick()
      const response3 = await fetch("https://7nzvzc1dd8.execute-api.us-east-2.amazonaws.com/dev/getting", {
        method: "POST",
        body: JSON.stringify({id: userId})
      })
      const result3 = await response3.json()
      console.log("result3: ", result3)
      console.log("result3.body: ", result3.body)
      let body = result3.body
      body = JSON.parse(body.slice(1, -1))
      console.log("body: ", body, " typeof body", typeof body)
      const resultAsJSON = body
      currentLanguage.value = resultAsJSON.language
      darkMode.value = resultAsJSON.dark_mode
      fontSize.value = resultAsJSON.font_size
      itemsPerPage.value = resultAsJSON.ipp
    }
    else {
      console.log("result.body != '[{}]'")
      const resultAsJSON = JSON.parse(result.body.slice(1, -1))
      console.log("resultAsJSON: ", resultAsJSON)
      currentLanguage.value = resultAsJSON.language
      darkMode.value = resultAsJSON.dark_mode
      itemsPerPage.value = resultAsJSON.ipp

    }
};


Hub.listen('auth', ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log('user have been signedIn successfully.');
      loadSettings()
      break;
    case 'signedOut':
      console.log('user have been signedOut successfully.');
      currentLanguage.value = "en"
      darkMode.value = false
      itemsPerPage.value = 25
      break;
  }
})
// Ensure dark mode styles are applied on component mount
onMounted(() => {
  loadSettings()
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
/* Base styles */
.contact-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
}

.contact-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 20px;
}

.contact-sections {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.contact-info,
.contact-form {
  padding: 2rem;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.submit-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

@media (max-width: 768px) {
  .contact-sections {
    grid-template-columns: 1fr;
  }
}
</style>