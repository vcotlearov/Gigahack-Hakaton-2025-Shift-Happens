package com.farmprofit.ui.features.home.qr_code_scan

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.farmprofit.repository.RepositoryPartners
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class QrCodePartnersViewModel @Inject constructor(
    private val partnersRepository: RepositoryPartners
) : ViewModel() {

    val partners = flow {
        val partners = partnersRepository.getPartners().getOrNull() ?: emptyList()
        if (partners.isNotEmpty()) {
            emit(partners.subList(0, 4))
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

}