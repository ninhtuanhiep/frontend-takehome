import axios from "axios";

import { successToast, errorToast } from "./toastStyle";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function API() {
  const handleSuccess = (response, successMessage) => {
    successToast(successMessage);

    return {
      ok: true,
      data: response.data,
      error: null,
    };
  };

  const handleError = (error, errorMessage) => {
    const message =
      errorMessage ||
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra";

    errorToast(message);

    return {
      ok: false,
      data: null,
      error: message,
    };
  };

  const get = async (url) => {
    try {
      const respone = await axiosClient.get(url);
      return handleSuccess(respone);
    } catch (error) {
      return handleError(error);
    }
  };

  const post = async (url, data, successMessage, errorMessage) => {
    try {
      const respone = await axiosClient.post(url, data);
      return handleSuccess(respone, successMessage);
    } catch (error) {
      return handleError(error, errorMessage);
    }
  };

  const patch = async (url, data, successMessage, errorMessage) => {
    try {
      const respone = await axiosClient.patch(url, data);
      return handleSuccess(respone, successMessage);
    } catch (error) {
      return handleError(error, errorMessage);
    }
  };

  const remove = async (url, successMessage, errorMessage) => {
    try {
      const respone = await axiosClient.delete(url);
      return handleSuccess(respone, successMessage);
    } catch (error) {
      return handleError(error, errorMessage);
    }
  };

  return { get, post, patch, remove };
}
