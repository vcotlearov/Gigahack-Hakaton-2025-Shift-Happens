package com.farmprofit.ui.features.maplandselection.components

import androidx.compose.runtime.Immutable
import com.google.android.gms.maps.model.LatLng

@Immutable
data class LocationData(val position: LatLng)

class LocationKey