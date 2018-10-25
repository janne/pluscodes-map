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
            latitude: 59.332438,
            longitude: 18.118813,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          showsUserLocation={true}
          rotateEnabled={false}
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
