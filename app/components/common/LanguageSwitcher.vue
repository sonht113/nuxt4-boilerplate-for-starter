<template>
  <div class="language-switcher">
    <button
      @click="toggleDropdown"
      class="language-button"
      aria-label="Change language"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span class="language-icon">🌐</span>
      <span class="language-code">{{ currentLocale.toUpperCase() }}</span>
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="changeLanguage(locale.code)"
          class="language-option"
          :class="{ active: locale.code === currentLocale }"
          :aria-label="`Switch to ${locale.name}`"
        >
          <span class="language-flag">{{ locale.flag }}</span>
          <span class="language-name">{{ locale.name }}</span>
          <span v-if="locale.code === currentLocale" class="check-icon">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
const isOpen = ref(false);

const currentLocale = computed(() => locale.value);

const availableLocales = computed(() => {
  const localeMap: Record<string, { flag: string; name: string }> = {
    en: { flag: "🇺🇸", name: "English" },
    vi: { flag: "🇻🇳", name: "Tiếng Việt" },
  };

  return (locales.value as any[]).map((loc) => ({
    code: typeof loc === "string" ? loc : loc.code,
    flag: localeMap[typeof loc === "string" ? loc : loc.code]?.flag || "🌐",
    name: localeMap[typeof loc === "string" ? loc : loc.code]?.name || loc,
  }));
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLanguage = async (newLocale: "vi" | "en") => {
  await setLocale(newLocale);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".language-switcher")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s;
}

.language-button:hover {
  background: #f0f0f0;
  border-color: #d0d0d0;
}

.language-icon {
  font-size: 18px;
}

.language-code {
  font-weight: 600;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.3s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
  text-align: left;
}

.language-option:hover {
  background: #f9f9f9;
}

.language-option.active {
  background: #f0f0f0;
}

.language-flag {
  font-size: 20px;
}

.language-name {
  flex: 1;
  font-weight: 500;
}

.check-icon {
  color: #667eea;
  font-size: 16px;
  font-weight: bold;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .language-button {
    padding: 6px 12px;
  }

  .language-dropdown {
    min-width: 150px;
  }
}
</style>
