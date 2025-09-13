package com.farmprofit.ui.features.maplandselection

import android.Manifest
import android.content.Context
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.hilt.navigation.compose.hiltViewModel
import com.farmprofit.ui.components.BackButtonBar
import com.farmprofit.ui.features.maplandselection.components.GoogleMapWithLocations
import com.farmprofit.ui.utils.isPermissionGranted

@Composable
fun MapLandSelectionScreen(
    viewModel: LandSelectionViewModel = hiltViewModel(),
    onNavigateBack: () -> Unit = {}
) {
    val context = LocalContext.current
    var isLocationPermissionGranted by remember {
        val isGranted = isLocationPermissionGranted(context)
        mutableStateOf(isGranted)
    }

    val requestPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissionsMap ->
        val allGranted = permissionsMap.all { it.value }
        isLocationPermissionGranted = allGranted
    }

    LaunchedEffect(isLocationPermissionGranted) {
        if (!isLocationPermissionGranted) {
            requestPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION
                )
            )
        }
    }

    Column(Modifier.fillMaxSize()) {
        BackButtonBar("Land") {
            onNavigateBack()
        }

        if (isLocationPermissionGranted) {
            GoogleMapWithLocations(
                viewModel.markersModel,
                modifier = Modifier
                    .fillMaxSize()
            )
        }
    }
}

private fun isLocationPermissionGranted(context: Context): Boolean {
    return context.isPermissionGranted(Manifest.permission.ACCESS_FINE_LOCATION) &&
            context.isPermissionGranted(Manifest.permission.ACCESS_COARSE_LOCATION)
}