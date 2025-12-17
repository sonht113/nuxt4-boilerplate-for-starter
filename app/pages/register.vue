<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Create Account</h1>
        <p class="subtitle">
          Join us today! Create your account to get started.
        </p>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter your full name"
              required
              :disabled="loading"
              minlength="2"
            />
          </div>

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
              minlength="6"
            />
            <small class="help-text"
              >Password must be at least 6 characters</small
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account? <NuxtLink to="/login">Login here</NuxtLink>
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
  title: "Register",
  description: "Create a new account to access the Recipe App",
});

const router = useRouter();
const { register } = useAuth();

const loading = ref(false);
const error = ref<string | null>(null);

const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  if (formData.name.length < 2) {
    error.value = "Name must be at least 2 characters";
    return false;
  }

  if (formData.password.length < 6) {
    error.value = "Password must be at least 6 characters";
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    error.value = "Passwords do not match";
    return false;
  }

  return true;
};

const handleRegister = async () => {
  error.value = null;

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    // Redirect to recipes page after successful registration
    router.push("/recipes");
  } catch (e: any) {
    error.value = e.message || "Registration failed. Please try again.";
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

.help-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
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
