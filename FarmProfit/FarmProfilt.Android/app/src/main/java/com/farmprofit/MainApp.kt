package com.farmprofit

import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.adaptive.WindowAdaptiveInfo
import androidx.compose.material3.adaptive.currentWindowAdaptiveInfo
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavController
import androidx.navigation.NavDestination
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavHostController
import com.farmprofit.ui.navigation.FarmNavigation
import com.farmprofit.ui.navigation.components.NiaNavigationSuiteScaffold
import com.farmprofit.ui.theme.FarmProfitTheme
import kotlin.reflect.KClass

@Composable
fun MainApp() {
    val appState = rememberFarmAppState()
    val windowAdaptiveInfo: WindowAdaptiveInfo = currentWindowAdaptiveInfo()
    val currentDestination = appState.currentDestination
    val isTopLevelDestination by appState.isTopLevelDestination
    FarmProfitTheme {
        if (isTopLevelDestination) {
            NiaNavigationSuiteScaffold(
                navigationSuiteItems = {
                    // Create a navigation item for each top-level destination
                    // in the app
                    appState.topLevelDestinations.forEach { destination ->
                        val selected = currentDestination
                            .isRouteInHierarchy(destination.route)
                        item(
                            selected = selected,
                            onClick = { appState.navigateToTopLevelDestination(destination) },
                            icon = {
                                Icon(
                                    imageVector = destination.icon,
                                    contentDescription = null,
                                )
                            },
                            label = { Text(stringResource(destination.titleTextId)) },
                            modifier = Modifier
                                .testTag("NiaNavItem")
                        )
                    }
                },
                windowAdaptiveInfo = windowAdaptiveInfo,
            ) {
                FarmMainContent(appState.navController)
            }
        } else {
            FarmMainContent(appState.navController)
        }
    }
}

@Composable
private fun FarmMainContent(
    navController: NavHostController
) {
    Scaffold(
        modifier = Modifier.fillMaxSize(),
    ) { padding ->
        FarmNavigation(
            navController = navController,
            modifier = Modifier.fillMaxSize()
                .padding(padding)
                .consumeWindowInsets(padding)
                .windowInsetsPadding(
                    WindowInsets.safeDrawing.only(
                        WindowInsetsSides.Horizontal,
                    ),
                )
        )
    }
}

private fun NavDestination?.isRouteInHierarchy(route: KClass<*>) =
    this?.hierarchy?.any {
        it.hasRoute(route)
    } ?: false