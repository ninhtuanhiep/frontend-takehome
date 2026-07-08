export const movieMetadata = {
  attributes: [
    {
      key: "title",
      label: "Tên phim",
      sortable: true,
    },
    {
      key: "director",
      label: "Đạo diễn",
      sortable: true,
    },
    {
      key: "year",
      label: "Năm",
      sortable: true,
    },
    {
      key: "genre",
      label: "Thể loại",
      sortable: true,
    },
    {
      key: "rating",
      label: "Đánh giá",
      sortable: true,
    },
  ],

  search: {
    placeholder: "Tìm kiếm theo tên phim...",
  },

  quick_search: {
    key: "title",
  },

  actions: {
    create: true,
    update: true,
    delete: true,
    detail: true,
  },

  features: {
    search: true,
    sort: true,
    pagination: true,
  },

  classes: {
    table: "movie-table",
    button: "btn",
    primaryButton: "btn btn-primary",
    dangerButton: "btn btn-danger",
  },
};
