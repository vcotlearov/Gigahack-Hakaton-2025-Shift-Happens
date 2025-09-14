import { Box, Stack, Typography } from "@mui/material"

// Минималистичный инлайн-логотип (SVG), похожий на иконку фермы
function FarmLogo() {
    return (<svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.8334 23.9166V7.68746C13.8334 6.55476 13.3834 5.46846 12.5825 4.66752C11.7815 3.86659 10.6952 3.41663 9.56254 3.41663C8.42985 3.41663 7.34354 3.86659 6.54261 4.66752C5.74167 5.46846 5.29171 6.55476 5.29171 7.68746V23.9166M13.8334 13.6666L24.0834 5.12496L37.75 15.375M34.3334 6.83329V23.9166M20.6667 23.9166H27.5V17.0833H20.6667V23.9166ZM20.6667 23.9166L12.125 37.5833M3.58337 23.9166H37.75M3.58337 37.5833L12.125 23.9166M37.75 37.5833H20.6667L29.2084 23.9166M25.7917 30.75H37.75" stroke="#262626" strokeWidth="2.5625" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    );
}

export const Logo = () => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={"12px"} >
            <FarmLogo />
            <Typography
                component="div"
                sx={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1 }}
            >
                <Box component="span" sx={{ color: 'text.primary' }}>Farm</Box>
                <Box component="span" sx={{ color: 'primary.main' }}>Profit</Box>
            </Typography>
        </Stack >
    )
}