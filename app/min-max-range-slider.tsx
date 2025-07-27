import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import MinMaxRangeSlider from '@/components/range-slider/min-max-slider';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const MinMaxRangeSliderPage = () => {
  const [minRange, setMinRange] = React.useState(1);
  const [maxRange, setMaxRange] = React.useState(100);
  const [step, setStep] = React.useState(1);
  const [minGapInSteps, setMinGapInSteps] = React.useState(5);
  const [min, setMin] = React.useState(minRange);
  const [max, setMax] = React.useState(maxRange);

  const handleNumberInput = (setter: (val: number) => void) => (val: string) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) setter(parsed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text>Min Range:</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={String(minRange)}
            onChangeText={handleNumberInput(setMinRange)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text>Max Range:</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={String(maxRange)}
            onChangeText={handleNumberInput(setMaxRange)}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text>Step:</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={String(step)}
            onChangeText={handleNumberInput(setStep)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text>Min Gap (steps):</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={String(minGapInSteps)}
            onChangeText={handleNumberInput(setMinGapInSteps)}
          />
        </View>
      </View>

      <View style={styles.sliderWrapper}>
        <MinMaxRangeSlider
          key={`${minRange}-${maxRange}-${step}-${minGapInSteps}`} // Reset on change
          sliderWidth={SCREEN_WIDTH * 0.8}
          minRange={minRange}
          maxRange={maxRange}
          step={step}
          minGapInSteps={minGapInSteps}
          onValueChange={(range) => {
            setMin(range.min);
            setMax(range.max);
          }}
        />
      </View>

      <Text style={styles.rangeText}>
        Selected Range: {min} - {max}
      </Text>
    </View>
  );
};

export default MinMaxRangeSliderPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.8,
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  sliderWrapper: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  rangeText: {
    marginTop: 20,
    fontSize: 18,
  },
});
