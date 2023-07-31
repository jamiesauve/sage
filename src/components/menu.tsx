import { useState } from "react";

import { env } from "../helpers/environment-variables"
import { IconButton } from "./ui/icon-button";
import { SettingsMenu } from "./settings-menu";

import "./menu.css";

export const Menu = () => {
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState<boolean>(false);

  return (
    <div className="menu">
      <div className="menu-button-container">
        {env.platform === "web"
          && <IconButton
            iconName="home"
            onClick={() => window.location.href = import.meta.env.VITE_LANDING_PAGE_URL}
            role="link"
          />
        }

        <IconButton
          iconName="settings"
          onClick={() => setIsSettingsMenuVisible(true)}
        />
      </div>
      

      {isSettingsMenuVisible && <SettingsMenu handleClose={ () => setIsSettingsMenuVisible(false) }/>}
      </div>
  )
}