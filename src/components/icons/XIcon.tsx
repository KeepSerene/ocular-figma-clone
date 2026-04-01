import * as React from "react";

const XIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <path d="M2.24805 3L9.34375 13.1406L2.62109 21H5.26172L10.5254 14.8301L14.8418 21H21.752L14.3301 10.375L20.6211 3H18.0215L13.1523 8.6875L9.17969 3H2.24805ZM6.08789 5H8.13672L17.9141 19H15.8828L6.08789 5Z" />
      </svg>
    );
  },
);

XIcon.displayName = "XIcon";

export default XIcon;
