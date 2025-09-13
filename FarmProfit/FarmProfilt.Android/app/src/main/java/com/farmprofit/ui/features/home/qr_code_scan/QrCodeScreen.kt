package com.farmprofit.ui.features.home.qr_code_scan

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.farmprofit.R
import com.farmprofit.repository.remote.models.Partner
import com.farmprofit.repository.remote.models.PartnerCategory
import com.farmprofit.ui.theme.FarmProfitTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QrCodeScreen(
    navigateBack: () -> Unit
) {
    val viewModel = hiltViewModel<QrCodePartnersViewModel>()
    val partners by viewModel.partners.collectAsStateWithLifecycle()

    QrCodeScreenContent(partners, navigateBack)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun QrCodeScreenContent(
    partners: List<Partner>,
    navigateBack: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize()) {
        CenterAlignedTopAppBar(
            title = {
                Text("Gain points")
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = Color.Transparent
            ),
            navigationIcon = {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    "",
                    modifier = Modifier.clickable {
                        navigateBack()
                    }
                )
            }
        )
        Column(
            modifier = Modifier
                .fillMaxSize()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(0.4f)
                    .background(color = MaterialTheme.colorScheme.primary)
            ) {
                Box(
                    modifier = Modifier
                        .wrapContentSize()
                        .background(color = Color.White, shape = RoundedCornerShape(8.dp))
                        .padding(8.dp)
                        .align(Alignment.Center),
                ) {

                    Column(
                        modifier = Modifier
                            .align(Alignment.Center),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Image(
                            modifier = Modifier.size(156.dp),
                            painter = painterResource(R.drawable.ic_qr_template_points),
                            contentDescription = ""
                        )
                        Text(
                            "M 123 33",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.W700)
                        )
                    }

                }
            }

            Column(
                modifier = Modifier
                    .weight(0.6f)
            ) {
                Text(
                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 24.dp),
                    text = stringResource(R.string.scan_qr_code_instructions),
                    style = MaterialTheme.typography.bodyLarge,
                    //    textAlign = TextAlign.Center
                )

                Text(
                    "Partners:",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.W600),
                    modifier = Modifier.padding(
                        start = 16.dp,
                        bottom = 8.dp,
                        end = 16.dp,
                        top = 16.dp
                    )
                )
                PartnersList(partners)
            }
        }
    }
}

@Composable
fun PartnersList(partners: List<Partner>) {
    LazyRow(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(partners) { item ->
            PartnerCard(item)
        }
    }
}

@Composable
fun PartnerCard(partner: Partner) {
    val logo = when (partner.category) {
        PartnerCategory.CROPS.displayName -> R.drawable.ic_partner_crops
        PartnerCategory.LIVESTOCK.displayName -> R.drawable.ic_partner_livestock
        PartnerCategory.ORGANIC_SUPPLIES.displayName -> R.drawable.ic_partner_organic_supplies
        PartnerCategory.PRODUCE_DISTRIBUTION.displayName -> R.drawable.ic_produce_distribution
        PartnerCategory.SEEDS_FERTILIZERS.displayName -> R.drawable.ic_partner_seeds

        else -> R.drawable.ic_partner_crops
    }


    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color.Gray, shape = RoundedCornerShape(8.dp))
            .padding(8.dp)
    ) {
        Text(
            partner.category,
            color = MaterialTheme.colorScheme.primary,
            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.W700)
        )
        HorizontalDivider()
        Image(
            modifier = Modifier
                .padding(8.dp)
                .size(width = 200.dp, height = 80.dp),
            painter = painterResource(logo),
            contentDescription = "",
        )
    }
}

@Preview
@Composable
fun QrCodeScreenPreview() {
    FarmProfitTheme {
        val partners = listOf(
            Partner(1, "Partner 1", PartnerCategory.CROPS.displayName),
            Partner(2, "Partner 2", PartnerCategory.LIVESTOCK.displayName),
            Partner(3, "Partner 3", "Farming"),
        )
        QrCodeScreenContent(partners) {}
    }
}