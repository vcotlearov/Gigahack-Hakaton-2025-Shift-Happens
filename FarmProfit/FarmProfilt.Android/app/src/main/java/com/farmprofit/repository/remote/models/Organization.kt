package com.farmprofit.repository.remote.models

data class Organization(
    val name: String,
    val registrationDate: String,
    val idno: String,
    val activeAssets: Int,
    val currentBalance: String,
    val isVerifiedByAipa: Boolean,
    val farmLevel: String,
)