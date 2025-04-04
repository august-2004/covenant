import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default OrderItem = ({ item, incrementCount, decrementCount }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.meal}>{item.itemName}</Text>
      <View style={styles.count}>
        <Pressable style={styles.plus} onPress={() => incrementCount(item.id)} ><Ionicons name="add" size={20}></Ionicons></Pressable>
        <View style={styles.countNumber}>
          <Text >{item.quantity}</Text>
        </View>
        <Pressable style={styles.minus} onPress={() => decrementCount(item.id)} ><Ionicons name="remove" size={20}></Ionicons></Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(
  {
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 35,
      backgroundColor : "white",
      margin: 2,
      alignItems: "center",
      borderRadius: 10
    },
    count: {
      flexDirection: "row",
      
      height: 35,
      alignItems: "center",
      
    },
    meal: {
      marginLeft: 10,
      textTransform: "capitalize"
    },
    plus:{
      width:30,
      height : 35,
      justifyContent : "center",
      alignItems: "center",
      backgroundColor: "#8fc02ea0",
      
    },
    countNumber: {
      width:30,
      height : 35,
      justifyContent : "center",
      alignItems: "center"
      
    },
    minus:{
      width:30,
      height : 35,
      justifyContent : "center",
      alignItems: "center",
      backgroundColor: "lightcoral",
      
      borderBottomRightRadius: 10,
      borderTopRightRadius : 10,
      
    }
  }
)
