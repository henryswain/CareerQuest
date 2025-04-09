<script setup>
import { ref, watch, onMounted } from 'vue';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useRouter } from 'vue-router';

const router = useRouter();
// Load profile data from localStorage
const loadProfile = () => {
  const savedProfile = localStorage.getItem('userProfile');
  const defaultProfile = {
    name: "Your Name",
    headline: "Your Professional Headline",
    email: "youremail@example.com",
    location: "Your Location",
    profilePicture: "", 
    about: "A short summary about your professional background.",
    experience: [],
    education: [],
    skills: [],
    qualifications: [],
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
      website: ""
    }
  };

  if (!savedProfile) {
    return defaultProfile;
  }

  const parsedProfile = JSON.parse(savedProfile);
  // Ensure socialLinks exists
  if (!parsedProfile.socialLinks) {
    parsedProfile.socialLinks = defaultProfile.socialLinks;
  }
  
  return parsedProfile;
};

const user = ref(loadProfile());
const isEditing = ref(false);
const newSkill = ref("");
const newQualification = ref("");
const newExperience = ref({ position: "", company: "", duration: "" });
const newEducation = ref({ degree: "", institution: "", year: "" });

// Watch and save changes to localStorage
watch(user, (newVal) => {
  localStorage.setItem('userProfile', JSON.stringify(newVal));
}, { deep: true });

// Save the profile and stop editing
const saveProfile = () => {
  isEditing.value = false;
  console.log("Profile updated:", user.value);
};

// Add skill, qualification, experience, and education
const addSkill = () => {
  if (newSkill.value.trim()) {
    user.value.skills.push(newSkill.value.trim());
    newSkill.value = "";
  }
};

const addQualification = () => {
  if (newQualification.value.trim()) {
    user.value.qualifications.push(newQualification.value.trim());
    newQualification.value = "";
  }
};

const addExperience = () => {
  if (newExperience.value.position && newExperience.value.company && newExperience.value.duration) {
    user.value.experience.push({ ...newExperience.value });
    newExperience.value = { position: "", company: "", duration: "" };
  }
};

const addEducation = () => {
  if (newEducation.value.degree && newEducation.value.institution && newEducation.value.year) {
    user.value.education.push({ ...newEducation.value });
    newEducation.value = { degree: "", institution: "", year: "" };
  }
};

// Handle profile picture upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const currentUserInfo = ref({});
onMounted(async () => {
  getUserInformation();
});

const getUserInformation = async () => {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
    currentUserInfo.value = { username, userId, signInDetails };
  } catch (e) {
    console.log(e.message);
    currentUserInfo.value = { username: undefined, userId: undefined, signInDetails: undefined };
  }
}

// Delete experience, education, or qualification
const deleteItem = (array, index) => {
  array.splice(index, 1);
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-header-banner">
      <div class="profile-header-content">
        <div class="profile-picture-section">
          <label class="profile-upload">
            <input type="file" @change="handleFileUpload" hidden />
            <img :src="user.profilePicture || '/user.png'" alt="Profile Picture" class="profile-picture" />
          </label>
        </div>
        <div class="profile-info">
           <!-- User Name, Headline, and Location -->
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="headline">{{ user.headline }}</p>
          <p class="location">{{ user.location }}</p>
        </div>
      </div>
    </div>
    <!-- Profile Layout: Main Content and Sidebar -->
    <div class="profile-layout">
      <!-- Main Profile Content -->
      <div class="profile-main">
        <div class="card">
          <h2>About</h2>
          <p class="about-text">{{ user.about }}</p>
        </div>
        <!-- Experience section -->
        <div class="card">
          <h2>Experience</h2>
          <div class="timeline">
            <!-- Loop through experience and display each job -->
            <div v-for="(job, index) in user.experience" :key="index" class="timeline-item">
              <div class="timeline-content">
                <h3>{{ job.position }}</h3>
                <p class="company">{{ job.company }}</p>
                <p class="duration">{{ job.duration }}</p>
                <!-- Delete button only viewable in editing mode -->
                <button v-if="isEditing" @click="deleteItem(user.experience, index)" class="btn-icon">×</button>
              </div>
            </div>
          </div>
        </div>
        <-- Education section -->
        <div class="card">
          <h2>Education</h2>
          <div class="education-list">
            <!-- Loop through education list and displays entries -->
            <div v-for="(edu, index) in user.education" :key="index" class="education-item">
              <h3>{{ edu.degree }}</h3>
              <p class="institution">{{ edu.institution }}</p>
              <p class="year">{{ edu.year }}</p>
              <button v-if="isEditing" @click="deleteItem(user.education, index)" class="btn-icon">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar (Skills & Socials-->
      <div class="profile-sidebar">
        <div class="card">
          <h2>Skills</h2>
          <div class="skills-grid">
            <!-- Loop through skills and displays skills -->
            <div v-for="(skill, index) in user.skills" :key="index" class="skill-tag">
              {{ skill }}
            </div>
          </div>
        </div>

        <!-- Update the social links section with proper checks -->
        <div class="card">
          <h2>Connect</h2>
          <div class="social-links">
            <a v-if="user?.socialLinks?.linkedin" :href="user.socialLinks.linkedin" target="_blank" class="social-link">
              LinkedIn
            </a>
            <a v-if="user?.socialLinks?.github" :href="user.socialLinks.github" target="_blank" class="social-link">
              GitHub
            </a>
            <a v-if="user?.socialLinks?.twitter" :href="user.socialLinks.twitter" target="_blank" class="social-link">
              Twitter
            </a>
            <a v-if="user?.socialLinks?.website" :href="user.socialLinks.website" target="_blank" class="social-link">
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Button -->
    <div class="profile-actions">
      <button v-if="!isEditing" class="btn-primary" @click="isEditing = true">Edit Profile</button>
    </div>

    <!-- Edit Modal remains the same -->
    <div v-if="isEditing" class="profile-edit">
      <div class="profile-edit-header">
        <div class="profile-picture-container">
          <label class="profile-upload">
            <input type="file" @change="handleFileUpload" hidden />
            <img :src="user.profilePicture || '/user.png'" alt="Profile Picture" class="profile-picture" />
          </label>
        </div>
        <input v-model="user.name" class="input-field" placeholder="Enter Name" />
        <input v-model="user.headline" class="input-field" placeholder="Enter Headline" />
      </div>
      <!-- About Edit Section -->
      <div class="profile-edit-section">
        <h3>About</h3>
        <textarea v-model="user.about" class="input-field" placeholder="Enter About"></textarea>
      </div>

      <div class="profile-edit-section">
        <!-- Experience Edit Section -->
        <h3>Experience</h3>
        <ul>
          <!-- Loop through experience list and show delete button -->
          <li v-for="(job, index) in user.experience" :key="index">
            <strong>{{ job.position }}</strong> at {{ job.company }} ({{ job.duration }})
            <button @click="deleteItem(user.experience, index)" class="btn btn-delete">Delete</button>
          </li>
        </ul>
        <!--User inputs for adding new experience -->
        <input v-model="newExperience.position" class="input-field" placeholder="Position" />
        <input v-model="newExperience.company" class="input-field" placeholder="Company" />
        <input v-model="newExperience.duration" class="input-field" placeholder="Duration" />
        <button class="btn btn-secondary" @click="addExperience">Add Experience</button>
      </div>
      <!-- Education Edit Section -->
      <div class="profile-edit-section">
        <h3>Education</h3>
        <ul>
          <!-- Loop through education list and show delete button -->
          <li v-for="(edu, index) in user.education" :key="index">
            <strong>{{ edu.degree }}</strong> - {{ edu.institution }} ({{ edu.year }})
            <button @click="deleteItem(user.education, index)" class="btn btn-delete">Delete</button>
          </li>
        </ul>
        <!-- Input fields for adding new education -->
        <input v-model="newEducation.degree" class="input-field" placeholder="Degree" />
        <input v-model="newEducation.institution" class="input-field" placeholder="Institution" />
        <input v-model="newEducation.year" class="input-field" placeholder="Year" />
        <button class="btn btn-secondary" @click="addEducation">Add Education</button>
      </div>
      <!-- Skills edit section -->
      <div class="profile-edit-section">
        <h3>Skills</h3>
        <ul>
          <li v-for="(skill, index) in user.skills" :key="index">
            <input type="checkbox" :checked="true" /> {{ skill }}
          </li>
        </ul>
        <input v-model="newSkill" class="input-field" placeholder="Enter Skill" />
        <button class="btn btn-secondary" @click="addSkill">Add Skill</button>
      </div>

      <div class="profile-edit-section">
        <h3>Social Links</h3>
        <input v-model="user.socialLinks.twitter" class="input-field" placeholder="Enter Twitter URL" />
        <input v-model="user.socialLinks.linkedin" class="input-field" placeholder="Enter LinkedIn URL" />
        <input v-model="user.socialLinks.github" class="input-field" placeholder="Enter GitHub URL" />
        <input v-model="user.socialLinks.website" class="input-field" placeholder="Enter Website URL" />
      </div>
      <! Save & cancel buttons for editing profile
      <div class="profile-actions">
        <button class="btn btn-success" @click="saveProfile">Save</button>
        <button class="btn btn-secondary" @click="isEditing = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.profile-header-banner {
  background: linear-gradient(135deg, #0073b1 0%, #0093e9 100%);
  padding: 40px 20px;
  color: white;
}

.profile-header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 30px;
}

.profile-picture {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.user-name {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 600;
}

.headline {
  font-size: 1.2rem;
  margin: 8px 0;
  opacity: 0.9;
}

.location {
  font-size: 1rem;
  opacity: 0.8;
}

.profile-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  padding: 24px;
  margin-top: -40px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.timeline-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-content h3 {
  margin: 0;
  color: #2c3e50;
}

.company, .duration {
  color: #666;
  margin: 5px 0;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #e1f0ff;
  color: #0073b1;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-link {
  color: #0073b1;
  text-decoration: none;
  padding: 8px 0;
  font-weight: 500;
}

.social-link:hover {
  color: #005582;
}

.btn-primary {
  background: #0073b1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #005582;
}

.btn-icon {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-icon:hover {
  background: #fff5f5;
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-header-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>