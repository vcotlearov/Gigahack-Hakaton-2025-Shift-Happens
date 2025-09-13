/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
    Box,
    Stack,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput
} from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import MapFieldsArea from '../maps/FarmFieldsMap';

type CropsPayload = {
    name: string;
    farmlandArea: string;      // id участка/зоны (селект)
    areaHa: string;            // площадь, ha (автозаполняется с карты)
    cadastral?: string;

    // Автополя из GeoJSON:
    geometry?: string;         // Feature в виде строки (можно хранить как объект)
    bbox?: string;             // "[minLng, minLat, maxLng, maxLat]"
};

export default function CreateCropsAsset() {
    const { index } = useParams<{ index: string }>();
    const history = useHistory();

    const [values, setValues] = React.useState<CropsPayload>({
        name: '',
        farmlandArea: '',
        areaHa: '',
        cadastral: '',
        geometry: '',
        bbox: '',
    });

    const handle = (k: keyof CropsPayload) =>
        (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) =>
            setValues((p) => ({ ...p, [k]: (e.target as any).value }));

    const onCreate = () => {
        // простая модель актива; можно расширить
        const asset = {
            id: Date.now(),
            type: 'crops' as const,
            name: values.name || 'Crops',
            areaHa: values.areaHa ? Number(values.areaHa) : undefined,
            cadastral: values.cadastral || undefined,
            farmlandArea: values.farmlandArea || undefined,
            geometry: values.geometry ? JSON.parse(values.geometry) : undefined,
        };

        const key = `assets:${index}`;
        const arr = (() => {
            try { return JSON.parse(localStorage.getItem(key) || '[]'); }
            catch { return []; }
        })();
        arr.push(asset);
        localStorage.setItem(key, JSON.stringify(arr));
        sessionStorage.setItem('fp:show_welcome_asset', '1');

        history.push(`/business/${index}`); // теперь ведём на новую страницу
    };

    const onBack = () => history.goBack();

    // получаем данные из карты и подставляем в форму
    const handleMapChange = (feature: any) => {
        const props = feature?.properties || {};
        setValues(prev => ({
            ...prev,
            areaHa: props.area_ha ? String(props.area_ha) : prev.areaHa,
            geometry: JSON.stringify(feature),
            bbox: props.bbox ? JSON.stringify(props.bbox) : prev.bbox,
        }));
    };

    return (
        <Box sx={{ px: 6, py: 3 }}>
            {/* header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Crops — New Asset</Typography>
                <Stack direction="row" spacing={2}>
                    <Button onClick={onBack} color="inherit">Back</Button>
                    <Button onClick={onCreate} variant="contained" color="success" sx={{ borderRadius: 999, px: 3, fontWeight: 700 }}>
                        Create
                    </Button>
                </Stack>
            </Stack>

            {/* две колонки */}
            <Stack direction={{ xs: 'column', lg: 'row' }} gap={3} alignItems="stretch">
                {/* левая карточка — форма */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, flex: 1, minWidth: 420 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Asset Details</Typography>

                    <Stack spacing={2.25}>
                        <TextField
                            required fullWidth label="Asset Name" placeholder="My Nice Crop"
                            value={values.name} onChange={handle('name')}
                        />

                        <FormControl fullWidth required>
                            <InputLabel id="farmland-area">Farmland Area</InputLabel>
                            <Select
                                labelId="farmland-area" label="Farmland Area" value={values.farmlandArea}
                                onChange={handle('farmlandArea') as any}
                                input={<OutlinedInput label="Farmland Area" notched={false} />}
                            >
                                {/* заполни реальными участками, пока — заглушки */}
                                <MenuItem value="owned">Owned</MenuItem>
                                <MenuItem value="leased">Leased</MenuItem>
                                <MenuItem value="in_use">In Use</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth label="Cadastral Number (optional)" placeholder="XXXXXXX.XXX"
                            value={values.cadastral} onChange={handle('cadastral')}
                        />

                        {/* --- Автозаполняемые поля из GeoJSON --- */}
                        <TextField
                            fullWidth label="GeoJSON Feature (raw)" value={values.geometry}
                            multiline minRows={3}
                            disabled
                            InputProps={{ readOnly: true }}
                        />


                        <TextField
                            required fullWidth label="Area Size (ha)" placeholder="e.g. 12.5"
                            value={values.areaHa}
                            disabled
                            onChange={handle('areaHa')}
                            helperText="Filled automatically after drawing polygon (editable)."
                        />
                    </Stack>
                </Paper>

                {/* правая карточка — карта */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1.2, minHeight: 480 }}>
                    <Box sx={{ height: '100%', borderRadius: 2, bgcolor: (t) => t.palette.grey[100], display: 'grid', placeItems: 'center' }}>
                        <MapFieldsArea onCreatePolygon={handleMapChange} />
                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
}
