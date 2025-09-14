// src/pages/Settings.tsx

import * as React from 'react';
import {
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    Link as MLink,
    Snackbar,
    Alert,
    Divider,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type ConsentKey = 'aipa' | 'moa' | 'partners' | 'banks' | 'insurers';
type Consents = Record<ConsentKey, boolean>;

const STORAGE_KEY = 'settings:consents';

const DEFAULT_CONSENTS: Consents = {
    aipa: true,
    moa: true,
    partners: true,
    banks: true,
    insurers: true,
};

export default function Settings() {
    const [consents, setConsents] = React.useState<Consents>(DEFAULT_CONSENTS);
    const [saved, setSaved] = React.useState(false);

    // load from storage
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<Consents>;
                setConsents({ ...DEFAULT_CONSENTS, ...parsed });
            }
        } catch {
            /* ignore */
        }
    }, []);

    const toggle = (key: ConsentKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setConsents(s => ({ ...s, [key]: e.target.checked }));

    const onSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consents));
        setSaved(true);
    };

    return (
        <Box sx={{ px: 6, py: 3 }}>
            {/* Header + Save */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Settings
                </Typography>
                <Button
                    onClick={onSave}
                    variant="contained"
                    color="success"
                    sx={{ px: 3, borderRadius: 999 }}
                >
                    Save Changes
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, maxWidth: 980 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Share your data with:
                </Typography>

                {/* Info banner */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#4096F31A',
                        color: '#3666EA',
                        mb: 2.5,
                    }}
                >
                    <InfoOutlinedIcon />
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                        Consent allows data collection to improve services, subsidies, and market access.
                        You retain ownership, and sharing with third parties is anonymized or legally justified.
                    </Typography>
                </Stack>

                {/* AIPA */}
                <FormControlLabel
                    control={<Checkbox disabled checked={true} color="success" onChange={toggle('aipa')} />}
                    label={
                        <Typography sx={{ fontWeight: 600 }}>
                            <MLink href="https://aipa.gov.md/" underline="hover">AIPA</MLink>
                        </Typography>
                    }
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 5, mt: 0.5, mb: 2 }}>
                    Shares the business/farm data needed to verify subsidy eligibility and process payments.
                    Used for official cross-checks; not for marketing. Consent can be withdrawn here, except
                    where a specific program legally requires sharing.
                </Typography>

                {/* Ministry of Agriculture */}
                <FormControlLabel
                    control={<Checkbox disabled checked={true} color="success" onChange={toggle('moa')} />}
                    label={
                        <Typography sx={{ fontWeight: 600 }}>
                            <MLink href="https://maia.gov.md/" underline="hover">Ministry of Agriculture</MLink>
                        </Typography>
                    }
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 5, mt: 0.5, mb: 2 }}>
                    Allows access to required compliance data and anonymized statistics that inform public
                    programs. Personal data is shared only when necessary for inspections or legal reporting.
                    You may withdraw consent here; we will continue only where the law obliges us.
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                {/* Partners */}
                <FormControlLabel
                    control={
                        <Checkbox color="success" checked={consents.partners} onChange={toggle('partners')} />
                    }
                    label={<Typography sx={{ fontWeight: 600 }}>Partners</Typography>}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 5, mt: 0.5, mb: 2 }}>
                    Lets vetted partners (e.g., fuel stations, markets) confirm your business identity and reward
                    balance for QR withdrawals or discounts. No detailed production or financial records are shared
                    without your explicit consent in the partner’s flow. Administrators can change this at any time.
                </Typography>

                {/* Banks */}
                <FormControlLabel
                    control={<Checkbox color="success" checked={consents.banks} onChange={toggle('banks')} />}
                    label={<Typography sx={{ fontWeight: 600 }}>Banks</Typography>}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 5, mt: 0.5, mb: 2 }}>
                    Enables verification of your account and processing of payouts/settlements related to rewards.
                    We share identifiers and transaction totals—never passwords or full farm records. You can revoke
                    access here; statutory anti-fraud/AML checks may still apply.
                </Typography>

                {/* Insurance Companies */}
                <FormControlLabel
                    control={
                        <Checkbox
                            color="success"
                            checked={consents.insurers}
                            onChange={toggle('insurers')}
                        />
                    }
                    label={<Typography sx={{ fontWeight: 600 }}>Insurance Companies</Typography>}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 5, mt: 0.5 }}>
                    Lets licensed insurers verify your identity and farm assets to offer quotes, manage policies,
                    and process claims. We share only what’s necessary (e.g., contact details, farm location,
                    crop/livestock lists, and claim-related evidence); no marketing use or raw production data
                    without your explicit consent. You can withdraw consent here; limited processing may still
                    occur where required by law (e.g., fraud prevention or contract performance).
                </Typography>
            </Paper>

            <Snackbar
                open={saved}
                autoHideDuration={2200}
                onClose={() => setSaved(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" onClose={() => setSaved(false)}>
                    Settings saved
                </Alert>
            </Snackbar>
        </Box>
    );
}
