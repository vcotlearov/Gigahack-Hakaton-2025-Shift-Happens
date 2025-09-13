/* eslint-disable @typescript-eslint/no-explicit-any */
// src/layout/Sidebar.tsx
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Toolbar, Box, Divider, Typography, Paper, Button, Link as MLink
} from '@mui/material';

import { Home } from '../icons/Home';
import { Dashboard } from '../icons/Dashboard';
import { Settings } from '../icons/Settings';

const drawerWidth = 240;

export type SidebarItem = {
    label: string;
    to: string;
    icon: (color: string) => React.ReactNode;
    match?: (pathname: string) => boolean;
};

const NAV_ITEMS: SidebarItem[] = [
    {
        label: 'My Businesses',
        to: '/my-businesses',
        icon: (color) => <Home color={color} />,
        match: (p) => p === '/my-businesses' || p.startsWith('/business/'),
    },
    { label: 'Dashboard', to: '/dashboard', icon: (c) => <Dashboard color={c} />, match: (p) => p.startsWith('/dashboard') },
    { label: 'Settings', to: '/settings', icon: (c) => <Settings color={c} />, match: (p) => p.startsWith('/settings') },
];

type Business = { businessName: string };

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
            }}
        >
            {children}
        </Box>
    );
}

export default function Sidebar() {
    const { pathname } = useLocation();


    // Нормализованное чтение из localStorage
    const readBusinesses = React.useCallback(() => {
        try {
            const raw = localStorage.getItem('business');
            const parsed = raw ? JSON.parse(raw) : [];
            setBusinesses(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
            setBusinesses([]);
        }
    }, []);

    // Первичная загрузка
    React.useEffect(() => {
        readBusinesses();
    }, [readBusinesses]);

    // Подписка на наше кастомное событие + стандартное 'storage' (кросс-вкладки)
    React.useEffect(() => {
        const handler = () => readBusinesses();

        // наше событие — обновляет в этой же вкладке
        window.addEventListener('fp:businesses-updated', handler as EventListener);
        // системное — если меняется из другой вкладки/внутреннего окна
        window.addEventListener('storage', handler);

        return () => {
            window.removeEventListener('fp:businesses-updated', handler as EventListener);
            window.removeEventListener('storage', handler);
        };
    }, [readBusinesses]);

    // Бизнесы из localStorage
    const [businesses, setBusinesses] = React.useState<Business[]>([]);
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('business');
            const parsed = raw ? JSON.parse(raw) : [];
            setBusinesses(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
            setBusinesses([]);
        }
    }, []);

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
            <Toolbar />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <List sx={{ pt: 2 }}>
                    {/* My Businesses — обычный пункт, ведёт на /my-businesses */}
                    <ListItemButton
                        component={Link as any}
                        to={NAV_ITEMS[0].to}
                        selected={NAV_ITEMS[0].match!(pathname)}
                        sx={{
                            mx: 1.5,
                            my: 0.5,
                            borderRadius: 1,
                            px: 1.25,
                            '&.Mui-selected': { backgroundColor: 'rgba(22,163,74,0.12)' },
                            '&.Mui-selected .MuiListItemText-primary': { color: 'success.main', fontWeight: 600 },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <NavIconBox active={NAV_ITEMS[0].match!(pathname)}>{NAV_ITEMS[0].icon('currentColor')}</NavIconBox>
                        </ListItemIcon>
                        <ListItemText primary="My Businesses" primaryTypographyProps={{ fontSize: 15 }} />
                    </ListItemButton>

                    {/* Если есть бизнесы — показываем их ниже без коллапса */}
                    {businesses.length > 0 && (
                        <List component="div" disablePadding>
                            {businesses.map((b, i) => {
                                const to = `/business/${i}`;
                                const active = pathname.startsWith(to);
                                return (
                                    <ListItemButton
                                        key={i}
                                        component={Link as any}
                                        to={to}
                                        selected={active}
                                        sx={{
                                            mx: 1.5,
                                            mb: 0.5,
                                            ml: 5,
                                            borderRadius: 1,
                                            '&.Mui-selected': { backgroundColor: 'rgba(22,163,74,0.08)' },
                                            '& .MuiListItemText-primary': { fontSize: 14 },
                                        }}
                                    >
                                        <ListItemText primary={b?.businessName || `Business ${i + 1}`} />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    )}

                    {/* Остальные разделы */}
                    {NAV_ITEMS.slice(1).map((item) => {
                        const isActive = item.match ? item.match(pathname) : pathname === item.to;
                        return (
                            <ListItemButton
                                key={item.to}
                                component={Link as any}
                                to={item.to}
                                selected={isActive}
                                sx={{
                                    mx: 1.5,
                                    my: 0.5,
                                    borderRadius: 1,
                                    px: 1.25,
                                    '&.Mui-selected': { backgroundColor: 'rgba(22,163,74,0.12)' },
                                    '&.Mui-selected .MuiListItemText-primary': { color: 'success.main', fontWeight: 600 },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 44 }}>
                                    <NavIconBox active={isActive}>{item.icon('currentColor')}</NavIconBox>
                                </ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 15 }} />
                            </ListItemButton>
                        );
                    })}
                </List>

                {/* CTA карточка Explore Partners */}
                <Box sx={{ px: 2, mt: 1.5 }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: (t) => t.palette.grey[100],
                            borderColor: (t) => t.palette.grey[200],
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                            Explore Reward Options
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                            Apply for discounts in our trusted partner stores.
                        </Typography>
                        <Button
                            component={Link as any}
                            to="/partners"
                            variant="outlined"
                            color="success"
                            fullWidth
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            Explore Partners
                        </Button>
                    </Paper>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Divider sx={{ mt: 2 }} />

                {/* Footer */}
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                        <MLink component={Link as any} to="/privacy" underline="none" sx={{ color: 'success.main', mb: 1 }}>
                            Privacy Policy
                        </MLink>
                        <MLink component={Link as any} to="/terms" underline="none" sx={{ color: 'success.main' }}>
                            Terms &amp; Conditions
                        </MLink>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block', mt: 1 }}>
                        Copyright © 2025 <b>FarmProfit</b>
                        <br />
                        All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
}
