import React from "react"
import { Platform } from "react-native"
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation"

import TabBarIcon from "../components/TabBarIcon"
import HomeScreen from "../screens/HomeScreen"
import CodesScreen from "../screens/CodesScreen"

const HomeStack = createStackNavigator({
  Home: HomeScreen
})

HomeStack.navigationOptions = {
  tabBarLabel: "Map",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios" ? `ios-map${focused ? "" : "-outline"}` : "md-map"
      }
    />
  )
}

const CodesStack = createStackNavigator({
  Codes: CodesScreen
})

CodesStack.navigationOptions = {
  tabBarLabel: "Plus codes",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-bookmarks${focused ? "" : "-outline"}`
          : "md-bookmarks"
      }
    />
  )
}

export default createBottomTabNavigator({
  HomeStack,
  CodesStack
})
