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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import '@/assets/dark-mode.css';
import '@/assets/light-mode.css';

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
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
}

.terms-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 20px;
}

.terms-container h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.terms-container h2 {
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.terms-content p {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.terms-content ul {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.terms-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.alert-box {
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 4px;
}

.alert-box p {
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .terms-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
