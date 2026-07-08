# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


## Công nghệ sử dụng

- Vue 3
- Composition API + script setup
- Vue Router
- Axios
- Vuelidate
- Vitest
- json-server

## Cách chạy project

```bash
npm install
npm run mock
npm run dev
npm run test
```

## Cấu trúc module

Module phim nằm trong `src/app_movie`, theo đúng pattern công ty:

- `router.js`: khai báo route của module, nhận `url_root` để mount vào router chính
- `pages/`: page mỏng (`ManageMovies.vue`, `MovieDetail.vue`) — chỉ điều phối state và gọi service
- `components/FormMovie.vue`: form dùng chung cho cả tạo mới và cập nhật
- `services/movieService.js`: toàn bộ lời gọi API, dùng `useAxios` qua alias `@/helpers/api/useAxios.js`
- `metadata/movies.meta.js`: cấu hình `attributes`, `search`, `actions`, `quick_search`, `features`, `classes` — UI đọc từ đây để bật/tắt search, sort, pagination, và các nút create/update/delete/detail
- `tests/`: unit test cho service và form

`helpers/api` và `composables/useLoading` nằm ở top-level `src/` vì được dùng chung cho toàn app, không riêng module phim.

## Giao diện

Giao diện được làm lại theo hướng "kho phim lưu trữ": thanh header màu navy đậm mô phỏng phòng chiếu phim, điểm nhấn vàng marquee cho hành động chính, đỏ velvet cho hành động xóa, và một chi tiết xuyên suốt là dải lỗ phim (film-strip perforation) làm đường phân cách. Font `Bebas Neue` dùng cho tiêu đề, `IBM Plex Sans` cho nội dung, `IBM Plex Mono` cho số liệu (năm, điểm đánh giá) để phân biệt rõ dữ liệu với văn bản thường.

Form thêm/sửa phim hiển thị dạng drawer trượt từ phải, thay vì modal giữa màn hình, để không che khuất toàn bộ danh sách phía sau.

## Vì sao dùng useLoading counter thay vì boolean?

Nếu dùng boolean, khi nhiều API chạy cùng lúc, một API xong trước có thể tắt loading
trong khi API khác vẫn đang chạy. Vì vậy project dùng counter:

- Mỗi API bắt đầu thì tăng `_count`
- Mỗi API kết thúc thì giảm `_count`
- Chỉ khi `_count === 0` mới tắt loading

## Các chức năng đã hoàn thành

- Danh sách phim
- Search realtime theo tên phim
- Sort theo cột
- Pagination 5 phim/trang
- Thêm phim
- Xem chi tiết phim
- Sửa phim
- Xóa phim
- Hiển thị phim cùng thể loại
- Validate form bằng Vuelidate
- Unit test service và form

