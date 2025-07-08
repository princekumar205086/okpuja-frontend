"use client";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";
import { useThemeStore } from "@/app/stores/themeStore";

export default function AppBar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setMobileMenuOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuOpen(false);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    router.push("/login");
  };

  const handleProfileNavigation = () => {
    handleMenuClose();
    const userRole = user?.role?.toLowerCase() || 'user';
    router.push(`/${userRole}/profile`);
  };

  const getAppBarContent = () => {
    const userRole = user?.role?.toLowerCase();
    switch (userRole) {
      case "admin":
        return {
          title: "OKPUJA Admin",
          notificationCount: 4,
          avatarText: "AD",
        };
      case "employee":
        return {
          title: "OKPUJA Employee",
          notificationCount: 2,
          avatarText: "EM",
        };
      case "user":
        return {
          title: "OKPUJA Dashboard",
          notificationCount: 3,
          avatarText: user?.full_name?.charAt(0).toUpperCase() || "ME",
          bookingIcon: true,
        };
      default:
        return {
          title: "OKPUJA",
          notificationCount: 0,
          avatarText: "ME",
        };
    }
  };

  const { title, notificationCount, avatarText, bookingIcon } = getAppBarContent();

  const menuItems = [
    <MenuItem key="profile" onClick={handleProfileNavigation}>
      <ListItemIcon>
        <AccountCircleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </MenuItem>,
    <MenuItem key="logout" onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </MenuItem>
  ];

  // Sample notifications for OKPUJA
  const notifications = [
    { id: 1, text: "New puja booking received", time: "5 min ago" },
    { id: 2, text: "Astrology consultation scheduled", time: "1 hour ago" },
    { id: 3, text: "Payment received for Ganesh Puja", time: "Yesterday" },
    { id: 4, text: "Profile updated successfully", time: "2 days ago" },
  ];

  return (
    <>
      <MuiAppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: mode === 'dark' 
            ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #92400e 100%)" // Dark mode: warmer yellow gradient
            : "linear-gradient(135deg, #fef3c7 0%, #fcd34d 25%, #f59e0b 75%, #f3f4f6 100%)", // Light mode: yellow to off-white
          boxShadow: mode === 'dark'
            ? "0 4px 20px rgba(251, 191, 36, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)"
            : "0 4px 15px rgba(252, 211, 77, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)",
          color: mode === 'dark' ? '#ffffff' : '#1f2937',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2 },
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(!open)}
              sx={{ 
                mr: { xs: 1, sm: 2 },
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: { xs: "1rem", sm: "1.25rem" },
                fontWeight: 'bold',
                textShadow: mode === 'dark' 
                  ? '0 1px 2px rgba(0,0,0,0.3)' 
                  : '0 1px 2px rgba(255,255,255,0.8)',
              }}
            >
              {title}
            </Typography>
            {isMobile && (
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: { xs: "block", sm: "none" },
                  fontSize: "1rem",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 'bold',
                  textShadow: mode === 'dark' 
                    ? '0 1px 2px rgba(0,0,0,0.3)' 
                    : '0 1px 2px rgba(255,255,255,0.8)',
                }}
              >
                {title}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Theme Toggle Button */}
            <IconButton 
              color="inherit" 
              onClick={toggleTheme} 
              sx={{ ml: { xs: 0.5, sm: 1 } }}
              aria-label={mode === 'light' ? "dark mode" : "light mode"}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {/* Notifications */}
            <IconButton 
              color="inherit" 
              sx={{ ml: { xs: 0.5, sm: 1 } }}
              onClick={handleNotificationsOpen}
              aria-label="notifications"
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Booking Calendar (only for users) */}
            {bookingIcon && (
              <IconButton 
                color="inherit" 
                sx={{ ml: { xs: 0.5, sm: 1 } }}
                onClick={() => router.push('/user/bookings')}
                aria-label="my bookings"
              >
                <Badge badgeContent={2} color="error">
                  <CalendarTodayIcon />
                </Badge>
              </IconButton>
            )}

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                ml: { xs: 0.5, sm: 1 },
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              aria-label="user menu"
            >
              <Avatar
                sx={{
                  bgcolor: mode === 'dark' 
                    ? "rgba(0, 0, 0, 0.3)" 
                    : "rgba(255, 255, 255, 0.4)",
                  color: mode === 'dark' ? "#fbbf24" : "#1f2937",
                  border: mode === 'dark' 
                    ? "2px solid rgba(251, 191, 36, 0.5)" 
                    : "2px solid rgba(31, 41, 55, 0.2)",
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  fontWeight: "bold",
                  backdropFilter: "blur(10px)",
                }}
              >
                {avatarText}
              </Avatar>
            </IconButton>
          </Box>

          {/* Desktop Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200,
                mt: 1.5,
                "& .MuiMenuItem-root": {
                  py: 1.5,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {menuItems}
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: { xs: 280, sm: 320 },
                maxHeight: 400,
                mt: 1.5,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
            </Box>
            {notifications.slice(0, notificationCount).map((notification) => (
              <MenuItem key={notification.id} onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1">{notification.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                </Box>
              </MenuItem>
            ))}
            {notificationCount > 0 && (
              <Box sx={{ px: 2, py: 1, borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleNotificationsClose();
                    const userRole = user?.role?.toLowerCase() || 'user';
                    router.push(`/${userRole}/notifications`);
                  }}
                >
                  View all notifications
                </Typography>
              </Box>
            )}
            {notificationCount === 0 && (
              <MenuItem sx={{ py: 2, justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </MuiAppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="bottom"
        open={mobileMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            maxHeight: '85vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2, // Higher than AppBar
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <Typography variant="h6">Menu</Typography>
          <IconButton 
            color="inherit" 
            onClick={handleMenuClose} 
            edge="end"
            sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              margin: "0 auto 12px",
              background: mode === 'dark' 
                ? "linear-gradient(135deg, #fbbf24, #f59e0b)" 
                : "linear-gradient(135deg, #fcd34d, #f59e0b)",
              color: mode === 'dark' ? "#ffffff" : "#1f2937",
              fontSize: "1.5rem",
              fontWeight: "bold",
              border: mode === 'dark' 
                ? "3px solid rgba(251, 191, 36, 0.3)" 
                : "3px solid rgba(31, 41, 55, 0.1)",
            }}
          >
            {avatarText}
          </Avatar>
          <Typography variant="h6" gutterBottom>
            {user?.full_name || "Welcome"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              opacity: 0.7, 
              mb: 2,
              color: mode === 'dark' ? '#b0b0b0' : '#666666'
            }}
          >
            {user?.email || ""}
          </Typography>
        </Box>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={toggleTheme}
              sx={{
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </ListItemIcon>
              <ListItemText primary={mode === 'light' ? "Dark Mode" : "Light Mode"} />
            </ListItemButton>
          </ListItem>
          {notificationCount > 0 && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  handleMenuClose();
                  const userRole = user?.role?.toLowerCase() || 'user';
                  router.push(`/${userRole}/notifications`);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
            </ListItem>
          )}
          {bookingIcon && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  handleMenuClose();
                  router.push('/user/bookings');
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
                  <Badge badgeContent={2} color="error">
                    <CalendarTodayIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="My Bookings" />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleProfileNavigation}
              sx={{
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
