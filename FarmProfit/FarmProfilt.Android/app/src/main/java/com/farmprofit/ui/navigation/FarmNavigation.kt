package com.farmprofit.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import androidx.navigation.compose.rememberNavController
import com.farmprofit.ui.features.login.navigation.loginScreen
import com.farmprofit.ui.features.maplandselection.MapLandSelectionScreen
import com.farmprofit.ui.features.maplandselection.navigation.LandSelectionRoute
import com.farmprofit.ui.features.onboarding.OnboardingScreen
import com.farmprofit.ui.features.onboarding.navigation.OnboardingRoute
import com.farmprofit.ui.features.register.navigation.registerScreen

@Composable
fun FarmNavigation(
    modifier: Modifier = Modifier
) {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = OnboardingGraphRoute,
        modifier = modifier
    ) {
        navigation<OnboardingGraphRoute>(startDestination = OnboardingRoute) {
            loginScreen()
            composable<OnboardingRoute> {
                OnboardingScreen(
                    navigateToLogin = {
                        navController.navigate(LandSelectionRoute)
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
    }
}