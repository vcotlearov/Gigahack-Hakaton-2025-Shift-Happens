package com.farmprofit.ui.features.maplandselection.components

import android.content.Context
import androidx.annotation.DrawableRes
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import com.google.android.gms.maps.model.BitmapDescriptor
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapProperties
import com.google.maps.android.compose.MapType
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.Polygon
import com.google.maps.android.compose.rememberCameraPositionState
import androidx.core.graphics.createBitmap
import com.farmprofit.R

/**
 * A GoogleMap with locations represented by markers
 */
@Composable
fun GoogleMapWithLocations(
    markersModel: DraggableMarkersModel,
    modifier: Modifier = Modifier
) {
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(LatLng(47.06335, 28.867542), 15f)
    }
    GoogleMap(
        modifier = modifier,
        cameraPositionState = cameraPositionState,
        properties = MapProperties(
            mapType = MapType.SATELLITE,
            isMyLocationEnabled = true
        ),
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
) {
    val context = LocalContext.current
    Marker(
        state = markerState,
        draggable = true,
        onClick = {
            onClick()
            true
        },
        icon = bitmapDescriptorFromVector(
            context, R.drawable.custom_marker
        )
    )
}

/**
 * A Polygon. Helps isolate recompositions while a Marker is being dragged.
 */
@Composable
private fun Polygon(markerPositionsModel: () -> List<() -> LatLng>) {
    val movingMarkerPositions = markerPositionsModel()

    val markerPositions = movingMarkerPositions.map { it() }
    if (markerPositions.isNotEmpty()) {
        Polygon(markerPositions,
            fillColor = Color.Cyan.copy(alpha = 0.3f),
            strokeColor = Color.Cyan
        )
    }
}

fun bitmapDescriptorFromVector(
    context: Context,
    @DrawableRes vectorResId: Int
): BitmapDescriptor? {
    val drawable = ContextCompat.getDrawable(context, vectorResId) ?: return null
    drawable.setBounds(0, 0, drawable.intrinsicWidth, drawable.intrinsicHeight)
    val bm = createBitmap(drawable.intrinsicWidth, drawable.intrinsicHeight)
    val canvas = android.graphics.Canvas(bm)
    drawable.draw(canvas)
    return BitmapDescriptorFactory.fromBitmap(bm)
}