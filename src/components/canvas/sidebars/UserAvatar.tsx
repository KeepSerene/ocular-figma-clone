import { memo } from "react";

interface UserAvatarProps {
  isSelf?: boolean;
  color?: string;
  name: string;
  className?: string;
}

const UserAvatar = memo(
  ({ isSelf = false, color, name, className = "" }: UserAvatarProps) => (
    <div
      aria-label={isSelf ? "Your avatar" : `${name}'s avatar`}
      title={isSelf ? "You" : name}
      style={{ backgroundColor: color ? color : "#3b82f6" }}
      className={`flex min-h-6 min-w-6 items-center justify-center rounded-full text-xs text-white ${className}`}
    >
      {name.length >= 1 ? name[0]?.toUpperCase() : "U"}
    </div>
  ),
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
