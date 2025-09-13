import * as React from 'react';
import {
    Box,
    Stack,
    Typography,
    Paper,
    Button,
    Chip,
    Tooltip,
    Link as MLink,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useHistory } from 'react-router-dom';
import MyBusinessesEmptyState from './MyBusinessesEmptyState';
import CongratsBusinessModal from '../modals/CongratsBusinessModal';

// ===== Типы данных (как в последнем логе) =====
export type LegalForm = 'SRL' | 'II' | 'GȚ';
export interface BusinessPayload {
    businessName: string;
    idno: string;
    registrationDate: string; // ISO string
    legalForm: LegalForm;
    contact: {
        email: string;
        phone: string;
        postalCode: string;
        region: string;
        address: string;
    };
}

// prettify
const mapLegal: Record<LegalForm, string> = {
    SRL: 'SRL',
    II: 'Întreprindere Individuală',
    'GȚ': 'Gospodărie Țărănească',
};

const fmtDate = (iso: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

function useBusinessesFromStorage(key = 'business') {
    const [items, setItems] = React.useState<BusinessPayload[]>([]);

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            setItems(arr);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            console.warn('Invalid business in storage');
        }
    }, [key]);
    return items;
}
function BusinessCard({
    data,
    onEdit,
    onView,
}: {
    data: BusinessPayload;
    onEdit?: () => void;
    onView?: () => void;
}) {
    const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuEl);

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, position: 'relative', pt: 5 }}>
            {/* Три точки — ВЕРХНИЙ ЛЕВЫЙ УГОЛ */}
            <IconButton
                size="small"
                onClick={(e) => setMenuEl(e.currentTarget)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
                aria-label="more"
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={menuEl}
                open={menuOpen}
                onClose={() => setMenuEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem
                    onClick={() => {
                        setMenuEl(null);
                        onView?.();
                    }}
                >
                    <Typography>View details</Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setMenuEl(null);
                        onEdit?.();
                    }}
                >
                    <Typography>Edit business</Typography>
                </MenuItem>
            </Menu>

            {/* Содержимое карточки */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} px={2.5} py={1.5}>
                <Box>
                    <Typography align="left" variant="h6" sx={{ fontWeight: 700 }}>
                        {data.businessName || '—'}
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        <Typography align="left">
                            <b>IDNO:</b>{' '}
                            <MLink underline="hover" sx={{ fontWeight: 700 }}>
                                {data.idno || '—'}
                            </MLink>
                        </Typography>
                        <Typography align="left">
                            <b>Legal form:</b> {mapLegal[data.legalForm] || data.legalForm || '—'}
                        </Typography>
                        <Typography align="left">
                            <b>Registration date:</b> {fmtDate(data.registrationDate)}
                        </Typography>
                        <Typography align="left">
                            <b>Region:</b> {data.contact?.region || '—'}
                        </Typography>
                        <Typography align="left">
                            <b>Contact email:</b> {data.contact?.email || '—'}
                        </Typography>
                        <Typography align="left">
                            <b>Contact phone:</b> {data.contact?.phone || '—'}
                        </Typography>
                        <MLink href="#" sx={{ color: 'primary.main', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                            <VerifiedRoundedIcon fontSize="small" /> Verified by AIPA
                        </MLink>
                    </Stack>
                </Box>

                <Stack alignItems="flex-end" spacing={1.25} minWidth={160}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Farm <MLink href="#">Level 1</MLink>{' '}
                        <Tooltip title="Level is calculated based on verified data and activity">
                            <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />
                        </Tooltip>
                    </Typography>
                    <Stack direction="column" spacing={1}>
                        <Chip label="Active assets: 0" size="small" variant="outlined" />
                        <Chip label="Balance: 1000 lei" size="small" variant="outlined" />
                    </Stack>
                </Stack>
            </Stack>

            {/* Удалили нижние кнопки Edit/View */}
            {/* <Divider sx={{ my: 2 }} /> ... */}
        </Paper>
    );
}


export function MyBusinesses() {
    const history = useHistory();
    const businesses = useBusinessesFromStorage('business');

    const [showCongrats, setShowCongrats] = React.useState(false);

    React.useEffect(() => {
        if (sessionStorage.getItem('fp:show_welcome_business') === '1') {
            setShowCongrats(true);
            sessionStorage.removeItem('fp:show_welcome_business'); // чтобы не всплывало повторно
        }
    }, []);

    const goRegister = () => history.push('/register'); // при необходимости поменяй путь

    return (
        <Box sx={{ height: 1 }} px={12} py={3}>
            {/* <Box sx={{ maxWidth: 1200, mx: 'auto' }}> */}

            {(!businesses || businesses.length === 0) ? (
                <MyBusinessesEmptyState onRegister={goRegister} />
            ) : (
                <>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>My Businesses</Typography>
                        <Button onClick={goRegister} startIcon={<AddRoundedIcon />} variant="contained" color="success" sx={{ borderRadius: 999, px: 2.5 }}>
                            Register Business
                        </Button>
                    </Stack>
                    <Box display="flex" gap={2.5} flexWrap={'wrap'}>
                        {businesses.map((b, i) => (
                            <BusinessCard
                                key={i}
                                data={b}
                                onView={() => history.push(`/business/${i}`)}     // → http://localhost:5173/business/1
                                onEdit={() => history.push(`/edit-business/${i}`)}
                            />
                        ))}
                    </Box>
                </>
            )}
            {/* Модалка — просто внизу JSX */}
            <CongratsBusinessModal
                action={() => {
                    const lastIndex = businesses.length - 1;
                    history.push(`/business/${lastIndex}/assets/new`);
                    window.location.href = '/business/0/assets/new';
                    setShowCongrats(false);
                }}
                open={showCongrats}
                onClose={() => setShowCongrats(false)}
            />
        </Box>
    );
}
