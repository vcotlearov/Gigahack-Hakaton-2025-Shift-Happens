package com.farmprofit.ui.navigation

import androidx.annotation.StringRes
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Handshake
import androidx.compose.material.icons.filled.Home
import androidx.compose.ui.graphics.vector.ImageVector
import com.farmprofit.R
import com.farmprofit.ui.features.dashboard.navigation.DashboardRoute
import com.farmprofit.ui.features.home.navigation.HomeScreenRoute
import kotlin.reflect.KClass

enum class TopLevelDestination(
    val icon: ImageVector,
    @StringRes val titleTextId: Int,
    val route: KClass<*>,
) {
    HOME(
        icon = Icons.Default.Home,
        titleTextId = R.string.home,
        route = HomeScreenRoute::class
    ),

    DASHBOARD(
        icon = Icons.Default.Handshake,
        titleTextId = R.string.partners,
        route = DashboardRoute::class
    )
}