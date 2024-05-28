import { useEffect } from "react";
import { nprogress } from "@mantine/nprogress";

const Loading = () => {
  useEffect(() => {
    nprogress.start();
    return () => {
      nprogress.complete();
    };
  }, []);
  return <></>;
};
export default Loading;
