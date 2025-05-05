import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DepartmentScreen from './components/DepartmentScreen';
import RoomScreen from './components/RoomScreen';
import QrScanner from './components/QrScanner';
import { StyleSheet } from 'react-native';
import { RootStackParamList } from './src/types/navigation';


// export type RootStackParamList = {
//   Department: undefined;
//   Room: { department: string };
//   Scanner: { departmentRoom: string };
// };

const Stack = createNativeStackNavigator<RootStackParamList>();



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});


export default function App() {
  return (
    <NavigationContainer>
<Stack.Navigator initialRouteName="DepartmentSelect">
  <Stack.Screen name="DepartmentSelect" component={DepartmentScreen} />
  <Stack.Screen name="RoomSelect" component={RoomScreen} />
  <Stack.Screen name="QrScanner" component={QrScanner} />
</Stack.Navigator>
    </NavigationContainer>
  );
}
