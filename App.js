import React from "react"
import { Platform, StatusBar, StyleSheet, View } from "react-native"
import { AppLoading, Font, Icon } from "expo"
import AppNavigator from "./navigation/AppNavigator"

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={console.warn}
          onFinish={this.handleFinishLoading}
        />
      )
    }

    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    )
  }

  loadResourcesAsync = async () => Font.loadAsync(Icon.Ionicons.font)

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
})
