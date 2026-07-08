import API from "@/helpers/api/useAxios.js";

const { get, post, patch, remove } = API();

const BASE = "movies";

export const getMovieList = (page = 1, filters = {}) => {
  const params = new URLSearchParams();

  params.set("page", page);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  return get(`${BASE}/?${params.toString()}`);
};

export const getMovieById = (id) => {
  return get(`${BASE}/${id}/`);
};

export const createMovie = (data) => {
  return post(`${BASE}/`, data, "Tạo phim thành công", "Tạo phim thất bại");
};

export const updateMovie = (id, data) => {
  return patch(`${BASE}/${id}/`, data, "Cập nhật thành công");
};

export const deleteMovie = (id) => {
  return remove(`${BASE}/${id}/`, "Xóa thành công");
};
