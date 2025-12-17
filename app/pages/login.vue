<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login</h1>
        <p class="subtitle">Welcome back! Please login to your account.</p>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <NuxtLink to="/register">Register here</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuth } from "~~/composables/useAuth";

definePageMeta({
  layout: "default",
  middleware: "guest",
  title: "Login",
  description: "Access your account to manage your recipes",
});

const router = useRouter();
const { login } = useAuth();

const loading = ref(false);
const error = ref<string | null>(null);

const formData = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    await login({
      email: formData.email,
      password: formData.password,
    });

    // Redirect to recipes page after successful login
    router.push("/recipes");
  } catch (e: any) {
    error.value = e.message || "Login failed.  Please try again.";
  } finally {
    loading.value = false;
  }
};

// Redirect if already logged in
const { isAuthenticated } = useAuth();
onMounted(() => {
  if (isAuthenticated.value) {
    router.push("/recipes");
  }
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-card h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin: 0 0 30px 0;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
