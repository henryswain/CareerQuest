<!-- this page containes the various filters for job sorting, the list of
 jobs, pagination buttons, and the modals for the individual jobs -->

<template>
  <div class="find-jobs-page">
    <div class="grid-container">
      <!-- Filter Section -->
      <div class="filter-section">
        <div class="card filter-card mb-4">
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
            <!-- Apply Filters -->
            <button class="btn btn-primary w-100 mt-3" @click="applyFilters(props.query)">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Jobs Section -->
      <div class="jobs-section">
        <div v-if="paginatedItems.length === 0">
          <p>No matching jobs found.</p>
        </div>
        <div v-else>
          <!-- Loop through paginated jobs and display them -->
          <div
            v-for="(item, index) in paginatedItems"
            :key="item['Job ID']"
            class="card mb-3"
          >
            <h5 class="card-header d-flex justify-content-between align-items-center">
  <span>{{ toTitleCase(item["Civil Service Title"]) }}</span>
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
              <!-- Salary and Location -->
              <div
                v-if='item["Salary Frequency"] === "Hourly" && item["Full-Time/Part-Time indicator"] === "F"'
              >
                <p class="card-text">
                  {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/hr • Full-time
                </p>
              </div>
              <div
                v-else-if='item["Salary Frequency"] === "Hourly" && item["Full-Time/Part-Time indicator"] === "P"'
              >
                <p class="card-text">
                  {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/hr • Part-time
                </p>
              </div>
              <div
                v-else-if='item["Salary Frequency"] === "Annual" && item["Full-Time/Part-Time indicator"] === "F"'
              >
                <p class="card-text">
                  {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/yr • Full-time
                </p>
              </div>
              <div
                v-else-if='item["Salary Frequency"] === "Annual" && item["Full-Time/Part-Time indicator"] === "P"'
              >
                <p class="card-text">
                  {{ item["Salary Range From"] }} - {{ item["Salary Range From"] }}/yr • Part-time
                </p>
              </div>
              <p class="card-text">Location: {{ item["Work Location"] }}</p>

              <!-- Action Buttons: Learn More & Save/Remove Job with Bookmark Icon -->
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
              <div
                class="modal fade"
                :id="`modal_${item['Job ID']}`"
                tabindex="-1"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5">
                        {{ toTitleCase(item["Civil Service Title"]) }}
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
                      <p v-if="item['Job Description']">
                        {{ isExpanded(item['Job ID'], 'description') ? cleanText(item['Job Description']) : shortenText(cleanText(item['Job Description'])) }}
                      </p>
                      <button
                        v-if="item['Job Description']"
                        class="btn btn-link"
                        @click="toggleExpand(item['Job ID'], 'description')"
                      >
                        {{ isExpanded(item['Job ID'], 'description') ? "Show Less" : "Show More" }}
                      </button>

                      <h5>Minimum Qualifications</h5>
                      <p v-if="item['Minimum Qual Requirements']">
                        {{ isExpanded(item['Job ID'], 'requirements') ? cleanText(item['Minimum Qual Requirements']) : shortenText(cleanText(item['Minimum Qual Requirements'])) }}
                      </p>
                      <button
                        v-if="item['Minimum Qual Requirements']"
                        class="btn btn-link"
                        @click="toggleExpand(item['Job ID'], 'requirements')"
                      >
                        {{ isExpanded(item['Job ID'], 'requirements') ? "Show Less" : "Show More" }}
                      </button>

                      <h5 v-if="item['Preferred Skills']">
                        Preferred Skills
                      </h5>
                      <p v-if="item['Preferred Skills']">
                        {{ isExpanded(item['Job ID'], 'skills') ? cleanText(item['Preferred Skills']) : shortenText(cleanText(item['Preferred Skills'])) }}
                      </p>
                      <button
                        v-if="item['Preferred Skills']"
                        class="btn btn-link"
                        @click="toggleExpand(item['Job ID'], 'skills')"
                      >
                        {{ isExpanded(item['Job ID'], 'skills') ? "Show Less" : "Show More" }}
                      </button>

                      <h5>To Apply</h5>
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
                      <button
                        v-else
                        class="btn btn-primary"
                      >
                        Generic Apply Button
                      </button>

                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
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
      </div>
    </div>
    <!-- Pagination -->
    <div class="pagination-controls">
      <button class="btn btn-secondary" @click="prevPage" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }}</span>
      <button
        class="btn btn-secondary"
        @click="nextPage"
        :disabled="currentPage * itemsPerPage >= filteredJobs.length"
      >
        Next
      </button>
    </div>
  </div>

  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <p class="copyright">&copy; 2024 CareerQuest, Inc</p>
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
</template>

<script setup>
import { ref, onMounted, defineProps, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Papa from "papaparse";
import jobsCsv from "@/assets/Jobs_NYC_Postings.csv?raw";
import { getCurrentUser } from 'aws-amplify/auth';

// Import bookmark images
import bookmarkFilled from '@/assets/bookmark_filled.png';
import bookmarkBlank from '@/assets/bookmark_blank.png';

const API_URL = "https://5weiq0uvn8.execute-api.us-east-2.amazonaws.com/dev/update";
const userId = ref("");

const props = defineProps({
  query: String,
});

const route = useRoute();
const router = useRouter();

const allJobs = ref([]);
const filteredJobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(
  JSON.parse(localStorage.getItem('userSettings'))?.itemsPerPage || 10
);

const currentJob = ref(null);

// For saved jobs
const savedJobs = ref([]);

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
    savedJobs.value = savedJobs.value.filter(job => job.id !== jobId);
  } catch (err) {
    console.error("Remove job failed:", err);
  }
}

function toggleJob(job) {
  const jobId = String(job["Job ID"]);
  if (isJobSaved(jobId)) {
    removeJob(jobId);
  } else {
    saveJob(job);
  }
}

function isJobSaved(jobId) {
  return savedJobs.value.some(job => job.id === jobId);
}

function toTitleCase(jobTitle) {
  return jobTitle.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

onMounted(async () => {
  try {
    const { username } = await getCurrentUser();
    userId.value = username;

    const response = await fetch(`${API_URL}?crud_type=read&user_id=${userId.value}`);
    const data = await response.json();
    const jobIds = Array.isArray(data.body) ? data.body : JSON.parse(data.body);
    savedJobs.value = jobIds.map(id => ({ id: String(id) }));
  } catch (err) {
    console.error("Auth or DB error:", err);
  }

  Papa.parse(jobsCsv, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      allJobs.value = results.data;
      filteredJobs.value = results.data;
    },
  });
});

// Cleaning function
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
  "Public Safety, Inspections, & Enforcement"
];
const careerLevelOptions = [
  "Entry-Level",
  "Experienced (non-manager)",
  "Manager",
  "Student"
];

const filters = ref({
  jobTypes: [],
  industries: [],
  careerLevels: [],
  location: "",
  searchText: props.query || ""
});

function toggleFilter(filterCategory, option) {
  const index = filters.value[filterCategory].indexOf(option);
  if (index === -1) {
    filters.value[filterCategory].push(option);
  } else {
    filters.value[filterCategory].splice(index, 1);
  }
}

function applyFilters(newQueryString = "") {
  let results = [...allJobs.value];
  const mapJobType = {
    "Full-Time": "F",
    "Part-Time": "P",
  };

  if (filters.value.jobTypes.length > 0) {
    results = results.filter((job) => {
      const csvVal = job["Full-Time/Part-Time indicator"];
      return filters.value.jobTypes.some((selected) => csvVal === mapJobType[selected]);
    });
  }

  if (filters.value.industries.length > 0) {
    results = results.filter((job) => {
      const catStr = job["Job Category"] || "";
      return filters.value.industries.some((selectedCat) =>
        catStr.includes(selectedCat)
      );
    });
  }

  if (filters.value.careerLevels.length > 0) {
    results = results.filter((job) =>
      filters.value.careerLevels.includes(job["Career Level"])
    );
  }

  if (filters.value.location.trim()) {
    const loc = filters.value.location.toLowerCase();
    results = results.filter((job) =>
      job["Work Location"]?.toLowerCase()?.includes(loc)
    );
  }

  if (newQueryString.length > 0) {
    const newString = newQueryString.toLowerCase();
    results = results.filter((job) => {
      return (
        job["Civil Service Title"]?.toLowerCase()?.includes(newString) ||
        job["Job Description"]?.toLowerCase()?.includes(newString) ||
        job["Minimum Qual Requirements"]?.toLowerCase()?.includes(newString) ||
        job["Preferred Skills"]?.toLowerCase().includes(newString)
      );
    });
  }

  filteredJobs.value = results;
  currentPage.value = 1;
}

watch(
  () => props.query,
  (newQueryString) => {
    if (newQueryString) {
      applyFilters(newQueryString);
    } else {
      filteredJobs.value = [...allJobs.value];
    }
  }
);
</script>

<style scoped>
.find-jobs-page {
  padding: 1rem;
}
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  padding: 1rem;
}
.filter-section {
  padding: 1rem;
  background-color: #f5f7fa;
  border-right: 1px solid #ddd;
}
.jobs-section {
  padding: 1rem;
}
.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
.filter-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.filter-group h6 {
  margin-bottom: 0.5rem;
  color: #343a40;
}
.filter-options {
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

/* Optional styling for the bookmark icon */
.bookmark-icon {
  width: 24px;
  height: 24px;
}
/* Custom icon-button style to remove borders, background, etc. */
.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon-button:focus {
  outline: none;      /* Remove focus outline if desired */
  box-shadow: none;   /* Remove any default focus shadow */
}
</style>

<style>
.modal {
  z-index: 2100 !important;
}
.modal-backdrop {
  z-index: 2050 !important;
}
.modal-dialog {
  margin-top: 80px;
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
.footer-section:nth-child(2) {
  justify-content: center;
  display: flex;
  align-items: center;
}
.footer-logo:hover {
  opacity: 0.8;
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
</style>