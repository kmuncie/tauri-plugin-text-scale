package org.silvermine.plugin.textscale

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import org.silvermine.textscale.AndroidTextScale

// Android side of the Rust `register_android_plugin(..., "TextScalePlugin")` bridge.
@TauriPlugin
class TextScalePlugin(private val activity: Activity) : Plugin(activity) {
   @Command
   fun getTextScale(invoke: Invoke) {
      invoke.resolve(JSObject().put("value", currentScale()))
   }

   private fun currentScale(): Double {
      return AndroidTextScale.fromFontScale(activity.resources.configuration.fontScale)
   }
}
