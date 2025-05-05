import React, { useState } from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigation';

const departments = ['SEECS', 'Department 2', 'Department 3', 'Department 4'];

type Props = NativeStackScreenProps<RootStackParamList, 'DepartmentSelect'>;

export default function DepartmentScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string>(departments[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Secure Campus Scanner</Text>
      <Picker
        selectedValue={selected}
        onValueChange={(value) => setSelected(value)}
        style={styles.picker}
      >
        {departments.map((dept) => (
          <Picker.Item key={dept} label={dept} value={dept} />
        ))}
      </Picker>
      <Button
        title="Next"
        onPress={() => navigation.navigate('RoomSelect', { selectedDept: selected })}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  picker: { height: 50, marginBottom: 20 },
});
