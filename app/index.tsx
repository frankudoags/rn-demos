import { SafeAreaContainer } from "@/components/ui/safe-area-container";
import { Link } from "expo-router";
import { Text } from "react-native";

export default function Index() {
  return (
    <SafeAreaContainer style={{
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
      <Link href="/synced-flat-lists">
        <Text>
          3. Synced Flat Lists
        </Text>
      </Link>
      <Link href="/mood-selector">
        <Text>
          4. Mood Selector
        </Text>
      </Link>
      <Link href="/sine-carousel">
        <Text>
          5. Sine Carousel
        </Text>
      </Link>
    </SafeAreaContainer>
  );
}
