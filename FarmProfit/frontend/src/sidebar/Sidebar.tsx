import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Divider,
    Typography,
} from '@mui/material';
import { Home } from '../icons/Home';
import { Dashboard } from '../icons/Dashboard';
import { Settings } from '../icons/Settings';

const drawerWidth = 240;

export type SidebarItem = {
    label: string;
    to: string;
    icon: (color: string) => React.ReactNode;
    match?: (pathname: string) => boolean; // кастомная логика активного пункта
};

const NAV_ITEMS: SidebarItem[] = [
    {
        label: 'My Businesses',
        to: '/my-businesses',
        icon: (color) => <Home color={color} />,
        match: (p) => p === '/my-businesses' || p.startsWith('/my-businesses/'),
    },
    {
        label: 'Dashboard',
        to: '/dashboard',
        icon: (color) => <Dashboard color={color} />,
        match: (p) => p.startsWith('/dashboard'),
    },
    {
        label: 'Settings',
        to: '/settings',
        icon: (color) => <Settings color={color} />,
        match: (p) => p.startsWith('/settings'),
    },
];

function NavIconBox({ active, children }: { active?: boolean; children: React.ReactNode }) {
    return (
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: active ? 'success.main' : 'text.secondary',
                backgroundColor: 'transparent',
            }}
        >
            {children}
        </Box>
    );
}

export default function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px solid #eee',
                },
            }}
        >
            {/* Отступ под AppBar */}
            <Toolbar />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* <Box sx={{ px: 2, py: 1 }}> */}
                {/* <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}> */}
                {/* можно вывести путь/хлебные крошки тут при желании */}
                {/* </Typography> */}
                {/* </Box> */}
                {/* <Divider /> */}

                <List sx={{ pt: 2 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.match ? item.match(pathname) : pathname === item.to;
                        return (
                            <ListItemButton
                                key={item.to}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                component={Link as any}
                                to={item.to}
                                selected={isActive}
                                sx={{
                                    mx: 1.5,
                                    my: 0.5,
                                    borderRadius: 1,
                                    px: 1.25,
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(22,163,74,0.12)', // светло‑зелёный, как на макете
                                    },
                                    '&.Mui-selected .MuiListItemText-primary': {
                                        color: 'success.main',
                                        fontWeight: 600,
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 44, backgroundColor: 'transparent' }}>
                                    <NavIconBox active={isActive}>{item.icon('currentColor')}</NavIconBox>
                                </ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 15 }} />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Box sx={{ flexGrow: 1 }} />
                <Divider />

                {/* Нижний копирайт */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        Copyright © 2025 <b>FarmProfit</b>
                        <br />
                        All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
}
