import { useState } from 'react';

const useNotification = () => {
  const [success, setSuccess] = useState({ state: false, message: '' });
  const [error, setError] = useState({ state: false, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const showSuccess = (message) => {
    setSuccess({ state: true, message });
  };

  const showError = (message) => {
    setError({ state: true, message });
  };

  const clearNotifications = () => {
    setSuccess({ state: false, message: '' });
    setError({ state: false, message: '' });
  };

  const startLoading = () => {
    clearNotifications();
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return { success, error, isLoading, showSuccess, showError, startLoading, stopLoading, clearNotifications };
};

export default useNotification;
