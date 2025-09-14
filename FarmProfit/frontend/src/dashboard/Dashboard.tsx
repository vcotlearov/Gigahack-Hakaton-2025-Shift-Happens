// src/dashboard/Dashboard.tsx
import * as React from 'react';
import {
    Box, Stack, Typography, Paper, Divider, Link as MLink,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Chip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NorthEastIcon from '@mui/icons-material/NorthEast';

type RegionStat = {
    region: string;
    businesses: number;
    subsidies: number;
    discountsMdl: number;
};

const MY_STATS = {
    businesses: 2,
    subsidies: 40,
    discountsMdl: 7356,
};

const MD_STATS = {
    businesses: 64,
    subsidies: 80,
    discountsMdl: 12451,
};

const REGIONS: RegionStat[] = [
    { region: 'Căușeni', businesses: 6, subsidies: 8, discountsMdl: 634 },
    { region: 'Ștefan Vodă', businesses: 2, subsidies: 4, discountsMdl: 202 },
    { region: 'Edineț', businesses: 10, subsidies: 2, discountsMdl: 2694 },
    { region: 'Cahul', businesses: 2, subsidies: 1, discountsMdl: 1001 },
    { region: 'Găgăuzia', businesses: 1, subsidies: 1, discountsMdl: 128 },
];

function StatGroup({
    title,
    items,
}: {
    title: string;
    items: { value: React.ReactNode; label: string; sublabel?: string }[];
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                {title}
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} divider={
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            } spacing={2}>
                {items.map((it, i) => (
                    <Box key={i} sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 4, alignSelf: 'stretch', borderRadius: 2,
                                bgcolor: i === 0 ? 'warning.main'
                                    : i === 1 ? 'secondary.main'
                                        : 'success.main',
                                opacity: 0.9,
                            }}
                        />
                        <Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                                {it.value}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{it.label}</Typography>
                            {it.sublabel && (
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {it.sublabel}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}

function numberMDL(n: number) {
    return `${n.toLocaleString('en-US')} MDL`;
}

export default function Dashboard() {
    return (
        <Box sx={{ px: 6, py: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Dashboard
            </Typography>

            {/* Info banner */}
            <Paper
                variant="outlined"
                sx={{
                    p: 1.5,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: (t) => t.palette.grey[100],
                    borderColor: (t) => t.palette.grey[300],
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <InfoOutlinedIcon sx={{ fontSize: 20, color: 'primary.main', mt: '2px' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Trusted, aggregated data builds credibility with EU partners, helping unlock subsidies, programs,
                        and investment for local farms. That is why your data matters—every field you complete impacts the
                        reality of farming in your region and across Moldova.
                    </Typography>
                </Stack>
            </Paper>

            {/* My stats */}
            <StatGroup
                title="My Statistics"
                items={[
                    { value: MY_STATS.businesses, label: 'business(es) registered in FarmProfit' },
                    { value: MY_STATS.subsidies, label: 'subsidy(ies) issued through FarmProfit' },
                    { value: numberMDL(MY_STATS.discountsMdl), label: 'discounted through FarmProfit' },
                ]}
            />

            <Box sx={{ height: 16 }} />

            {/* Moldova overall */}
            <StatGroup
                title="Overall by Moldova"
                items={[
                    { value: MD_STATS.businesses, label: 'business(es) registered in FarmProfit' },
                    { value: MD_STATS.subsidies, label: 'subsidy(ies) issued through FarmProfit' },
                    { value: numberMDL(MD_STATS.discountsMdl), label: 'discounted through FarmProfit' },
                ]}
            />

            <Box sx={{ height: 16 }} />

            {/* Regions table */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Overall by Region
                </Typography>

                <Table size="small" sx={{ '& td, & th': { py: 1.25 } }}>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: (t) => t.palette.grey[100] } }}>
                            <TableCell sx={{ width: '40%' }}>Region</TableCell>
                            <TableCell>Businesses Count</TableCell>
                            <TableCell>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <span>Subsidies Count</span>
                                    <NorthEastIcon fontSize="inherit" sx={{ opacity: 0.6 }} />
                                </Stack>
                            </TableCell>
                            <TableCell>Total Discounts</TableCell>
                            <TableCell align="right" sx={{ width: 56 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {REGIONS.map((r) => (
                            <TableRow key={r.region} hover>
                                <TableCell>{r.region}</TableCell>
                                <TableCell>{r.businesses}</TableCell>
                                <TableCell>
                                    {r.subsidies}{' '}
                                    <Chip size="small" label="↑" sx={{ ml: 0.5, height: 18, fontSize: 11 }} />
                                </TableCell>
                                <TableCell>{numberMDL(r.discountsMdl)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="More">
                                        <IconButton size="small">
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Stack alignItems="center" sx={{ pt: 1.5 }}>
                    <MLink href="#" underline="hover" color="success.main" sx={{ fontWeight: 600 }}>
                        View Details
                    </MLink>
                </Stack>
            </Paper>
        </Box>
    );
}
