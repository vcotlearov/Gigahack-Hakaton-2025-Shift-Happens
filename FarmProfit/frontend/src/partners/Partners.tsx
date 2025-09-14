// src/pages/Partners.tsx
import * as React from 'react';

import {
  Box,
  Stack,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Icon
} from '@mui/material';
import { PartnerCrops } from '../icons/PartnerCrops';
import { PartnerOrganicSuppliess } from '../icons/PartnerOrganicSupplies';
import { PartnerProduceDistribution } from '../icons/PartnerProduceDistribution';
import { PartnerLivestock } from '../icons/PartnerLivestock';
import { PartnerSeeds } from '../icons/PartnerSeeds';

// Individual Partner Card Component using Material-UI
interface PartnerCardProps {
  category: string;
  logo: React.ReactNode;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ category, logo }) => (
  <Card variant="outlined" sx={{ width: 300, height: 113, display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s', overflow: 'auto'}}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography sx={{ color: 'success.light' }}>
          {category}
        </Typography>
        <Icon>
          <div>
            <svg fill="none" height="24" viewBox="0 0 25 24" width="25" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 3V5H5.5V19H19.5V12H21.5V19C21.5 20.1 20.6 21 19.5 21H5.5C4.39 21 3.5 20.1 3.5 19V5C3.5 3.9 4.39 3 5.5 3H12.5ZM21.5 3V10H19.5V6.41016L9.66992 16.2402L8.25977 14.8301L18.0898 5H14.5V3H21.5Z" fill="#49454F" />
            </svg>  
          </div>
        </Icon>
      </Box>
      <Box display="flex" alignItems="center" gap={1.5}>
        {logo}
      </Box>
    </CardContent>
  </Card>
);

export default function Partners() {

    const partners = [
    {
      category: 'Crops',
      logo: (
         PartnerCrops()
      ),
    },
    {
      category: 'Organic Supplies',
      logo: (
          PartnerOrganicSuppliess()
      ),
  
    },
    {
      category: 'Produce Distribution',
      logo: (
          PartnerProduceDistribution()
      ),
    },
    {
      category: 'Livestock',
      logo: (
        PartnerLivestock()
      ),
    },
    {
      category: 'Seeds & Fertilizers',
      logo: (
        PartnerSeeds()  
      ),
    },
  ];
  
 return (
        <Box sx={{ px: 6, py: 3 }}>
            {/* Header + Save */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Partners
                </Typography>
            </Stack>

            <Paper variant="outlined" sx={{ px: 3, py: 8, borderRadius: 2, maxWidth: 980 }}>
                <Box sx={{ textAlign: 'center', mb: 4}}>
                    <Typography variant="h6" sx={{ fontWeight: '500', color: 'text.primary'}}>
                         Trusted Partners
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 'md', mx: 'auto' }}>
                       Together with our partners, we bring you better prices on the products you need most.
                    </Typography>
                </Box>

              <Grid container spacing={3} justifyContent="center" alignItems="center">
                { partners.map((partner) => (
                    <PartnerCard category={partner.category} logo={partner.logo} />
                ))}
              </Grid>
            </Paper>
        </Box>
    );
}

