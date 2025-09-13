package com.farmprofit.ui.features.dashboard.navigation

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavOptions
import androidx.navigation.compose.composable
import com.farmprofit.ui.features.dashboard.DashboardScreen
import kotlinx.serialization.Serializable

@Serializable
object DashboardRoute

fun NavGraphBuilder.dashboardScreen(navigateToLand: () -> Unit) {
    composable<DashboardRoute> {
        DashboardScreen(navigateToLand)
    }
}

fun NavController.navigateToDashboard(navOptions: NavOptions) {
    this.navigate(DashboardRoute::class, navOptions)
}