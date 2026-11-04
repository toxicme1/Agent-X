package com.androidagent;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class DeviceToolsModule extends ReactContextBaseJavaModule {
  DeviceToolsModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "DeviceToolsModule";
  }

  @ReactMethod
  public void getDeviceInfo(Promise promise) {
    try {
      ReactApplicationContext ctx = getReactApplicationContext();
      PackageManager pm = ctx.getPackageManager();
      PackageInfo pInfo = pm.getPackageInfo(ctx.getPackageName(), 0);
      com.facebook.react.bridge.WritableNativeMap map = new com.facebook.react.bridge.WritableNativeMap();
      map.putString("brand", Build.BRAND);
      map.putString("model", Build.MODEL);
      map.putString("device", Build.DEVICE);
      map.putString("version", Build.VERSION.RELEASE);
      map.putString("sdk", String.valueOf(Build.VERSION.SDK_INT));
      map.putString("packageName", ctx.getPackageName());
      map.putString("versionName", pInfo.versionName);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("ERR", e.getMessage());
    }
  }

  @ReactMethod
  public void runShell(String command, boolean approved, Promise promise) {
    if (!approved) {
      promise.reject("NOT_APPROVED", "Command not approved");
      return;
    }
    new Thread(() -> {
      try {
        Process process = Runtime.getRuntime().exec(new String[]{"sh", "-c", command});
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder out = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
          out.append(line).append("\n");
          if (out.length() > 8000) break;
        }
        process.waitFor();
        com.facebook.react.bridge.WritableNativeMap map = new com.facebook.react.bridge.WritableNativeMap();
        map.putString("output", out.toString());
        map.putInt("exitCode", process.exitValue());
        promise.resolve(map);
      } catch (Exception e) {
        promise.reject("ERR", e.getMessage());
      }
    }).start();
  }
}
