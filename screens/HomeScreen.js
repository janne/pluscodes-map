import React from "react"
import { StyleSheet, StatusBar, View, TextInput } from "react-native"
import { MapView } from "expo"
import { decode } from "pluscodes"
import * as R from "ramda"

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    latitude: 59.332438,
    longitude: 18.118813,
    delta: 0.0922,
    error: false,
    search: ""
  }

  decode = e => {
    const code = e.nativeEvent.text.toUpperCase()
    const coord = decode(code)
    this.setState({ error: !coord, search: code })
    if (!coord) return
    this.setState(R.pick(["latitude", "longitude"], coord))
    this.setState({ delta: coord.resolution * 20 })
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.delta,
            longitudeDelta: this.state.delta
          }}
          showsUserLocation={true}
          rotateEnabled={false}
        >
          <MapView.Marker
            coordinate={R.pick(["latitude", "longitude"], this.state)}
            opacity={this.state.search ? 1.0 : 0}
          />
        </MapView>
        <View style={styles.bubble}>
          <TextInput
            ref={"input"}
            style={styles.input}
            underlineColorAndroid={this.state.error ? "red" : "transparent"}
            placeholder="Enter a plus code"
            defaultValue={this.state.search}
            onEndEditing={this.decode}
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
  input: { padding: 4, fontSize: 16 },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    backgroundColor: "#fff",
    margin: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 10
  }
})
