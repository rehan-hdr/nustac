import React from 'react';
import { View, Text, StyleSheet, ScrollView,ImageBackground,Image } from 'react-native';

const AccessHistory = () => {
  // Dummy data for the table
  const data = [
    { date: '2025-05-03', time: '10:00 AM', access: 'Granted', facility: 'Gym' },
    { date: '2025-05-03', time: '11:30 AM', access: 'Denied', facility: 'Library' },
    { date: '2025-05-02', time: '04:00 PM', access: 'Granted', facility: 'Cafeteria' },
    { date: '2025-05-03', time: '10:00 AM', access: 'Granted', facility: 'Gym' },
    { date: '2025-05-03', time: '11:30 AM', access: 'Denied', facility: 'Library' },
    { date: '2025-05-02', time: '04:00 PM', access: 'Granted', facility: 'Cafeteria' },
    { date: '2025-05-03', time: '10:00 AM', access: 'Granted', facility: 'Gym' },
    { date: '2025-05-03', time: '11:30 AM', access: 'Denied', facility: 'Library' },
    { date: '2025-05-02', time: '04:00 PM', access: 'Granted', facility: 'Cafeteria' },
    { date: '2025-05-03', time: '10:00 AM', access: 'Granted', facility: 'Gym' },
    { date: '2025-05-03', time: '11:30 AM', access: 'Denied', facility: 'Library' },
    { date: '2025-05-02', time: '04:00 PM', access: 'Granted', facility: 'Cafeteria' },
    { date: '2025-05-03', time: '10:00 AM', access: 'Granted', facility: 'Gym' },
    { date: '2025-05-03', time: '11:30 AM', access: 'Denied', facility: 'Library' },
    { date: '2025-05-02', time: '04:00 PM', access: 'Granted', facility: 'Cafeteria' },
    { date: '2025-05-03', time: '10:00 AM', access: 'Granted', facility: 'Gym' },
    { date: '2025-05-03', time: '11:30 AM', access: 'Denied', facility: 'Library' },
    { date: '2025-05-02', time: '04:00 PM', access: 'Granted', facility: 'Cafeteria' },
  ];

  return (
    <ImageBackground
          source={require('../../assets/images/home-bg.jpg')}
          style={styles.background}
          resizeMode="cover"
    >
    <View style={styles.container}>
      {/* Logo at the top right */}
      <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/nust-logo.png')}
            style={styles.logo}
          />
        <Text style={styles.title}>NUSTAC</Text>
      </View>
      
      {/* Access History heading */}
      <Text style={styles.heading}>Access History</Text>
      
      {/* Scrollable table */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Time</Text>
            <Text style={styles.tableHeader}>Access</Text>
            <Text style={styles.tableHeader}>Facility</Text>
          </View>
          
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableData}>{item.date}</Text>
              <Text style={styles.tableData}>{item.time}</Text>
              <Text
              style={[
                styles.tableData,
                { color: item.access === 'Granted' ? 'green' : 'red' }
              ]}
            >
              {item.access}
            </Text>
              <Text style={styles.tableData}>{item.facility}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#80D8FF',
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    justifyContent: 'space-around',
  },
  tableHeader: {
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },
  tableData: {
    width: '25%',
    textAlign: 'center',
  },
});

export default AccessHistory;
