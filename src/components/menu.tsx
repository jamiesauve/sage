import { env } from "../helpers/environment-variables"
import { SettingsButton } from "./settings-button"
import { HomeIcon } from "./svg/home-icon-svg"

import "./menu.css";

export const Menu = () => {
  return (
    <div className="menu">
      {env.platform === "web"
        && <div className="back-button-container">
          <a href={import.meta.env.VITE_LANDING_PAGE_URL}>
            <HomeIcon />
          </a>
        </div>
      }

      <SettingsButton />
    </div>
  )
}