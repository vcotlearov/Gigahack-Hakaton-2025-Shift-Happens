/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box, Stack, Typography, Button, Paper, Divider, Chip, Link as MLink
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CongratsAssetModal from '../modals/CongratsAssetModal';

type Business = {
    businessName: string;
    idno: string;
    registrationDate: string;
    legalForm: string;
    contact: { email: string; phone: string; region: string; address: string; postalCode: string };
};

type Asset = {
    id: string | number;
    type: 'crops' | 'land' | string;
    name: string;
    areaHa?: number;          // total area
    cadastral?: string;

    // совместимость: раньше сюда мог попадать ярлык "owned" | "leased" | "mixed"
    farmlandArea?: string;

    // новые необязательные поля (если появятся в будущем)
    ownedHa?: number;
    leasedHa?: number;
    inUseHa?: number;

    geometry?: any;
};

const round = (n: number, d = 4) => Math.round(n * 10 ** d) / 10 ** d;
const num = (v: unknown) => {
    const n = typeof v === 'string' ? parseFloat(v) : (v as number);
    return Number.isFinite(n) ? n : 0;
};
const fmtHa = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 4 });

function computeHectares(a: Asset) {
    const total = Math.max(0, num(a.areaHa));
    let owned = Math.max(0, num((a as any).ownedHa));
    let leased = Math.max(0, num((a as any).leasedHa));
    const inUse = Math.max(0, num((a as any).inUseHa || total));

    // Если явно не задали owned/leased — пробуем вывести из ярлыка
    if (!owned && !leased) {
        const label = String(a.farmlandArea || '').toLowerCase().trim();
        if (label === 'owned') owned = total;
        else if (label === 'leased') leased = total;
        else if (label === 'mixed') {
            owned = total / 2;
            leased = total - owned;
        }
    }

    // Если задано только одно значение — второе = остаток
    if (owned && !leased) leased = Math.max(0, total - owned);
    if (leased && !owned) owned = Math.max(0, total - leased);

    // Нормализация: не больше total
    const sum = owned + leased;
    if (sum > total && sum > 0) {
        const k = total / sum;
        owned *= k;
        leased *= k;
    }

    // Итоги (округлим для стабильного UI)
    return {
        owned: round(owned),
        leased: round(leased),
        inUse: round(inUse || total),
    };
}


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
    try {
        const raw = localStorage.getItem(`assets:${index}`);
        return raw ? (JSON.parse(raw) as Asset[]) : [];
    } catch {
        return [];
    }
}

export default function BusinessDetails() {
    const { index } = useParams<{ index: string }>();
    const idx = Number(index || 0);
    const history = useHistory();

    const business = useBusiness(idx);
    const assets = useAssets(idx);
    const [showAssetCongrats, setShowAssetCongrats] = useState(false);

    // когда вернулись после создания
    useEffect(() => {
        if (sessionStorage.getItem('fp:show_welcome_asset') === '1') {
            sessionStorage.removeItem('fp:show_welcome_asset');
            // покажем только если это реально первый ассет
            if (assets.length === 1) setShowAssetCongrats(true);
        }
    }, [assets.length]);
    return (
        <Box sx={{ px: 6, py: 3 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {business?.businessName || 'Business'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total Balance: 1000 lei · <MLink href="#" underline="hover">Explore Partners →</MLink>
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="success">Invite Representative</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => history.push(`/business/${idx}/assets/new`)}
                    >
                        + Create Asset
                    </Button>
                </Stack>
            </Stack>

            {/* Assets block */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Assets ({assets.length})</Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

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
                    <Stack spacing={2}>
                        {assets.map((a) => {
                            const { owned, leased, inUse } = computeHectares(a);

                            return (
                                <Paper key={a.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                                        <Box display='flex' flexDirection="column" gap={1}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{a.name}</Typography>
                                            <Typography variant="body2">
                                                <b>Asset Type:</b> {a.type === 'crops' ? 'Crops' : a.type}
                                            </Typography>

                                            {a.areaHa != null && (
                                                <Typography variant="body2">
                                                    <b>Farmland Area:</b> {fmtHa(num(a.areaHa))} ha
                                                </Typography>
                                            )}

                                            {!!a.farmlandArea && (
                                                <Typography variant="body2"><b>Area label:</b> {a.farmlandArea}</Typography>
                                            )}

                                            {!!a.cadastral && (
                                                <Typography variant="body2"><b>Cadastral Number:</b> {a.cadastral}</Typography>
                                            )}

                                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                                <Chip size="small" label={`Owned: ${fmtHa(owned)} ha`} />
                                                <Chip size="small" label={`Leased: ${fmtHa(leased)} ha`} />
                                                <Chip size="small" label={`In Use: ${fmtHa(inUse)} ha`} />
                                            </Stack>
                                        </Box>

                                        <Stack alignItems="flex-end" spacing={1}>
                                            <Button size="medium" variant="outlined">   Open   </Button>
                                            <Button size="medium" variant="text" color="error">Remove</Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            );
                        })}

                    </Stack>
                )}
            </Paper>

            {/* HR block (заглушка под макет) */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Human Resources (0)</Typography>
                <Box sx={{ borderRadius: 1, p: 2, border: '1px dashed #ddd', color: 'text.secondary' }}>
                    Sharing HR data could unlock access to training programs or subsidies for seasonal workers.
                </Box>
            </Paper>
            <CongratsAssetModal
                open={showAssetCongrats}
                onClose={() => setShowAssetCongrats(false)}
                onExplore={() => {
                    setShowAssetCongrats(false);
                    // Если у тебя уже есть страница партнёров:
                    history.push('/partners');
                    // Если нет, можешь временно вести на /my-businesses или оставить onClose
                }}
            />
        </Box>
    );
}
