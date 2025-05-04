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
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
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
.privacy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  /* Use theme variables for background */
  background-color: var(--light-bg);
}

.dark-mode .privacy-page {
  background-color: var(--dark-bg);
}

.privacy-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
}

.privacy-container .card {
  padding: 2rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  background-color: var(--light-surface);
  border: 1px solid var(--light-border);
}

.dark-mode .privacy-container .card {
  background-color: var(--dark-surface);
  border-color: var(--dark-border);
}

.privacy-container h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--light-text-primary);
}

.dark-mode .privacy-container h1 {
  color: var(--dark-text-primary);
}

.privacy-container h2 {
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--light-text-primary);
}

.dark-mode .privacy-container h2 {
  color: var(--dark-text-primary);
}

.privacy-content p {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: var(--light-text-secondary);
}

.dark-mode .privacy-content p {
  color: var(--dark-text-secondary);
}

.privacy-content ul {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.privacy-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: var(--light-text-secondary);
}

.dark-mode .privacy-content li {
  color: var(--dark-text-secondary);
}

</style>