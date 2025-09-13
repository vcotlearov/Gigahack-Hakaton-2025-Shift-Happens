// src/components/CongratsAssetModal.tsx
import * as React from 'react';
import {
    Dialog, Box, Stack, Typography, Button, IconButton
} from '@mui/material';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Congrats } from '../icons/Congrats';

type Props = {
    open: boolean;
    onClose: () => void;
    onExplore?: () => void; // клик по CTA
};

export default function CongratsAssetModal({ open, onClose, onExplore }: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 3.5 } }}
        >
            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <IconButton size="small" onClick={onClose}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>

            <Stack spacing={3} alignItems="center" textAlign="center">
                <Congrats />

                <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Congrats!
                    </Typography>
                    <Typography variant="body1">
                        You created a new asset
                    </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
                    You’ve earned additional <b>100 lei</b> that can be used
                    for discounts and products from our partners.
                </Typography>

                <Button
                    onClick={onExplore ?? onClose}
                    variant="contained"
                    color="success"
                    size="large"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                >
                    Explore Partners
                </Button>
            </Stack>
        </Dialog>
    );
}
