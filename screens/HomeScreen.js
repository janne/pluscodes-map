import React from "react"
import {
  StyleSheet,
  StatusBar,
  View,
  TextInput,
  TouchableOpacity
} from "react-native"
import { MapView, Permissions, Location } from "expo"
import { decode, encode } from "pluscodes"
import Dialog from "react-native-dialog"
import * as R from "ramda"
import TabBarIcon from "../components/TabBarIcon"

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    region: {
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
      latitude: 59.332438,
      longitude: 18.118813
    },
    marker: undefined,
    code: undefined,
    locationServices: false,
    error: false,
    dialogVisible: false,
    name: ""
  }

  hasMarker = () => Boolean(this.state.marker)

  handleInput = async ({ nativeEvent }) => {
    const code = nativeEvent.text.toUpperCase()
    const coord = decode(code)
    this.setState({ error: !coord, code: undefined, name: undefined })
    if (!coord) return
    const delta = coord.resolution * 10
    this.setState({
      region: { ...coord, latitudeDelta: delta, longitudeDelta: delta },
      marker: coord,
      name: code,
      code
    })
    this.simplifyCode(code)
  }

  handleRegionChange = region => {
    this.setState({ region })
  }

  simplifyCode = async (code = this.state.code) => {
    try {
      if (!this.state.marker) return
      const addresses = await Expo.Location.reverseGeocodeAsync(
        this.state.marker
      )
      const { region, city } = addresses[0]
      const address = city || region
      const positions = await Expo.Location.geocodeAsync(address)
      const { latitude, longitude } = positions[0]
      const ref = encode({ latitude, longitude }, 4)
      if (ref.slice(0, 4) === code.slice(0, 4)) {
        this.setState({ code: `${code.slice(4)} ${address}` })
      }
    } catch (err) {
      console.error(err)
    }
  }

  handleMapPress = async ({ nativeEvent }) => {
    const code = encode(nativeEvent.coordinate)
    if (Boolean(code)) {
      this.setState({
        marker: { ...nativeEvent.coordinate, resolution: 0.000125 },
        region: {
          ...nativeEvent.coordinate,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta
        },
        code,
        name: nativeEvent.name
      })
      this.simplifyCode()
    }
  }

  toggleModal = () =>
    this.setState({ dialogVisible: !this.state.dialogVisible })

  polygonCoords = () => {
    if (!this.state.marker) return []
    const lat = this.state.marker.latitude
    const lng = this.state.marker.longitude
    const h = this.state.marker.resolution / 2
    return [
      { latitude: lat - h, longitude: lng - h },
      { latitude: lat + h, longitude: lng - h },
      { latitude: lat + h, longitude: lng + h },
      { latitude: lat - h, longitude: lng + h }
    ]
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== "granted") return

    let location = Location.getCurrentPositionAsync({}).then(location => {
      const { longitude, latitude } = location.coords
      this.setState({
        region: { ...this.state.region, longitude, latitude },
        locationServices: true
      })
    })
  }

  componentWillMount() {
    this.getLocationAsync()
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          rotateEnabled={false}
          onPress={this.handleMapPress}
          onPoiClick={this.handleMapPress}
          onRegionChangeComplete={this.handleRegionChange}
        >
          {this.hasMarker() && (
            <MapView.Marker
              title={this.state.name || this.state.code}
              coordinate={R.pick(["latitude", "longitude"], this.state.marker)}
            />
          )}
          {this.state.marker && (
            <MapView.Polygon
              coordinates={this.polygonCoords()}
              fillColor={"rgba(255, 128, 128, 0.5)"}
              strokeColor={"rgba(255, 0, 0, 0.5)"}
            />
          )}
        </MapView>
        <View style={styles.bubble}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={this.state.error ? "red" : "transparent"}
            placeholder="Plus code and/or location"
            defaultValue={this.state.code}
            onEndEditing={this.handleInput}
          />

          <TouchableOpacity
            style={styles.icon}
            activeOpacity={this.hasMarker() ? 0.2 : 1}
            onPress={this.hasMarker() ? this.toggleModal : undefined}
          >
            <TabBarIcon style name="md-bookmark" focused={this.hasMarker()} />
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
                onChange={({ nativeEvent }) =>
                  this.setState({ name: nativeEvent.text })
                }
              />
              <Dialog.Button label="Cancel" onPress={this.toggleModal} />
              <Dialog.Button
                label="Save"
                onPress={() => {
                  console.log("Saved", this.state.name)
                  this.toggleModal()
                }}
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
