<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useLoading } from "@/composables/useLoading.js";

const { isLoading } = useLoading();
</script>

<template>
  <div class="shell">
    <div v-if="isLoading" class="top-loader" role="status" aria-label="Đang tải dữ liệu"></div>

    <header class="topbar">
      <div class="container topbar-inner">
        <RouterLink to="/movies" class="brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.4" />
            <circle cx="12" cy="12" r="2.4" fill="currentColor" />
            <circle cx="12" cy="5.3" r="1.5" fill="currentColor" />
            <circle cx="18" cy="9.4" r="1.5" fill="currentColor" />
            <circle cx="15.7" cy="16.9" r="1.5" fill="currentColor" />
            <circle cx="8.3" cy="16.9" r="1.5" fill="currentColor" />
            <circle cx="6" cy="9.4" r="1.5" fill="currentColor" />
          </svg>
          <span class="brand-name">Metatwin<em>Cinema</em></span>
        </RouterLink>
      </div>
      <div class="filmstrip topbar-strip"></div>
    </header>

    <main class="shell-body">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: var(--navy);
  color: #fff;
}

.topbar-inner {
  height: 60px;
  display: flex;
  align-items: center;
}

.topbar-strip {
  background: var(--navy);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--marquee);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 0.04em;
  color: #fff;
}
.brand-name em {
  font-style: normal;
  color: var(--marquee);
  margin-left: 4px;
}

.shell-body {
  flex: 1;
  padding: 32px 0 56px;
}
</style>
