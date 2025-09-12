package com.farmprofit.ui.features.maplandselection.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.Polygon
import com.google.maps.android.compose.rememberCameraPositionState

/**
 * A GoogleMap with locations represented by markers
 */
@Composable
fun GoogleMapWithLocations(
    markersModel: DraggableMarkersModel,
    modifier: Modifier = Modifier
) {
    val cameraPositionState = rememberCameraPositionState { position = CameraPosition.fromLatLngZoom(LatLng(47.06335, 28.867542), 11f) }
    GoogleMap(
        modifier = modifier,
        cameraPositionState = cameraPositionState,
        onMapClick = { position -> markersModel.addLocation(LocationData(position)) }
    ) {
        markersModel.Markers()

        Polygon(markersModel::markerPositionsModel)
    }
}

/**
 * A draggable GoogleMap Marker representing a location on the map
 */
@Composable
inline fun LocationMarker(
    markerState: MarkerState,
    crossinline onClick: () -> Unit
) = Marker(
    state = markerState,
    draggable = true,
    onClick = {
        onClick()

        true
    }
)

/**
 * A Polygon. Helps isolate recompositions while a Marker is being dragged.
 */
@Composable
private fun Polygon(markerPositionsModel: () -> List<() -> LatLng>) {
    val movingMarkerPositions = markerPositionsModel()

    val markerPositions = movingMarkerPositions.map { it() }
    if (markerPositions.isNotEmpty()) {
        Polygon(markerPositions)
    }
}