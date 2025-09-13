package com.farmprofit.repository.remote.models

import com.google.gson.annotations.SerializedName

data class Partner(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("category")
    val category: String
)