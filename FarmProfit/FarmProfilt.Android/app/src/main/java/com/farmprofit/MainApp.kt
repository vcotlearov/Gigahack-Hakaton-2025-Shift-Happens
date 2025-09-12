package com.farmprofit

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.farmprofit.ui.navigation.FarmNavigation
import com.farmprofit.ui.theme.FarmProfitTheme

@Composable
fun MainApp() {
    FarmProfitTheme {
        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
            FarmNavigation(
                modifier = Modifier.padding(innerPadding)
            )
        }
    }
}