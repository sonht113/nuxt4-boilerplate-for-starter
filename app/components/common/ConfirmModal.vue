<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleClose">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-icon" :class="iconClass">
              {{ icon }}
            </div>
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="handleClose" aria-label="Close">
              ✕
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
            <slot />
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-cancel"
              @click="handleClose"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn"
              :class="confirmClass"
              @click="handleConfirm"
              :disabled="loading"
            >
              {{ loading ? loadingText : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  loading?: boolean;
  type?: "danger" | "warning" | "info" | "success";
}

const props = withDefaults(defineProps<Props>(), {
  title: "Confirm Action",
  message: "Are you sure you want to proceed?",
  confirmText: "Confirm",
  cancelText: "Cancel",
  loadingText: "Processing...",
  loading: false,
  type: "danger",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const icon = computed(() => {
  switch (props.type) {
    case "danger":
      return "⚠️";
    case "warning":
      return "⚡";
    case "info":
      return "ℹ️";
    case "success":
      return "✓";
    default:
      return "⚠️";
  }
});

const iconClass = computed(() => `modal-icon-${props.type}`);

const confirmClass = computed(() => {
  switch (props.type) {
    case "danger":
      return "btn-danger";
    case "warning":
      return "btn-warning";
    case "info":
      return "btn-info";
    case "success":
      return "btn-success";
    default:
      return "btn-danger";
  }
});

const handleClose = () => {
  if (!props.loading) {
    emit("update:modelValue", false);
    emit("cancel");
  }
};

const handleConfirm = () => {
  emit("confirm");
};

// Close on Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && !props.loading) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 12px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-icon-danger {
  background: #fee;
  color: #e74c3c;
}

.modal-icon-warning {
  background: #fff3e0;
  color: #ff9800;
}

.modal-icon-info {
  background: #e3f2fd;
  color: #2196f3;
}

.modal-icon-success {
  background: #e8f5e9;
  color: #4caf50;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 16px 24px 24px;
}

.modal-message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  text-align: center;
  margin: 0;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.btn-info {
  background: #2196f3;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 0 16px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
