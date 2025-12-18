import { Dog, dog_list } from "@/components/image-list";
import {
  BackdropFilter,
  Blur,
  Canvas,
  RoundedRect,
} from "@shopify/react-native-skia";
import { Image, ImageBackground } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// lets get the sizes and constants down
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const IMAGE_SIZE = 40;
const IMAGE_BORDER_RADIUS = 12;
const ITEM_WIDTH = SCREEN_WIDTH * 0.5;
const ITEM_VERTICAL_PADDING = 10;
const ITEM_HORIZONTAL_PADDING = 14;
const ITEM_HEIGHT = IMAGE_SIZE + ITEM_VERTICAL_PADDING * 2;
const TITLE_SIZE = 14;
const SUBTITLE_SIZE = 12;
const BORDER_RADIUS = 16;
const INITIAL_MARGIN_TOP = ITEM_HEIGHT * 4;
const ITEMS_LENGTH = dog_list.length;

// wave parameters
const WAVE_FREQUENCY = 0.01; // controls the frequency of the sine wave, tweaked till it looked good
const INITIAL_AMPLITUDE = 80;

const SineCarousel = () => {
  //shared value to track scroll position
  const scrollY = useSharedValue(0);

  //shared value to control amplitude of sine wave
  const amplitude = useSharedValue(INITIAL_AMPLITUDE);
  // initial amplitude to calculate relative changes during pinch
  const initialAmplitude = useSharedValue(INITIAL_AMPLITUDE);

  //scroll handler to update scrollY
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      initialAmplitude.value = amplitude.value;
    })
    .onUpdate((e) => {
      amplitude.value = initialAmplitude.value * e.scale;
    });

  return (
    <GestureDetector gesture={pinchGesture}>
      <View style={{ flex: 1, backgroundColor: "#111" }}>
        <Animated.FlatList
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          data={dog_list}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <DogItem
              index={index}
              item={item}
              scrollY={scrollY}
              amplitude={amplitude}
            />
          )}
        />
      </View>
    </GestureDetector>
  );
};

export default SineCarousel;

const styles = StyleSheet.create({
  listContainer: {
    alignItems: "center",
    paddingVertical: INITIAL_MARGIN_TOP,
    paddingBottom: INITIAL_MARGIN_TOP * 3,
  },
});

interface DogItemProps {
  index: number;
  item: Dog;
  scrollY: SharedValue<number>;
  amplitude: SharedValue<number>;
}

const DogItem = ({ index, item, scrollY, amplitude }: DogItemProps) => {
  const rStyle = useAnimatedStyle(() => {
    // calculate vertical position of the item based on its index and current scroll position
    // this is the value that we plug into the sine function to get the horizontal offset
    const y = index * ITEMS_LENGTH - scrollY.value + INITIAL_MARGIN_TOP;
    //f(x) = A.sin(kx) - the sine wave function
    // A = amplitude, k = WAVE_FREQUENCY
    // x is the horizontal offset, y is the vertical position
    // we use y to calculate x to make the wave go horizontally as we scroll vertically
    const x = Math.sin(y * WAVE_FREQUENCY) * amplitude.value;
    //slope f'(x) = A.k.cos(kx), the derivative of the sine wave function
    // to calculate the slope at point y
    //slope is used to determine rotation angle of the item based on the wave's slope at that point
    const slope =
      WAVE_FREQUENCY * amplitude.value * Math.cos(y * WAVE_FREQUENCY);
    // rotation in radians: atan(-f'(x)) to get the angle of rotation
    // we use the negative slope to tilt in the opposite direction of the slope for a more natural effect,
    // like how a car would tilt when going over hills.
    // I didn't know that before implementing this :)
    //and I learned this from trial and error and asking "You're absolutely right"
    const rotation = Math.atan(-slope);

    // Calculate which item position is currently at the top of the viewport
    const currentScrollIndex = scrollY.value / ITEM_HEIGHT;
    // Scale items based on their distance from the current scroll index
    const scale = interpolate(
      index,
      [
        currentScrollIndex - 2,
        currentScrollIndex,
        currentScrollIndex + 4,
        currentScrollIndex + 8,
        currentScrollIndex + 12,
        currentScrollIndex + 16,
      ],
      [1.0, 1.0, 0.85, 0.7, 0.4, 0.3],
      Extrapolation.CLAMP
    );

    // Static overlap adjustment to ensure items overlap nicely like the original design
    // This is independent of scroll position, and acts as a negative marginTop
    const staticOverlap = interpolate(
      index,
      [0, 5, 10, 15],
      [
        -ITEM_HEIGHT * 0.2,
        -ITEM_HEIGHT * 0.2,
        -ITEM_HEIGHT * 0.15,
        -ITEM_HEIGHT * 0.15,
      ],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: x }, { rotate: `${rotation}rad` }, { scale }],
      marginTop: staticOverlap,
    };
  });

  return (
    <Animated.View style={[rStyle]}>
      <ImageBackground
        source={item.source}
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          flexDirection: "row",
          gap: 20,
          paddingHorizontal: ITEM_HORIZONTAL_PADDING,
          paddingVertical: ITEM_VERTICAL_PADDING,
          alignItems: "center",
          borderRadius: BORDER_RADIUS,
          overflow: "hidden",
        }}
        imageStyle={{
          borderRadius: BORDER_RADIUS,
          transform: [
            { scale: 4 }, // Zoom the background
            { translateX: ITEM_WIDTH / 20 }, // Slightly shift to the right for better composition
          ],
        }}
        blurRadius={50}
      >
        <Canvas
          style={{
            position: "absolute",
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
          }}
        >
          <BackdropFilter filter={<Blur blur={30} />}>
            <RoundedRect
              x={0}
              y={0}
              width={ITEM_WIDTH}
              height={ITEM_HEIGHT}
              r={BORDER_RADIUS}
              color="rgba(0, 0, 0, 0.3)"
            />
          </BackdropFilter>
        </Canvas>
        <Image
          source={item.source}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_BORDER_RADIUS,
            zIndex: 1,
          }}
        />
        <View style={{ zIndex: 1 }}>
          <Text
            style={{ color: "white", fontWeight: "600", fontSize: TITLE_SIZE }}
          >
            {item.name}
          </Text>
          <Text
            style={{ color: "white", opacity: 0.8, fontSize: SUBTITLE_SIZE }}
          >
            {item.breed}
          </Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};
