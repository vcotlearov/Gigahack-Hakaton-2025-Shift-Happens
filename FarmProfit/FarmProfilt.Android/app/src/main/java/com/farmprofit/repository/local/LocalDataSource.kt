package com.farmprofit.repository.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.dataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LocalDataSource @Inject constructor(
    @ApplicationContext private val context: Context
) {
    val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "local_store")

    suspend fun saveAccessToken(accessToken: String) {
        val preferenceKey = stringPreferencesKey(ACCESS_TOKEN)
        context.dataStore.edit { settings ->
            settings[preferenceKey] = accessToken
        }
    }

    suspend fun isLoggedIn(): Boolean {
        val preferenceKey = stringPreferencesKey(ACCESS_TOKEN)
        return context.dataStore.data.map { it[preferenceKey] != null }.firstOrNull() ?: false
    }

    companion object {
        private const val ACCESS_TOKEN = "access_token"
    }
}