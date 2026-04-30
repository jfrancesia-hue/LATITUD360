import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: "#0A0A0A" },
        headerTintColor: "#F5F5F5",
        headerTitleStyle: { fontWeight: "500" },
        contentStyle: { backgroundColor: "#0A0A0A" },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="incident/new" options={{ presentation: "modal", title: "Reportar incidente" }} />
        <Stack.Screen name="permit/new" options={{ presentation: "modal", title: "Solicitar permiso" }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
