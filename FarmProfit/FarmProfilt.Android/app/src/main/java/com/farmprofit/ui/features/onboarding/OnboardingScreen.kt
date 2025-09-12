package com.farmprofit.ui.features.onboarding

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material.icons.Icons
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.farmprofit.R
import com.farmprofit.ui.theme.FarmProfitTheme

@Composable
fun OnboardingScreen(
    navigateToLogin: () -> Unit = {},
    navigateToRegister: () -> Unit = {}
) {
    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentSize()

                .padding(horizontal = 48.dp)
                .align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row {
                Icon(painterResource(R.drawable.ic_onboarding_logo), "")
                Text(
                    text = buildAnnotatedString {
                        append("Farm")
                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary)) {
                            append("Profit")
                        }
                    },
                    style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight(700)),
                    modifier = Modifier.padding(start = 8.dp)
                )
            }

            Text(
                "Welcome to FarmProfit!",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(top = 24.dp)
            )

            Text(
                "Your farm. Your data. Your rewards.",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.outline,
                modifier = Modifier.padding(top = 8.dp)
            )

            Button(
                modifier = Modifier.fillMaxWidth()
                    .padding(top = 24.dp),
                onClick = navigateToLogin,
                content = { Text("Login") }
            )

            TextButton (
                modifier = Modifier.fillMaxWidth(),
                onClick = navigateToRegister,
                content = { Text("Register") }
            )
        }
    }
}

@Preview
@Composable
fun OnboardingScreenPreview() {
    FarmProfitTheme {
        OnboardingScreen()
    }
}