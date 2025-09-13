package com.farmprofit.ui.features.onboarding

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auth0.android.Auth0
import com.auth0.android.authentication.AuthenticationException
import com.auth0.android.callback.Callback
import com.auth0.android.provider.WebAuthProvider
import com.auth0.android.result.Credentials
import com.farmprofit.repository.RepositoryLogin
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val loginRepository: RepositoryLogin
): ViewModel() {
    fun login(context: Context) {
        val callback = object : Callback<Credentials, AuthenticationException> {
            override fun onFailure(error: AuthenticationException) {
                 println("Login failed: ${error.message}")
            }

            override fun onSuccess(result: Credentials) {
                println("Login succeeded: ${result.accessToken}")
                viewModelScope.launch {
                    loginRepository.saveAccessToken(result.accessToken)
                }
            }
        }
        val auth0 = Auth0.getInstance(
            "v4AWtxNb0xVt9zqm4GFhDqy6ku7IALpK",
            "dev-iqadq0gbmsvx3bju.us.auth0.com")
        WebAuthProvider.login(auth0,)
            .withAudience("https://farm-profit-webapp.azurewebsites.net")
            .withScheme("demo")
            .start(context, callback = callback)
    }
}