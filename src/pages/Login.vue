<template>
    <div class="Login-page">
      <!-- User login form -->
      <form @submit.prevent="submitForm">
        <!-- Email input -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            v-model="email" 
            aria-describedby="emailHelp" 
            placeholder="Enter email" 
            required
          />
          <small id="emailHelp" class="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <!-- password input -->
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="password" 
            placeholder="Password" 
            required
          />
        </div>
        <!-- Remember me box -->
        <div class="form-check">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="rememberMe" 
            v-model="rememberMe"
          />
          <label class="form-check-label" for="rememberMe">
            Remember me
          </label>
        </div>
        <!-- Submit button-->
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </template>
  
  <script>

  import { signIn, getCurrentUser } from 'aws-amplify/auth';

  export default {
    data() {
      return {
        // Hold user data
        email: "",
        password: "",
        rememberMe: false,
      };
    },
    methods: {
      // Form submisstion
      async submitForm() {
        try {
          const user = await signIn({ username: this.email, password: this.password });
          console.log("Login successful:", user);

          localStorage.setItem('currentUserEmail', user.username); // Save email

          await fetch(`https://5weiq0uvn8.execute-api.us-east-2.amazonaws.com/dev/update?id=${user.username}`);
          alert("Logged in and registered in DB!");

          window.location.reload(); // Live update
        } catch (err) {
          console.error("Login failed:", err);
          alert("Login failed: " + (err.message || "Unknown error"));
        }
      }
    }
  };
</script>
  
  <style scoped>
/* Styles for the login page container */
.login-page {
  max-width: 400px;  /* Limits the width of the form */
  margin: auto;  /* Centers the form horizontally */
  padding: 20px;  /* Adds padding inside the form */
  background: #f8f9fa;  /* Light background color */
  border-radius: 8px;  /* Rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  /* Subtle shadow for the form */
}
</style>