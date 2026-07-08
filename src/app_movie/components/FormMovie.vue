<script setup>
import { computed, reactive, watch } from "vue";

import useVueLidate from "@vuelidate/core";

import {
  required,
  minLength,
  numeric,
  decimal,
  between,
  helpers,
} from "@vuelidate/validators";

const props = defineProps({
  movie: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({
  title: "",
  director: "",
  year: "",
  genre: "",
  rating: "",
  description: "",
});

const isEditMode = computed(() => Boolean(props.movie?.id));

const genreSuggestions = [
  "Sci-Fi",
  "Action",
  "Drama",
  "Romance",
  "Comedy",
  "Horror",
  "Thriller",
  "Animation",
  "Tình cảm",
  "Hài",
];

const rules = computed(() => ({
  title: {
    required: helpers.withMessage("Vui lòng nhập tên phim", required),
    minLength: helpers.withMessage("Tên phim phải có ít nhất 2 kí tự", minLength(2)),
  },
  director: {
    required: helpers.withMessage("Vui lòng nhập đạo diễn", required),
  },
  year: {
    required: helpers.withMessage("Vui lòng nhập năm phát hành", required),
    numeric: helpers.withMessage("Năm phải là số", numeric),
    between: helpers.withMessage("Năm phải từ 1900 đến 2100", between(1900, 2100)),
  },
  rating: {
    required: helpers.withMessage("Vui lòng nhập đánh giá", required),
    decimal: helpers.withMessage("Đánh giá phải là số", decimal),
    between: helpers.withMessage("Đánh giá phải từ 1 đến 10", between(1, 10)),
  },
}));

const v$ = useVueLidate(rules, form);

watch(
  () => props.movie,
  (movie) => {
    form.title = movie?.title || "";
    form.director = movie?.director || "";
    form.year = movie?.year || "";
    form.genre = movie?.genre || "";
    form.rating = movie?.rating || "";
    form.description = movie?.description || "";
    v$.value.$reset();
  },
  { immediate: true },
);

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  emit("submit", {
    title: form.title.trim(),
    director: form.director.trim(),
    year: Number(form.year),
    genre: form.genre.trim(),
    rating: Number(form.rating),
    description: form.description.trim(),
  });
};

// Dùng cho test để kiểm tra v$.$invalid
// Không ảnh hưởng giao diện thật.
defineExpose({ v$, form });
</script>

<template>
  <form class="movie-form" @submit.prevent="handleSubmit">
    <div class="drawer-body">
      <div class="form-field" :class="{ 'has-error': v$.title.$error }">
        <label for="movie-title">Tên phim</label>
        <input
          id="movie-title"
          v-model="form.title"
          data-test="title-input"
          type="text"
          placeholder="Vd: Inception"
          @blur="v$.title.$touch()"
        />
        <p v-if="v$.title.$error" class="field-error">{{ v$.title.$errors[0].$message }}</p>
      </div>

      <div class="form-field" :class="{ 'has-error': v$.director.$error }">
        <label for="movie-director">Đạo diễn</label>
        <input
          id="movie-director"
          v-model="form.director"
          data-test="director-input"
          type="text"
          placeholder="Vd: Christopher Nolan"
          @blur="v$.director.$touch()"
        />
        <p v-if="v$.director.$error" class="field-error">{{ v$.director.$errors[0].$message }}</p>
      </div>

      <div class="field-row">
        <div class="form-field" :class="{ 'has-error': v$.year.$error }">
          <label for="movie-year">Năm phát hành</label>
          <input
            id="movie-year"
            v-model="form.year"
            data-test="year-input"
            type="number"
            placeholder="2024"
            @blur="v$.year.$touch()"
          />
          <p v-if="v$.year.$error" class="field-error">{{ v$.year.$errors[0].$message }}</p>
        </div>

        <div class="form-field" :class="{ 'has-error': v$.rating.$error }">
          <label for="movie-rating">Đánh giá</label>
          <input
            id="movie-rating"
            v-model="form.rating"
            data-test="rating-input"
            type="number"
            step="0.1"
            placeholder="8.5"
            @blur="v$.rating.$touch()"
          />
          <p v-if="v$.rating.$error" class="field-error">{{ v$.rating.$errors[0].$message }}</p>
        </div>
      </div>

      <div class="form-field">
        <label for="movie-genre">Thể loại</label>
        <input
          id="movie-genre"
          v-model="form.genre"
          data-test="genre-input"
          type="text"
          list="genre-suggestions"
          placeholder="Vd: Sci-Fi"
        />
        <datalist id="genre-suggestions">
          <option v-for="genre in genreSuggestions" :key="genre" :value="genre" />
        </datalist>
      </div>

      <div class="form-field">
        <label for="movie-description">Mô tả</label>
        <textarea
          id="movie-description"
          v-model="form.description"
          data-test="description-input"
          placeholder="Tóm tắt ngắn về nội dung phim"
        ></textarea>
      </div>
    </div>

    <div class="drawer-footer">
      <button type="button" class="btn btn-ghost" @click="emit('cancel')">Hủy</button>
      <button data-test="submit-button" type="submit" class="btn btn-primary">
        {{ isEditMode ? "Lưu thay đổi" : "Thêm phim" }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.movie-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
