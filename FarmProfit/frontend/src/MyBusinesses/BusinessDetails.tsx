/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
    Box,
    Stack,
    Typography,
    Paper,
    Chip,
    Button,
    IconButton,
    Link as MLink,
    Menu,
    MenuItem,
    Tabs,
    Tab,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useHistory, useParams } from 'react-router-dom';
import RepresentativesTab from './tabs/RepresentativesTab';
import HumanResourcesTab from './tabs/HumanResourcesTab';
import { useLsCount } from './useLsCounts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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

// мягкое чтение массивов из localStorage
function readArray<T = any>(key: string): T[] {
    try {
        const raw = localStorage.getItem(key);
        const v = raw ? JSON.parse(raw) : [];
        return Array.isArray(v) ? v : [];
    } catch {
        return [];
    }
}

// пробуем найти логотип и превратить его в dataURL (png)
async function tryLoadLogoDataUrl() {
    const candidates = ['/logo.png', '/logo512.png', '/logo.svg'];
    for (const url of candidates) {
        try {
            const dataUrl = await imgToDataUrl(url);
            if (dataUrl) return dataUrl;
        } catch { /* noop */ }
    }
    return null;
}
function imgToDataUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('no ctx'));
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
}


// основной экспорт в PDF
async function exportBusinessPdf(idx: number, business: Business | null, assets: Asset[]) {
    // helpers
    const fmtDate = (v?: string) =>
        v ? new Date(v).toLocaleDateString() : '';
    const n = (v?: number | string) =>
        (v ?? '') === '' ? '' : String(v);

    const hr = readArray<any>(`hr:${idx}`);
    const reps = readArray<any>(`reps:${idx}`);

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // поля страницы
    const LM = 40, RM = 40, TM = 120, BM = 60;
    let cursor = TM;

    // header (логотип, название, служебная инфа)
    try {
        const logo = await tryLoadLogoDataUrl();
        if (logo) doc.addImage(logo, 'PNG', LM, 40, 120, 40);
    } catch { console.warn('Failed to load logo'); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text(business?.businessName || 'Business', LM, 85);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, LM, 102);
    doc.text(`Total Balance: 1000 lei`, LM, 118);
    doc.setTextColor(0);

    // утилита для заголовков/секций
    const sectionTitle = (title: string) => {
        // новая страница если не помещается заголовок + хотя бы одна строка
        if (cursor > pageH - BM - 40) { doc.addPage(); cursor = TM; }
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
        doc.text(title, LM, cursor);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
        cursor += 16;
    };
    const runTable = (cfg: any) => {
        autoTable(doc, {
            startY: cursor + 6,
            margin: { left: LM, right: RM },
            styles: { fontSize: 10, cellPadding: 6 },
            theme: 'grid',
            ...cfg,
        } as any);
        // курсор после таблицы
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cursor = (doc as any).lastAutoTable.finalY + 24;
    };

    // Business details
    sectionTitle('Business Details');
    runTable({
        head: [['Field', 'Value']],
        headStyles: { fillColor: [22, 163, 74], textColor: 255 },
        body: [
            ['IDNO', business?.idno ?? ''],
            ['Legal form', business?.legalForm ?? ''],
            ['Registration date', fmtDate(business?.registrationDate)],
            ['Region', business?.contact?.region ?? ''],
            ['Email', business?.contact?.email ?? ''],
            ['Phone', business?.contact?.phone ?? ''],
            ['Address', business?.contact?.address ?? ''],
            ['Postal code', business?.contact?.postalCode ?? ''],
        ],
    });

    // Assets
    sectionTitle(`Assets (${assets.length})`);
    runTable({
        head: [['Name', 'Type', 'Area (ha)', 'Owned (ha)', 'Leased (ha)', 'In Use (ha)', 'Cadastral']],
        headStyles: { fillColor: [240, 240, 240], textColor: 20 },
        body: assets.length
            ? assets.map(a => [
                a.name ?? '',
                a.type === 'crops' ? 'Crops' : a.type === 'land' ? 'Land' : (a.type ?? ''),
                n(a.areaHa),
                n(a.ownedHa ?? a.areaHa),
                n(a.leasedHa),
                n(a.inUseHa ?? Math.max(0, (a.areaHa ?? 0) - (a.leasedHa ?? 0))),
                a.cadastral ?? '',
            ])
            : [['No assets yet', '', '', '', '', '', '']],
    });

    // Human Resources
    sectionTitle(`Human Resources (${hr.length})`);
    runTable({
        head: [['Full Name', 'Gender', 'Role', 'Employment Type', 'Date Added']],
        headStyles: { fillColor: [240, 240, 240], textColor: 20 },
        body: hr.length
            ? hr.map((p: any) => [
                p.fullName ?? p.name ?? '',
                p.gender ?? '',
                p.role ?? '',
                p.employmentType ?? p.type ?? '',
                fmtDate(p.dateAdded ?? p.date),
            ])
            : [['No human resources yet', '', '', '', '']],
    });

    // Representatives
    sectionTitle(`Representatives (${reps.length})`);
    runTable({
        head: [['Email', 'Invitation Status', 'Invitation Date']],
        headStyles: { fillColor: [240, 240, 240], textColor: 20 },
        body: reps.length
            ? reps.map((r: any) => [
                r.email ?? '',
                r.status ?? r.invitationStatus ?? '',
                fmtDate(r.date ?? r.invitationDate),
            ])
            : [['No representatives yet', '', '']],
    });

    // footer with page numbers
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFontSize(9); doc.setTextColor(120);
        doc.text(`FarmProfit — ${new Date().toLocaleDateString()} — Page ${i}/${total}`,
            pageW - RM, pageH - 24, { align: 'right' });
    }
    doc.save(`FarmProfit_Business_${idx}.pdf`);
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

    const onExport = async (fmt: 'csv' | 'json' | 'geojson' | 'pdf') => {
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
            return;
        }
        if (fmt === 'pdf') {
            await exportBusinessPdf(idx, business, assets);   // ← новый
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
                        <MenuItem onClick={() => onExport('pdf')}>PDF</MenuItem> {/* ← новый */}
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
