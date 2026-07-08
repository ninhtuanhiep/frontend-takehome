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

const rules = computed(() => ({
  title: {
    required: helpers.withMessage("Vui lòng nhập tên phim", required),
    minLength: helpers.withMessage(
      "Tên phim phải có ít nhất 2 kí tự",
      minLength(2),
    ),
  },
  director: {
    required: helpers.withMessage("Vui lòng nhập đạo diễn", required),
  },
  year: {
    required: helpers.withMessage("Vui lòng nhập năm phát hành", required),
    numeric: helpers.withMessage("Năm phải là số", numeric),
    between: helpers.withMessage(
      "Năm phải từ 1900 -> 2026",
      between(1900, 2026),
    ),
  },
  rating: {
    required: helpers.withMessage("Vui lòng nhập đánh giá", required),
    numeric: helpers.withMessage("Đánh giá phải là số", decimal),
    between: helpers.withMessage("Đánh giá phải từ 1 -> 10", between(1, 10)),
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
    <h2>{{ isEditMode ? "Cập nhật phim" : "Thêm phim mới" }}</h2>

    <div class="form-group">
      <label>Tên phim</label>
      <input
        v-model="form.title"
        data-test="title-input"
        type="text"
        placeholder="Nhập tên phim"
        @blur="v$.title.$touch()"
      />
      <p v-if="v$.title.$error" class="error-message">
        {{ v$.title.$errors[0].$message }}
      </p>
    </div>

    <div class="form-group">
      <label>Đạo diễn</label>
      <input
        v-model="form.director"
        data-test="director-input"
        type="text"
        placeholder="Nhập đạo diễn"
        @blur="v$.director.$touch()"
      />
      <p v-if="v$.director.$error" class="error-message">
        {{ v$.director.$errors[0].$message }}
      </p>
    </div>

    <div class="form-group">
      <label>Năm phát hành</label>
      <input
        v-model="form.year"
        data-test="year-input"
        type="number"
        placeholder="Nhập năm phát hành"
        @blur="v$.year.$touch()"
      />
      <p v-if="v$.year.$error" class="error-message">
        {{ v$.year.$errors[0].$message }}
      </p>
    </div>

    <div class="form-group">
      <label>Thể loại</label>
      <input
        v-model="form.genre"
        data-test="genre-input"
        type="text"
        placeholder="Nhập thể loại"
      />
    </div>

    <div class="form-group">
      <label>Đánh giá</label>
      <input
        v-model="form.rating"
        data-test="rating-input"
        type="number"
        step="0.1"
        placeholder="Nhập điểm đánh giá"
        @blur="v$.rating.$touch()"
      />
      <p v-if="v$.rating.$error" class="error-message">
        {{ v$.rating.$errors[0].$message }}
      </p>
    </div>

    <div class="form-group">
      <label>Mô tả</label>
      <textarea
        v-model="form.description"
        data-test="description-input"
        placeholder="Nhập mô tả phim"
      ></textarea>
    </div>

    <div class="form-actions">
      <button data-test="submit-button" type="submit">
        {{ isEditMode ? "Lưu thay đổi" : "Thêm phim" }}
      </button>
      <button type="button" @click="emit('cancel')">Hủy</button>
    </div>
  </form>
</template>

<style scoped>
.movie-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
textarea {
  padding: 10px;
  border: 1px solid #dcdde1;
  border-radius: 6px;
}

textarea {
  min-height: 80px;
}

.error-message {
  color: #e84118;
  font-size: 14px;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 10px;
}
</style>
