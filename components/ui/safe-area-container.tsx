import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, style }) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
};

export { SafeAreaContainer };
export type { SafeAreaContainerProps };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
