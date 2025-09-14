import { AppBar, Avatar, Box, MenuItem } from "@mui/material"
import { Logo } from "../logo/Logo"
import { useAuth0 } from "@auth0/auth0-react";


export const Header = () => {
    const { logout } = useAuth0();
    return (
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, borderRadius: 0, backgroundColor: 'white', color: 'black' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: '16px 24px' }}>
                <Box display="flex" alignItems="center" gap={3}>
                    <Logo />
                </Box>
                <Box display='flex' alignItems='center' gap={1}>
                    <Avatar>JD</Avatar>
                    <MenuItem onClick={() => {
                        logout({ logoutParams: { returnTo: window.location.origin } });

                    }}>
                        Log out
                    </MenuItem>
                </Box>
            </Box>
        </AppBar>
    )
}
