<!-- this page containes the various filters for job sorting, the list of
 jobs, pagination buttons, and the modals for the individual jobs -->

 <template>
  <div class="find-jobs-page">
    <div class="grid-container">
      <!-- Filter Section -->
      <div class="filter-section">
        <div class="card filter-card">
          <div class="card-body">
            <h5 class="card-title">Filter Your Search</h5>
            <!-- Job Type Filter -->
            <div class="filter-group">
              <h6>Job Type</h6>
              <div class="filter-options">
                <button
                  v-for="option in jobTypeOptions"
                  :key="option"
                  :class="['filter-box', { active: filters.jobTypes.includes(option) }]"
                  @click="toggleFilter('jobTypes', option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            <!-- Job Category Filter -->
            <div class="filter-group mt-3">
              <h6>Job Category</h6>
              <div class="filter-options">
                <button
                  v-for="option in jobCategoryOptions"
                  :key="option"
                  :class="['filter-box', { active: filters.industries.includes(option) }]"
                  @click="toggleFilter('industries', option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            <!-- Career Level Filter -->
            <div class="filter-group mt-3">
              <h6>Career Level</h6>
              <div class="filter-options">
                <button
                  v-for="option in careerLevelOptions"
                  :key="option"
                  :class="['filter-box', { active: filters.careerLevels.includes(option) }]"
                  @click="toggleFilter('careerLevels', option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            <!-- Location Filter -->
            <div class="filter-group mt-3">
              <h6>Location</h6>
              <input
                type="text"
                class="form-control"
                placeholder="Enter city or zip"
                v-model="filters.location"
              />
            </div>
          </div>
          <!-- Sticky Footer for Apply Filters Button -->
          <div class="filter-footer">
    <button class="btn btn-primary apply-filter-btn" @click="loadJobs()">
      Apply Filters
    </button>
  </div>
        </div>
      </div>

      <!-- Jobs Section -->
      <div class="jobs-section">
        <!-- <div v-if="!filter"> -->
        <!-- Check if there are no results and changes rendering -->
          <div class="no-jobs-block" v-if="paginatedItems.length === 0">
            <p class="no-jobs-text">No matching jobs found.</p>
          </div>
          <div v-else>
            <!-- Loop through paginated jobs and display them -->
            <div v-for="(item, index) in paginatedItems" :key="item['Job ID']" class="card mb-3">
              <h5 class="card-header d-flex justify-content-between align-items-center">
                <!-- Use getField() for the title; this helper always fetches the right field -->
                <span>{{ toTitleCase(getField(item, "Civil Service Title")) }}</span>
                <button
                  class="icon-button"
                  @click="toggleJob(item)"
                  :aria-label="isJobSaved(item['Job ID']) ? 'Remove bookmark' : 'Save bookmark'"
                >
                  <img
                    :src="isJobSaved(item['Job ID']) ? bookmarkFilled : bookmarkBlank"
                    alt="Bookmark Icon"
                    class="bookmark-icon"
                  />
                </button>
              </h5>
              <div class="card-body">
                <!-- Salary and Location (unchanged) -->
                <div v-if='item["Salary Frequency"] === "Hourly" && item["Full-Time/Part-Time indicator"] === "F"'>
                  <p class="card-text">
                    {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/hr • Full-time
                  </p>
                </div>
                <div v-else-if='item["Salary Frequency"] === "Hourly" && item["Full-Time/Part-Time indicator"] === "P"'>
                  <p class="card-text">
                    {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/hr • Part-time
                  </p>
                </div>
                <div v-else-if='item["Salary Frequency"] === "Annual" && item["Full-Time/Part-Time indicator"] === "F"'>
                  <p class="card-text">
                    {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/yr • Full-time
                  </p>
                </div>
                <div v-else-if='item["Salary Frequency"] === "Annual" && item["Full-Time/Part-Time indicator"] === "P"'>
                  <p class="card-text">
                    {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/yr • Part-time
                  </p>
                </div>
                <p class="card-text">Location: {{ item["Work Location"] }}</p>

                <!-- Action Buttons -->
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    :id="`button_${item['Job ID']}`"
                    :data-bs-target="`#modal_${item['Job ID']}`"
                  >
                    Learn More
                  </button>
                </div>

                <!-- Modal for Job Details -->
                <div class="modal fade" :id="`modal_${item['Job ID']}`" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5">
                          {{ toTitleCase(getField(item, "Civil Service Title")) }}
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <h5>Job Description</h5>
                        <p v-if="getField(item, 'Job Description')">
                          {{ isExpanded(item['Job ID'], 'description') ? cleanText(getField(item, "Job Description")) : shortenText(cleanText(getField(item, "Job Description"))) }}
                        </p>
                        <button
                          v-if="getField(item, 'Job Description')"
                          class="btn btn-link"
                          @click="toggleExpand(item['Job ID'], 'description')"
                        >
                          {{ isExpanded(item['Job ID'], 'description') ? "Show Less" : "Show More" }}
                        </button>

                        <h5>Minimum Qualifications</h5>
                        <p v-if="getField(item, 'Minimum Qual Requirements')">
                          {{ isExpanded(item['Job ID'], 'requirements') ? cleanText(getField(item, "Minimum Qual Requirements")) : shortenText(cleanText(getField(item, "Minimum Qual Requirements"))) }}
                        </p>
                        <button
                          v-if="getField(item, 'Minimum Qual Requirements')"
                          class="btn btn-link"
                          @click="toggleExpand(item['Job ID'], 'requirements')"
                        >
                          {{ isExpanded(item['Job ID'], 'requirements') ? "Show Less" : "Show More" }}
                        </button>

                        <h5 v-if="getField(item, 'Preferred Skills')">Preferred Skills</h5>
                        <p v-if="getField(item, 'Preferred Skills')">
                          {{ isExpanded(item['Job ID'], 'skills') ? cleanText(getField(item, "Preferred Skills")) : shortenText(cleanText(getField(item, "Preferred Skills"))) }}
                        </p>
                        <button
                          v-if="getField(item, 'Preferred Skills')"
                          class="btn btn-link"
                          @click="toggleExpand(item['Job ID'], 'skills')"
                        >
                          {{ isExpanded(item['Job ID'], 'skills') ? "Show Less" : "Show More" }}
                        </button>

                        <h5 v-if="item['To Apply']">To Apply</h5>
                        <p v-if="item['To Apply']">
                          {{ isExpanded(item['Job ID'], 'apply') ? cleanText(item['To Apply']) : shortenText(cleanText(item['To Apply'])) }}
                        </p>
                        <button
                          v-if="item['To Apply']"
                          class="btn btn-link"
                          @click="toggleExpand(item['Job ID'], 'apply')"
                        >
                          {{ isExpanded(item['Job ID'], 'apply') ? "Show Less" : "Show More" }}
                        </button>

                        <div class="modal-footer">
                          <button
                            class="btn btn-primary"
                            @click="goToApplyLink(item['Job ID'])"
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
                </div>
                <!-- End Modal -->
              </div>
            </div>
          </div>
      
          <!-- Pagination Controls -->
            <div class="pagination-controls" v-if="paginatedItems.length != 0">
              <button class="btn btn-secondary" @click="prevPage" :disabled="currentPage === 1">
                Previous
              </button>
              <span class="current-page-num">Page {{ currentPage }}</span>
              <button
                class="btn btn-secondary"
                @click="nextPage"
                :disabled="currentPage * itemsPerPage >= filteredJobs.length"
              >
                Next
              </button>
            </div>
          </div>
        <!-- <div v-else>
          <h2>Please be patient! Loading Jobs</h2>
        </div> -->
      <!-- </div> -->
    </div>
  </div>

  <!-- Modal: Prompt to sign in -->
<div class="modal fade" id="signInRequiredModal" tabindex="-1" aria-labelledby="signInRequiredModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="signInRequiredModalLabel">Sign In Required</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        You must be signed in to save jobs.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#authenticationModal">
          Sign In
        </button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Papa from "papaparse";
// Import both CSV sources:
// import jobsCsvEnglish from "@/assets/Jobs_NYC_Postings.csv?raw";
// import jobsCsvSpanish from "@/assets/Jobs_NYC_Postings_translated.csv?raw";
import { getCurrentUser } from "aws-amplify/auth";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Import bookmark images
import bookmarkFilled from "@/assets/bookmark_filled.png";
import bookmarkBlank from "@/assets/bookmark_blank.png";
import { nextTick } from "vue";

const API_URL = "https://5weiq0uvn8.execute-api.us-east-2.amazonaws.com/dev/update";
const userId = ref("");
const route = useRoute();
const query = computed(() => route.query.q || "");
const router = useRouter();

import { Hub } from 'aws-amplify/utils';

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

// Create an instance.
let controller = null
const loadingJobs = ref(null)
const allJobs = ref([]);
const filteredJobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref("25")
// const itemsPerPage = ref(JSON.parse(localStorage.getItem("userSettings"))?.itemsPerPage || 25);
const savedJobs = ref([]);

// Look at local storage settings and render in darkmode if necessary
const darkMode = ref(false);
const fontSize = ref()
// loads user settings from localStorage

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

// Apply dark mode 
const applyDarkMode = () => {
  if (darkMode.value) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode')
  }
};
// Watch for changes to darkmode and apply accordingly
watch(darkMode, applyDarkMode);

const props = defineProps({
  query: String
})

// --- Language & CSV Source Helper ---
// Get initial language from localStorage "userSettings", default to "en"
// const getInitialLanguage = () => {
//   try {
//     return (JSON.parse(localStorage.getItem("userSettings")) || {}).language || "en";
//   } catch (error) {
//     return "en";
//   }
// };
const currentLanguage = ref("en");

// Compute the appropriate CSV source based on language
const selectedCsv = computed(() =>
  currentLanguage.value === "es" ? jobsCsvSpanish : jobsCsvEnglish
);

// --- Helper to get the appropriate field value ---
function getField(job, fieldName) {
  // If language is Spanish, return Spanish column if available; else fallback to English.
  if (currentLanguage.value === "es") {
    const spanishField = `${fieldName} (Spanish)`;
    return job[spanishField] && job[spanishField].trim() !== ""
      ? job[spanishField]
      : job[fieldName] || "";
  }
  return job[fieldName] || "";
}

async function saveJob(job) {
  const jobId = String(job["Job ID"]);
  try {
    await fetch(`${API_URL}?crud_type=create&user_id=${userId.value}&job_id=${jobId}`);
    savedJobs.value.push({ id: jobId });
  } catch (err) {
    console.error("Save job failed:", err);
  }
}

async function removeJob(jobId) {
  try {
    await fetch(`${API_URL}?crud_type=delete&user_id=${userId.value}&job_id=${jobId}`);
    savedJobs.value = savedJobs.value.filter((job) => job.id !== jobId);
  } catch (err) {
    console.error("Remove job failed:", err);
  }
}

function toggleJob(job) {
  if (!userId.value) {
    const signInModal = new bootstrap.Modal(document.getElementById('signInRequiredModal'));
    signInModal.show();
    return;
  }

  const jobId = String(job["Job ID"]);
  if (isJobSaved(jobId)) {
    removeJob(jobId);
  } else {
    saveJob(job);
  }
}


function isJobSaved(jobId) {
  return savedJobs.value.some((job) => job.id === jobId);
}

function toTitleCase(jobTitle) {
  return jobTitle.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function goToApplyLink(jobId) {
  window.open("https://cityjobs.nyc.gov/job/" + jobId, '_blank').focus();
  console.log("https://cityjobs.nyc.gov/job/" + jobId);
}
// loads csv by selected option in hopes to reduce load times
async function loadJobs() {


  loadingJobs.value = true
  console.log("loadJobs called")
  console.log("filters.value: ", filters.value)
  const response = await fetch('https://54pullbiac.execute-api.us-east-2.amazonaws.com/dev/reading', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "filters": filters.value
    })
  })
  if (response.ok) {
    console.log("first fetch call is valid")
    // let tempItems = []
    let data = await response.json()

    console.log("data: ", data)
    filteredJobs.value = [...data.items]
    
    while (data.pageToken) {
      const response2 = await fetch('https://54pullbiac.execute-api.us-east-2.amazonaws.com/dev/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "filters": filters.value,
          "pageToken": data.pageToken
        })
      })
      if (response2.ok) {

        //  console.log("next fetch call is valid")
        data = await response2.json()
        filteredJobs.value = [...filteredJobs.value, ...data.items]
      }
    }
    // filteredJobs.value = [...tempItems]
    currentPage.value = 1
    // console.log("currentPage.value: ", currentPage.value)
  }
  loadingJobs.value = false

}

onMounted(async () => {
  try {
    const { username } = await getCurrentUser();
    userId.value = username;
    const response = await fetch(`${API_URL}?crud_type=read&user_id=${userId.value}`);
    const data = await response.json();
    const jobIds = Array.isArray(data.body) ? data.body : JSON.parse(data.body);
    savedJobs.value = jobIds.map((id) => ({ id: String(id) }));
  } catch (err) {
    console.error("Auth or DB error:", err);
  }

  loadSettings();
  console.log("finished loading settings")
  loadJobs();
});

function cleanText(text) {
  if (typeof text !== "string") {
    return "";
  }

  // Replace known mis-encodings with their proper characters
  text = text
    // Remove hashtags (I think these need to be added to Civil Service Title)
    .replace(/#/g, "")
    .replace(/#(\s|$)/g, "")
    // Common curly quotes
    .replace(/â/g, '"')
    .replace(/â/g, '"')
    .replace(/â/g, "'")
    .replace(/â/g, "'")
  
    // Bullets and dashes
    .replace(/â¢/g, "-")
    .replace(/â/g, "–")  // En dash
    .replace(/â/g, "—")  // Em dash
  
    // Handle some accented letters if they appear mangled
    .replace(/Ã±/g, "ñ")
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã¼/g, "ü");
  
  // Optionally, add more cleaning steps here
  text = text.replace(/\s+/g, " ").trim();
  
  return text;
}


const expanded = ref({});
const isExpanded = (jobId, section) => expanded.value[jobId]?.[section] || false;
const toggleExpand = (jobId, section) => {
  if (!expanded.value[jobId]) {
    expanded.value[jobId] = {};
  }
  expanded.value[jobId][section] = !expanded.value[jobId][section];
};

const shortenText = (text, length = 150) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredJobs.value.slice(start, start + itemsPerPage.value);
});

// Brings user to the Next page. Also scrolls the page up to the top
function nextPage() {
  if (currentPage.value * itemsPerPage.value < filteredJobs.value.length) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
function safeTitle(job) {
  const rawTitle = job["Civil Service Title"] || "";
  const cleaned = cleanText(rawTitle);
  return cleaned || "Untitled Position";
}

// Brings user to prev page and scrolls to the top on click
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

const jobTypeOptions = ["Full-Time", "Part-Time"];
const jobCategoryOptions = [
  "Engineering, Architecture, & Planning",
  "Health",
  "Public Safety, Inspections, & Enforcement",
];
const careerLevelOptions = [
  "Entry-Level",
  "Experienced (non-manager)",
  "Manager",
  "Student",
];

const filters = ref({
  jobTypes: [],
  industries: [],
  careerLevels: [],
  location: "",
  searchText: query.value || "",
});


function toggleFilter(filterCategory, option) {
  console.log("toggleFilter called")
  console.log("filterCategory: ", filterCategory)
  console.log("option: ", option)
  const index = filters.value[filterCategory].indexOf(option);
  if (index === -1) {
    filters.value[filterCategory].push(option);
  } else {
    filters.value[filterCategory].splice(index, 1);
  }
  console.log("filters.value: ", filters.value)
  console.log("typeof filters.value: ", typeof filters.value)

  console.log("filters.value[filterCategory]: ", filters.value[filterCategory])
  console.log("typeof filters.value[filterCategory]: ", typeof filters.value[filterCategory])
}

watch(
  () => props.query,
  async (newQueryString) => {
    console.log("watch called")
    console.log("newQueryString: ", newQueryString)
      filters.value.searchText = newQueryString
      loadJobs()
      await nextTick()
  }
);
</script>


<style scoped>
.find-jobs-page {
  padding: 0rem;
  background-color: var(--light-bg);
}

.grid-container {
  display: grid;
  grid-template-columns: 180px 1fr;  /* Reduced from 250px to 180px */
  gap: 20px;
  padding-left: 1rem;
  padding-right: 1rem;
}

.filter-section {
  padding: 0.5rem;  /* Reduced padding */
  background-color: var(--light-surface);
  border-right: 1px solid var(--light-border);
  min-height: 0;
  height: auto;
}

.jobs-section {
  padding: 1rem;
}

.no-jobs-block {
  height: auto;
}

.no-jobs-text {
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
  padding-top: 25vh;
  color: var(--light-text-primary);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding: 20px;
  margin-bottom: 50px;
}

.current-page-num {
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: var(--light-text-primary);
}

.card {
  border: 1px solid var(--light-border);
  border-radius: 0.5rem;
  background-color: var(--light-surface);
  color: var(--light-text-primary);
}

.card-body {
  background-color: var(--light-bg);
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
  padding: 0.75rem;  /* Reduced padding */
}

.filter-card {
  background-color: var(--light-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
}

.card-title {
  font-size: 1rem;  /* Slightly smaller title */
  margin-bottom: 0.75rem;
}

.filter-group h6 {
  margin-bottom: 0.5rem;
  color: var(--light-text-primary);
  font-size: 0.9rem;  /* Smaller headings */
}

.filter-options {
  justify-content: flex-start;  /* Changed to left align */
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;  /* Reduced gap */
}

.filter-box {
  border: 1px solid var(--light-border);
  padding: 0.25rem 0.5rem;  /* Reduced padding */
  font-size: 0.85rem;  /* Smaller font */
  border-radius: 4px;
  background-color: var(--light-surface);
  color: var(--light-text-primary);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.filter-box.active {
  background-color: #2196f3;
  color: #ffffff;
  border-color: #2196f3;
}

.filter-box:hover {
  background-color: var(--light-hover);
}

.filter-box.active:hover {
  background-color: #1976d2;
}

.bookmark-icon {
  width: 24px;
  height: 24px;
}

.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon-button:focus {
  outline: none;
  box-shadow: none;
}

.modal {
  z-index: 2100 !important;
}

.modal-backdrop {
  z-index: 2050 !important;
}

.modal-dialog {
  margin-top: 80px;
}

/* Apply Filters button styling */
.btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Specific styling for Apply Filters button */
.apply-filter-btn {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  width: auto;
  margin: 0 auto;
  display: block;
}

.filter-footer {
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--light-border);
  background-color: var(--light-surface);
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;  /* Vertically center */
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .filter-section {
    padding: 1rem;
    border-bottom: 1px solid var(--light-border);
    border-right: none;
  }
  
  .filter-card {
    width: 100%;
    position: relative;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.25rem;
    text-align: center;  /* Center the main title */
  }
  
  .filter-group h6 {
    font-size: 1rem;
    text-align: center;  /* Center all section headings */
  }
  
  .filter-group {
    text-align: center;  /* Center the entire filter group */
  }
  
  .filter-options {
    justify-content: center;
  }
  
  .filter-box {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  
  .form-control {
    text-align: center;  /* Center the location input text */
  }
  
  .apply-filter-btn {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    text-align: center;
  }
  
  .filter-footer {
    display: block;
  }
}
</style>