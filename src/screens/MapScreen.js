import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import { MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Wave } from 'react-native-animated-spinkit';
import FAB from '../components/atom/fab/FAB';
import FindContactForm from '../components/organims/find-contact-form/FindContactForm';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import CustomHeader from '../components/molecules/header/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../utils/firebase';
import { locationService } from '../utils/locationPublisher';
import colors from '../utils/colors';
import { LocationSubscriber } from 'expo-location/build/LocationSubscribers';
const { spanishVioletLight, lightGreen } = colors;

const LOCATION_FETCH_TASK = 'LOCATION_SERVICE';


TaskManager.defineTask(LOCATION_FETCH_TASK, async ({ data, error }) => {
	if(error) console.log(error.message);
	
	const { latitude, longitude } = data.locations[0].coords;
	locationService.setLocation({
		latitude,
		longitude
	})
});

export default function MapScreen({ navigation }) {
	
	const USER_KEY = 'USER';
	const [loading, setLoading] = useState(false)
	const [region, setRegion] = useState({})
	const [location, setLocation] = useState({})
	const [contactLocation, setContactLocation] = useState({})
	const [showModal, setShowModal] = useState(false);
	const [coords, setCoords] = useState([])
	const API_KEY = 'AIzaSyBZ4QKcXVXPQUTSi5YWpafm-wbeIrJjOXQ';
	
	const setRegionAndLocation = async () => {
		const position = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.BestForNavigation });
		setRegion({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
			latitudeDelta: 0.009,
			longitudeDelta: 0.009,
		});
		setLocation({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	}
	
	const saveUser = async (user) => {
		user.activeFollowLocation = true;
		user.location = location;
		console.log('location 2', user)
		await setUserFromAsyncStorage(user);
		const docRef = firestore.collection('users').doc(auth.currentUser.uid);
        await docRef.set(user);
	}	

	const startSaveLocation = async (user) => {
		const statusFP = await Location.requestForegroundPermissionsAsync();
		const statusBP = await Location.requestBackgroundPermissionsAsync();
		if(statusFP.granted && statusBP.granted) {
			await setRegionAndLocation();
			await saveUser(user);
			await Location.startLocationUpdatesAsync(LOCATION_FETCH_TASK, {
				accuracy: Location.Accuracy.BestForNavigation,
				deferredUpdatesInterval: 1000,
				deferredUpdatesDistance: 1000,
				distanceInterval: 1,
				foregroundService: {
					notificationBody: "Uploading Jobs if available",
					notificationTitle: "Background Fetch"
				}
			});
			setLoading(false);
		} else {
			setLoading(false);
			navigation.navigate('Contacts');
		}
	}

	const getUserFromAsyncStorage = async () => {
		const userInAsyncStorage = await AsyncStorage.getItem(USER_KEY);
		return JSON.parse(userInAsyncStorage);
	}

	const setUserFromAsyncStorage = async (user) => {
		await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
	}

	const LocationSubcriber = ({ latitude, longitude }) => {
		setLocation({ latitude, longitude });
	}

	const startLocationService = async () => {
		locationService.subscribe(LocationSubcriber);
		setLoading(true);
		try {
			const user = await getUserFromAsyncStorage();
			if(user.activeFollowLocation === undefined && !user.activeFollowLocation) {
				Alert.alert(
					'Guardado de Ubicación',
					`Esta aplicación guardara tu ubicación para poder mostrarsela a la lista de tus contactos guadados en la aplicación.
					Si aceptas, la aplicación empezará a guarda la ubicación.
					Si no aceptas, la lista de contactos no podra ver tu ubicación en caso de un acontecimiento inesperado`,
					[
						{
							text: 'Cancelar',
							onPress: () => navigation.navigate('Contacts'),
							style: 'cancel'
						},
						{
							text: 'Aceptar',
							onPress: () => startSaveLocation(user),
						}
					],
					{ cancelable: false }
				)
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	useEffect(() => {
		startLocationService();
    }, [])
	
	const findContact = () => {
		// setContactLocation({
		// 	latitude: location.latitude - 0.005,
		// 	longitude: location.longitude - 0.005
		// })	
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
						<Wave size={48} color={spanishVioletLight} style={{ alignSelf: 'center'}}/>
						:
						<View>
							<FindContactForm 
								showModal={showModal}
								setShowModal={setShowModal}
							/>
							<MapView
								initialRegion={region}
								style={styles.map}
								>
									<Marker 
										coordinate={location}
										icon={require('../../assets/custom-marker.png')}
										title='Tu ubicacion'
									/>
									{
										Object.keys(contactLocation).length > 0 &&
											<View>
												<Marker 
													coordinate={contactLocation}
													icon={require('../../assets/contact-marker.png')}
												/>
												<MapViewDirections
													origin={location}
													destination={contactLocation}
													apikey={API_KEY}
													strokeWidth={5}
													strokeColor={lightGreen}
												/>			
											</View>
									}
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
