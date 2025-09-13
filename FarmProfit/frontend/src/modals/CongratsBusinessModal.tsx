// src/components/CongratsBusinessModal.tsx
import {
    Dialog, Box, Stack, Typography, Button, IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Congrats } from '../icons/Congrats';

type Props = { open: boolean; onClose: () => void };

export default function CongratsBusinessModal({ open, onClose }: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 3.5 }
            }}
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
                        You’ve added a new business
                    </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
                    You’ve earned <b>1000 lei</b>. Create your first Asset
                    to earn more credits
                </Typography>

                <Button
                    onClick={onClose}
                    variant="contained"
                    color="success"
                    size="large"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                >
                    Got it!
                </Button>
            </Stack>
        </Dialog>
    );
}
