import { useState } from "react";

import { env } from "../helpers/environment-variables"
import { IconButton, IconLink } from "./ui/icon-with-action";
import { SettingsMenu } from "./settings-menu";

import "./menu.css";

export const Menu = () => {
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState<boolean>(false);
  
  return (
    <div className="menu">
      {env.platform === "web"
        && <IconLink href={import.meta.env.VITE_LANDING_PAGE_URL} iconName="home" />
      }

      <IconButton
        iconName="settings"
        onClick={() => setIsSettingsMenuVisible(true)}
      />

      {isSettingsMenuVisible && <SettingsMenu handleClose={ () => setIsSettingsMenuVisible(false) }/>}
    </div>
  )
}