package com.farmprofit.ui.features.home.navigation

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavOptions
import androidx.navigation.compose.composable
import com.farmprofit.ui.features.home.HomeScreen
import kotlinx.serialization.Serializable

@Serializable
object HomeScreenRoute

fun NavGraphBuilder.homeScreen() {
    composable<HomeScreenRoute> {
        HomeScreen()
    }
}

fun NavController.navigateToHome(navOptions: NavOptions) {
    this.navigate(HomeScreenRoute::class, navOptions)
}