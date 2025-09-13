package com.farmprofit.ui.features.home.qr_code_scan

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.farmprofit.R
import com.farmprofit.ui.theme.FarmProfitTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QrCodeScreen() {
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
                    ""
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
                    .padding(horizontal = 24.dp)
            ) {
                Text(
                    text = stringResource(R.string.scan_qr_code_instructions),
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun PartnersList() {

}

@Preview
@Composable
fun QrCodeScreenPreview() {
    FarmProfitTheme {
        QrCodeScreen()
    }
}