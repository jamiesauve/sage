import { HomeIcon } from "../svg/home-icon-svg"
import { SettingsIcon } from "../svg/settings-icon-svg";

import "./icon-button.css";

const icons = {
  home: HomeIcon,
  settings: SettingsIcon
}

type IconName = keyof typeof icons;

interface IconButtonProps {
  iconName: IconName,
  onClick: (e: any) => void
  role?: string;
}

export const IconButton = ({ iconName, onClick, role }: IconButtonProps) => {
  const IconComponent = icons[iconName];

  return (
    <button 
      className="icon-button" 
      onClick={onClick}
      role={role}
    >
     <IconComponent />
  </button>
    )
}