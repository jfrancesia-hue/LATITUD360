import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B1A",
        tabBarInactiveTintColor: "#F5F5F580",
        tabBarStyle: { backgroundColor: "#0A0A0A", borderTopColor: "#1F1F1F" },
        headerStyle: { backgroundColor: "#0A0A0A" },
        headerTintColor: "#F5F5F5",
      }}
    >
      <Tabs.Screen name="index"   options={{ title: "Inicio" }} />
      <Tabs.Screen name="shift"   options={{ title: "Mi turno" }} />
      <Tabs.Screen name="report"  options={{ title: "Reportar" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
