package ai.secureprivacy.reactnativemobileconsent

import ai.secureprivacy.mobileconsent.cross_platform.enginestore.EngineStore
import ai.secureprivacy.mobileconsent.cross_platform.platform.BasePlatformEventHandler
import ai.secureprivacy.mobileconsent.cross_platform.platform.SPPlatformError
import ai.secureprivacy.mobileconsent.cross_platform.platform.SPPlatformEventHandler
import ai.secureprivacy.mobileconsent.cross_platform.platform.SPPlatformExecutor
import ai.secureprivacy.mobileconsent.cross_platform.platform.SPPlatformHandler
import ai.secureprivacy.mobileconsent.cross_platform.platform.SPPlatformMethod
import ai.secureprivacy.mobileconsent.cross_platform.platform.SPPlatformStrings.unknownError
import ai.secureprivacy.mobileconsent.cross_platform.support.SPPlatformResult
import ai.secureprivacy.mobileconsent.cross_platform.support.SPPlatformStrings
import ai.secureprivacy.mobileconsent.cross_platform.support.toJsonObject
import ai.secureprivacy.mobileconsent.cross_platform.support.toSPMessage
import ai.secureprivacy.mobileconsent.support.SPLogger
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class ReactNativeMobileConsentModule(reactContext: ReactApplicationContext) :
  NativeReactNativeMobileConsentSpec(reactContext) {

  private val appContext: Context
    get() = reactApplicationContext.applicationContext

  private var eventHandler: SPPlatformEventHandler? = null

  private fun getOrCreateEventHandler(): SPPlatformEventHandler {
    if (eventHandler == null) {
      eventHandler = object : BasePlatformEventHandler() {
        override suspend fun emit(message: String) = emitOnSPEvent(message)

      }
    }
    return eventHandler!!
  }

  override fun setLogConfigs(payload: String?, promise: Promise) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.LogConfig,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun getLocale(payload: String?, promise: Promise) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.GetLocale,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun initialiseSDK(payload: String?, promise: Promise) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.Initialise,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun getClientId(payload: String?, promise: Promise) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.GetClientId,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun getConsentStatus(payload: String?, promise: Promise) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.GetConsentStatus,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun getLastConsentedAt(
    payload: String?,
    promise: Promise
  ) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.GetLastConsentedAt,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun getConsentRecollectionReason(
    payload: String?,
    promise: Promise
  ) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.GetConsentRecollectionReason,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun showConsentBanner(promise: Promise) =
    SPPlatformExecutor.dispatch(
      SPPlatformMethod.ShowConsentBanner,
      null,
      promise.wrapper(),
      ::operation
    )

  override fun showSecondaryBanner(promise: Promise) =
    SPPlatformExecutor.dispatch(
      SPPlatformMethod.ShowSecondaryConsentBanner,
      null,
      promise.wrapper(),
      ::operation
    )

  override fun showPreferenceCenter(
    payload: String?, promise: Promise
  ) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.ShowPreferenceCenter,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun getPackage(
    payload: String?, promise: Promise
  ) = SPPlatformExecutor.dispatch(
    SPPlatformMethod.GetPackage,
    payload,
    promise.wrapper(),
    ::operation
  )

  override fun clearSession(promise: Promise) =
    SPPlatformExecutor.dispatch(SPPlatformMethod.ClearSession, null, promise.wrapper(), ::operation)

  override fun addConsentEventListener(payload: String?) {
    if (payload == null) return
    getOrCreateEventHandler() // Trigger event handler creation in case user registers event before init
    CoroutineScope(Dispatchers.Main).launch {
      try {
        operation(SPPlatformMethod.AddListener, JSONObject(payload))
      } catch (error: Exception) {
        SPLogger.e(TAG, "addConsentEventListener($payload)", error)
      }
    }
  }

  override fun removeConsentEventListener(payload: String?) {
    if (payload == null) return
    CoroutineScope(Dispatchers.Main).launch {
      try {
        operation(SPPlatformMethod.RemoveListener, JSONObject(payload))
      } catch (error: Exception) {
        SPLogger.e(TAG, "removeConsentEventListener($payload)", error)
      }
    }
  }

  /**
   * Executes the platform operation corresponding to the given [SPPlatformMethod].
   *
   * Converts input payloads from Flutter into [JSONObject] and maps the result to JSON
   * to be sent back via the method channel.
   *
   * @param method The [SPPlatformMethod] to execute.
   * @param payload Optional JSON payload from Flutter.
   * @return The result of the operation as [JSONObject].
   */
  private suspend fun operation(method: SPPlatformMethod, payload: JSONObject?) = when (method) {
    SPPlatformMethod.GetBuildVersion -> JSONObject().apply {
      put("code", 200)
      put("msg", "")
      put("data", ReactNativeMobileConsentConfig.BUILD_VERSION)
    }

    SPPlatformMethod.LogConfig -> SPPlatformHandler.setLogsConfig(payload)
      .toJsonObject()

    SPPlatformMethod.Initialise -> SPPlatformHandler.initialiseSDK(
      appContext, payload, getOrCreateEventHandler()
    ).let {
      it.data?.let { engine -> EngineStore.setEngine(engine) }
      it.toSPMessage().toJsonObject()
    }

    SPPlatformMethod.GetLocale -> SPPlatformHandler.getLocale(payload)
      .toJsonObject { locale -> locale }

    SPPlatformMethod.GetConsentStatus -> SPPlatformHandler.getConsentStatus(payload)
      .toJsonObject { it?.key }

    SPPlatformMethod.GetLastConsentedAt -> SPPlatformHandler.getLastConsentedAt(payload)
      .toJsonObject { it }

    SPPlatformMethod.ShowConsentBanner -> SPPlatformHandler.displayConsentBanner(
      reactApplicationContext.currentActivity
    ).toJsonObject()

    SPPlatformMethod.ShowSecondaryConsentBanner -> SPPlatformHandler.displaySecondaryBanner(
      reactApplicationContext.currentActivity
    ).toJsonObject()

    SPPlatformMethod.ShowPreferenceCenter -> SPPlatformHandler.displayPreferenceCenter(
      reactApplicationContext.currentActivity, payload
    ).toJsonObject()

    SPPlatformMethod.GetClientId -> SPPlatformHandler.getClientId(payload)
      .toJsonObject { clientId -> clientId }

    SPPlatformMethod.GetPackage -> SPPlatformHandler.getPackage(payload)
      .toJsonObject { it?.toJsonObject() }

    SPPlatformMethod.GetCollectedConsentInfo -> SPPlatformHandler.getCollectedConsentInfo(
      payload
    ).toJsonObject { consentData ->
      consentData?.let {
        val array = JSONArray()
        for (consent in consentData) {
          val consentJson = consent.toJsonObject()
          array.put(consentJson)
        }
        return@toJsonObject array
      }
    }

    SPPlatformMethod.AddListener -> SPPlatformHandler.addListener(payload).toJsonObject()

    SPPlatformMethod.RemoveListener -> SPPlatformHandler.removeListener(payload).toJsonObject()

    SPPlatformMethod.ClearSession -> {
      EngineStore.setEngine(null)
      eventHandler?.deInit()
      eventHandler = null
      SPPlatformHandler.clearSession().toJsonObject()
    }

    else -> JSONObject().apply {
      put("code", 500)
      put("msg", unknownError(SPPlatformError.INVALID_PLATFORM_METHOD))
      put("error", SPPlatformError.INVALID_PLATFORM_METHOD.code)
    }
  }

  override fun invalidate() {
    super.invalidate()
    CoroutineScope(Dispatchers.Main).launch {
      eventHandler?.deInit()
    }
    eventHandler = null
  }

  companion object {
    const val NAME = NativeReactNativeMobileConsentSpec.NAME
    private const val TAG = "ReactNativeMobileConsentModule"
  }

  private fun Promise.wrapper() =
    object : SPPlatformResult {
      override fun error(
        errorCode: String,
        errorMessage: String,
        errorDetails: Any?
      ) {
        reject(errorCode, errorMessage, Throwable("$errorDetails"))
      }

      override fun notImplemented() {
        reject(Throwable(SPPlatformStrings.unknownError(SPPlatformError.INVALID_PLATFORM_METHOD)))
      }

      override fun success(result: Any) {
        resolve(result)
      }

    }
}
