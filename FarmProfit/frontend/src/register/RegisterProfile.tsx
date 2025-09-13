
import * as React from 'react';
import {
    Box,
    Paper,
    Stack,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    IconButton,
    InputAdornment,
} from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useHistory } from 'react-router-dom';
import { Logo } from '../logo/Logo';

// ===== Типы и payload =====
export interface ProfilePayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idnp: string;          // 13 цифр
    password: string;      // (демо) — в реале не кладём в LS, а шифруем/шлём на бэк
    acceptedTerms: boolean;
}

export const RegisterProfile = () => {
    const history = useHistory();

    // ---- state формы (как у тебя в Register)
    const [values, setValues] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idnp: '',
        password: '',
        confirmPassword: '',
        accepted: true,
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [showPw, setShowPw] = React.useState(false);
    const [showPw2, setShowPw2] = React.useState(false);

    const handle =
        (key: keyof typeof values) =>
            (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setValues((prev) => ({ ...prev, [key]: e.target.value }));
            };

    // ---- нормализация (склейка) как в твоём коде
    function toPayload(v: typeof values): ProfilePayload {
        return {
            firstName: v.firstName.trim(),
            lastName: v.lastName.trim(),
            email: v.email.trim(),
            phone: v.phone.trim(),
            idnp: v.idnp.replace(/\s/g, ''),
            password: v.password,
            acceptedTerms: v.accepted,
        };
    }

    // ---- валидация (минимально)
    function validate(v = values) {
        const e: Record<string, string> = {};
        if (!v.firstName.trim()) e.firstName = 'Required';
        if (!v.lastName.trim()) e.lastName = 'Required';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = 'Enter a valid email';
        if (!v.phone.trim()) e.phone = 'Required';
        if (!/^\d{13}$/.test(v.idnp.replace(/\s/g, ''))) e.idnp = 'Enter 13 digits';
        if (v.password.length < 8) e.password = 'Min 8 characters';
        if (v.password !== v.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (!v.accepted) e.accepted = 'You must accept terms';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ---- действия
    // const onNext = () => {
    //     if (!validate()) return;
    //     const payload = toPayload(values);
    //     // Демо-сохранение (как в бизнес-форме)
    //     localStorage.setItem('profile', JSON.stringify(payload));
    //     console.log('Profile submit payload:', payload);
    //     history.push('/my-businesses'); // поменяй на следующий шаг онбординга
    // };

    const onNext = async () => {
        if (!validate()) return;
        // const payload = toPayload(values);        // уже есть в твоём коде
        // await fetchApi('/profile', { method: 'POST', body: JSON.stringify(payload) });
        history.push('/my-businesses');
    };

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'background.default',
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: 462,
                    maxWidth: '92vw',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                }}
            >
                {/* Лого */}
                <Stack alignItems="center">
                    <Logo />
                </Stack>

                {/* Заголовок */}
                <Stack alignItems="center" textAlign="center" spacing={2} mb={3} mt={3}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Enter Profile Information
                    </Typography>
                </Stack>

                {/* ФОРМА */}
                <Stack spacing={2.25}>
                    {/* Имя + Фамилия */}
                    <Stack direction="row" spacing={2}>
                        <TextField
                            required
                            label="First Name"
                            placeholder="Enter your first name"
                            value={values.firstName}
                            onChange={handle('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            fullWidth
                            sx={{ '& fieldset': { borderRadius: 2 } }}
                        />
                        <TextField
                            required
                            label="Last Name"
                            placeholder="Enter your last name"
                            value={values.lastName}
                            onChange={handle('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            fullWidth
                            sx={{ '& fieldset': { borderRadius: 2 } }}
                        />
                    </Stack>

                    <TextField
                        required
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handle('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        sx={{ '& fieldset': { borderRadius: 2 } }}
                    />

                    <TextField
                        required
                        label="Phone Number"
                        placeholder="+373XX XX XX XX"
                        value={values.phone}
                        onChange={handle('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        fullWidth
                        inputProps={{ inputMode: 'tel' }}
                        sx={{ '& fieldset': { borderRadius: 2 } }}
                    />

                    <TextField
                        required
                        label="IDNP"
                        placeholder="XXXXXXXXXXXXX"
                        value={values.idnp}
                        onChange={handle('idnp')}
                        error={!!errors.idnp}
                        helperText={errors.idnp}
                        fullWidth
                        inputProps={{ maxLength: 13 }}
                        sx={{ '& fieldset': { borderRadius: 2 } }}
                    />

                    <TextField
                        required
                        label="Password"
                        placeholder="Enter password"
                        type={showPw ? 'text' : 'password'}
                        value={values.password}
                        onChange={handle('password')}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        sx={{ '& fieldset': { borderRadius: 2 } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end">
                                        {showPw ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        label="Confirm Password"
                        placeholder="Enter password confirmation"
                        type={showPw2 ? 'text' : 'password'}
                        value={values.confirmPassword}
                        onChange={handle('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        fullWidth
                        sx={{ '& fieldset': { borderRadius: 2 } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPw2((s) => !s)} edge="end">
                                        {showPw2 ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControlLabel
                        sx={{ alignItems: 'flex-start', mt: 0.5 }}
                        control={
                            <Checkbox
                                color="success"
                                checked={values.accepted}
                                onChange={(e) => setValues((p) => ({ ...p, accepted: e.target.checked }))}
                                sx={{ p: 0, ml: '19px' }}
                            />
                        }
                        label={
                            <Typography sx={{ color: 'text.secondary' }}>
                                I agree to the
                                <Link href="#" underline="hover" color="success.main">
                                    Terms and Conditions
                                </Link>{' '}
                                and{' '}
                                <Link href="#" underline="hover" color="success.main">
                                    Privacy Policy
                                </Link>
                            </Typography>
                        }
                    />
                    {errors.accepted && (
                        <Typography variant="caption" color="error">
                            {errors.accepted}
                        </Typography>
                    )}

                    <Button
                        onClick={onNext}
                        size="large"
                        color="success"
                        variant="contained"
                        sx={{ borderRadius: 999, mt: 1 }}
                        fullWidth
                    >
                        Next
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};
