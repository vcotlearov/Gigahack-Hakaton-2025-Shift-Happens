
import * as React from 'react';
import {
    Box, Stack, Paper, Typography, Button, Chip,
    IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type RepStatus = 'Pending' | 'Accepted' | 'Revoked';
type Rep = {
    id: string;
    email: string;
    status: RepStatus;
    invitedAt: string; // ISO
};

const uid = () => (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);
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
            const arr = raw ? JSON.parse(raw) as Rep[] : [];
            setReps(Array.isArray(arr) ? arr : []);
        } catch { setReps([]); }
    }, [key]);

    const save = React.useCallback((next: Rep[]) => {
        localStorage.setItem(key, JSON.stringify(next));
        setReps(next);
        // если нужно, уведомим другие компоненты
        window.dispatchEvent(new Event('fp:reps-updated'));
    }, [key]);

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

function statusChip(status: RepStatus) {
    if (status === 'Accepted') return <Chip label="Accepted" color="success" size="small" variant="outlined" />;
    if (status === 'Revoked') return <Chip label="Revoked" color="error" size="small" variant="outlined" />;
    return <Chip label="Pending" color="secondary" size="small" variant="outlined" />;
}

function InviteDialog({
    open, onClose, onSubmit
}: { open: boolean; onClose: () => void; onSubmit: (email: string) => void }) {
    const [email, setEmail] = React.useState('');
    const [err, setErr] = React.useState('');

    const submit = () => {
        const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
        if (!ok) { setErr('Enter a valid email'); return; }
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
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={submit} variant="contained" color="success">Send Invite</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function RepresentativesTab({ businessIndex }: { businessIndex: number }) {
    const { reps, save } = useReps(businessIndex);
    const [inviteOpen, setInviteOpen] = React.useState(false);

    const addRep = (email: string) => {
        const next: Rep[] = [
            ...reps,
            { id: uid(), email, status: 'Pending', invitedAt: new Date().toISOString() },
        ];
        save(next);
        setInviteOpen(false);
    };

    const updateStatus = (id: string, status: RepStatus) => {
        save(reps.map(r => r.id === id ? { ...r, status } : r));
    };

    const removeRep = (id: string) => save(reps.filter(r => r.id !== id));

    return (
        <Box>
            {/* top bar inside tab */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 999, px: 2.5 }}
                    onClick={() => setInviteOpen(true)}
                >
                    Invite Representative
                </Button>
            </Stack>

            {/* cards */}
            {reps.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography color="text.secondary">
                        You don’t have representatives yet. Invite a person using the button above.
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
                            onAccept={() => updateStatus(r.id, 'Accepted')}
                            onMarkPending={() => updateStatus(r.id, 'Pending')}
                            onRevoke={() => updateStatus(r.id, 'Revoked')}
                            onRemove={() => removeRep(r.id)}
                            inviteLink={`${window.location.origin}/accept-invite?biz=${businessIndex}&email=${encodeURIComponent(r.email)}`}
                        />
                    ))}
                </Box>
            )}

            <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} onSubmit={addRep} />
        </Box>
    );
}

function RepCard({
    rep, onAccept, onMarkPending, onRevoke, onRemove
}: {
    rep: Rep;
    onAccept: () => void;
    onMarkPending: () => void;
    onRevoke: () => void;
    onRemove: () => void;
    inviteLink: string;
}) {
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchor);

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
                <MenuItem onClick={() => { onAccept(); setAnchor(null); }}>Mark as accepted</MenuItem>
                <MenuItem onClick={() => { onMarkPending(); setAnchor(null); }}>Mark as pending</MenuItem>
                <MenuItem onClick={() => { onRevoke(); setAnchor(null); }}>Revoke access</MenuItem>
                <MenuItem onClick={() => { onRemove(); setAnchor(null); }} style={{ color: '#d32f2f' }}>
                    Remove
                </MenuItem>
            </Menu>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {rep.email}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Invitation Status:</Typography>
                {statusChip(rep.status)}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Invitation Date:</Typography>
                <Tooltip title={rep.invitedAt}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtDate(rep.invitedAt)}</Typography>
                </Tooltip>
            </Stack>
        </Paper>
    );
}
