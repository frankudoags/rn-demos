import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const images = [
  { id: "1", source: require("@/assets/images/dogs/dog-1.webp") },
  { id: "2", source: require("@/assets/images/dogs/dog-2.webp") },
  { id: "3", source: require("@/assets/images/dogs/dog-3.webp") },
  { id: "4", source: require("@/assets/images/dogs/dog-4.webp") },
  { id: "5", source: require("@/assets/images/dogs/dog-5.webp") },
  { id: "6", source: require("@/assets/images/dogs/dog-6.webp") },
  { id: "7", source: require("@/assets/images/dogs/dog-1.webp") },
  { id: "8", source: require("@/assets/images/dogs/dog-2.webp") },
  { id: "9", source: require("@/assets/images/dogs/dog-3.webp") },
  { id: "10", source: require("@/assets/images/dogs/dog-4.webp") },
  { id: "11", source: require("@/assets/images/dogs/dog-5.webp") },
  { id: "12", source: require("@/assets/images/dogs/dog-6.webp") },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const ITEM_SIZE = SCREEN_WIDTH * 0.23; // 23% of the screen width
const SPACING = 12;
const ITEM_SIZE_WITH_SPACING = ITEM_SIZE + SPACING;

interface CarouselItemProps {
  item: { id: string; source: any };
  index: number;
  scrollX: SharedValue<number>;
}
const CarouselItem = ({ item, index, scrollX }: CarouselItemProps) => {
  const rstyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    const outputRange = [ITEM_SIZE / 3, 0, ITEM_SIZE / 3];

    return {
      borderWidth: 4,
      borderColor: interpolateColor(scrollX.value, inputRange, [
        "transparent",
        "gray",
        "transparent",
      ]),
      transform: [
        {
          translateY: interpolate(scrollX.value, inputRange, outputRange),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          borderRadius: ITEM_SIZE / 2,
          overflow: "hidden",
        },
        rstyle,
      ]}
    >
      <Image
        source={item.source}
        style={{
          flex: 1,
          borderRadius: ITEM_SIZE / 2,
        }}
      />
    </Animated.View>
  );
};

const Slider = () => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = clamp(
        event.contentOffset.x / ITEM_SIZE_WITH_SPACING,
        0,
        images.length - 1
      );
      const newActiveIndex = Math.round(scrollX.value);
      if (newActiveIndex !== activeIndex) {
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });
  return (
    <View
      style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#000 " }}
    >
      <Animated.Image
        key={`active-image-${activeIndex}`}
        entering={FadeIn.duration(100)}
        exiting={FadeOut.duration(100)}
        source={images[activeIndex].source}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          ...StyleSheet.absoluteFillObject,
        }}
        resizeMode="cover"
      />
      <Animated.FlatList
        data={images}
        style={{
          flexGrow: 0,
          height: ITEM_SIZE * 2,
        }}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - ITEM_SIZE) / 2,
          gap: SPACING,
        }}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CarouselItem
            key={index}
            index={index}
            item={item}
            scrollX={scrollX}
          />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_SIZE_WITH_SPACING}
        decelerationRate={"fast"}
      />
    </View>
  );
};

export default Slider;

