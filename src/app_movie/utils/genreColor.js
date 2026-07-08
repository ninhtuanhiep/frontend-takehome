// Gán một tông màu ổn định cho mỗi thể loại (hash đơn giản từ chuỗi genre),
// giúp bảng và trang chi tiết dễ quét bằng mắt hơn khi danh sách dài.
const PALETTE = [
  { bg: "rgba(99, 102, 241, 0.14)", text: "#4338ca" }, // indigo
  { bg: "rgba(215, 154, 44, 0.16)", text: "#8a5d10" }, // marquee gold
  { bg: "rgba(156, 47, 62, 0.13)", text: "#7f2432" }, // velvet
  { bg: "rgba(47, 125, 91, 0.14)", text: "#215f45" }, // reel green
  { bg: "rgba(190, 90, 140, 0.14)", text: "#9c3f70" }, // plum
  { bg: "rgba(56, 132, 168, 0.14)", text: "#1f5c76" }, // teal
];

export function genreTint(genre) {
  const key = String(genre || "");
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
