import { Link } from "react-router-dom";
import { GithubIcon } from "../../Icons/GithubIcon";
import { TelegramIcon } from "../../Icons/TelegramIcon";
import { XIcon } from "../../Icons/XIcon";
import s from "./Footer.module.scss";

const socLinks = [
  {
    link: "https://x.com/beetroot_fi",
    icon: <XIcon />,
  },
  {
    link: "https://github.com/Beetroot-fi",
    icon: <GithubIcon />,
  },
  {
    link: "https://t.me/BeetrootFinance",
    icon: <TelegramIcon />,
  },
];

export const Footer = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        {socLinks.map((item, i) => (
          <Link to={item.link} target="blank" key={i}>
            {item.icon}
          </Link>
        ))}
      </div>
      <div className={s.bottom}>
        <Link to="#">Terms of use</Link>
        <Link to="#">Privacy policy</Link>
      </div>
    </div>
  );
};
