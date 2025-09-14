package com.farmprofit.repository

import com.farmprofit.repository.remote.ApiService
import com.farmprofit.repository.remote.models.Partner
import javax.inject.Inject

class RepositoryPartners @Inject constructor(
    private val apiService: ApiService
): BaseRepository {
    suspend fun getPartners(): Result<List<Partner>> {
        return safeApiCall {
            println("RepositoryPartners getPartners")
            apiService.getPartners()
        }
    }
}