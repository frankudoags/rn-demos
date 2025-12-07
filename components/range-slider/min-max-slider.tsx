import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface MinMaxRangeSliderProps {
  sliderWidth: number;
  minRange: number;
  maxRange: number;
  step?: number;
  minGapInSteps?: number;
  reset?: boolean;
  onValueChange: (range: { min: number; max: number }) => void;
}

const MinMaxRangeSlider = ({
  sliderWidth,
  minRange,
  maxRange,
  step: userStep,
  minGapInSteps: userMinGapInSteps,
  reset,
  onValueChange,
}: MinMaxRangeSliderProps) => {
  const min = minRange;
  const max = maxRange;
  const range = max - min;

  // Compute safe fallback step
  const safeStep = Math.max(1, Math.floor(range / 20));
  const step = userStep && userStep > 0 && range % userStep === 0
    ? userStep
    : (() => {
        console.warn(`[MinMaxRangeSlider] Invalid or missing "step" (${userStep}). Falling back to ${safeStep}`);
        return safeStep;
      })();

  const totalSteps = Math.floor(range / step);

  const safeMinGapInSteps = 2;
  const minGapInSteps =
    userMinGapInSteps != null &&
    userMinGapInSteps >= 0 &&
    userMinGapInSteps < totalSteps
      ? userMinGapInSteps
      : (() => {
          console.warn(`[MinMaxRangeSlider] Invalid or missing "minGapInSteps" (${userMinGapInSteps}). Falling back to ${safeMinGapInSteps}`);
          return safeMinGapInSteps;
        })();

  const isInvalid = sliderWidth <= 0 || totalSteps <= 0 || min >= max;

  
  const pixelsPerStep = sliderWidth / totalSteps;
  const minGapPx = pixelsPerStep * minGapInSteps;
  
  const position = useSharedValue(0);
  const position2 = useSharedValue(sliderWidth);
  
  const scaleLeft = useSharedValue(1);
  const scaleRight = useSharedValue(1);
  
  const context = useSharedValue(0);
  const context2 = useSharedValue(0);
  
  useEffect(() => {
    if (reset) {
      position.value = 0;
      position2.value = sliderWidth;
      runOnJS(onValueChange)({ min, max });
    }
  }, [reset]);
  
  const updateValues = () => {
    'worklet';
    const minSteps = Math.round(position.value / pixelsPerStep);
    const maxSteps = Math.round(position2.value / pixelsPerStep);
    const rangeMin = min + minSteps * step;
    const rangeMax = min + maxSteps * step;
    
    runOnJS(onValueChange)({
      min: Math.min(rangeMin, rangeMax - step),
      max: Math.max(rangeMax, rangeMin + step),
    });
  };
  
  const leftGesture = Gesture.Pan()
  .onBegin(() => {
    context.value = position.value;
    scaleLeft.value = withTiming(1.3, { duration: 300 }); // Optional: Scale up the left thumb on touch
  })
  .onUpdate(e => {
    let newPos = context.value + e.translationX;
    newPos = Math.max(0, Math.min(newPos, position2.value - minGapPx));
    position.value = newPos;
    updateValues();
  })
  .onEnd(() => {
    scaleLeft.value = withTiming(1, { duration: 300 }); // Reset scale on release
  });
  
  const rightGesture = Gesture.Pan()
  .onBegin(() => {
    context2.value = position2.value;
    scaleRight.value = withTiming(1.3, { duration: 300 }); // Optional: Scale up the right thumb on touch
  })
  .onUpdate(e => {
    let newPos = context2.value + e.translationX;
    newPos = Math.min(sliderWidth, Math.max(newPos, position.value + minGapPx));
    position2.value = newPos;
    updateValues();
  })
  .onEnd(() => {
    scaleRight.value = withTiming(1, { duration: 300 }); // Reset scale on release
  });
  
  const leftThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value },
      { scale: scaleLeft.value },
    ],
  }));
  
  const rightThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position2.value },
      { scale: scaleRight.value },
    ],
  }));
  
  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    width: position2.value - position.value,
  }));
  
  if (isInvalid) {
    console.warn(
      `[MinMaxRangeSlider] Invalid configuration: sliderWidth=${sliderWidth}, min=${min}, max=${max}, step=${step}`
    );
    return null;
  }
  
  return (
    <View style={[styles.sliderContainer, { width: sliderWidth }]}>
      <View style={styles.sliderBack} />
      <Animated.View style={[trackStyle, styles.sliderFront]} />

      <GestureDetector gesture={leftGesture}>
        <Animated.View style={[leftThumbStyle, styles.thumb]} />
      </GestureDetector>

      <GestureDetector gesture={rightGesture}>
        <Animated.View style={[rightThumbStyle, styles.thumb]} />
      </GestureDetector>
    </View>
  );
};

export default MinMaxRangeSlider;

const SLIDER_HEIGHT = 6;
const SLIDER_COLOR = 'black';
const THUMB_SIZE = 20;

const styles = StyleSheet.create({
  sliderContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sliderBack: {
    height: SLIDER_HEIGHT - 2,
    backgroundColor: '#E4E7EC',
    borderRadius: 20,
    width: '100%',
  },
  sliderFront: {
    height: SLIDER_HEIGHT,
    backgroundColor: SLIDER_COLOR,
    borderRadius: 20,
    position: 'absolute',
  },
  thumb: {
    left: -10,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    position: 'absolute',
    backgroundColor: 'white',
    borderColor: SLIDER_COLOR,
    borderWidth: 2,
    borderRadius: 10,
  },
});
