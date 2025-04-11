<template>


<!-- Footer -->
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


<style>
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