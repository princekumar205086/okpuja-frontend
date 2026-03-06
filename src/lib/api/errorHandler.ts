import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface DRFFieldErrors {
  [key: string]: string[];
}

interface DRFDetailError {
  detail: string;
}

interface DRFGenericError {
  error: string;
  message: string;
}

/**
 * Extract a user-friendly message from a DRF error response.
 */
export function extractErrorMessage(error: unknown): string {
  if (!(error instanceof AxiosError) || !error.response?.data) {
    if (error instanceof AxiosError && !error.response) {
      return "Network error. Please check your connection.";
    }
    return "Something went wrong. Please try again.";
  }

  const data = error.response.data;

  // { "detail": "message" }
  if (typeof data === "object" && "detail" in data) {
    return (data as DRFDetailError).detail;
  }

  // { "error": "title", "message": "description" }
  if (typeof data === "object" && "message" in data) {
    return (data as DRFGenericError).message;
  }

  // { "field": ["error1", "error2"] }
  if (typeof data === "object") {
    const fieldErrors = data as DRFFieldErrors;
    const firstField = Object.keys(fieldErrors)[0];
    if (firstField && Array.isArray(fieldErrors[firstField])) {
      return `${firstField}: ${fieldErrors[firstField][0]}`;
    }
  }

  return "Something went wrong. Please try again.";
}

/**
 * Show a toast notification for an API error.
 */
export function handleApiError(error: unknown): void {
  const message = extractErrorMessage(error);
  toast.error(message);
}
