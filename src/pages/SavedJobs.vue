<template>
  <div class="saved-jobs-container">
    <h1>Saved Jobs</h1>
    <div v-if="savedJobs.length === 0" class="no-jobs">
      <p>No Jobs Saved</p>
    </div>
    <ul v-else class="jobs-list">
      <li v-for="job in savedJobs" :key="job.id" class="job-item">
        <h3>{{ job.title }}</h3>
        <p>{{ job.company }}</p>
        <p>{{ job.location }}</p>

        <div class="btn-group">
          <!-- Learn More -->
          <button type="button" class="btn btn-primary" @click="fetchJobDetails(job.id)" data-bs-toggle="modal" :data-bs-target="'#modal_' + job.id">
            Learn More
          </button>
          <!-- Remove button -->
          <button class="btn btn-danger ms-2" @click="removeJob(job.id)">Remove</button>
        </div>

        <!-- Job Details Modal from FindJobs -->
        <div class="modal fade" :id="'modal_' + job.id" tabindex="-1" aria-labelledby="more information" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5">{{ job.title }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <h5>Job Description</h5>
                <p v-if="jobDetails[job.id]">
                  {{ isExpanded(job.id, 'description')
                    ? cleanText(jobDetails[job.id].description)
                    : shortenText(cleanText(jobDetails[job.id].description)) }}
                </p>
                <button v-if="jobDetails[job.id]" class="btn btn-link" @click="toggleExpand(job.id, 'description')">
                  {{ isExpanded(job.id, 'description') ? "Show Less" : "Show More" }}
                </button>

                <h5>Basic Qual Requirements</h5>
                <p v-if="jobDetails[job.id]">
                  {{ isExpanded(job.id, 'requirements')
                    ? cleanText(jobDetails[job.id].requirements)
                    : shortenText(cleanText(jobDetails[job.id].requirements)) }}
                </p>
                <button v-if="jobDetails[job.id]" class="btn btn-link" @click="toggleExpand(job.id, 'requirements')">
                  {{ isExpanded(job.id, 'requirements') ? "Show Less" : "Show More" }}
                </button>

                <h5>Preferred Skills</h5>
                <p v-if="jobDetails[job.id]">
                  {{ isExpanded(job.id, 'skills')
                    ? cleanText(jobDetails[job.id].skills)
                    : shortenText(cleanText(jobDetails[job.id].skills)) }}
                </p>
                <button v-if="jobDetails[job.id]" class="btn btn-link" @click="toggleExpand(job.id, 'skills')">
                  {{ isExpanded(job.id, 'skills') ? "Show Less" : "Show More" }}
                </button>
                <p v-if="!jobDetails[job.id]" class="text-muted">Loading job details...</p>
              <h5>Salary Range</h5>
                <p v-if="jobDetails[job.id]">
                  {{ jobDetails[job.id].salaryFrom ? `$${jobDetails[job.id].salaryFrom} ${jobDetails[job.id].salaryFrequency || ''}` : 'Not specified.' }}
                </p>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn btn-primary"
                    @click="goToApplyLink(job.id)"
                  >
                    View Original Listing
                  </button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  
</template>

<script setup>
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import { getCurrentUser } from 'aws-amplify/auth';
// import jobsCsv from "@/assets/Jobs_NYC_Postings.csv?raw";

const savedJobs = ref([]);
const userId = ref("");
const LAMBDA_URL = "https://5weiq0uvn8.execute-api.us-east-2.amazonaws.com/dev/update";
const allJobs = ref([]);

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


function goToApplyLink(jobId) {
  window.open("https://cityjobs.nyc.gov/job/" + jobId, '_blank').focus();
  console.log("https://cityjobs.nyc.gov/job/" + jobId);
}

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

onMounted(async () => {
  try {
    // Get user ID
    const { username } = await getCurrentUser();
    userId.value = username;

    // Fetch saved jobs
    const savedJobRes = await fetch(`${LAMBDA_URL}?crud_type=read&user_id=${userId.value}`);
    const savedJobData = await savedJobRes.json();
    const savedJobIds = Array.isArray(savedJobData.body)
      ? savedJobData.body.map(String)
      : JSON.parse(savedJobData.body).map(String);

    console.log("Saved job IDs:", savedJobIds);

    // Fetch all jobs
    const filters = ref({});
    let data = { items: [], pageToken: null };

    const fetchAllJobs = async () => {
      const response = await fetch('https://54pullbiac.execute-api.us-east-2.amazonaws.com/dev/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: filters.value }),
      });
      if (response.ok) {
        data = await response.json();
        return data.items;
      }
      return [];
    };

    let allJobs = await fetchAllJobs();
    let filtered = allJobs.filter(job => savedJobIds.includes(String(job["Job ID"])));

    // SavedJobs from filtered jobs
    for (const job of filtered) {
      const id = String(job["Job ID"]);
      jobDetails.value[id] = {
        title: job["Civil Service Title"] || "Untitled",
        location: job["Work Location"] || "Unknown Location",
        salaryFrequency: job["Salary Frequency"] || "",
        salaryFrom: job["Salary Range From"] || "",
        fullPartTime: job["Full-Time/Part-Time indicator"] || "",
        description: job["Job Description"] || "No description.",
        requirements: job["Minimum Qual Requirements"] || "Not specified.",
        skills: job["Preferred Skills"] || "Not specified.",
      };
      savedJobs.value.push({
        id,
        title: jobDetails.value[id].title,
        company: jobDetails.value[id].company,
        location: jobDetails.value[id].location,
      });
    }
  } catch (e) {
    console.error("Auth or job load error:", e.message);
  }

  loadSettings();
});


//text cleaning function
function cleanText(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .replace(/â/g, '"')
    .replace(/â¢/g, '-')
    .replace(/â/g, '"')
    .replace(/â/g, "''")
    .replace(/â/g, '—')
    .replace(/[^\x20-\u00FF]/g, '');
}

// Track if expanded
const expanded = ref({});

const isExpanded = (jobId, section) => expanded.value[jobId]?.[section] || false;

const toggleExpand = (jobId, section) => {
  if (!expanded.value[jobId]) {
    expanded.value[jobId] = {};
  }
  expanded.value[jobId][section] = !expanded.value[jobId][section];
};

// Shorten for preview
const shortenText = (text, length = 150) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

const jobDetails = ref({});


// Remove job from DB using API call
async function removeJob(id) {
  try {
    await fetch(`${LAMBDA_URL}?crud_type=delete&user_id=${userId.value}&job_id=${id}`);
    savedJobs.value = savedJobs.value.filter(job => job.id !== id);
  } catch (err) {
    console.error("Remove job failed:", err);
  }
}

const fetchJobDetails = async (jobId) => {
  if (jobDetails.value[jobId]) return; // Skip if already fetched
  try {
    const response = await fetch(`https://npvdpxycgi.execute-api.us-east-2.amazonaws.com/dev2/reading?id=${jobId}`);
    const data = await response.json();
  
    if (data.items && data.items.length > 0) {
      const job = data.items[0];
      jobDetails.value[jobId] = {
        title: job["Civil Service Title"] || "Untitled",
        company: job["Agency"] || "Unknown Agency",
        location: job["Work Location"] || "Unknown Location",
        salaryFrequency: job["Salary Frequency"] || "",
        salaryFrom: job["Salary Range From"] || "",
        fullPartTime: job["Full-Time/Part-Time indicator"] || "",
        description: job["Job Description"] || "No description.",
        requirements: job["Minimum Qual Requirements"] || "Not specified.",
        skills: job["Preferred Skills"] || "Not specified.",
        apply: job["To Apply"] || "Not specified"
      };
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
  }
};

</script>

<style scoped>
.saved-jobs-container {
  padding: 2rem;
  background-color: #f8f9fa; /* Light background by default */
  min-height: calc(100vh - 140px); /* Adjust for navbar and footer */
  color: #333;
}

.no-jobs {
  text-align: center;
  color: #777;
}

.jobs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.job-item {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.job-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.job-item p {
  color: #666;
  margin-bottom: 0.25rem;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

/* Dark mode overrides */
.dark-mode .saved-jobs-container {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dark-mode .no-jobs {
  color: #bbb;
}

.dark-mode .job-item {
  border-color: #444;
  background-color: #282828;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark-mode .job-item h3 {
  color: #f5f5f5;
}

.dark-mode .job-item p {
  color: #d0d0d0;
}

.dark-mode .btn-link {
  color: #87CEEB !important;
}

.dark-mode .btn-link:hover {
  color: #B0E0E6 !important;
}

.dark-mode .modal-content {
  background-color: #282828;
  color: #f5f5f5;
  border-color: #444;
}

.dark-mode .modal-header {
  border-bottom-color: #444;
}

.dark-mode .modal-footer {
  border-top-color: #444;
}

.dark-mode .modal-title {
  color: #f5f5f5;
}

.dark-mode .btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.dark-mode .btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.dark-mode .btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.dark-mode .btn-close {
  filter: invert(1);
}

.dark-mode .text-muted {
  color: #aaa !important;
}

/* Style the "Saved Jobs" heading */
h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

.dark-mode h1 {
  color: #f5f5f5;
}

/* modal sections */
h5 {
  color: #333;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.dark-mode h5 {
  color: #f5f5f5;
}

/* spacing and layout */
.modal-body p {
  margin-bottom: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.btn-link {
  padding: 0.5rem 0;
}
</style>
