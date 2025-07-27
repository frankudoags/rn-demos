import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{
      flex: 1,
      alignItems: "center",
      gap: 20,
    }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        RN Demos
      </Text>
      <Link href="/carousel">
        <Text>
          1. Sliding Image Carousel
        </Text>
      </Link>
      <Link href="/min-max-range-slider">
        <Text>
         2. Min-Max Range Slider
        </Text>
      </Link>
    </SafeAreaView>
  );
}
