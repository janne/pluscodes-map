import React from "react"
import { StyleSheet, StatusBar, View, TextInput } from "react-native"
import { MapView } from "expo"

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 43.78825,
            longitude: 18.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <View style={styles.bubble}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Enter a plus code"
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    marginTop: StatusBar.currentHeight
  },
  input: { padding: 4, fontSize: 18 },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    backgroundColor: "#fff",
    margin: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    elevation: 10
  }
})
