package com.farmprofit.ui.features.home

import androidx.lifecycle.ViewModel
import com.farmprofit.repository.remote.models.Organization
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor() : ViewModel() {
    private val _state = MutableStateFlow(HomeState())
    val state = _state.asStateFlow()

    init {
        getOrganizations()
    }

    fun getOrganizations() {
        val organizations = listOf(
            Organization(
                name = "Green Acres Farm",
                registrationDate = "2020-05-15",
                idno = "GA123456",
                activeAssets = 150,
                currentBalance = "$12,500",
                isVerifiedByAipa = true,
                farmLevel = "Level 1"
            ),
            Organization(
                name = "Sunny Fields Co-op",
                registrationDate = "2019-03-22",
                idno = "SF654321",
                activeAssets = 200,
                currentBalance = "$20,000",
                isVerifiedByAipa = false,
                farmLevel = "Level 2"
            )
        )
        _state.update { current -> current.copy(organizations = organizations) }
    }

}