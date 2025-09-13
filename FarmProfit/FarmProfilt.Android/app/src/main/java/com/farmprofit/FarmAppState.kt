package com.farmprofit

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.navigation.NavDestination
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navOptions
import com.farmprofit.ui.features.dashboard.navigation.navigateToDashboard
import com.farmprofit.ui.navigation.TopLevelDestination
import kotlin.reflect.KClass

@Stable
class FarmAppState(
    val navController: NavHostController
) {
    private val previousDestination = mutableStateOf<NavDestination?>(null)
    var isTopLevelDestination = mutableStateOf(false)
    val currentDestination: NavDestination?
        @Composable get() {
            // Collect the currentBackStackEntryFlow as a state
            val currentEntry = navController.currentBackStackEntryFlow
                .collectAsState(initial = null)

            // Fallback to previousDestination if currentEntry is null
            return currentEntry.value?.destination.also { destination ->
                if (destination != null) {
                    previousDestination.value = destination
                }
            } ?: previousDestination.value
        }

    val currentTopLevelDestination: TopLevelDestination?
        @Composable get() {
            return TopLevelDestination.entries.firstOrNull { topLevelDestination ->
                currentDestination?.hasRoute(route = topLevelDestination.route) == true
            }
        }

    val topLevelDestinations: List<TopLevelDestination> = TopLevelDestination.entries

    fun navigateToTopLevelDestination(topLevelDestination: TopLevelDestination) {
            val topLevelNavOptions = navOptions {
                // Pop up to the start destination of the graph to
                // avoid building up a large stack of destinations
                // on the back stack as users select items
                popUpTo(navController.graph.findStartDestination().id) {
                    saveState = true
                }
                // Avoid multiple copies of the same destination when
                // reselecting the same item
                launchSingleTop = true
                // Restore state when reselecting a previously selected item
                restoreState = true
            }

            when (topLevelDestination) {
                TopLevelDestination.DASHBOARD -> navController.navigateToDashboard(topLevelNavOptions)
            }
        }
}

@Composable
fun rememberFarmAppState(
    navController: NavHostController = rememberNavController(),
): FarmAppState {
    return remember(
        navController,
    ) {
        val state = FarmAppState(
            navController = navController,
        )
        navController.addOnDestinationChangedListener {
            _, destination, _ ->
            val isTopLevel = TopLevelDestination.entries.any { destination.hasRoute(it.route) }

            // Update the state only if it has changed to avoid unnecessary recompositions
            if (state.isTopLevelDestination.value != isTopLevel) {
                state.isTopLevelDestination.value = isTopLevel
            }
        }
        state
    }
}

private fun NavDestination?.isRouteInHierarchy(route: KClass<*>) =
    this?.hierarchy?.any {
        it.hasRoute(route)
    } ?: false