"use client";
import axios, { type AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface FormState {
  email: string;
  password: string;
  staySignedIn: boolean;
}

export interface Errors {
  email?: string;
  password?: string;
}

export function useLogin() {
  const router = useRouter();

  const handleSubmit = async (
    formState: FormState,
    setErrors: (errors: Errors) => void
  ) => {
    // Clear previous errors
    setErrors({});

    // Basic validation
    if (!validateForm(formState, setErrors)) {
      return;
    }

    console.log("Attempting login with email:", formState.email);

    try {
      // Make the login request
      const response = await axios.post("/api/login", {
        email: formState.email,
        password: formState.password,
      });

      console.log("Login response received:", {
        status: response.status,
        account_status: response.data.account_status,
      });

      const { token, role, account_status, message } = response.data;

      // Handle different account statuses
      if (account_status === "ACTIVE") {
        // Store auth data in localStorage (if remember me is checked, could add expiry logic)
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (formState.staySignedIn) {
          // You could set a longer expiry or additional flags for "remember me" functionality
          localStorage.setItem("rememberMe", "true");
        }

        toast.success(message || "Login successful!");

        // Small delay to ensure localStorage is set before navigation
        setTimeout(() => {
          if (role === "ADMIN") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
          // Force refresh to ensure all auth-dependent UI updates
          router.refresh();
        }, 300);
      } else if (account_status === "PENDING") {
        toast.error("Please verify your email before logging in.");
      } else if (account_status === "DEACTIVATED") {
        toast.error(
          "Your account has been deactivated. Please contact support."
        );
      } else {
        toast.error("Login failed. Unknown account status.");
      }
    } catch (error) {
      console.error("Login error details:", error);

      // Detailed error extraction and handling
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as AxiosError).response
      ) {
        const response = (error as AxiosError).response!;
        console.error("Error response data:", response.data);
        console.error("Error response status:", response.status);

        if (response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (response.status === 404) {
          errorMessage = "Login service not available. Please try again later.";
        } else if (
          typeof response.data === "object" &&
          response.data &&
          "error" in response.data
        ) {
          errorMessage = (response.data as { error?: string }).error ?? errorMessage;
        }
      } else if (
        typeof error === "object" &&
        error !== null &&
        "request" in error &&
        (error as AxiosError).request
      ) {
        // The request was made but no response was received
        console.error("No response received:", (error as AxiosError).request);
        errorMessage = "Server did not respond. Please check your connection.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        // Something happened in setting up the request
        console.error("Error message:", (error as Error).message);
      }

      setErrors({
        password: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const validateForm = (
    formState: FormState,
    setErrors: (errors: Errors) => void
  ): boolean => {
    const errors: Errors = {};
    let isValid = true;

    if (!formState.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formState.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(errors);
      return false;
    }

    return true;
  };

  return { handleSubmit, validateForm };
}
