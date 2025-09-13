// src/layout/Sidebar.tsx
import * as React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Toolbar, Box, Divider, Typography, Collapse, Paper, Button, Link as MLink
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
    const history = useHistory();

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

    const [openBiz, setOpenBiz] = React.useState(true);

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
                    {/* My Businesses + раскрывашка */}
                    <ListItemButton
                        selected={NAV_ITEMS[0].match!(pathname)}
                        onClick={() => {
                            setOpenBiz((v) => !v);
                            if (!pathname.startsWith('/my-businesses') && !pathname.startsWith('/business/')) {
                                history.push('/my-businesses');
                            }
                        }}
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
                        {openBiz ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={openBiz} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {businesses.map((b, i) => {
                                const to = `/business/${i}`;
                                const active = pathname.startsWith(to);
                                return (
                                    <ListItemButton
                                        key={i}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    </Collapse>

                    {/* Dashboard / Settings */}
                    {NAV_ITEMS.slice(1).map((item) => {
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
                            component={Link}
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

                {/* Footer links + копирайт */}
                <Box sx={{ px: 2, py: 1.5 }}>
                    <MLink
                        component={Link}
                        to="/privacy"
                        underline="none"
                        sx={{ display: 'block', color: 'success.main', fontWeight: 400, mb: 1 }}
                    >
                        Privacy Policy
                    </MLink>
                    <MLink
                        component={Link}
                        to="/terms"
                        underline="none"
                        sx={{ display: 'block', color: 'success.main', fontWeight: 400, mb: 1 }}
                    >
                        Terms &amp; Conditions
                    </MLink>

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
