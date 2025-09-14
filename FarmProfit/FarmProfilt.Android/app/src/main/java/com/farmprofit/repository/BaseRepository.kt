package com.farmprofit.repository

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response
import java.net.HttpURLConnection.HTTP_BAD_REQUEST
import java.net.HttpURLConnection.HTTP_INTERNAL_ERROR
import java.net.HttpURLConnection.HTTP_NOT_FOUND
import java.net.HttpURLConnection.HTTP_UNAUTHORIZED
import java.net.SocketTimeoutException

interface BaseRepository {

    suspend fun <T> safeApiCall(
        dispatcher: CoroutineDispatcher = Dispatchers.IO,
        apiCall: suspend () -> Response<T>
    ): Result<T> {
        return withContext(dispatcher) {
            try {
                val response = apiCall.invoke()
                if (response.isSuccessful) {
                    response.body()?.let {
                        Result.success(it)
                    } ?: Result.failure(FailureType.Unknown("Body was null"))
                } else {
                    val failureType = getFailureTypeResponse(response)
                    Result.failure(failureType)
                }
            } catch (throwable: Throwable) {
                val failureType = getFailureTypeFromThrowable(throwable)
                Result.failure(failureType)
            }
        }
    }
}

sealed class FailureType(override val message: String?) : Throwable(message) {
    data class Timeout(override val message: String? = "Api Call Timeout") : FailureType(message)
    data class Unknown(override val message: String? = "Api Call Unknown") : FailureType(message)
    data class Unauthorized(override val message: String? = "Api Call Unauthorized") :
        FailureType(message)

    data class BadRequest(override val message: String? = "Api Call BadRequest") :
        FailureType(message)

    data class NotFound(override val message: String? = "Api Call NotFound") : FailureType(message)
    data class InternalError(override val message: String? = "Api Call Internal error") :
        FailureType(message)
}

fun <T> getFailureTypeResponse(response: Response<T>): FailureType {
    return when (response.code()) {
        HTTP_UNAUTHORIZED -> FailureType.Unauthorized()
        HTTP_BAD_REQUEST -> FailureType.BadRequest()
        HTTP_NOT_FOUND -> FailureType.NotFound()
        HTTP_INTERNAL_ERROR -> FailureType.InternalError()
        else -> FailureType.Unknown("Error code: ${response.code()}")
    }
}

fun getFailureTypeFromThrowable(throwable: Throwable): FailureType {
    return when (throwable) {
        is SocketTimeoutException -> FailureType.Timeout()
        else -> FailureType.Unknown(throwable.message)
    }
}