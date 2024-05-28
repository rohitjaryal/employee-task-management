import { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";
import fetchRequest from "@/includes/axios.ts";

const ApiLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up a request interceptor
    const requestInterceptor = fetchRequest.interceptors.request.use(
      (config) => {
        // Show the loader when a request is initiated
        setIsLoading(true);
        return config;
      },
    );

    // Set up a response interceptor
    const responseInterceptor = fetchRequest.interceptors.response.use(
      (response) => {
        // Hide the loader when a response is received
        setIsLoading(false);

        // return response?.data?.data;
        return response;
      },
      (error) => {
        // Hide the loader when an error occurs
        setIsLoading(false);

        return Promise.reject(error);
      },
    );

    // Cleanup the interceptors when the component unmounts
    return () => {
      fetchRequest.interceptors.request.eject(requestInterceptor);
      fetchRequest.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty dependency array to run this effect only once

  return (
    <div>
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
      )}

      {children}
    </div>
  );
};

export default ApiLoader;
