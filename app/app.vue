<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";

const head = useLocaleHead();
const route = useRoute();
const { t } = useI18n();
const { initAuth } = useAuth();

const description = computed(() =>
  route.meta.description ? t(route.meta.description as string) : ""
);
const title = computed(() => {
  return route.meta.title ? t(route.meta.title as string) : "";
});

defineOgImageComponent("Default", {
  description,
  title,
});

// Initialize auth from localStorage on mount
onMounted(() => {
  initAuth();
});
</script>

<template>
  <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
    <Head v-if="title">
      <Title>{{ title }}</Title>
      <Meta :content="description" name="description" />
      <template v-for="link in head.link" :key="link.id">
        <Link
          :id="link.id"
          :hreflang="link.hreflang"
          :href="link.href"
          :rel="link.rel"
        />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <NuxtLoadingIndicator />
      <NuxtRouteAnnouncer />
      <div id="app">
        <main>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </main>
      </div>
    </Body>
  </Html>
</template>
