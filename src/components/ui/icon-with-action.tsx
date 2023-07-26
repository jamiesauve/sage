import { HomeIcon } from "../svg/home-icon-svg"
import { SettingsIcon } from "../svg/settings-icon-svg";

import "./icon-with-action.css";

const icons = {
  home: HomeIcon,
  settings: SettingsIcon
}

type IconName = keyof typeof icons;

interface IconButtonProps {
  iconName: IconName,
  onClick: (e: any) => void
}

export const IconButton = ({ iconName, onClick }: IconButtonProps) => {
  const IconComponent = icons[iconName];

  return (
    <button 
      className="icon-with-action-container icon-with-action--button" 
      onClick={onClick}
    >
     <IconComponent />
  </button>
    )
}

interface IconLinkProps {
  href: string
  iconName: IconName,
}

export const IconLink = ({ href, iconName }: IconLinkProps) => {
  const IconComponent = icons[iconName];

  return (
    <div className="icon-with-action-container icon-with-action--link-container ">
      <a href={href}>
        <IconComponent />
      </a>
    </div>
  );
}