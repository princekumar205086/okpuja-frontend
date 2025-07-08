"use client";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
  SxProps,
  Theme
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useThemeStore } from "@/app/stores/themeStore";

export interface SidebarItem {
  text: string;
  icon: ReactNode;
  path: string;
  customStyle?: SxProps<Theme>;
}

interface SidebarItemProps {
  item: SidebarItem;
  open: boolean;
  onClick?: () => void;
}

export default function SidebarItem({ item, open, onClick }: SidebarItemProps) {
  const theme = useTheme();
  const { mode } = useThemeStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();

  if (!pathname) {
      return null;
  }

  // Check if current item is active based on path
  const isActive =
    pathname === item.path ||
    (item.path !== "#" && pathname.startsWith(item.path));

  // Common styles for the ListItemButton
  const buttonStyles = {
    minHeight: { xs: 56, sm: 48 },
    borderRadius: "8px",
    mx: { xs: 1, sm: 0.5 },
    px: { xs: 2, sm: open ? 2 : 1 },
    py: { xs: 1, sm: 0.5 },
    transition: "all 0.2s ease",
    color: mode === 'dark' ? 'rgba(255,255,255,0.85)' : undefined,
    "&:hover": {
      background: isActive
        ? mode === 'dark'
          ? "linear-gradient(to right, #fbbf24, #f59e0b)"
          : "linear-gradient(to right, #fcd34d, #f59e0b)"
        : mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      transform: "translateY(-1px)",
      boxShadow: isActive 
        ? mode === 'dark'
          ? "0 4px 8px rgba(251, 191, 36, 0.3)"
          : "0 4px 8px rgba(252, 211, 77, 0.4)"
        : "none",
    },
    ...(isActive && {
      background: mode === 'dark'
        ? "linear-gradient(to right, #fbbf24, #f59e0b)"
        : "linear-gradient(to right, #fcd34d, #f59e0b)",
      color: mode === 'dark' ? "white" : "#1f2937",
      "& .MuiListItemIcon-root": {
        color: mode === 'dark' ? "white" : "#1f2937",
      },
    }),
    "&:active": {
      transform: "translateY(0)",
    },
    ...(item.customStyle || {}),
  };

  // Icon styles with responsive adjustments
  const iconStyles = {
    minWidth: '36px',
    width: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: { xs: 22, sm: 20 },
    transition: 'all 0.2s ease',
    color: isActive 
      ? (mode === 'dark' ? "white" : "#1f2937")
      : mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined,
  };

  // Text styles with responsive adjustments
  const textStyles = {
    opacity: { xs: 1, sm: open ? 1 : 0 },
    display: { xs: "block", sm: open ? "block" : "none" },
    transition: "opacity 0.2s ease",
    "& .MuiTypography-root": {
      fontWeight: isActive ? 500 : 400,
      fontSize: { xs: "0.95rem", sm: "0.875rem" },
      whiteSpace: "nowrap",
      color: isActive 
        ? (mode === 'dark' ? "white" : "#1f2937") 
        : mode === 'dark' ? 'rgba(255,255,255,0.85)' : undefined,
    },
  };

  return (
    <ListItem
      disablePadding
      sx={{
        mb: { xs: 0.5, sm: 0.25 },
        display: "block",
      }}
    >
      <Tooltip
        title={!open && !isMobile ? item.text : ""}
        placement="right"
        arrow
      >
        {item.path === "#" ? (
          <ListItemButton sx={buttonStyles} onClick={onClick}>
            <ListItemIcon sx={iconStyles}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={textStyles}
              disableTypography={false}
            />
          </ListItemButton>
        ) : (
          <ListItemButton
            component={Link}
            href={item.path}
            sx={buttonStyles}
            onClick={onClick}
          >
            <ListItemIcon sx={iconStyles}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={textStyles}
              disableTypography={false}
            />
          </ListItemButton>
        )}
      </Tooltip>
    </ListItem>
  );
}
