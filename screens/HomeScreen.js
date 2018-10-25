import React from "react"
import { StyleSheet, StatusBar, View, TextInput } from "react-native"
import { MapView } from "expo"
import { decode } from "pluscodes"
import * as R from "ramda"
import TabBarIcon from "../components/TabBarIcon"

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    latitude: 59.332438,
    longitude: 18.118813,
    resolution: undefined,
    delta: 0.0922,
    error: false,
    code: undefined
  }

  decode = e => {
    const code = e.nativeEvent.text.toUpperCase()
    const coord = decode(code)
    this.setState({ error: !coord })
    if (!coord) return
    this.setState({ ...coord, code, delta: coord.resolution * 10 })
  }

  polygonCoords = () => {
    if (!this.state.resolution) return []
    const lat = this.state.latitude
    const lng = this.state.longitude
    const h = this.state.resolution / 2
    return [
      { latitude: lat - h, longitude: lng - h },
      { latitude: lat + h, longitude: lng - h },
      { latitude: lat + h, longitude: lng + h },
      { latitude: lat - h, longitude: lng + h }
    ]
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
            title={this.state.code}
            coordinate={R.pick(["latitude", "longitude"], this.state)}
            opacity={this.state.code ? 1.0 : 0}
          />
          {this.state.resolution && (
            <MapView.Polygon
              coordinates={this.polygonCoords()}
              fillColor={"rgba(255, 128, 128, 0.5)"}
              strokeColor={"rgba(255, 0, 0, 0.5)"}
            />
          )}
        </MapView>
        <View style={styles.bubble}>
          <TextInput
            ref={"input"}
            style={styles.input}
            underlineColorAndroid={this.state.error ? "red" : "transparent"}
            placeholder="Enter a plus code"
            defaultValue={this.state.code}
            onEndEditing={this.decode}
          />

          <View style={styles.icon}>
            <TabBarIcon style name="md-star" />
          </View>
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
  input: { flex: 1, padding: 4, fontSize: 16 },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    margin: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 10
  },
  icon: { margin: 4 }
})
