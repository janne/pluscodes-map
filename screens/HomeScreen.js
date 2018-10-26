import React from "react"
import {
  StyleSheet,
  StatusBar,
  View,
  TextInput,
  TouchableOpacity
} from "react-native"
import { MapView } from "expo"
import { decode, encode } from "pluscodes"
import Dialog from "react-native-dialog"
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
    code: undefined,
    dialogVisible: false,
    name: ""
  }

  hasCode = () => Boolean(this.state.code)

  decode = ({ nativeEvent }) => {
    const code = nativeEvent.text.toUpperCase()
    const coord = decode(code)
    this.setState({ error: !coord, code: undefined, name: undefined })
    if (!coord) return
    this.setState({ ...coord, code, delta: coord.resolution * 10 })
  }

  handleMapPress = ({ nativeEvent }) => {
    const code = encode(nativeEvent.coordinate)
    if (Boolean(code))
      this.setState({ ...nativeEvent.coordinate, code, name: nativeEvent.name })
  }

  toggleModal = () =>
    this.setState({ dialogVisible: !this.state.dialogVisible })

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
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.delta,
            longitudeDelta: this.state.delta
          }}
          showsUserLocation={true}
          rotateEnabled={false}
          onPress={this.handleMapPress}
          onPoiClick={this.handleMapPress}
        >
          {this.hasCode() && (
            <MapView.Marker
              title={this.state.name || this.state.code}
              coordinate={R.pick(["latitude", "longitude"], this.state)}
            />
          )}
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
            placeholder="Plus code and/or location"
            defaultValue={this.state.code}
            onEndEditing={this.decode}
          />

          <TouchableOpacity
            style={styles.icon}
            activeOpacity={this.hasCode() ? 0.2 : 1}
            onPress={this.hasCode() ? this.toggleModal : undefined}
          >
            <TabBarIcon style name="md-bookmark" focused={this.hasCode()} />
          </TouchableOpacity>

          <View>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>Save plus code</Dialog.Title>
              <Dialog.Description>
                Choose a name for this plus code
              </Dialog.Description>
              <Dialog.Input
                label="Name"
                autoFocus={true}
                value={this.state.name}
              />
              <Dialog.Button label="Cancel" onPress={this.toggleModal} />
              <Dialog.Button
                label="Save"
                onPress={() => console.log("Saved")}
              />
            </Dialog.Container>
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
