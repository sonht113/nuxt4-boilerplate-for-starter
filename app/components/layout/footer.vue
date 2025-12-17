<template>
  <footer class="app-footer">
    <div class="w-full">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">Nuxt Boilerplate For Starter</h3>
          <p class="footer-description">
            A modern, full-stack boilerplate for building web applications with
            Nuxt 3, Prisma, and TypeScript.
          </p>
        </div>

        <div class="footer-section">
          <h4>Features</h4>
          <ul class="footer-links">
            <li>🔐 Authentication System</li>
            <li>🎨 Modern UI Components</li>
            <li>🌐 i18n Support</li>
            <li>📝 Recipe Management</li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Developer</h4>
          <p class="developer-info">
            Created by
            <a
              href="https://github.com/sonht113"
              target="_blank"
              rel="noopener noreferrer"
              >nuicoder</a
            >
          </p>
          <p class="social-links">
            <a
              href="https://github.com/sonht113"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub</a
            >
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} nuxt-boilerplate-for-starter.
          All rights reserved.
        </p>
        <p class="footer-tech">
          Built with Nuxt 4, Prisma, TypeScript & PostgreSQL
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-left: 20px;
}

.footer-section h3,
.footer-section h4 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 16px;
}

.footer-section h3 {
  font-size: 20px;
  color: #667eea;
}

.footer-description {
  font-size: 14px;
  line-height: 1.6;
  color: #b0b0b0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  font-size: 14px;
  margin-bottom: 8px;
  color: #b0b0b0;
}

.developer-info {
  font-size: 14px;
  margin-bottom: 10px;
}

.developer-info a,
.social-links a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.developer-info a:hover,
.social-links a:hover {
  color: #8a9bf5;
  text-decoration: underline;
}

.social-links {
  font-size: 14px;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
}

.footer-bottom p {
  font-size: 13px;
  color: #888;
  margin: 5px 0;
}

.footer-tech {
  font-size: 12px;
  color: #666;
}
</style>
