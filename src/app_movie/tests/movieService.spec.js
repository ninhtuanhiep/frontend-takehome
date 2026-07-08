import { beforeEach, describe, expect, it, vi } from "vitest";

const getMock = vi.fn();
const postMock = vi.fn();
const patchMock = vi.fn();
const removeMock = vi.fn();

vi.mock("@/helpers/api/useAxios.js", () => {
  return {
    default: () => ({
      get: getMock,
      post: postMock,
      patch: patchMock,
      remove: removeMock,
    }),
  };
});

const {
  getMovieList,
  createMovie,
  updateMovie,
  deleteMovie,
} = await import("../services/movieService.js");

describe("movieService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMovieList(2) gọi get đúng endpoint", () => {
    getMovieList(2);

    expect(getMock).toHaveBeenCalledWith("movies/?page=2");
  });

  it("createMovie(data) gọi post đúng endpoint và message", () => {
    const data = {
      title: "Inception",
      director: "Christopher Nolan",
      year: 2010,
      rating: 8.8,
    };

    createMovie(data);

    expect(postMock).toHaveBeenCalledWith(
      "movies/",
      data,
      "Tạo phim thành công",
      "Tạo phim thất bại"
    );
  });

  it("updateMovie(id, data) gọi patch đúng endpoint và message", () => {
    const data = {
      title: "Interstellar",
    };

    updateMovie("1", data);

    expect(patchMock).toHaveBeenCalledWith(
      "movies/1/",
      data,
      "Cập nhật thành công"
    );
  });

  it("deleteMovie(id) gọi remove đúng endpoint và message", () => {
    deleteMovie("1");

    expect(removeMock).toHaveBeenCalledWith(
      "movies/1/",
      "Xóa thành công"
    );
  });
});