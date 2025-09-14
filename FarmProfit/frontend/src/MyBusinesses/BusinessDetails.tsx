/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Link as MLink,
    Menu,
    MenuItem,
    Tabs,
    Tab,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useHistory, useParams } from 'react-router-dom';
import RepresentativesTab from './tabs/RepresentativesTab';
import HumanResourcesTab from './tabs/HumanResourcesTab';
import { useLsCount } from './useLsCounts';

// --------- Types (синхронно с твоими) ----------
export type Business = {
    businessName: string;
    idno: string;
    registrationDate: string;
    legalForm: string;
    contact: { email: string; phone: string; region: string; address: string; postalCode: string };
};

export type Asset = {
    id: string | number;
    type: 'crops' | 'land' | string;
    name: string;
    areaHa?: number;          // farmland (total)
    ownedHa?: number;         // дробим при показе (по умолчанию = areaHa)
    leasedHa?: number;        // опционально
    inUseHa?: number;         // опционально
    cadastral?: string;
    farmlandArea?: string;    // label (leased/owned/…)
    geometry?: any;
};

// ---------- helpers ----------
function useBusiness(index: number) {
    const raw = localStorage.getItem('business');
    if (!raw) return null;
    try {
        const arr = JSON.parse(raw) as Business[];
        return arr[index] || null;
    } catch {
        return null;
    }
}



function useAssets(index: number) {
    const key = `assets:${index}`;
    const [data, setData] = React.useState<Asset[]>([]);

    const load = React.useCallback(() => {
        try {
            const raw = localStorage.getItem(key);
            setData(raw ? (JSON.parse(raw) as Asset[]) : []);
        } catch {
            setData([]);
        }
    }, [key]);

    React.useEffect(() => {
        load();
        const onAny = () => load();
        window.addEventListener('storage', onAny);
        window.addEventListener('fp:assets-updated', onAny as EventListener); // ← если дергаете сами
        return () => {
            window.removeEventListener('storage', onAny);
            window.removeEventListener('fp:assets-updated', onAny as EventListener);
        };
    }, [load]);

    return data;
}


function download(filename: string, data: string, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function toCSV(rows: Record<string, any>[]) {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const esc = (v: any) =>
        String(v ?? '')
            .replace(/"/g, '""')
            .replace(/\r?\n/g, ' ');
    const head = headers.map((h) => `"${esc(h)}"`).join(',');
    const body = rows.map((r) => headers.map((h) => `"${esc(r[h])}"`).join(',')).join('\n');
    return `${head}\n${body}`;
}

// ---------- Small cards ----------
function AssetCard({ a }: { a: Asset }) {
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchor);

    const owned = a.ownedHa ?? a.areaHa ?? 0;
    const leased = a.leasedHa ?? 0;
    const inUse = a.inUseHa ?? Math.max(0, (a.areaHa ?? 0) - leased); // примерная логика

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
            <IconButton
                size="small"
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchor}
                open={open}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={() => setAnchor(null)}>Open</MenuItem>
                <MenuItem onClick={() => setAnchor(null)} sx={{ color: 'error.main' }}>
                    Remove
                </MenuItem>
            </Menu>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                {a.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Asset Type: {a.type === 'crops' ? 'Crops' : a.type === 'land' ? 'Land' : a.type}
            </Typography>

            {a.areaHa != null && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Farmland Area: {a.areaHa} ha
                </Typography>
            )}
            {a.farmlandArea && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Area label: {a.farmlandArea}
                </Typography>
            )}
            {a.cadastral && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Cadastral Number: {a.cadastral}
                </Typography>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                <Chip size="small" label={`Owned: ${owned} ha`} />
                <Chip size="small" label={`Leased: ${leased} ha`} />
                <Chip size="small" label={`In Use: ${inUse} ha`} />
            </Stack>
        </Paper>
    );
}

// ---------- Page ----------
export default function BusinessDetails() {
    const { index } = useParams<{ index: string }>();
    const idx = Number(index || 0);
    const history = useHistory();

    const hrCount = useLsCount(`hr:${idx}`, ['fp:hr-updated']);
    const repsCount = useLsCount(`reps:${idx}`, ['fp:reps-updated']);

    const business = useBusiness(idx);
    const assets = useAssets(idx);

    // tabs: 0 - Assets, 1 - HR, 2 - Representatives
    const [tab, setTab] = React.useState(0);

    // Export menu
    const [expEl, setExpEl] = React.useState<null | HTMLElement>(null);
    const expOpen = Boolean(expEl);

    const onExport = (fmt: 'csv' | 'json' | 'geojson') => {
        setExpEl(null);
        if (fmt === 'json') {
            download(`business-${idx}-assets.json`, JSON.stringify(assets, null, 2), 'application/json');
            return;
        }
        if (fmt === 'csv') {
            const rows = assets.map((a) => ({
                id: a.id,
                name: a.name,
                type: a.type,
                areaHa: a.areaHa ?? '',
                ownedHa: a.ownedHa ?? '',
                leasedHa: a.leasedHa ?? '',
                inUseHa: a.inUseHa ?? '',
                cadastral: a.cadastral ?? '',
            }));
            download(`business-${idx}-assets.csv`, toCSV(rows), 'text/csv;charset=utf-8');
            return;
        }
        if (fmt === 'geojson') {
            const features = assets
                .filter((a) => a.geometry)
                .map((a) => ({
                    type: 'Feature',
                    geometry: a.geometry?.geometry ?? a.geometry ?? null,
                    properties: { id: a.id, name: a.name, type: a.type, areaHa: a.areaHa },
                }));
            const fc = { type: 'FeatureCollection', features };
            download(`business-${idx}-assets.geojson`, JSON.stringify(fc, null, 2), 'application/geo+json');
        }
    };

    return (
        <Box sx={{ px: 6, py: 3 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {business?.businessName || 'Business'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total Balance: 1000 lei · <MLink href="/partners" underline="hover">Explore Partners →</MLink>
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Export as */}
                    <Button
                        variant="outlined"
                        color="success"
                        endIcon={<ArrowDropDownIcon />}
                        startIcon={<CloudUploadOutlinedIcon />}
                        onClick={(e) => setExpEl(e.currentTarget)}
                        sx={{ borderRadius: 999, px: 2 }}
                    >
                        Export as
                    </Button>
                    <Menu
                        anchorEl={expEl}
                        open={expOpen}
                        onClose={() => setExpEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={() => onExport('csv')}>CSV</MenuItem>
                        <MenuItem onClick={() => onExport('json')}>JSON</MenuItem>
                        <MenuItem onClick={() => onExport('geojson')}>GeoJSON</MenuItem>
                    </Menu>


                </Stack>
            </Stack>

            {/* Tabs */}
            <Box sx={{ p: 2, mb: 2 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, mr: 2 },
                    }}
                >
                    <Tab label={`Assets (${assets.length})`} />
                    <Tab label={`Human Resources (${hrCount})`} />
                    <Tab label={`Representatives (${repsCount})`} />
                </Tabs>
            </Box>

            {/* Content by tab */}
            {tab === 0 && (
                <>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => history.push(`/business/${idx}/assets/new`)}
                        sx={{ borderRadius: 999, px: 2.5, mb: 2 }}
                    >
                        Create Asset
                    </Button>
                    {assets.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                                No assets yet. Create your first one to start earning credits.
                            </Typography>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => history.push(`/business/${idx}/assets/new`)}
                            >
                                Create Asset
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 2,
                            }}
                        >
                            {assets.map((a) => (
                                <AssetCard key={a.id} a={a} />
                            ))}
                        </Box>
                    )}
                </>
            )}

            {tab === 1 && (
                <HumanResourcesTab businessIndex={idx} />
            )}

            {tab === 2 && (
                // <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                //     <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                //         Representatives (0)
                //     </Typography>
                //     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                //         Invite and manage company representatives here.
                //     </Typography>
                // </Paper>
                <RepresentativesTab businessIndex={idx} />
            )}

        </Box>
    );
}
