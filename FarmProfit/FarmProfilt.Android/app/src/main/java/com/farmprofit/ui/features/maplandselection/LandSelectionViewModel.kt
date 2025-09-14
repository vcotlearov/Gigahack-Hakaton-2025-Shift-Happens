package com.farmprofit.ui.features.maplandselection

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.farmprofit.ui.features.maplandselection.components.DraggableMarkersModel
import com.farmprofit.ui.features.maplandselection.components.LocationData
import com.farmprofit.ui.features.maplandselection.components.LocationKey
import com.farmprofit.ui.features.maplandselection.models.CoordinatesToGeoJsonMapper
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class LandSelectionViewModel @Inject constructor() : ViewModel() {
    private var dataModel: Map<LocationKey, LocationData> = mapOf()
        set(value) {
            field = value
            markersModel = DraggableMarkersModel(value)
        }

    var markersModel by mutableStateOf(DraggableMarkersModel(dataModel))

    fun createGeoJson() {
        val geoJson = CoordinatesToGeoJsonMapper().dataModelToGeoJson(dataModel)
    }
}