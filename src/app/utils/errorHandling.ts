/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Extracts error message from API response with proper handling of validation errors
 * @param error - The error object from axios catch block
 * @param fallbackMessage - Default message if no specific error is found
 * @returns Formatted error message string
 */
export function extractErrorMessage(error: any, fallbackMessage: string = 'An error occurred'): string {
  // Handle validation errors with specific field messages
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    
    // Extract all error messages from all fields and flatten them
    const errorMessages = Object.values(errors)
      .flat()
      .filter(msg => typeof msg === 'string')
      .join(', ');
    
    return errorMessages || fallbackMessage;
  }
  
  // Handle general error messages
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Handle detail messages (common in Django REST framework)
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  // Handle string error responses
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  
  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return 'Network error. Please check your internet connection.';
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  // Handle authentication errors
  if (error.response?.status === 401) {
    return 'Authentication required. Please login.';
  }
  
  // Handle forbidden errors
  if (error.response?.status === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  // Handle not found errors
  if (error.response?.status === 404) {
    return 'Requested resource not found.';
  }
  
  // Handle server errors
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  // Fallback to error message or default
  return error.message || fallbackMessage;
}

/**
 * Handles errors consistently and shows toast messages
 * @param error - The error object from axios catch block
 * @param fallbackMessage - Default message if no specific error is found
 * @param showToast - Whether to show toast notification (default: true)
 * @returns Formatted error message string
 */
export function handleApiError(
  error: any, 
  fallbackMessage: string = 'An error occurred',
  showToast: boolean = true
): string {
  const errorMessage = extractErrorMessage(error, fallbackMessage);
  
  if (showToast) {
    // Import toast dynamically to avoid circular dependencies
    import('react-hot-toast').then(({ toast }) => {
      toast.error(errorMessage);
    });
  }
  
  // Log error for debugging
  console.error('API Error:', {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
    originalError: error
  });
  
  return errorMessage;
}

/**
 * Creates an error handler function with predefined fallback message
 * @param fallbackMessage - Default message for this specific error context
 * @returns Error handler function
 */
export function createErrorHandler(fallbackMessage: string) {
  return (error: any, showToast: boolean = true) => {
    return handleApiError(error, fallbackMessage, showToast);
  };
}

/**
 * Specific error handlers for common operations
 */
export const errorHandlers = {
  booking: createErrorHandler('Failed to process booking. Please try again.'),
  payment: createErrorHandler('Payment processing failed. Please try again.'),
  authentication: createErrorHandler('Authentication failed. Please login again.'),
  fetch: createErrorHandler('Failed to load data. Please refresh the page.'),
  update: createErrorHandler('Failed to update. Please try again.'),
  delete: createErrorHandler('Failed to delete. Please try again.'),
  upload: createErrorHandler('Failed to upload file. Please try again.'),
};
