package com.farmprofit.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.farmprofit.repository.RepositoryLogin
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val loginRepository: RepositoryLogin
): ViewModel() {

    val isLoggedIn = flow {
        emit(loginRepository.isLoggedIn())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), false)
}