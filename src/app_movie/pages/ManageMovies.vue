<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import FormMovie from "../components/FormMovie.vue";
import { movieMetadata } from "../metadata/movies.meta.js";
import { getMovieList, createMovie } from "../services/movieService.js";
import { useLoading } from "@/composables/useLoading.js";
import { genreTint } from "../utils/genreColor.js";

const router = useRouter();
const { showLoading, hideLoading } = useLoading();

const movies = ref([]);
const isFetching = ref(true);
const searchKeyword = ref("");
const sortKey = ref("");
const sortOrder = ref("asc");
const currentPage = ref(1);
const pageSize = 5;
const isShowForm = ref(false);

const posterThumb = (id) => `https://picsum.photos/seed/${id}/80/112`;

const fetchMovies = async () => {
  showLoading();
  const res = await getMovieList();
  hideLoading();
  isFetching.value = false;

  if (!res.ok) return;

  movies.value = res.data;
};

const filteredMovies = computed(() => {
  if (!movieMetadata.features.search) return movies.value;

  const quickSearchKey = movieMetadata.quick_search.key;
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) return movies.value;

  return movies.value.filter((movie) => {
    return String(movie[quickSearchKey]).toLowerCase().includes(keyword);
  });
});

const sortedMovies = computed(() => {
  if (!movieMetadata.features.sort || !sortKey.value) return filteredMovies.value;

  return [...filteredMovies.value].sort((a, b) => {
    const firstValue = a[sortKey.value];
    const secondValue = b[sortKey.value];

    if (firstValue > secondValue) return sortOrder.value === "asc" ? 1 : -1;
    if (firstValue < secondValue) return sortOrder.value === "asc" ? -1 : 1;
    return 0;
  });
});

const totalPages = computed(() => {
  if (!movieMetadata.features.pagination) return 1;
  return Math.ceil(sortedMovies.value.length / pageSize) || 1;
});

const paginatedMovies = computed(() => {
  if (!movieMetadata.features.pagination) return sortedMovies.value;

  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;

  return sortedMovies.value.slice(start, end);
});

const handleSort = (attribute) => {
  if (!movieMetadata.features.sort || !attribute.sortable) return;

  if (sortKey.value === attribute.key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = attribute.key;
    sortOrder.value = "asc";
  }
};

const goToDetail = (id) => {
  if (!movieMetadata.actions.detail) return;
  router.push(`/movies/${id}`);
};

const openCreateForm = () => {
  isShowForm.value = true;
};

const closeForm = () => {
  isShowForm.value = false;
};

const handleCreateMovie = async (payload) => {
  showLoading();
  const res = await createMovie(payload);
  hideLoading();

  if (!res.ok) return;

  closeForm();
  currentPage.value = 1;
  await fetchMovies();
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const clearSearch = () => {
  searchKeyword.value = "";
};

onMounted(() => {
  fetchMovies();
});
</script>

<template>
  <div class="container">
    <div class="page-header">
      <div>
        <h1>Quản lý phim</h1>
        <p class="subtitle">Danh sách phim đang có trong hệ thống</p>
      </div>
      <button v-if="movieMetadata.actions.create" class="btn btn-primary" @click="openCreateForm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        Thêm phim
      </button>
    </div>

    <div v-if="movieMetadata.features.search" class="toolbar">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4" />
          <path d="m14 14-3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="movieMetadata.search.placeholder"
        />
      </div>
      <span class="result-count">{{ sortedMovies.length }} phim</span>
    </div>

    <div class="card table-card">
      <table :class="movieMetadata.classes.table">
        <thead>
          <tr>
            <th
              v-for="attribute in movieMetadata.attributes"
              :key="attribute.key"
              :class="{ sortable: movieMetadata.features.sort && attribute.sortable }"
              @click="handleSort(attribute)"
            >
              <span class="th-inner">
                {{ attribute.label }}
                <svg
                  v-if="movieMetadata.features.sort && attribute.sortable"
                  class="sort-icon"
                  :class="{ active: sortKey === attribute.key }"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    v-if="sortKey === attribute.key && sortOrder === 'desc'"
                    d="M1 3.5 5 7.5 9 3.5"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M1 6.5 5 2.5 9 6.5"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </th>
          </tr>
        </thead>

        <tbody v-if="isFetching">
          <tr v-for="n in pageSize" :key="n" class="skeleton-row">
            <td v-for="attribute in movieMetadata.attributes" :key="attribute.key" :data-label="attribute.label">
              <span class="skeleton-bar" :style="{ width: attribute.key === 'title' ? '70%' : '50%' }"></span>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr
            v-for="movie in paginatedMovies"
            :key="movie.id"
            :class="{ clickable: movieMetadata.actions.detail }"
            @click="goToDetail(movie.id)"
          >
            <td v-for="attribute in movieMetadata.attributes" :key="attribute.key" :data-label="attribute.label">
              <span v-if="attribute.key === 'title'" class="movie-title-cell">
                <img class="title-thumb" :src="posterThumb(movie.id)" :alt="movie.title" loading="lazy" />
                {{ movie.title }}
              </span>
              <span
                v-else-if="attribute.key === 'genre'"
                class="chip"
                :style="{ background: genreTint(movie.genre).bg, color: genreTint(movie.genre).text, borderColor: 'transparent' }"
              >
                {{ movie.genre }}
              </span>
              <span v-else-if="attribute.key === 'rating'" class="badge-rating">
                <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M6 0.5l1.6 3.4 3.7.4-2.75 2.55.75 3.65L6 8.7 2.7 10.5l.75-3.65L.7 4.3l3.7-.4z" />
                </svg>
                {{ movie[attribute.key] }}
              </span>
              <span v-else class="mono-cell">{{ movie[attribute.key] }}</span>
            </td>
          </tr>

          <tr v-if="paginatedMovies.length === 0" class="empty-row">
            <td :colspan="movieMetadata.attributes.length">
              <div class="empty-state">
                <p class="empty-title">Không tìm thấy phim phù hợp</p>
                <p class="empty-hint">Thử một từ khóa khác, hoặc thêm phim mới vào hệ thống.</p>
                <button v-if="searchKeyword" class="btn btn-ghost" @click="clearSearch">Xóa tìm kiếm</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="movieMetadata.features.pagination && sortedMovies.length > 0" class="pagination">
      <button
        class="btn btn-ghost btn-icon"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        aria-label="Trang trước"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2.5 4 7l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="page-indicator">Trang {{ currentPage }} / {{ totalPages }}</span>
      <button
        class="btn btn-ghost btn-icon"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        aria-label="Trang sau"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 2.5 10 7l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="backdrop">
        <div v-if="isShowForm" class="drawer-backdrop" @click="closeForm"></div>
      </Transition>
      <Transition name="drawer">
        <div v-if="isShowForm" class="drawer">
          <div class="drawer-header">
            <h2>Thêm phim mới</h2>
            <p>Điền thông tin phim để thêm vào danh sách</p>
          </div>
          <FormMovie
            class="drawer-form"
            @submit="handleCreateMovie"
            @cancel="closeForm"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 22px;
  gap: 16px;
  flex-wrap: wrap;
}

.subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-top: 4px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.search-box {
  flex: 1;
  max-width: 360px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  height: 42px;
  color: var(--muted);
}
.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  height: 100%;
  color: var(--ink);
}
.search-box input:focus {
  outline: none;
}

.result-count {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
}

.table-card {
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 13px 16px;
  text-align: left;
  border-bottom: 1px solid var(--line);
}

th {
  background: var(--paper);
  font-size: 12.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  user-select: none;
}
th.sortable {
  cursor: pointer;
}
th.sortable:hover {
  color: var(--ink);
}

.th-inner {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.sort-icon {
  opacity: 0.35;
}
.sort-icon.active {
  opacity: 1;
  color: var(--marquee-dark);
}

tbody tr.clickable {
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease);
}
tbody tr.clickable:hover {
  background: var(--marquee-bg);
}

.movie-title-cell {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.title-thumb {
  width: 34px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  flex: none;
}

.skeleton-row td {
  padding: 16px;
}

.mono-cell {
  font-family: var(--font-mono);
  color: var(--muted);
}

.empty-row td {
  padding: 0;
}
.empty-state {
  padding: 56px 24px;
  text-align: center;
}
.empty-title {
  font-weight: 600;
  font-size: 15px;
}
.empty-hint {
  color: var(--muted);
  font-size: 13.5px;
  margin-top: 6px;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
}

.page-indicator {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}

.drawer-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- responsive: table becomes a stack of cards --- */
@media (max-width: 640px) {
  thead {
    display: none;
  }
  table,
  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }
  tbody tr {
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    margin: 10px;
    overflow: hidden;
  }
  tbody tr.skeleton-row {
    border-color: transparent;
  }
  td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--line);
  }
  tr td:last-child {
    border-bottom: none;
  }
  td::before {
    content: attr(data-label);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    flex: none;
  }
  .title-thumb {
    display: none;
  }
  .empty-row {
    border: none !important;
  }
  .empty-row td {
    display: block;
  }
  .empty-row td::before {
    content: none;
  }
}
</style>
