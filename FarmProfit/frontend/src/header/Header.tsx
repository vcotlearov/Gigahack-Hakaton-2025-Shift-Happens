import { AppBar, Avatar, Box } from "@mui/material"
import { Logo } from "../logo/Logo"
import { BurgerMenu } from "../icons/BurgerMenu"

export const Header = () => {
    return (
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, borderRadius: 0, backgroundColor: 'white', color: 'black' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: '16px 24px' }}>
                <Box display="flex" alignItems="center" gap={3}>
                    <BurgerMenu />
                    <Logo />

                </Box>
                <Avatar>JD</Avatar>
            </Box>
        </AppBar>
    )
}
