export default (url_root) => [
  {
    path: url_root,
    name: "ManageMoviesLayout",
    component: () => import("./pages/ManageMovies.vue"),
    meta: {
      title: "Quản lý phim",
      icon: "ri-movie-line",
      showMenu: true,
    },
  },
  {
    path: `${url_root}/:id`,
    name: "MovieDetail",
    component: () => import("./pages/MovieDetail.vue"),
    meta: {
      title: "Chi tiết phim",
    },
  },
];
