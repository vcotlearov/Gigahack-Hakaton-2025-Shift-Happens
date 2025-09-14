import * as React from 'react';
import {
    Box, Stack, Paper, Typography, Button,
    IconButton, Menu, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

type Rep = {
    id: string;
    email: string;
    invitedAt: string; // ISO
};

const uid = () =>
(globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);

const fmtDate = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

function useReps(index: number) {
    const key = `reps:${index}`;
    const [reps, setReps] = React.useState<Rep[]>([]);

    const load = React.useCallback(() => {
        try {
            const raw = localStorage.getItem(key);
            const arr = raw ? (JSON.parse(raw) as any[]) : [];
            const normalized: Rep[] = (Array.isArray(arr) ? arr : [])
                .map((r) => ({
                    id: r?.id ?? uid(),
                    email: r?.email ?? '',
                    invitedAt: r?.invitedAt ?? r?.date ?? new Date().toISOString(),
                }))
                .filter((r) => !!r.email);
            setReps(normalized);
        } catch {
            setReps([]);
        }
    }, [key]);

    const save = React.useCallback(
        (next: Rep[]) => {
            localStorage.setItem(key, JSON.stringify(next));
            setReps(next);
            window.dispatchEvent(new Event('fp:reps-updated'));
        },
        [key]
    );

    React.useEffect(() => {
        load();
        const onStorage = () => load();
        window.addEventListener('storage', onStorage);
        window.addEventListener('fp:reps-updated', onStorage as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('fp:reps-updated', onStorage as EventListener);
        };
    }, [load]);

    return { reps, save };
}

function InviteDialog({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
}) {
    const [email, setEmail] = React.useState('');
    const [err, setErr] = React.useState('');

    const submit = () => {
        const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
        if (!ok) {
            setErr('Enter a valid email');
            return;
        }
        onSubmit(email.trim());
        setEmail('');
        setErr('');
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Invite Representative</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!err}
                    helperText={err}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={submit} variant="contained" color="success">
                    Send Invite
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function RepresentativesTab({
    businessIndex,
}: {
    businessIndex: number;
}) {
    const { reps, save } = useReps(businessIndex);
    const [inviteOpen, setInviteOpen] = React.useState(false);

    const addRep = (email: string) => {
        const next: Rep[] = [
            ...reps,
            { id: uid(), email, invitedAt: new Date().toISOString() },
        ];
        save(next);
        setInviteOpen(false);
    };

    const removeRep = (id: string) => save(reps.filter((r) => r.id !== id));

    return (
        <Box>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <Button
                    startIcon={<AddRoundedIcon />}
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 999, px: 2.5 }}
                    onClick={() => setInviteOpen(true)}
                >
                    Invite Representative
                </Button>
            </Stack>

            {reps.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography color="text.secondary">
                        You don’t have representatives yet. Invite a person using the button
                        above.
                    </Typography>
                </Paper>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {reps.map((r) => (
                        <RepCard
                            key={r.id}
                            rep={r}
                            onRemove={() => removeRep(r.id)}
                            inviteLink={`${window.location.origin}/accept-invite?biz=${businessIndex}&email=${encodeURIComponent(
                                r.email
                            )}`}
                        />
                    ))}
                </Box>
            )}

            <InviteDialog
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onSubmit={addRep}
            />
        </Box>
    );
}

function RepCard({
    rep,
    onRemove,
    inviteLink,
}: {
    rep: Rep;
    onRemove: () => void;
    inviteLink: string;
}) {
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchor);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
        } catch {
            /* no-op */
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, position: 'relative' }}>
            <IconButton
                size="small"
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
                aria-label="more"
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchor}
                open={open}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem
                    onClick={() => {
                        copyLink();
                        setAnchor(null);
                    }}
                >
                    Copy invite link
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onRemove();
                        setAnchor(null);
                    }}
                    style={{ color: '#d32f2f' }}
                >
                    Remove
                </MenuItem>
            </Menu>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {rep.email}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Invitation Date:
                </Typography>
                <Tooltip title={rep.invitedAt}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {fmtDate(rep.invitedAt)}
                    </Typography>
                </Tooltip>
            </Stack>
        </Paper>
    );
}
