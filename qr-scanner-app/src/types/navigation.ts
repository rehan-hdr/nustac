// src/types/navigation.ts

export type RootStackParamList = {
    DepartmentSelect: undefined;
    RoomSelect: { selectedDept: string };
    QrScanner: { selectedDept: string; selectedRoom: string };
  };
  