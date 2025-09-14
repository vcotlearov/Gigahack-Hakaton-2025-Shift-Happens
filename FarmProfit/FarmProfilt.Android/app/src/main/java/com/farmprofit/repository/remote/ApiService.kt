package com.farmprofit.repository.remote

import com.farmprofit.repository.remote.models.Partner
import retrofit2.Response
import retrofit2.http.GET

interface ApiService {
    @GET("/api/resources/partners")
    suspend fun getPartners(): Response<List<Partner>>
}