<template>
    <div class="Login-page">
      <-- User login form -->
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
        <! password input -->
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
  export default {
    data() {
      return {
        // Data properties to hold email, password, and rememberMe state
        email: "",
        password: "",
        rememberMe: false,
      };
    },
    methods: {
      // Handles form submisstion
      submitForm() {
        // Logs email, pw, &rememberMe state to console via .log
        console.log("Email:", this.email);
        console.log("Password:", this.password);
        console.log("Remember Me:", this.rememberMe);
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