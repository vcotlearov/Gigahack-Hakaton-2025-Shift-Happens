
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
    Box, Stack, Typography, Paper, TextField, Button, Breadcrumbs, Link,
    FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useHistory, useParams } from 'react-router-dom';
import { useApi } from '../lib/api';

// ---------- ТИПЫ ДАННЫХ (payload «на бэк»)
type LegalForm = 'SRL' | 'II' | 'GȚ' | '';
export interface BusinessPayload {
    businessName: string;
    idno: string;
    registrationDate: string; // ISO date
    legalForm: Exclude<LegalForm, ''>;
    contact: {
        email: string;
        phone: string;
        postalCode: string;
        region: string;
        address: string;
    };
}

// ---------- СТЕЙТ ФОРМЫ (как у тебя)

export const Register = () => {
    const { fetchApi } = useApi();
    const history = useHistory();
    const { index } = useParams<{ index?: string }>();

    const isEdit = typeof index === 'string'; // <-- режим редактирования

    const [values, setValues] = React.useState({
        businessName: '',
        idno: '',
        regDate: '',          // HTML date (YYYY-MM-DD)
        legalForm: '' as LegalForm,
        email: 'admin@farmprofit.com',
        phone: '+373 68 42 30 07',
        postalCode: '',
        region: '',
        address: '',
    });

    // Prefill if editing
    React.useEffect(() => {
        if (typeof index === 'string') {
            const raw = localStorage.getItem('business');
            if (raw) {
                try {
                    const arr = JSON.parse(raw);
                    if (Array.isArray(arr) && arr[Number(index)]) {
                        const b = arr[Number(index)];
                        setValues({
                            businessName: b.businessName || '',
                            idno: b.idno || '',
                            regDate: b.registrationDate ? b.registrationDate.slice(0, 10) : '',
                            legalForm: b.legalForm || '',
                            email: b.contact?.email || '',
                            phone: b.contact?.phone || '',
                            postalCode: b.contact?.postalCode || '',
                            region: b.contact?.region || '',
                            address: b.contact?.address || '',
                        });
                    }
                } catch { console.error('Failed to parse business from storage'); }
            }
        }
    }, [index]);

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handle =
        (key: keyof typeof values) =>
            (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setValues((prev) => ({ ...prev, [key]: e.target.value }));
            };

    // ---------- Нормализация/склейка
    function toPayload(v: typeof values): BusinessPayload {
        return {
            businessName: v.businessName.trim(),
            idno: v.idno.trim(),
            registrationDate: v.regDate ? new Date(v.regDate + 'T00:00:00').toISOString() : '',
            legalForm: (v.legalForm || 'SRL') as Exclude<LegalForm, ''>,
            contact: {
                email: v.email.trim(),
                phone: v.phone.trim(),
                postalCode: v.postalCode.trim(),
                region: v.region,
                address: v.address.trim(),
            },
        };
    }

    // ---------- Валидация (минимальная, под макет)
    function validate(v = values) {
        const e: Record<string, string> = {};
        if (!v.businessName.trim()) e.businessName = 'Required';
        if (!/^\d{8,13}$/.test(v.idno.replace(/\s/g, ''))) e.idno = 'Enter valid IDNO';
        if (!v.regDate) e.regDate = 'Required';
        if (!v.legalForm) e.legalForm = 'Required';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = 'Enter a valid email';
        if (!v.phone.trim()) e.phone = 'Required';
        if (!v.postalCode.trim()) e.postalCode = 'Required';
        if (!v.region) e.region = 'Required';
        if (!v.address.trim()) e.address = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ---------- Действия
    const onCancel = () => history.goBack();
    // внутри Register.tsx (как у тебя выше)
    const onConfirm = async () => {
        if (!validate()) return;

        try {
            await fetchApi('/api/admin/users', { method: 'GET' });
        } catch (e) {
            console.error('Failed to call API:', e);
            return;
        }

        // сохранить бизнес в localStorage (как у тебя)
        const payload = toPayload(values);
        const key = 'business';
        let arr: BusinessPayload[] = [];
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                arr = Array.isArray(parsed) ? parsed : [parsed];
            }
        } catch { arr = []; }

        if (isEdit && arr[Number(index)]) arr[Number(index)] = payload;
        else arr.push(payload);
        localStorage.setItem(key, JSON.stringify(arr));

        window.dispatchEvent(new Event('fp:businesses-updated'));

        // 👇 одноразовый флаг для показа модалки на следующем экране
        if (!isEdit) sessionStorage.setItem('fp:show_welcome_business', '1');

        history.push('/my-businesses');
    };


    return (
        <Box sx={{ height: 1, p: 3, gap: 3, bgcolor: (t) => t.palette.grey[100] }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                {/* breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary', mb: 3 }}>
                    <Link underline="hover" color="inherit" href="/my-businesses">My Businesses</Link>
                    <Typography color="text.primary">{isEdit ? 'Edit Business' : 'Register Business'}</Typography> {/* <-- FIX */}
                </Breadcrumbs>

                {/* Заголовок + кнопки */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {isEdit ? 'Edit Business' : 'Register Business'} {/* <-- динамический заголовок */}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={onCancel} color="success" variant="text" sx={{ fontWeight: 600 }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            color="success"
                            variant="contained"
                            sx={{ borderRadius: 999, px: 3, fontWeight: 700 }}
                        >
                            {isEdit ? 'Save' : 'Confirm'} {/* <-- динамическая кнопка */}
                        </Button>
                    </Stack>
                </Stack>

                {/* Две колонки карточек */}
                <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
                    {/* Левая карточка */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: '480px' }}>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: 'left', mb: 4, fontWeight: 700, fontSize: '1.1rem' }}
                            >
                                Legal Details
                            </Typography>

                            <Stack spacing={2.25}>
                                <TextField
                                    required
                                    label="Business Name"
                                    placeholder="Enter your business name"
                                    value={values.businessName}
                                    onChange={handle('businessName')}
                                    error={!!errors.businessName}
                                    helperText={errors.businessName}
                                    fullWidth
                                />

                                <TextField
                                    required
                                    label="IDNO"
                                    placeholder="XXXXXXXXXXXX"
                                    value={values.idno}
                                    onChange={handle('idno')}
                                    error={!!errors.idno}
                                    helperText={errors.idno}
                                    fullWidth
                                />

                                <TextField
                                    type="date"
                                    label="Registration Date"
                                    value={values.regDate}
                                    onChange={handle('regDate')}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />

                                {/* Select без «пропила» сверху */}
                                <FormControl
                                    fullWidth
                                    required
                                    error={!!errors.legalForm}
                                    sx={{
                                        '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink) + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
                                            { width: 0 },
                                    }}
                                >
                                    <InputLabel id="legal-form-label">Type of Legal Form</InputLabel>
                                    <Select
                                        labelId="legal-form-label"
                                        label="Type of Legal Form"
                                        value={values.legalForm}

                                        onChange={handle('legalForm') as any}
                                        displayEmpty
                                        input={<OutlinedInput label="Type of Legal Form" notched={false} />}
                                    >
                                        {/* placeholder можно скрыть, если не нужен */}
                                        {/* <MenuItem value=""><em>Select type of legal form</em></MenuItem> */}
                                        <MenuItem value="SRL">SRL</MenuItem>
                                        <MenuItem value="II">Întreprindere Individuală</MenuItem>
                                        <MenuItem value="GȚ">Gospodărie Țărănească</MenuItem>
                                    </Select>
                                    {errors.legalForm && <FormHelperText>{errors.legalForm}</FormHelperText>}
                                </FormControl>
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Правая карточка */}
                    <Box sx={{ flexGrow: 1, minHeight: '580px' }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: '480px' }}>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: 'left', mb: 4, fontWeight: 700, fontSize: '1.1rem' }}
                            >
                                Contact Details
                            </Typography>

                            <Stack spacing={2.25}>
                                <TextField
                                    required
                                    type="email"
                                    label="Email"
                                    placeholder="admin@farmprofit.com"
                                    onChange={handle('email')}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                />

                                <TextField
                                    required
                                    label="Phone Number"
                                    placeholder="+373 68 42 30 07"
                                    onChange={handle('phone')}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    fullWidth
                                />

                                <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                                    <TextField
                                        required
                                        label="Postal Code"
                                        placeholder="XXXX"
                                        value={values.postalCode}
                                        onChange={handle('postalCode')}
                                        error={!!errors.postalCode}
                                        helperText={errors.postalCode}
                                        fullWidth
                                    />
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.region}
                                        sx={{
                                            // убираем "пропил" в бордере, пока лейбл не схлопнут
                                            '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink) + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend': {
                                                width: 0,
                                            },
                                        }}
                                    >
                                        <InputLabel id="region-label">Region</InputLabel>
                                        <Select
                                            labelId="region-label"
                                            value={values.region}
                                            onChange={handle('region') as any}
                                            displayEmpty
                                            input={<OutlinedInput label="Region" notched={false} />}
                                        >
                                            <MenuItem value="Anenii Noi">Anenii Noi</MenuItem>
                                            <MenuItem value="Basarabeasca">Basarabeasca</MenuItem>
                                            <MenuItem value="Briceni">Briceni</MenuItem>
                                            <MenuItem value="Cahul">Cahul</MenuItem>
                                            <MenuItem value="Cantemir">Cantemir</MenuItem>
                                            <MenuItem value="Călărași">Călărași</MenuItem>
                                            <MenuItem value="Căușeni">Căușeni</MenuItem>
                                            <MenuItem value="Cimișlia">Cimișlia</MenuItem>
                                            <MenuItem value="Criuleni">Criuleni</MenuItem>
                                            <MenuItem value="Dondușeni">Dondușeni</MenuItem>
                                            <MenuItem value="Drochia">Drochia</MenuItem>
                                            <MenuItem value="Dubăsari">Dubăsari</MenuItem>
                                            <MenuItem value="Edineț">Edineț</MenuItem>
                                            <MenuItem value="Fălești">Fălești</MenuItem>
                                            <MenuItem value="Florești">Florești</MenuItem>
                                            <MenuItem value="Glodeni">Glodeni</MenuItem>
                                            <MenuItem value="Hîncești">Hîncești</MenuItem>
                                            <MenuItem value="Ialoveni">Ialoveni</MenuItem>
                                            <MenuItem value="Leova">Leova</MenuItem>
                                            <MenuItem value="Nisporeni">Nisporeni</MenuItem>
                                            <MenuItem value="Ocnița">Ocnița</MenuItem>
                                            <MenuItem value="Orhei">Orhei</MenuItem>
                                            <MenuItem value="Rezina">Rezina</MenuItem>
                                            <MenuItem value="Rîșcani">Rîșcani</MenuItem>
                                            <MenuItem value="Sîngerei">Sîngerei</MenuItem>
                                            <MenuItem value="Soroca">Soroca</MenuItem>
                                            <MenuItem value="Strășeni">Strășeni</MenuItem>
                                            <MenuItem value="Șoldănești">Șoldănești</MenuItem>
                                            <MenuItem value="Ștefan Vodă">Ștefan Vodă</MenuItem>
                                            <MenuItem value="Taraclia">Taraclia</MenuItem>
                                            <MenuItem value="Telenești">Telenești</MenuItem>
                                            <MenuItem value="Ungheni">Ungheni</MenuItem>
                                        </Select>
                                        {errors.region && <FormHelperText>{errors.region}</FormHelperText>}
                                    </FormControl>

                                </Box>

                                <TextField
                                    required
                                    label="Address"
                                    placeholder="Enter your address"
                                    value={values.address}
                                    onChange={handle('address')}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    fullWidth
                                />
                            </Stack>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}
