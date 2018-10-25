import React from "react"
import { StatusBar } from "react-native"
import { MapView } from "expo"

const styles = {
  mapView: { flex: 1, marginTop: StatusBar.currentHeight }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: 46.78825,
          longitude: 18.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      />
    )
  }
}
