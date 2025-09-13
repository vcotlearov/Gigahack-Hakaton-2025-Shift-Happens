package com.farmprofit.repository

import com.farmprofit.repository.local.LocalDataSource
import javax.inject.Inject

class RepositoryLogin @Inject constructor(
    private val localDataSource: LocalDataSource
) {

    suspend fun saveAccessToken(token: String) {
        localDataSource.saveAccessToken(accessToken = token)
    }

    suspend fun isLoggedIn(): Boolean {
        val token = localDataSource.getAccessToken()
        return !token.isNullOrEmpty()
    }

}