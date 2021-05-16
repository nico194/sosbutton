import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import { MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location';
import FAB from '../components/atom/fab/FAB';
import FindContactForm from '../components/organims/find-contact-form/FindContactForm';
import colors from '../utils/colors';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import CustomHeader from '../components/molecules/header/CustomHeader';
const { spanishVioletLight } = colors;

export default function MapScreen({ navigation }) {

	const [loading, setLoading] = useState(false)
	const [region, setRegion] = useState({})
	const [location, setLocation] = useState({})
	const [contactLocation, setContactLocation] = useState({})
	const [showModal, setShowModal] = useState(false);
	const [coords, setCoords] = useState([])
	const API_KEY = 'AIzaSyBZ4QKcXVXPQUTSi5YWpafm-wbeIrJjOXQ';
	
	
	const getCurrentLocation = async () => {
		try {
			setLoading(true);
			const { status } = await Location.requestForegroundPermissionsAsync()
			if(status !== 'granted') console.log("You don't have location permissions");
			const location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.BestForNavigation });
			setRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.009,
				longitudeDelta: 0.009,
			})
			setLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude
			})
			setContactLocation({
				latitude: location.coords.latitude + 0.012 ,
				longitude: location.coords.longitude - 0.012
			})
			setLoading(false);
		} catch (error) {
			console.log(error)
			setLoading(false);
		}
	}
	
	useEffect(() => {
		getCurrentLocation();
	}, [])
	
	const findContact = () => {
		setShowModal(true)

		// setLoading(true);
		// const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location}&destination=${contactLocation}&key=${API_KEY}`;
		// try {
		// 	const resp = await fetch(url);
		// 	const respJSON = await resp.json();
		// 	console.log(respJSON)
		// 	let points = polyline.decode(respJSON.routes[0].overview_polyline.points);
		// 	let coords = points.map((point, index) => ({ latitude: point[0], longitude: point[1]}))
		// 	console.log(coords);
		// 	setCoords(coords);
		// 	setLoading(true);
		// } catch (error) {
		// 	console.log(error)
		// }
		
		
	}


	return (
		<View style={{ flex: 1 }}>
            <CustomHeader />
			<FAB 
				backgroundColor={spanishVioletLight}
				onPress={findContact}
				positionHeight={200}
				>
				<MaterialIcons style={{ alignSelf: 'center' }} name='search' size={32} color='#fff' />
				<Text style={{ color: '#fff' }}>Rastrear</Text>
			</FAB>
			<ScrollView>
				{
					loading ?
						<Text>Cargango...</Text>
						:
						<View>
							<FindContactForm 
								showModal={showModal}
								setShowModal={setShowModal}
							/>
							<MapView
								initialRegion={region}
								showsUserLocation={true}
								style={styles.map}
								>
								<MapViewDirections
									origin={location}
									destination={contactLocation}
									apikey={API_KEY}
									strokeWidth={5}
									strokeColor={spanishVioletLight}
								/>			
							</MapView>
						</View>
				}
			</ScrollView>
            <CustomFooter navigate={navigation.navigate} page='Map' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		zIndex: 0
	}
});