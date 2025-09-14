/* eslint-disable @typescript-eslint/no-explicit-any */
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
        icon: (c) => <Home color={c} />,
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
                width: 36, height: 36, borderRadius: 2, display: 'grid', placeItems: 'center',
                color: active ? 'success.main' : 'text.secondary',
            }}
        >
            {children}
        </Box>
    );
}

export default function Sidebar() {
    const { pathname } = useLocation();

    // 1) Состояние + чтение из LS
    const [businesses, setBusinesses] = React.useState<Business[]>([]);

    const readBusinesses = React.useCallback(() => {
        try {
            const raw = localStorage.getItem('business');
            const parsed = raw ? JSON.parse(raw) : [];
            setBusinesses(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
            setBusinesses([]);
        }
    }, []);

    // 2) Первичная загрузка и подписки
    React.useEffect(() => {
        readBusinesses();
        const handler = () => readBusinesses();
        window.addEventListener('fp:businesses-updated', handler as EventListener);
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('fp:businesses-updated', handler as EventListener);
            window.removeEventListener('storage', handler);
        };
    }, [readBusinesses]);

    // 3) Достаём нужные айтемы по ключам — порядок задаём здесь
    const myBizItem = NAV_ITEMS.find(i => i.to === '/my-businesses')!;
    const dashItem = NAV_ITEMS.find(i => i.to === '/dashboard')!;
    const setItem = NAV_ITEMS.find(i => i.to === '/settings')!;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth, flexShrink: 0,
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #eee' },
            }}
        >
            <Toolbar />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <List sx={{ pt: 2 }}>
                    {/* --- 1) DASHBOARD --- */}
                    <ListItemButton
                        component={Link as any}
                        to={dashItem.to}
                        selected={dashItem.match ? dashItem.match(pathname) : pathname === dashItem.to}
                        sx={{
                            mx: 1.5, my: 0.5, borderRadius: 1, px: 1.25,
                            '&.Mui-selected': { backgroundColor: 'rgba(22,163,74,0.12)' },
                            '&.Mui-selected .MuiListItemText-primary': { color: 'success.main', fontWeight: 600 },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <NavIconBox active={dashItem.match ? dashItem.match(pathname) : pathname === dashItem.to}>
                                {dashItem.icon('currentColor')}
                            </NavIconBox>
                        </ListItemIcon>
                        <ListItemText primary={dashItem.label} primaryTypographyProps={{ fontSize: 15 }} />
                    </ListItemButton>

                    {/* --- 2) MY BUSINESSES --- */}
                    <ListItemButton
                        component={Link as any}
                        to={myBizItem.to}
                        selected={myBizItem.match ? myBizItem.match(pathname) : pathname === myBizItem.to}
                        sx={{
                            mx: 1.5, my: 0.5, borderRadius: 1, px: 1.25,
                            '&.Mui-selected': { backgroundColor: 'rgba(22,163,74,0.12)' },
                            '&.Mui-selected .MuiListItemText-primary': { color: 'success.main', fontWeight: 600 },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <NavIconBox active={myBizItem.match ? myBizItem.match(pathname) : pathname === myBizItem.to}>
                                {myBizItem.icon('currentColor')}
                            </NavIconBox>
                        </ListItemIcon>
                        <ListItemText primary={myBizItem.label} primaryTypographyProps={{ fontSize: 15 }} />
                    </ListItemButton>

                    {/* список бизнесов без коллапса */}
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
                                            mx: 1.5, mb: .5, ml: 5, borderRadius: 1,
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

                    {/* --- 3) SETTINGS --- */}
                    <ListItemButton
                        component={Link as any}
                        to={setItem.to}
                        selected={setItem.match ? setItem.match(pathname) : pathname === setItem.to}
                        sx={{
                            mx: 1.5, my: 0.5, borderRadius: 1, px: 1.25,
                            '&.Mui-selected': { backgroundColor: 'rgba(22,163,74,0.12)' },
                            '&.Mui-selected .MuiListItemText-primary': { color: 'success.main', fontWeight: 600 },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <NavIconBox active={setItem.match ? setItem.match(pathname) : pathname === setItem.to}>
                                {setItem.icon('currentColor')}
                            </NavIconBox>
                        </ListItemIcon>
                        <ListItemText primary={setItem.label} primaryTypographyProps={{ fontSize: 15 }} />
                    </ListItemButton>
                </List>

                {/* CTA карточка */}
                <Box sx={{ px: 2, mt: 1.5 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: (t) => t.palette.grey[100], borderColor: (t) => t.palette.grey[200] }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Explore Reward Options</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                            Apply for discounts in our trusted partner stores.
                        </Typography>
                        <Button component={Link as any} to="/partners" variant="outlined" color="success" fullWidth sx={{ borderRadius: 2, fontWeight: 600 }}>
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
