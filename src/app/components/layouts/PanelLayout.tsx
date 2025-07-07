'use client'
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material'
import { ReactNode, useState, useEffect } from 'react'
import AppBar from '../AppBar'
import Sidebar from '../Sidebar'
import { useAuthStore } from '@/app/stores/authStore'
import { useThemeStore } from '@/app/stores/themeStore'

export default function PanelLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const { user } = useAuthStore()
    const { mode } = useThemeStore()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    // Close sidebar by default on mobile
    useEffect(() => {
        if (isMobile) {
            setOpen(false)
        }
    }, [isMobile])

    const toggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
            <AppBar open={open} setOpen={setOpen} />
            <Sidebar
                open={open}
                toggleDrawer={toggleDrawer}
                userType={user?.role as 'admin' | 'employee' | 'user'}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    paddingTop: { xs: '64px', sm: '75px' },
                    paddingLeft: { xs: '8px', sm: '16px' },
                    paddingRight: { xs: '8px', sm: '16px', md: '24px' },
                    paddingBottom: { xs: '16px', sm: '24px' },
                    transition: 'margin 0.3s ease, padding 0.3s ease',
                    width: '100%',
                    overflowX: 'hidden',
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
