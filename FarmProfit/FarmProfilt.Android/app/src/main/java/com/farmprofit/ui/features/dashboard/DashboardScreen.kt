package com.farmprofit.ui.features.dashboard

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun DashboardScreen(
    navigateToLandMap: () -> Unit
) {
    Text("Dashboard Screen")
    Button(onClick = navigateToLandMap) {
        Text("Go to Land Map")
    }
}