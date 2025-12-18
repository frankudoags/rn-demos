import React, { useState } from "react";
import { SafeAreaContainer } from "@/components/ui/safe-area-container";
import Slider from "@react-native-community/slider";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { AnimatedText } from "@/components/ui/animated-text";
import { GlassView } from "expo-glass-effect";
import { PlatformColor, StyleSheet } from "react-native";
import { MoodShape } from "@/components/ui/mood-shape";

const texts = [
  "Melancholy",
  "Tired",
  "Bored",
  "Calm",
  "Happy",
  "Super Happy",
  "Awesome",
];

const colors = [
  "#775FDE",
  "#73A4F0",
  "#86CFED",
  "#BEDEAF",
  "#E2D077",
  "#FDCA7E",
  "#FBA4A8",
];

const MoodSelector = () => {
  const value = useSharedValue(0);
  //goes from 0 to 6
  const [currentText, setCurrentText] = useState(0);

  useAnimatedReaction(
    () => value.value,
    (sliderValue) => {
      const index = Math.round(sliderValue * (texts.length - 1));
      scheduleOnRN(setCurrentText, index);
    }
  );

  const animatedColor = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors[currentText], { duration: 500 }),
  }));

  return (
    <SafeAreaContainer>
      <GlassView style={styles.glassView} isInteractive>
        <AnimatedText style={styles.text} text={texts[currentText]} />
        <Animated.View
          style={[
            {
              width: 150,
              height: 150,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 75,
            },
            animatedColor,
          ]}
        >
          <MoodShape progress={currentText} />
        </Animated.View>
          <Slider
            style={{ width: "100%" }}
            minimumValue={0}
            maximumValue={1}
            onValueChange={(sliderValue) => {
              value.value = sliderValue;
            }}
            minimumTrackTintColor={PlatformColor("systemGreenColor").toString()}
          />
      </GlassView>
    </SafeAreaContainer>
  );
};

export default MoodSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "medium",
  },
  glassView: {
    paddingTop: 200,
    paddingBottom: 30,
    paddingHorizontal: 30,
    gap: 30,
    borderRadius: 45,
    bottom: 50,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
  },
  sliderContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});
