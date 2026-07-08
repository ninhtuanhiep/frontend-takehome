import appMoviesRouter from "@/app_movie/router.js";

const routes = [
  { path: "/", redirect: "/movies" },
  ...appMoviesRouter("/movies"),
];

export default routes