// src/layout/Layout.tsx
import * as React from 'react';
import {
    Toolbar, Drawer, Box
} from '@mui/material';
import { Header } from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import { BootstrapGate } from '../BootstrapGate';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <BootstrapGate />
            <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                {/* Header */}
                <Header />

                {/* Sidebar */}
                <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                        }}
                    >
                        {/* компенсируем высоту AppBar */}
                        <Toolbar />
                        {/* <Divider /> */}
                        <Sidebar />

                    </Drawer>

                    {/* Контент страниц */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            maxWidth: `calc(100vw - ${drawerWidth}px)`,
                            // ml: `${-319}px`,       // отступ под сайдбар
                            mt: '73px',                   // высота AppBar (desktop)
                            height: 'calc(100vh - 64px)', // чтобы карта тянулась на всю высоту
                            overflow: 'hidden',
                            // p: 2,
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box >
        </>
    );
}
