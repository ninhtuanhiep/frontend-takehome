import { ref } from "vue";

const _count = ref(0);

const isLoading = ref(false);

export function useLoading() {
  const showLoading = () => {
    _count.value++;
    isLoading.value = _count.value > 0;
  };

  const hideLoading = () => {
    _count.value = Math.max(0, _count.value - 1);
    isLoading.value = _count.value > 0;
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
}
