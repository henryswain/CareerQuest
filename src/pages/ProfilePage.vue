<template>

  <div class="container">
    <div class="profile">
      <div class="profile__left">
        <div class="profile__image">
          <img :src="user.image || '/user.png'" alt="Profile Image">
        </div>
      </div>
      <div class="profile__info">
        <div class="name-container">
          <h2 class="full-name">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="username">{{ user.username }}</p>
          <button class="change-profile-btn" data-bs-toggle="modal" data-bs-target="#profileModal">
            Change Profile
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Profile Modal -->
  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileModalLabel">Edit Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="profile-edit-form">
            <div class="profile-photo-upload">
              <img :src="previewImage || user.image || '/user.png'" class="preview-image" alt="Profile preview">
              <label class="upload-button">
                <input type="file" @change="handleFileUpload" accept="image/*" hidden>
                Change Photo
              </label>
            </div>
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" v-model="user.firstName" class="form-control" placeholder="Enter first name">
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" v-model="user.lastName" class="form-control" placeholder="Enter last name">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-modal btn-modal-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn-modal btn-modal-primary" @click="saveProfile">Save Changes</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Education Section -->
  <div class="container">
    <div class="education">
      <div class="education__info">
        <div class="education-container">
          <h2 class="education-title">Education</h2>
          <button class="add-education-btn" data-bs-toggle="modal" data-bs-target="#educationModal">
            Add Education
          </button>
        </div>
        <!-- Display education entries -->
        <div class="education-list">
          <div v-for="(edu, index) in user.education" :key="index" class="education-item">
            <h3>{{ edu.schoolName }}</h3>
            <p>{{ edu.degree }} in {{ edu.fieldOfStudy }}</p>
            <p>{{ edu.startDate }} - {{ edu.endDate }}</p>
            <button @click="deleteEducation(index)" class="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Education Modal -->
  <div class="modal fade" id="educationModal" tabindex="-1" aria-labelledby="educationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="educationModalLabel">Add Education</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="schoolName">School Name</label>
            <input type="text" id="schoolName" v-model="newEducation.schoolName" class="form-control">
          </div>
          <div class="form-group">
            <label for="degree">Degree</label>
            <input type="text" id="degree" v-model="newEducation.degree" class="form-control">
          </div>
          <div class="form-group">
            <label for="fieldOfStudy">Field of Study</label>
            <input type="text" id="fieldOfStudy" v-model="newEducation.fieldOfStudy" class="form-control">
          </div>
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" v-model="newEducation.startDate" class="form-control">
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" v-model="newEducation.endDate" class="form-control">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addEducation">Add</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Experience Section -->
  <div class="container">
    <div class="experience">
      <div class="experience__info">
        <div class="experience-container">
          <h2 class="experience-title">Experience</h2>
          <button class="add-experience-btn" data-bs-toggle="modal" data-bs-target="#experienceModal">
            Add Experience
          </button>
        </div>
        <!-- Display experience entries -->
        <div class="experience-list">
          <div v-for="(exp, index) in user.experience" :key="index" class="experience-item">
            <h3>{{ exp.companyName }}</h3>
            <p>{{ exp.position }}</p>
            <p>{{ exp.startDate }} - {{ exp.endDate }}</p>
            <button @click="deleteExperience(index)" class="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Experience Modal -->
  <div class="modal fade" id="experienceModal" tabindex="-1" aria-labelledby="experienceModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="experienceModalLabel">Add Experience</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="companyName">Company Name</label>
            <input type="text" id="companyName" v-model="newExperience.companyName" class="form-control">
          </div>
          <div class="form-group">
            <label for="position">Position</label>
            <input type="text" id="position" v-model="newExperience.position" class="form-control">
          </div>
          <div class="form-group">
            <label for="expStartDate">Start Date</label>
            <input type="date" id="expStartDate" v-model="newExperience.startDate" class="form-control">
          </div>
          <div class="form-group">
            <label for="expEndDate">End Date</label>
            <input type="date" id="expEndDate" v-model="newExperience.endDate" class="form-control">
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newExperience.description" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addExperience">Add</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Skills Section -->
<div class="container">
  <div class="skills">
    <div class="skills__info">
      <div class="skills-container">
        <h2 class="skills-title">Skills</h2>
        <button
          class="add-skills-btn"
          data-bs-toggle="modal"
          data-bs-target="#skillsModal"
          @click="openSkillsModal"
        >
          Add Skills
        </button>
      </div>
      <div class="skills-list">
        <div class="skills-tags">
          <!-- show saved skills -->
          <span v-for="(skill, index) in user.skills" :key="index" class="skill-tag">
            {{ skill }}
            <button class="remove-tag" @click="deleteSkill(index)">&times;</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Add Skills Modal -->
<div
  class="modal fade"
  id="skillsModal"
  tabindex="-1"
  aria-labelledby="skillsModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="skillsModalLabel">Add Skills</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="skillInput">Add Skills</label>
          <div class="skill-tags">
            <!-- show editable skill list while modal is open -->
            <span v-for="(skill, index) in newSkills" :key="index" class="skill-tag">
              {{ skill }}
              <button class="remove-tag" @click="removeSkill(index)">&times;</button>
            </span>
          </div>
          <input
            type="text"
            id="skillInput"
            v-model="skillInput"
            class="form-control"
            placeholder="Type a skill and press Enter"
            @keyup.enter="addSkillTag"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="saveSkills">Save Skills</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import '@/assets/dark-mode.css';
import { Modal } from 'bootstrap';
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from 'aws-amplify/utils';

const previewImage = ref(null);

//nested json object to save profile data to DB
const user = ref({
  username: '',
  firstName: '',
  lastName: '',
  education: [],
  skills: [],
  socialLinks: {
    twitter: '',
    linkedin: '',
    github: '',
    website: ''
  },
  experience: [],
  about: '',
  headline: '',
  image: ''
});

const skillInput = ref('');
const newSkills = ref([]);

//profile picture/banner logic
const handleFileUpload = async (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
  }
};

const saveProfile = async () => {
  try {
    user.value.skills = [...(user.value.skills || [])].map(skill => String(skill));

    //shows fields that get saved to DB
    console.log("Saving profile with:", JSON.stringify(user.value, null, 2));

    const { userId } = await getCurrentUser();
    const encodedProfile = encodeURIComponent(JSON.stringify(user.value));
    const url = `https://z2orizbc4b.execute-api.us-east-2.amazonaws.com/dev/profile?crud_type=profile-create&user_id=${userId}&profile=${encodedProfile}`;
    const response = await fetch(url);
    const result = await response.json();
    console.log('Profile saved:', result);
// fix for modal backdrop remaining after closing and freezes the site
    const modalElement = document.getElementById('profileModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      modal.hide();
    }
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

// Called when Enter key is pressed and adds skill tag
const addSkillTag = () => {
  if (skillInput.value.trim()) {
    newSkills.value.push(skillInput.value.trim());
    skillInput.value = '';
    
  }
};

// Called when X button on tag is clicked
const removeSkill = async (index) => {
  user.value.skills.splice(index, 1);
  await saveProfile();
};

// Called when opening modal
const openSkillsModal = () => {
  newSkills.value = [...(user.value.skills || [])];

  const modalEl = document.getElementById('skillsModal');
  if (modalEl) {
    const existingInstance = Modal.getInstance(modalEl);
    if (existingInstance) {
      existingInstance.dispose();
    }
    new Modal(modalEl);
  }
};

// Called when Save button clicked
const saveSkills = async () => {  
  user.value.skills = [...newSkills.value];
  newSkills.value = [];
  skillInput.value = '';
  const modalElement = document.getElementById('skillsModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
  }
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  console.log("Saving profile");
  await saveProfile();
};

// Education fields
const newEducation = ref({
  schoolName: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: ''
});

const addEducation = async () => {
  if (!user.value.education) user.value.education = [];
  user.value.education.push({ ...newEducation.value });
  newEducation.value = { schoolName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' };

  const modalElement = document.getElementById('educationModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
  }

  await saveProfile();
};

const deleteEducation = async (index) => {
  user.value.education.splice(index, 1);
  await saveProfile();
};

// Experience fields
const newExperience = ref({
  companyName: '',
  position: '',
  startDate: '',
  endDate: '',
  description: ''
});

const addExperience = async () => {
  if (!user.value.experience) user.value.experience = [];
  user.value.experience.push({ ...newExperience.value });
  newExperience.value = { companyName: '', position: '', startDate: '', endDate: '', description: '' };

  const modalElement = document.getElementById('experienceModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
  }

  await saveProfile();
};

const deleteExperience = async (index) => {
  user.value.experience.splice(index, 1);
  await saveProfile();
};

const deleteSkill = async (index) => {
  user.value.skills.splice(index, 1);
  await saveProfile();
};

// Settings
const darkMode = ref(false);
const fontSize = ref();
const currentLanguage = ref("en");
const itemsPerPage = ref("25");

const applyDarkMode = () => {
  if (darkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};
watch(darkMode, applyDarkMode);


const loadSettings = async () => {
  console.log("loadSettings called")
  const { userId } = await getCurrentUser();
  console.log("userId: ", userId)
  const response = await fetch("https://7nzvzc1dd8.execute-api.us-east-2.amazonaws.com/dev/getting", {
    method: "POST",
    body: JSON.stringify({ id: userId })
  });
  const result = await response.json();

  if (result.body == '[{}]') {
    console.log("result.body == '[{}]'")
    await fetch("https://cceysg77wa.execute-api.us-east-2.amazonaws.com/dev/updating", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        reset_settings: true
      })
    });
    await nextTick();
    const response3 = await fetch("https://7nzvzc1dd8.execute-api.us-east-2.amazonaws.com/dev/getting", {
      method: "POST",
      body: JSON.stringify({ id: userId })
    });
    const result3 = await response3.json();
    let body = JSON.parse(result3.body.slice(1, -1));
    currentLanguage.value = body.language;
    darkMode.value = body.dark_mode;
    fontSize.value = body.font_size;
    itemsPerPage.value = body.ipp;
  } else {
    const resultAsJSON = JSON.parse(result.body.slice(1, -1));
    currentLanguage.value = resultAsJSON.language;
    darkMode.value = resultAsJSON.dark_mode;
    itemsPerPage.value = resultAsJSON.ipp;
  }
};

Hub.listen('auth', ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log('user signed in');
      loadSettings();
      break;
    case 'signedOut':
      console.log('user signed out');
      currentLanguage.value = "en";
      darkMode.value = false;
      itemsPerPage.value = 25;
      break;
  }
});


//load settings and user profile from load, if no profile then the lambda function creates one with the user ID
onMounted(async () => {
  loadSettings();
  try {
    const { userId } = await getCurrentUser();
    const readUrl = `https://z2orizbc4b.execute-api.us-east-2.amazonaws.com/dev/profile?crud_type=profile-read&user_id=${userId}`;
    const response = await fetch(readUrl);
    const result = await response.json();
    user.value = { ...user.value, ...result };
  } catch (err) {
    console.error("Error loading user profile:", err);
  }
  const modalEl = document.getElementById('skillsModal');
  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', () => {
      newSkills.value = [...(user.value.skills || [])];
    });
  }
});
</script>


<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 8px;
}

.profile-header {
  position: relative;
  padding: 0;
  overflow: hidden;
}

.profile-cover {
  height: 200px;
  background-color: var(--dark-surface-2);
}

.profile-info {
  padding: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--dark-surface);
}

.profile-details h1 {
  margin-bottom: 0.5rem;
}

.profile-location {
  color: var(--dark-text-secondary);
}

.experience-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--dark-border);
}

.experience-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background-color: var(--dark-surface-2);
  border-radius: 20px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
  }
}

.profile-page {
  padding-top: 80px;
  padding-bottom: 80px;
  min-height: calc(100vh - 160px);
  position: relative;
  z-index: 0; /* Lower z-index to stay behind navbar/footer */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  position: relative;
  z-index: 0;
  margin-bottom: 80px; /* Increased margin to prevent footer overlap */
}

.profile, .education, .experience, .skills {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  position: relative;
  z-index: 0;
}

/* Remove duplicate styles and fixed heights */
.profile {
  min-height: auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.education, .experience {
  min-height: auto;
  margin-top: 2rem;
}

.skills {
  margin-bottom: 80px; /* Add space above footer */
}

.profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 200px;
}



.profile__left {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile__image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #0073b1;
  position: relative;
}

.profile__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile__image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.profile__image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.profile__image-overlay span {
  color: white;
  font-size: 0.9rem;
}

.profile__image:hover .profile__image-overlay {
  opacity: 1;
}

.change-profile-btn {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;
}

.change-profile-btn:hover {
  background-color: #005582;
}

.profile__info {
  margin-top: 0;
  text-align: left;
  padding-left: 1rem;
}

.name-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-start;
}

.full-name {
  color: #1a1a1a;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
}

.username {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
}

/* Modal Styles */
.profile-edit-form {
  padding: 1rem;
}

.profile-photo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.preview-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0073b1;
}

.upload-button {
  background-color: #0073b1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.upload-button:hover {
  background-color: #005582;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

/* Modal Button Styles */
.btn-modal {
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
  min-width: 120px;
}

.btn-modal-primary {
  background-color: #0073b1;
  color: white;
}

.btn-modal-primary:hover {
  background-color: #005582;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-modal-secondary {
  background-color: #f0f2f5;
  color: #666;
}

.btn-modal-secondary:hover {
  background-color: #e4e6e9;
  color: #444;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.education {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  margin-top: 2rem;
}

.education__info {
  flex-grow: 1;
}

.education-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.education-title {
  color: #1a1a1a;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
}

.add-education-btn {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.add-education-btn:hover {
  background-color: #005582;
}

.education-list {
  margin-top: 20px;
}

.education-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.education-item h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.education-item p {
  margin: 5px 0;
  color: #666;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.btn-delete:hover {
  background-color: #c82333;
}

.experience {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  margin-top: 2rem;
}

.experience__info {
  flex-grow: 1;
}

.experience-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.experience-title {
  color: #1a1a1a;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
}

.add-experience-btn {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.add-experience-btn:hover {
  background-color: #005582;
}

.experience-list {
  margin-top: 20px;
}

.experience-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.experience-item h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.experience-item p {
  margin: 5px 0;
  color: #666;
}

.skills {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.skills__info {
  flex-grow: 1;
}

.skills-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.skills-title {
  color: #1a1a1a;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
}

.add-skills-btn {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.add-skills-btn:hover {
  background-color: #005582;
}

.skills-list {
  margin-top: 20px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  background-color: #e3f2fd;
  color: #0073b1;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.remove-tag {
  background: none;
  border: none;
  color: #0073b1;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.remove-tag:hover {
  color: #005582;
}

/* Container adjustments for page height */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Adjust the profile sections to fit content */
.profile, .education, .experience, .skills {
  min-height: auto;
  height: fit-content;
}

.skills {
  margin-bottom: 120px !important; /* was 2rem, ensure it's above footer */
  padding-bottom: 2rem; /* extra space for safety */
}

body {
  padding-bottom: 160px; /* in case footer is fixed */
}

</style>