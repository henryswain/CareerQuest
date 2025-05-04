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
.about-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
}

.about-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 20px;
}

.about-container h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.about-container p {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .about-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}

.dark-mode .about-page {
  background-color: var(--dark-bg);
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