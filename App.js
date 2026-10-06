import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Dubora</Text>
        <Text style={styles.subtitle}>Studio de doublage mobile</Text>
        <Text style={styles.status}>Démarrage OK</Text>
        <Text style={styles.info}>Test de démarrage natif</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#101114"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "800"
  },
  subtitle: {
    color: "#aeb4c0",
    fontSize: 17,
    marginTop: 6
  },
  status: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 40
  },
  info: {
    color: "#7f8794",
    fontSize: 15,
    marginTop: 8
  }
});