import { useEffect, useState } from "react";
import { HomePageFaq } from "./components/HomePageFaq";
import { HomePageLoader } from "./components/HomePageLoader";
import { HomePageTop } from "./components/HomePageTop";
import s from "./HomePage.module.scss";

export const HomePage = () => {
    const [showLoader, setShowLoader] = useState(() => {
      return !sessionStorage.getItem("homePageLoaderShown");
    });

    useEffect(() => {
      if (showLoader) {
        sessionStorage.setItem("homePageLoaderShown", "true");
      }
    }, [showLoader]);
    return (
      <div className={s.wrapper}>
        {showLoader && <HomePageLoader setShowLoader={setShowLoader} />}
        <HomePageTop />
        <HomePageFaq />
      </div>
    );
}