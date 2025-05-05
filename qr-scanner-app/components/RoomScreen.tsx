import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigation';

const rooms = ['CR1', 'Lab1', 'Lab2', 'Research Lab4', 'CR2', 'CR3'];

type Props = NativeStackScreenProps<RootStackParamList, 'RoomSelect'>;

export default function RoomScreen({ route, navigation }: Props) {
  const { selectedDept } = route.params;
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Room</Text>
      <Picker
        selectedValue={selectedRoom}
        onValueChange={(value) => setSelectedRoom(value)}
        style={styles.picker}
      >
        {rooms.map((room) => (
          <Picker.Item key={room} label={room} value={room} />
        ))}
      </Picker>
      <Button
        title="Scan QR"
        onPress={() =>
            navigation.navigate('QrScanner', {
              selectedDept: selectedDept,
              selectedRoom: selectedRoom,
            })
          }
          
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  picker: { height: 50, marginBottom: 20 },
});
