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

                <h5>To Apply</h5>
                <p v-if="jobDetails[job.id]">
                  {{ cleanText(jobDetails[job.id].apply) }}
                </p>

                <p v-if="!jobDetails[job.id]" class="text-muted">Loading job details...</p>
                </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
import jobsCsv from "@/assets/Jobs_NYC_Postings.csv?raw";
import Papa from "papaparse";

const savedJobs = ref([]);
const userId = ref("");
const LAMBDA_URL = "https://5weiq0uvn8.execute-api.us-east-2.amazonaws.com/dev/update";
const allJobs = ref([]);

onMounted(async () => {
  try {
    const { username } = await getCurrentUser();
    userId.value = username;

    const res = await fetch(`${LAMBDA_URL}?crud_type=read&user_id=${userId.value}`);
    const data = await res.json();
    const ids = Array.isArray(data.body) ? data.body : JSON.parse(data.body);
    const jobIdList = ids.map(id => String(id));

    // Parse CSV after saved job IDs are ready
    Papa.parse(jobsCsv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        allJobs.value = results.data;

        savedJobs.value = jobIdList.map(id => {
          const match = allJobs.value.find(j => j["Job ID"] === id);
          return {
            id,
            title: match?.["Civil Service Title"] || "Unknown Title",
            company: match?.["Agency"] || "Unknown Agency",
            location: match?.["Work Location"] || "Unknown Location"
          };
        });
      }
    });
  } catch (e) {
    console.error("Auth or DB error:", e.message);
  }
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
  if (jobDetails.value[jobId]) return; // Stop duplicates
  try {
    const response = await fetch(`https://npvdpxycgi.execute-api.us-east-2.amazonaws.com/dev2/reading?id=${jobId}`);
    const data = await response.json();
  
    if (data.items && data.items.length > 0) { //null values
      const job = data.items[0];
      jobDetails.value[jobId] = {
        description: job["Job Description"] || "No description.",
        requirements: job["Minimum Qual Requirements"] || "Not specified.",
        skills: job["Preferred Skills"] || "Not specified.",
        apply: job["To Apply"] || "Work in progress"
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
}

.no-jobs {
  text-align: center;
  color: #777;
}

.jobs-list {
  list-style: none;
  padding: 0;
}

.job-item {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-group {
  display: flex;
  gap: 10px;
}
</style>
