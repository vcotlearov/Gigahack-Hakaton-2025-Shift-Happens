package com.farmprofit.ui.features.onboarding

import android.content.Context
import androidx.lifecycle.ViewModel
import com.auth0.android.Auth0
import com.auth0.android.authentication.AuthenticationException
import com.auth0.android.callback.Callback
import com.auth0.android.provider.WebAuthProvider
import com.auth0.android.result.Credentials

class OnboardingViewModel: ViewModel() {
    fun login(context: Context) {
        val callback = object : Callback<Credentials, AuthenticationException> {
            override fun onFailure(error: AuthenticationException) {
                // Log.e("Auth0", "Login failed: ${error.message}")
            }

            override fun onSuccess(result: Credentials) {
                // Log.d("Auth0", "Login succeeded: ${result.accessToken}")
            }
        }
        val auth0 = Auth0.getInstance(
            "v4AWtxNb0xVt9zqm4GFhDqy6ku7IALpK",
            "dev-iqadq0gbmsvx3bju.us.auth0.com")
        WebAuthProvider.login(
            auth0,
        ).start(context, callback = callback)
    }
}