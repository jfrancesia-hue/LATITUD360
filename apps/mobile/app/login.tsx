import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    // TODO: integrar con @supabase/supabase-js
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 800);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 48, color: "#F5F5F5", letterSpacing: -1 }}>
          Latitud360
        </Text>
        <Text style={{ color: "#F5F5F5", opacity: 0.6, marginTop: 6, marginBottom: 40 }}>
          Una latitud. Todas tus operaciones.
        </Text>

        <Text style={{ color: "#F5F5F5", opacity: 0.6, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 8 }}>
          Email
        </Text>
        <TextInput
          autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
          value={email} onChangeText={setEmail}
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 16, marginBottom: 16 }}
        />

        <Text style={{ color: "#F5F5F5", opacity: 0.6, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 8 }}>
          Contraseña
        </Text>
        <TextInput
          secureTextEntry value={password} onChangeText={setPassword}
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 16, marginBottom: 32 }}
        />

        <Pressable
          onPress={submit} disabled={loading || !email || !password}
          style={{ backgroundColor: "#FF6B1A", padding: 16, borderRadius: 9999, alignItems: "center", opacity: loading || !email || !password ? 0.5 : 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Ingresar</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
