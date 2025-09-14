package com.farmprofit.ui.features.home.qr_code_scan.navigation

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.farmprofit.ui.features.home.qr_code_scan.QrCodeScreen
import kotlinx.serialization.Serializable

@Serializable
object QrCodeScan

fun NavGraphBuilder.qrCodePartnersScreen(onNavigateBack: () -> Unit) {
    composable<QrCodeScan> {
        QrCodeScreen(onNavigateBack)
    }
}

fun NavController.navigateToQrCodePartners() {
    this.navigate(QrCodeScan)
}