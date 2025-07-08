'use client'
import React from 'react'
import { 
  Drawer, 
  List, 
  Divider, 
  Box, 
  useMediaQuery, 
  useTheme,
  IconButton,
  Typography,
  Avatar,
  SwipeableDrawer
} from '@mui/material'
import { getSidebarItems } from '@/app/lib/config/sidebar'
import SidebarItem from './SidebarItem'
import { useAuthStore } from '@/app/stores/authStore'
import { useThemeStore } from '@/app/stores/themeStore'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  open: boolean
  toggleDrawer: () => void
  userType?: 'admin' | 'employee' | 'user'
}

export default function Sidebar({ open, toggleDrawer, userType }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const { mode } = useThemeStore()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  const role = (userType || user?.role || 'user').toLowerCase()
  const sidebarItems = getSidebarItems(role as 'admin' | 'employee' | 'user')

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Generate avatar text based on user role or name
  const getAvatarText = () => {
    if (!user) return "ME";
    
    const userRole = user.role?.toLowerCase();
    switch (userRole) {
      case "admin": return "AD";
      case "employee": return "EM";
      default: return user.full_name?.charAt(0).toUpperCase() || "ME";
    }
  };

  // Dark mode styles
  const darkModeStyles = {
    background: mode === 'dark' ? 'rgb(26, 26, 26)' : 'white',
    color: mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'inherit',
    borderRight: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
  };
  
  const headerGradient = mode === 'dark'
    ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)"
    : "linear-gradient(135deg, #fef3c7 0%, #fcd34d 25%, #f59e0b 100%)"; // OKPUJA brand colors - yellow to off-white
  
  const drawerContent = (
    <>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginTop: { xs: 0, sm: '60px' }, // No margin on mobile, margin on desktop
        }}
      >
        {/* Header with user info */}
        <Box
          sx={{
            p: { xs: 2, sm: 2 },
            background: headerGradient,
            color: mode === 'dark' ? 'white' : '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            minHeight: { xs: 70, sm: 64 },
            transition: 'all 0.3s ease',
          }}
        >
          {open ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: mode === 'dark' 
                    ? 'rgba(0, 0, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.7)',
                  color: mode === 'dark' ? '#fbbf24' : '#1f2937',
                  fontWeight: 'bold',
                  mr: 2,
                  border: mode === 'dark' 
                    ? '2px solid rgba(251, 191, 36, 0.3)' 
                    : '2px solid rgba(31, 41, 55, 0.2)',
                }}
              >
                {getAvatarText()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 'bold' }}>
                  {user?.full_name || 'Welcome'}
                </Typography>
                <Typography variant="caption" noWrap sx={{ opacity: 0.8 }}>
                  {user?.email || ''}
                </Typography>
              </Box>
            </Box>
          ) : (
            !isMobile && (
              <Avatar
                sx={{
                  bgcolor: mode === 'dark' 
                    ? 'rgba(0, 0, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.7)',
                  color: mode === 'dark' ? '#fbbf24' : '#1f2937',
                  fontWeight: 'bold',
                  width: 40,
                  height: 40,
                  border: mode === 'dark' 
                    ? '2px solid rgba(251, 191, 36, 0.3)' 
                    : '2px solid rgba(31, 41, 55, 0.2)',
                }}
              >
                {getAvatarText()}
              </Avatar>
            )
          )}
          
          {(open || isMobile) && (
            <IconButton 
              onClick={toggleDrawer} 
              color="inherit"
              sx={{
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'transform 0.2s',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        
        <Divider sx={{ 
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }} />
        
        {/* Main navigation items */}
        <Box 
          sx={{ 
            overflowY: 'auto', 
            flexGrow: 1, 
            py: 1,
            // Custom scrollbar styling - thinner with gradient
            '&::-webkit-scrollbar': {
              width: '2px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark'
                ? 'linear-gradient(to bottom, #fbbf24, #f59e0b)'
                : 'linear-gradient(to bottom, #fcd34d, #f59e0b)',
              borderRadius: '10px',
              '&:hover': {
                background: mode === 'dark'
                  ? 'linear-gradient(to bottom, #f59e0b, #d97706)'
                  : 'linear-gradient(to bottom, #f59e0b, #d97706)',
              }
            },
          }}
        >
          <List>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                open={open}
                onClick={isMobile ? toggleDrawer : undefined}
              />
            ))}
          </List>
        </Box>
        
        {/* Footer with logout */}
        <Box mt="auto">
          <Divider sx={{ 
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
          }} />
          <List sx={{ py: 1 }}>
            <SidebarItem
              item={{
                text: 'Logout',
                icon: <LogoutIcon />,
                path: '#',
                customStyle: {
                  '&:hover': {
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: theme.palette.error.main
                    }
                  }
                }
              }}
              open={open}
              onClick={handleLogout}
            />
          </List>
        </Box>
      </Box>
    </>
  );

  // Use different drawer types based on screen size
  return isMobile ? (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      disableBackdropTransition={isIOS}
      disableDiscovery={isIOS}
      PaperProps={{
        sx: {
          width: '85%',
          maxWidth: 300,
          borderRadius: '0 16px 16px 0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          ...darkModeStyles,
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          },
          transition: 'box-shadow 0.3s ease',
          // Remove iOS specific adjustments that might cause issues
          paddingTop: 0,
          paddingBottom: 0,
          height: '100%',
        }
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2
      }}
    >
      {drawerContent}
    </SwipeableDrawer>
  ) : (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 64,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s ease, box-shadow 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          },
          ...darkModeStyles
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
