import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="carousel">
      <Stack.Screen name="carousel" options={stackOptions.carousel} />
      <Stack.Screen name="index" options={stackOptions.header} />
    </Stack>
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