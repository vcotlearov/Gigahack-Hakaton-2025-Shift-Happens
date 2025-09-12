package com.farmprofit.ui.features.maplandselection

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.farmprofit.ui.features.maplandselection.components.GoogleMapWithLocations

@Composable
fun MapLandSelectionScreen(
    viewModel: LandSelectionViewModel = hiltViewModel()
) {
    println("GoogleMapWithLocations MapLandSelectionScreen")

    GoogleMapWithLocations(
        viewModel.markersModel,
        modifier = Modifier.fillMaxSize()
            .systemBarsPadding()
    )
}