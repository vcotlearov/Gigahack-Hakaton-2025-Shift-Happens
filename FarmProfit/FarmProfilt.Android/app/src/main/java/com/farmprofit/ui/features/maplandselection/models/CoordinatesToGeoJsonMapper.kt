package com.farmprofit.ui.features.maplandselection.models

import com.farmprofit.ui.features.maplandselection.components.LocationData
import com.farmprofit.ui.features.maplandselection.components.LocationKey
import kotlinx.serialization.json.Json.Default.encodeToString
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive

class CoordinatesToGeoJsonMapper {
    fun dataModelToGeoJson(dataModel: Map<LocationKey, LocationData>): String {
        val coordinates = dataModel.values.map { listOf(it.position.longitude, it.position.latitude) }
        val closedCoordinates = if (coordinates.isNotEmpty() && coordinates.first() != coordinates.last()) {
            coordinates + listOf(coordinates.first())
        } else {
            coordinates
        }
        val feature = mapOf(
            "type" to "Feature",
            "geometry" to mapOf(
                "type" to "Polygon",
                "coordinates" to listOf(closedCoordinates)
            ),
            "properties" to mapOf(
                "id" to "generated-id",
                "name" to "Generated Field",
                "area_m2" to 0.0,
                "area_ha" to 0.0
            )
        )
        val geoJson = mapOf(
            "type" to "FeatureCollection",
            "features" to listOf(feature)
        )
        return encodeToString(
            JsonObject.serializer(),
            JsonObject(geoJson.mapValues { JsonPrimitive(it.value.toString()) })
        )
    }
}
