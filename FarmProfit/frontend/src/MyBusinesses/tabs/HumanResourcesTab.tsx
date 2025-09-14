
import * as React from 'react';
import {
    Box, Stack, Paper, Typography, Button, IconButton, Menu, MenuItem, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Select, InputLabel, FormControl,
    OutlinedInput
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

type Gender = 'Male' | 'Female' | 'Other';
type HrItem = {
    id: string;
    fullName: string;
    gender: Gender;
    role: string;
    employmentType: string; // e.g. Seasonal Worker
    addedAt: string;        // ISO
};

const uid = () => (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);
const fmtDate = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

function useHR(index: number) {
    const key = `hr:${index}`;
    const [items, setItems] = React.useState<HrItem[]>([]);

    const load = React.useCallback(() => {
        try {
            const raw = localStorage.getItem(key);
            const arr = raw ? JSON.parse(raw) as HrItem[] : [];
            setItems(Array.isArray(arr) ? arr : []);
        } catch { setItems([]); }
    }, [key]);

    const save = React.useCallback((next: HrItem[]) => {
        localStorage.setItem(key, JSON.stringify(next));
        setItems(next);
        window.dispatchEvent(new Event('fp:hr-updated'));
    }, [key]);

    React.useEffect(() => {
        load();
        const onAny = () => load();
        window.addEventListener('storage', onAny);
        window.addEventListener('fp:hr-updated', onAny as EventListener);
        return () => {
            window.removeEventListener('storage', onAny);
            window.removeEventListener('fp:hr-updated', onAny as EventListener);
        };
    }, [load]);

    return { items, save };
}

/* -------------------- Add / Edit dialog -------------------- */
function IndividualDialog({
    open, onClose, initial, onSubmit
}: {
    open: boolean;
    onClose: () => void;
    initial?: Partial<HrItem>;
    onSubmit: (payload: Omit<HrItem, 'id' | 'addedAt'> & { id?: string }) => void;
}) {
    const [fullName, setFullName] = React.useState(initial?.fullName ?? '');
    const [gender, setGender] = React.useState<Gender>((initial?.gender as Gender) ?? 'Male');
    const [role, setRole] = React.useState(initial?.role ?? '');
    const [etype, setEtype] = React.useState(initial?.employmentType ?? 'Seasonal Worker');
    const [err, setErr] = React.useState('');

    React.useEffect(() => {
        if (!open) return;
        setFullName(initial?.fullName ?? '');
        setGender((initial?.gender as Gender) ?? 'Male');
        setRole(initial?.role ?? '');
        setEtype(initial?.employmentType ?? 'Seasonal Worker');
        setErr('');
    }, [open, initial]);

    const submit = () => {
        if (!fullName.trim()) { setErr('Enter full name'); return; }
        if (!role.trim()) { setErr('Enter role'); return; }
        onSubmit({ id: initial?.id, fullName: fullName.trim(), gender, role: role.trim(), employmentType: etype });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial?.id ? 'Edit Individual' : 'Add Individual'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Full Name" fullWidth value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={!!err && !fullName.trim()} helperText={!fullName.trim() && err ? err : ' '}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                            labelId="gender-label" value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            input={<OutlinedInput label="Gender" notched={false} />}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Role" fullWidth value={role}
                        onChange={(e) => setRole(e.target.value)}
                        error={!!err && !role.trim()} helperText={!role.trim() && err ? err : ' '}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="etype-label">Employment Type</InputLabel>
                        <Select
                            labelId="etype-label" value={etype}
                            onChange={(e) => setEtype(e.target.value)}
                            input={<OutlinedInput label="Employment Type" notched={false} />}
                        >
                            <MenuItem value="Seasonal Worker">Seasonal Worker</MenuItem>
                            <MenuItem value="Full-time">Full-time</MenuItem>
                            <MenuItem value="Part-time">Part-time</MenuItem>
                            <MenuItem value="Contractor">Contractor</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={submit} variant="contained" color="success">
                    {initial?.id ? 'Save' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/* -------------------- Card -------------------- */
function HrCard({
    item, onEdit, onRemove
}: {
    item: HrItem;
    onEdit: () => void;
    onRemove: () => void;
}) {
    const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(menuEl);

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, position: 'relative' }}>
            <IconButton
                size="small" onClick={(e) => setMenuEl(e.currentTarget)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={menuEl} open={open} onClose={() => setMenuEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem onClick={() => { setMenuEl(null); onRemove(); }} style={{ color: '#d32f2f' }}>Remove</MenuItem>
            </Menu>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                {item.fullName}
            </Typography>

            <Typography variant="body2" sx={{ mb: 1.5 }}>
                Gender: <span style={{ fontWeight: 400 }}>{item.gender}</span>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
                Role: <span style={{ fontWeight: 400 }}>{item.role}</span>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
                Employment Type: <span style={{ fontWeight: 400 }}>{item.employmentType}</span>
            </Typography>
            <Typography variant="body2">
                Date Added: <span style={{ fontWeight: 400 }}>{fmtDate(item.addedAt)}</span>
            </Typography>
        </Paper>
    );
}

/* -------------------- Info banner -------------------- */
function HRInfoBanner({ storageKey }: { storageKey: string }) {
    const [visible, setVisible] = React.useState(() => localStorage.getItem(storageKey) !== '1');
    if (!visible) return null;

    return (
        <Box
            sx={{
                bgcolor: '#4096F31A',
                border: '1px solid #d6e6ff',
                color: '#3666EA',
                px: 2, py: 1.25, borderRadius: 1, mb: 2,
                display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center',
            }}
        >
            <Box sx={{ left: 'auto' }} display="flex" alignItems="center" gap={1}>
                <InfoOutlinedIcon fontSize="small" />
                <Typography variant="body2" sx={{ flex: 1 }} textAlign={"center"}>
                    Sharing HR data could unlock access to training programs or subsidies for hiring seasonal workers.
                </Typography>
            </Box>
            <IconButton
                size="small"
                onClick={() => { localStorage.setItem(storageKey, '1'); setVisible(false); }}
            >
                <CloseRoundedIcon fontSize="small" />
            </IconButton>
        </Box >
    );
}

/* -------------------- Main tab -------------------- */
export default function HumanResourcesTab({ businessIndex }: { businessIndex: number }) {
    const { items, save } = useHR(businessIndex);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [editItem, setEditItem] = React.useState<HrItem | null>(null);

    const add = () => {
        setEditItem(null);
        setOpenDialog(true);
    };

    const onSubmit = (payload: Omit<HrItem, 'id' | 'addedAt'> & { id?: string }) => {
        if (payload.id) {
            // edit
            const updated = items.map(i => i.id === payload.id ? { ...i, ...payload } as HrItem : i);
            save(updated);
        } else {
            const next: HrItem = {
                id: uid(),
                ...payload,
                addedAt: new Date().toISOString(),
            };
            save([...items, next]);
        }
        setOpenDialog(false);
    };

    const onRemove = (id: string) => save(items.filter(i => i.id !== id));

    return (
        <Box>
            {/* подсказка */}
            <HRInfoBanner storageKey={`hr:banner:dismissed:${businessIndex}`} />

            {/* верхняя кнопка */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 999, px: 2.5 }}
                    onClick={add}
                >
                    Add Individual
                </Button>
                {/* Пример бейджа количества, как в табе */}
            </Stack>

            {/* список карточек */}
            {items.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography color="text.secondary">
                        No people added yet. Click “Add Individual” to create your first record.
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
                    {items.map((it) => (
                        <HrCard
                            key={it.id}
                            item={it}
                            onEdit={() => { setEditItem(it); setOpenDialog(true); }}
                            onRemove={() => onRemove(it.id)}
                        />
                    ))}
                </Box>
            )}

            <IndividualDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                initial={editItem ?? undefined}
                onSubmit={onSubmit}
            />
        </Box>
    );
}
