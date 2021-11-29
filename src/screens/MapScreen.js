import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Alert, Dimensions, ScrollView } from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import MapView, { AnimatedRegion, MapViewAnimated, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import { MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Wave } from 'react-native-animated-spinkit';
import { DeviceMotion } from 'expo-sensors';
import FAB from '../components/atom/fab/FAB';
import FindContactForm from '../components/organims/find-contact-form/FindContactForm';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import CustomHeader from '../components/molecules/header/CustomHeader';
import { getContactLocation, saveLocation, hideContactLocation } from '../redux/actions/users';
import colors from '../utils/colors';
import { Button } from 'react-native-elements';
const { spanishVioletLight, lightGreen } = colors;

const LOCATION_FETCH_TASK = 'LOCATION_SERVICE';


TaskManager.defineTask(LOCATION_FETCH_TASK, async ({ data, error }) => {
	if(error) console.log('Error ', LOCATION_FETCH_TASK , " : ", error.code, " - ", error.message);

	const { latitude, longitude } = data.locations[0].coords;
	locationService.setLocation({
		latitude,
		longitude
	})
});

const LocationService = () => {
    let subscribers = []
    let location = {
      latitude: 0,
      longitude: 0
    }

    return {
      subscribe: (sub) => subscribers.push(sub),
      setLocation: (coords) => {
        location = coords
        subscribers.forEach((sub) => sub(location))
      },
      unsubscribe: (sub) => {
        subscribers = subscribers.filter((_sub) => _sub !== sub)
      }
    }
  }

export const locationService = LocationService()

export default function MapScreen({ navigation }) {

	const [localLoading, setLocalLoading] = useState(true)
	const [localLocation, setLocalLocation] = useState({});
	const [localRegion, setLocalRegion] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [contactPhone, setContactPhone] = useState('');
	const [repeat, setRepeat] = useState(null)
	const mapRef = useRef(null);
	const API_KEY = 'AIzaSyBZ4QKcXVXPQUTSi5YWpafm-wbeIrJjOXQ';

	const dispatch = useDispatch();
	const { activeFollowLocation, location, phone, contactLocation } = useSelector(state => state.users)

	const startSaveLocation = async () => {
		const statusFP = await Location.requestForegroundPermissionsAsync();
		const statusBP = await Location.requestBackgroundPermissionsAsync();
		if(statusFP.granted && statusBP.granted) {
			await Location.startLocationUpdatesAsync(LOCATION_FETCH_TASK, {
				accuracy: Location.Accuracy.BestForNavigation,
				deferredUpdatesInterval: 1000,
				deferredUpdatesDistance: 1000,
				distanceInterval: 1,
				foregroundService: {
					notificationTitle: "Sos Button",
					notificationBody: "La aplicación esta guardando su ubicación...",
				}
			});
			const position = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.BestForNavigation });
			const loc = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			}
			setLocalLoading(false)
			dispatch(saveLocation(loc));
		} else {
			navigation.navigate('Contacts');
		}
	}

	const startLocationService = async () => {
		setLocalLoading(true);
		locationService.subscribe(LocationSubcriber);
		try {
			if(!activeFollowLocation) {
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
							onPress: () => startSaveLocation(),
						}
					],
					{ cancelable: false }
				)
			} else {
				setLocalLoading(false)
			}
		} catch (error) {
			console.log('error: ', error)
		}
	}

	useEffect(() => {
		if (Object.keys(location).length > 0) {
			locationService.subscribe(LocationSubcriber);
			console.log('location: ', location)
			setLocalLocation(location)
			setLocalRegion({
				latitude: location.latitude,
				longitude: location.longitude,
				latitudeDelta: 0.009,
				longitudeDelta: 0.009
			})
			setLocalLoading(false);
		} else {
			startLocationService();
		}
    }, [])

	const LocationSubcriber = ({ latitude, longitude }) => {
		setLocalLocation({latitude, longitude});
		setLocalRegion({
			latitude,
			longitude,
			latitudeDelta: 0.009,
			longitudeDelta: 0.009
		})
		mapRef.current.animateToRegion({
			latitude,
			longitude,
			latitudeDelta: 0.009,
			longitudeDelta: 0.009
		})
		dispatch(saveLocation({ latitude, longitude }));
	}

	const findContact = () => {
		this.repeat = setInterval(() => {
			console.log('dispatch');
		}, 3000)
		// if (Object.keys(contactLocation).length > 0) {
		// 	setRepeat(false)
		// 	this.clearInterval(true);
		// 	dispatch(hideContactLocation())
		// 	mapRef.current.animateToRegion({
		// 		latitude: localLocation.latitude,
		// 		longitude: localLocation.longitude,
		// 		latitudeDelta: 0.009,
		// 		longitudeDelta: 0.009
		// 	})
		// } else {
		// 	setShowModal(true);
		// 	setRepeat(true)
		// }
	}

	const findContactByPhone = () => {
		//dispatch(getContactLocation(phone, contactPhone));
		
	}

	const stopInterval = () => {
		clearInterval(this.repeat);
	}

	useEffect(() => {
		if (Object.keys(contactLocation).length > 0) {
			mapRef.current.animateToRegion({
				latitude: contactLocation.latitude,
				longitude: contactLocation.longitude,
				latitudeDelta: 0.009,
				longitudeDelta: 0.009
			})
		}
	}, [contactLocation])

	return (
		<View style={{ flex: 1 }}>
            <CustomHeader />
			<FAB
				backgroundColor={spanishVioletLight}
				onPress={findContact}
				positionHeight={200}
				>
				{
					Object.keys(contactLocation).length > 0 ?
						<MaterialIcons style={{ alignSelf: 'center' }} name='clear' size={32} color='#fff' />
						:
						<>
							<MaterialIcons style={{ alignSelf: 'center' }} name='search' size={32} color='#fff' />
							<Text style={{ color: '#fff' }}>Rastrear</Text>
						</>
				}
			</FAB>
			<Button
				type="submit"
				color="red"
				style={{ position: 'absolute', top: 700}}
				onPress={stopInterval}
			/>
			<ScrollView>
				{
					localLoading ?
						<Wave size={48} color={spanishVioletLight} style={{ alignSelf: 'center'}}/>
						:
						<View>
							<FindContactForm
								showModal={showModal}
								setShowModal={setShowModal}
								phone={contactPhone}
								setPhone={setContactPhone}
								findContact={findContactByPhone}
							/>
							<MapView
								ref={mapRef}
								initialRegion={localRegion}
								followsUserLocation
								style={styles.map}
								>
									<Marker
										coordinate={localLocation}
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
													origin={localLocation}
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
