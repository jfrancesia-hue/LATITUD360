import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../src/lib/auth-store";
import { syncPending } from "../src/lib/api";

export default function RootLayout() {
  const restore = useAuth((s) => s.restore);

  useEffect(() => {
    restore();
    // Drenar cola al arrancar; los siguientes intentos los gatilla cada
    // mutation/login. En una iteración siguiente se conecta a NetInfo.
    syncPending().catch(() => {});
  }, [restore]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0A0A0A" },
          headerTintColor: "#F5F5F5",
          headerTitleStyle: { fontWeight: "500" },
          contentStyle: { backgroundColor: "#0A0A0A" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="incident/new" options={{ presentation: "modal", title: "Reportar incidente" }} />
        <Stack.Screen name="permit/new" options={{ presentation: "modal", title: "Solicitar permiso" }} />
        <Stack.Screen name="recognize/new" options={{ presentation: "modal", title: "Reconocer a alguien" }} />
        <Stack.Screen name="daily-report/new" options={{ presentation: "modal", title: "Parte diario" }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
