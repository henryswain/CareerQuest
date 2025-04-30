<!-- this page containes the various filters for job sorting, the list of
 jobs, pagination buttons, and the modals for the individual jobs -->

<template>
  <div class="find-jobs-page">
    <div class="grid-container">
      <!-- Filter Section -->
      <div class="filter-section">
        <div class="card filter-card mb-4">
          <div class="card-body" style="height: 70vh; overflow: auto;">
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
            <!-- Apply Filters -->
            <button class="btn btn-primary w-100 mt-3" @click="loadJobs()">
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


// Create an instance.
let controller = null
const loadingJobs = ref(null)
const allJobs = ref([]);
const filteredJobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(JSON.parse(localStorage.getItem("userSettings"))?.itemsPerPage || 25);
const savedJobs = ref([]);

// Look at local storage settings and render in darkmode if necessary
const darkMode = ref(false);
// loads user settings from localStorage
const loadSettings = () => {
  const savedSettings = localStorage.getItem('userSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    darkMode.value = settings.darkMode || false;
  }
};

// Apply dark mode 
const applyDarkMode = () => {
  if (darkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};
// Watch for changes to darkmode and apply accordingly
watch(darkMode, applyDarkMode);
// On component mount, load user settings and apply dark mode
onMounted(() => {
  loadSettings();
  applyDarkMode();
});

const props = defineProps({
  query: String
})

// --- Language & CSV Source Helper ---
// Get initial language from localStorage "userSettings", default to "en"
const getInitialLanguage = () => {
  try {
    return (JSON.parse(localStorage.getItem("userSettings")) || {}).language || "en";
  } catch (error) {
    return "en";
  }
};
const currentLanguage = ref(getInitialLanguage());

// Listen for custom "language-changed" events from Settings.vue
window.addEventListener("language-changed", (event) => {
  currentLanguage.value = event.detail;
  console.log("Language changed to:", currentLanguage.value);
  // Reload jobs when language changes:
  loadJobs();
});

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
}
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  padding-left: 1rem;
  padding-right: 1rem;
}
.filter-section {
  padding: 1rem;
  background-color: #f5f7fa;
  border-right: 1px solid #ddd;
}
.jobs-section {
  padding: 1rem;
  height: 100vh;
  overflow: scroll;
  
}
.no-jobs-block {
  height:100vh;
}
.no-jobs-text{
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
  padding-top: 25vh;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding: 20px;
  margin-bottom: 50px;
}

.current-page-num{
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
.card {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
.filter-card {
  position: fixed;
  width: 200px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.filter-group h6 {
  margin-bottom: 0.5rem;
  color: #343a40;
}
.filter-options {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.filter-box {
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}
.filter-box:hover {
  background-color: #e9ecef;
}
.filter-box.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
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

/* Dark Mode */
.dark-mode .filter-section{
  background-color: #ec1b1b;
}
</style>
