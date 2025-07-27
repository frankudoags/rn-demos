import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack initialRouteName="carousel">
      <Stack.Screen name="carousel" options={stackOptions.carousel} />
      <Stack.Screen name="index" options={stackOptions.header} />
      <Stack.Screen name="min-max-range-slider" options={stackOptions.header} />
    </Stack>
    </GestureHandlerRootView>
  );
}

type StackScreenOptions = Parameters<typeof Stack.Screen>[0]["options"];

const stackOptions: Record<string, StackScreenOptions> = {
  rootStackOptions: {
    headerShown: false,
  },

  header: {
    headerShown: true,
    title: "Home",
  },

  carousel: {
    headerShown: false,
  },
}