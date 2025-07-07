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
  
  const role = userType || user?.role || 'user'
  const sidebarItems = getSidebarItems(role as 'admin' | 'employee' | 'user')

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  // Generate avatar text based on user role or name
  const getAvatarText = () => {
    if (!user) return "ME";
    
    switch (user.role) {
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
  
  const headerGradient = "linear-gradient(to right, #ff6b35, #f7931e)"; // OKPUJA brand colors
  
  const drawerContent = (
    <>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginTop: '60px',
        }}
      >
        {/* Header with user info */}
        <Box
          sx={{
            p: 2,
            background: headerGradient,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            minHeight: 64,
            transition: 'all 0.3s ease'
          }}
        >
          {open ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  mr: 2
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
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  width: 40,
                  height: 40
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
              background: headerGradient,
              borderRadius: '10px',
              '&:hover': {
                background: 'linear-gradient(to bottom, #e85a2b, #df7f1c)',
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
          width: '80%',
          maxWidth: 280,
          borderRadius: '0 12px 12px 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          ...darkModeStyles,
          '&:hover': {
            boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
          },
          transition: 'box-shadow 0.3s ease',
          // Fix iOS safe area issues
          paddingTop: isIOS ? 'env(safe-area-inset-top)' : 0,
          paddingBottom: isIOS ? 'env(safe-area-inset-bottom)' : 0,
          height: isIOS ? 'calc(100% - env(safe-area-inset-top) - env(safe-area-inset-bottom))' : '100%',
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
