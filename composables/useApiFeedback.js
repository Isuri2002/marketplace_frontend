export const useApiFeedback = () => {
  const toast = useToast();

  const extractErrorMessage = (
    error,
    fallback = "Something went wrong. Please try again.",
  ) => {
    if (!error) return fallback;
    if (typeof error === "string") return error || fallback;

    return (
      error?.response?.data?.message ||
      error?.data?.message ||
      error?.message ||
      fallback
    );
  };

  const notifyInfo = (description, title = "Info") => {
    toast.add({
      title,
      description,
      icon: "i-heroicons-information-circle",
      color: "blue",
    });
  };

  const notifyError = (
    errorOrMessage,
    fallback = "Something went wrong. Please try again.",
    title = "Error",
  ) => {
    const description =
      typeof errorOrMessage === "string"
        ? errorOrMessage || fallback
        : extractErrorMessage(errorOrMessage, fallback);

    toast.add({
      title,
      description,
      icon: "i-heroicons-exclamation-circle-solid",
      color: "red",
    });

    return description;
  };

  const redirectToLogin = (router, redirectTarget = "/") => {
    router.push(`/auth/login?redirect=${encodeURIComponent(redirectTarget)}`);
  };

  const handleFavoriteApiError = (
    error,
    {
      onAlreadyInFavorites,
      onFavoriteNotFound,
      onUnhandled,
      defaultMessage = "Failed to update favorite. Please try again.",
      alreadyMessage = "This item is already in your favorites.",
      notFoundMessage = "This item is not in your favorites.",
    } = {},
  ) => {
    const message = extractErrorMessage(error, defaultMessage);

    if (message.includes("Ad already in favorites")) {
      onAlreadyInFavorites?.();
      notifyInfo(alreadyMessage);
      return "already-in-favorites";
    }

    if (message.includes("Favorite not found")) {
      onFavoriteNotFound?.();
      notifyInfo(notFoundMessage);
      return "favorite-not-found";
    }

    onUnhandled?.(message);
    notifyError(message, defaultMessage);
    return "unhandled";
  };

  return {
    extractErrorMessage,
    notifyInfo,
    notifyError,
    redirectToLogin,
    handleFavoriteApiError,
  };
};
