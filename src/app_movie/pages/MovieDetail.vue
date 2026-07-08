<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import FormMovie from "../components/FormMovie.vue";
import { movieMetadata } from "../metadata/movies.meta.js";
import {
  getMovieById,
  getMovieList,
  updateMovie,
  deleteMovie,
} from "../services/movieService.js";
import { useLoading } from "@/composables/useLoading.js";
import { genreTint } from "../utils/genreColor.js";

const route = useRoute();
const router = useRouter();

const { showLoading, hideLoading } = useLoading();

const movie = ref(null);
const notFound = ref(false);
const isFetching = ref(true);
const relatedMovies = ref([]);
const isShowForm = ref(false);

const movieId = computed(() => route.params.id);

const posterUrl = computed(() => `https://picsum.photos/seed/${movieId.value}/400/600`);

const fetchRelatedMovies = async () => {
  if (!movie.value?.genre) return;

  showLoading();
  const res = await getMovieList(1, { genre: movie.value.genre });
  hideLoading();
  if (!res.ok) return;

  relatedMovies.value = res.data.filter((item) => item.id !== movie.value.id).slice(0, 4);
};

const fetchMovieDetail = async () => {
  notFound.value = false;
  showLoading();
  const res = await getMovieById(movieId.value);
  hideLoading();
  isFetching.value = false;

  if (!res.ok || !res.data) {
    notFound.value = true;
    return;
  }

  movie.value = res.data;
  await fetchRelatedMovies();
};

const openEditForm = () => {
  isShowForm.value = true;
};

const closeForm = () => {
  isShowForm.value = false;
};

const handleUpdateMovie = async (payload) => {
  showLoading();
  const res = await updateMovie(movieId.value, payload);
  hideLoading();

  if (!res.ok) return;

  closeForm();
  await fetchMovieDetail();
};

const handleDeleteMovie = async () => {
  const isConfirmed = confirm("Bạn có chắc muốn xóa phim này không?");
  if (!isConfirmed) return;

  showLoading();
  const res = await deleteMovie(movieId.value);
  hideLoading();

  if (!res.ok) return;

  router.push("/movies");
};

const goToDetail = (id) => {
  router.push(`/movies/${id}`);
};

watch(
  () => route.params.id,
  () => fetchMovieDetail(),
);

onMounted(() => {
  fetchMovieDetail();
});
</script>

<template>
  <div class="container">
    <button class="btn btn-ghost back-button" @click="router.push('/movies')">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M9 2.5 4 7l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Quay lại
    </button>

    <div v-if="isFetching" class="card detail skeleton-detail">
      <span class="skeleton-bar skeleton-poster"></span>
      <div class="info">
        <span class="skeleton-bar" style="width: 55%; height: 26px"></span>
        <div class="meta-chips">
          <span class="skeleton-bar" style="width: 120px"></span>
          <span class="skeleton-bar" style="width: 70px"></span>
          <span class="skeleton-bar" style="width: 90px"></span>
        </div>
        <span class="skeleton-bar" style="width: 90%"></span>
        <span class="skeleton-bar" style="width: 75%"></span>
      </div>
    </div>

    <div v-else-if="notFound" class="card not-found">
      <p class="empty-title">Không tìm thấy phim này</p>
      <p class="empty-hint">Phim có thể đã bị xóa hoặc đường dẫn không đúng.</p>
    </div>

    <section v-else-if="movie" class="card detail">
      <div class="poster-wrap">
        <img :src="posterUrl" :alt="movie.title" class="poster" />
        <span class="badge-rating poster-badge">
          <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M6 0.5l1.6 3.4 3.7.4-2.75 2.55.75 3.65L6 8.7 2.7 10.5l.75-3.65L.7 4.3l3.7-.4z" />
          </svg>
          {{ movie.rating }}
        </span>
      </div>

      <div class="info">
        <h1>{{ movie.title }}</h1>

        <div class="meta-chips">
          <span class="chip">Đạo diễn · {{ movie.director }}</span>
          <span class="chip mono-chip">{{ movie.year }}</span>
          <span
            class="chip"
            :style="{ background: genreTint(movie.genre).bg, color: genreTint(movie.genre).text, borderColor: 'transparent' }"
          >
            {{ movie.genre }}
          </span>
        </div>

        <p class="description">{{ movie.description || "Chưa có mô tả cho phim này." }}</p>

        <div class="actions">
          <button v-if="movieMetadata.actions.update" class="btn btn-ghost" @click="openEditForm">
            Sửa
          </button>
          <button v-if="movieMetadata.actions.delete" class="btn btn-danger" @click="handleDeleteMovie">
            Xóa
          </button>
        </div>
      </div>
    </section>

    <section v-if="movie && relatedMovies.length" class="related">
      <h2>Phim cùng thể loại</h2>

      <div class="related-grid">
        <article
          v-for="item in relatedMovies"
          :key="item.id"
          class="related-card"
          @click="goToDetail(item.id)"
        >
          <img :src="`https://picsum.photos/seed/${item.id}/200/260`" :alt="item.title" />
          <h3>{{ item.title }}</h3>
          <p class="related-meta">
            <span class="mono-chip">{{ item.year }}</span> · {{ item.rating }}/10
          </p>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="backdrop">
        <div v-if="isShowForm" class="drawer-backdrop" @click="closeForm"></div>
      </Transition>
      <Transition name="drawer">
        <div v-if="isShowForm" class="drawer">
          <div class="drawer-header">
            <h2>Cập nhật phim</h2>
            <p>Chỉnh sửa thông tin của "{{ movie?.title }}"</p>
          </div>
          <FormMovie class="drawer-form" :movie="movie" @submit="handleUpdateMovie" @cancel="closeForm" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.back-button {
  margin-bottom: 20px;
}

.not-found {
  padding: 56px 24px;
  text-align: center;
}

.skeleton-detail {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding: 28px;
}
.skeleton-poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
}
.skeleton-detail .info {
  gap: 14px;
}

.detail {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding: 28px;
}

.poster-wrap {
  position: relative;
}

.poster {
  width: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: block;
}

.poster-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--navy);
  color: var(--marquee);
  box-shadow: var(--shadow-sm);
}
.poster-badge svg {
  fill: var(--marquee);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mono-chip {
  font-family: var(--font-mono);
}

.description {
  color: var(--muted);
  line-height: 1.7;
  max-width: 60ch;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.related {
  margin-top: 36px;
}
.related h2 {
  font-size: 22px;
  margin-bottom: 16px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.related-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 12px;
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}
.related-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.related-card img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.related-card h3 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  margin-top: 10px;
}
.related-meta {
  font-size: 12.5px;
  color: var(--muted);
  margin-top: 4px;
}

@media (max-width: 720px) {
  .detail,
  .skeleton-detail {
    grid-template-columns: 1fr;
  }
  .poster-wrap,
  .skeleton-poster {
    max-width: 220px;
  }
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
