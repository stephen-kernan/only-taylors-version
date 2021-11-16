import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";

export const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    let path = router.asPath.split(/&|#/);
    const parsedPath = path.slice(1, path.length);
    parsedPath.forEach((hashParam) => {
      const paramKeyValueTuple = hashParam.split("=");
      localStorage.setItem(paramKeyValueTuple[0], paramKeyValueTuple[1]);
    });

    if (parsedPath.length > 1) {
      router.push('/confirmation')
    }
  }, []);

  return <div>Processing</div>;
};

export default Callback;
