package com.farmprofit.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import com.farmprofit.ui.features.dashboard.navigation.dashboardScreen
import com.farmprofit.ui.features.home.navigation.HomeScreenRoute
import com.farmprofit.ui.features.home.navigation.homeScreen
import com.farmprofit.ui.features.login.navigation.loginScreen
import com.farmprofit.ui.features.maplandselection.MapLandSelectionScreen
import com.farmprofit.ui.features.maplandselection.navigation.LandSelectionRoute
import com.farmprofit.ui.features.onboarding.OnboardingScreen
import com.farmprofit.ui.features.onboarding.navigation.OnboardingRoute
import com.farmprofit.ui.features.register.navigation.registerScreen

@Composable
fun FarmNavigation(
    navController: NavHostController,
    isLoggedIn: Boolean,
    modifier: Modifier = Modifier
) {
    val startDestination = if (isLoggedIn) {
        HomeScreenRoute
    } else {
        OnboardingGraphRoute
    }

    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier
    ) {
        navigation<OnboardingGraphRoute>(startDestination = OnboardingRoute) {
            loginScreen()
            composable<OnboardingRoute> {
                OnboardingScreen(
                    navigateToLogin = {
                        navController.navigate(HomeScreenRoute)
                    },

                    )
            }
            registerScreen()
        }

        composable<LandSelectionRoute> {
            MapLandSelectionScreen(
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }

        dashboardScreen { navController.navigate(LandSelectionRoute) }
        homeScreen()
    }
}