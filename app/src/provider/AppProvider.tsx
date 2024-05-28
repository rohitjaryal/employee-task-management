import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import UiProvider from "./UiProvider.tsx";
import AppRoutes from "@/routes/AppRoutes.tsx";
import Loading from "@cmp/Loading";
import { BrowserRouter } from "react-router-dom";
import LayoutProvider from "@/provider/LayoutProvider.tsx";

function ErrorFallback() {
  return (
    <div>
      <h2>Oops, something went wrong </h2>
    </div>
  );
}

const AppProvider = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UiProvider>
          <BrowserRouter>
            <LayoutProvider>
              <AppRoutes />
            </LayoutProvider>
          </BrowserRouter>
        </UiProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default AppProvider;
