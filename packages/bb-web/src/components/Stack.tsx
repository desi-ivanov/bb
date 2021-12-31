import React from "react"

export const Stack: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { spacing: number } & { children: React.ReactNode[] }> =
  React.memo(({ children, spacing, ...props }) => {
    return (
      <div {...props} style={{ gap: spacing * 16, display: "flex", flexDirection: "column", ...props.style }}>
        {children}
      </div>
    );
  });
