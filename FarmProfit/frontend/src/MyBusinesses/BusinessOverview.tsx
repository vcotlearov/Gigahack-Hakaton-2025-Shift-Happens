import * as React from 'react';
import { Box, Paper, Stack, Typography, ButtonBase } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrassIcon from '@mui/icons-material/Grass';
import PetsIcon from '@mui/icons-material/Pets';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function BusinessOverview() {
    const { index } = useParams<{ index: string }>();
    const history = useHistory();

    // заголовок
    const [title, setTitle] = React.useState('My Business');
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('business');
            const arr = raw ? JSON.parse(raw) : [];
            const b = Array.isArray(arr) ? arr[Number(index)] : null;
            if (!b) history.replace('/my-businesses');
            else if (b?.businessName) setTitle(b.businessName);
        } catch {
            history.replace('/my-businesses');
        }
    }, [index, history]);

    const goCreate = (slug: string) =>
        history.push(`/business/${index}/assets/new/${slug}`);

    const Card = ({
        icon,
        label,
        onClick,
    }: {
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
    }) => (
        <ButtonBase onClick={onClick} sx={{ borderRadius: 2 }}>
            <Paper
                variant="outlined"
                sx={{
                    width: 220,
                    height: 96,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                }}
            >
                <Stack alignItems="center" spacing={1}>
                    {icon}
                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                </Stack>
            </Paper>
        </ButtonBase>
    );

    return (
        <Box sx={{ px: 6, py: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                Total Balance: 1000 lei · Explore Partners →
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography align="center" sx={{ fontWeight: 600, mb: 0.5 }} fontSize={28}>
                    Select Asset Type
                </Typography>
                <Typography align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                    Create your first Asset to earn more credits
                </Typography>

                <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap">
                    <Card icon={<GrassIcon color="success" />} label="Land" onClick={() => goCreate('land')} />
                    <Card icon={<AgricultureIcon color="success" />} label="Crops" onClick={() => goCreate('crops')} />
                    <Card icon={<PetsIcon color="success" />} label="Livestock Inventory" onClick={() => goCreate('livestock')} />
                    <Card icon={<PrecisionManufacturingIcon color="success" />} label="Machinery & Equipment" onClick={() => goCreate('machinery')} />
                    <Card icon={<ApartmentIcon color="success" />} label="Building & Facilities" onClick={() => goCreate('buildings')} />
                </Stack>
            </Paper>
        </Box>
    );
}
