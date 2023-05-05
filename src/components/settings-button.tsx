import { useState } from "react";
import { SettingsIcon } from "./svg/settings.icon-svg";

import "./settings-button.css";

export const SettingsButton = () => {
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState<boolean>(false);
  
  return (
    <>
    <button className="settings-button" onClick={() => setIsSettingsMenuVisible(true)}>
      <SettingsIcon />
    </button>

    </>
  )
}