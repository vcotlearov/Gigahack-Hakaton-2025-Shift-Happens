package com.farmprofit.ui.features.maplandselection.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.key
import androidx.compose.runtime.snapshots.SnapshotStateMap
import androidx.compose.runtime.toMutableStateMap
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.MarkerState

@Stable
class DraggableMarkersModel(dataModel: Map<LocationKey, LocationData>) {
    // This initializes MarkerState from our model once (model is initial source of truth)
    // and never updates it from the model afterwards.
    // See SyncingDraggableMarkerWithDataModelActivity for rationale.
    private val markerDataMap: SnapshotStateMap<LocationKey, MarkerState> =
        dataModel.entries.map { (locationKey, locationData) ->
            locationKey to MarkerState(locationData.position)
        }.toMutableStateMap()

    /** Add new marker location to model */
    fun addLocation(locationData: LocationData) {
        markerDataMap += LocationKey() to MarkerState(locationData.position)
    }

    /** Delete marker location from model */
    private fun deleteLocation(locationKey: LocationKey) {
        markerDataMap -= locationKey
    }

    /**
     * Render Markers from model
     */
    @Composable
    fun Markers() = markerDataMap.forEach { (locationKey, markerState) ->
        key(locationKey) {
            LocationMarker(
                markerState,
                onClick = { deleteLocation(locationKey) }
            )
        }
    }

    /**
     * List of functions providing current positions of Markers.
     *
     * Calling from composition will trigger recomposition when Markers and their positions
     * change.
     */
    val markerPositionsModel: List<() -> LatLng>
        get() = markerDataMap.values.map { { it.position } }
}