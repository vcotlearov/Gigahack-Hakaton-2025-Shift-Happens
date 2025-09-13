package com.farmprofit.ui.features.home

import com.farmprofit.repository.remote.models.Organization

data class HomeState(
    val organizations: List<Organization> = emptyList(),
    val hasOrganization: Boolean = false
)