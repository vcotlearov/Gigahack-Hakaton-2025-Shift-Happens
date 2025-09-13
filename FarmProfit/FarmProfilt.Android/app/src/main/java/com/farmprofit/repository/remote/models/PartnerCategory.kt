package com.farmprofit.repository.remote.models

import kotlinx.serialization.Serializable

@Serializable
enum class PartnerCategory(val displayName: String) {
    CROPS("Crops"),
    ORGANIC_SUPPLIES("Organic Supplies"),
    PRODUCE_DISTRIBUTION("Produce Distribution"),
    LIVESTOCK("Livestock"),
    SEEDS_FERTILIZERS("Seeds & Fertilizers"),
    GRAIN_STORAGE("Grain & Storage"),
    HORTICULTURE("Horticulture"),
    FARM_EQUIPMENT("Farm Equipment"),
    AGROCHEMICALS("Agrochemicals"),
    IRRIGATION_SYSTEMS("Irrigation Systems"),
}