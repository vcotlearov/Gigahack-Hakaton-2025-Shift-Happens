package com.farmprofit.ui.features.register.navigation

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.farmprofit.ui.features.login.navigation.LoginRoute
import com.farmprofit.ui.features.register.RegisterScreen
import kotlinx.serialization.Serializable

@Serializable
object RegisterRoute

fun NavGraphBuilder.registerScreen() {
    composable<RegisterRoute> {
        RegisterScreen()
    }
}