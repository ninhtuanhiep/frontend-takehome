import { toast } from "vue3-toastify";

export const successToast = (message) => {
  if (!message) return;

  toast.success(message, {
    autoClose: 2000,
  });
};

export const errorToast = (message) => {
  if (!message) return;

  toast.error(message, {
    autoClose: 2500,
  });
};
