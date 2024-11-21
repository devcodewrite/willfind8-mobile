// components/MainFilter.jsx
import { View, Text, StyleSheet } from 'react-native';

export default function MainFilter() {
  return (
    <View style={styles.filterContainer}>
      <Text>Main Filter</Text>
      {/* Add filter options here */}
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginVertical: 8,
  },
});
