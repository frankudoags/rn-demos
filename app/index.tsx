import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    }}>
      <Link href="/carousel">
        <Text>
          Sliding Image Carousel
        </Text>
      </Link>
    </SafeAreaView>
  );
}
