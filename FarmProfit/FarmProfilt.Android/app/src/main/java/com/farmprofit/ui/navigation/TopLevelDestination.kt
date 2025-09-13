package com.farmprofit.ui.navigation

import androidx.annotation.StringRes
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.ui.graphics.vector.ImageVector
import com.farmprofit.R
import com.farmprofit.ui.features.dashboard.navigation.DashboardRoute
import kotlin.reflect.KClass

enum class TopLevelDestination(
    val icon: ImageVector,
    @StringRes val titleTextId: Int,
    val route: KClass<*>,
) {
    DASHBOARD(
        icon = Icons.Default.Home,
        titleTextId = R.string.dashboard,
        route = DashboardRoute::class
    ),
}