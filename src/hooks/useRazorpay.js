import { useCallback } from "react";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadingPromise = null;

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return loadingPromise;
};

export const useRazorpay = () => {
  const openCheckout = useCallback(async (options) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error("Could not load the payment gateway. Check your connection and try again.");
    }
    const instance = new window.Razorpay(options);
    instance.open();
    return instance;
  }, []);

  return { openCheckout };
};
