import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/login"), 800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0A" }}>
      <Text style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 56, color: "#F5F5F5", letterSpacing: -1 }}>
        Latitud360
      </Text>
      <Text style={{ color: "#F5F5F5", opacity: 0.5, marginTop: 6, fontSize: 14 }}>
        Una latitud. Todas tus operaciones.
      </Text>
      <ActivityIndicator color="#FF6B1A" style={{ marginTop: 32 }} />
    </View>
  );
}
