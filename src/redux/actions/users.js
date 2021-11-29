import {
    USER_PENDING,
    GET_USER,
    LOGOUT_USER,
    ERROR_USER,
    USER_ASYNC_STORAGE,
    CHANGED,
    ADD_CONTACT,
    UPDATE_CONTACT,
    DELETE_CONTACT,
    SET_MESSAGE,
    SET_LOCATION,
    CONTACT_LOCATION,
    HIDE_CONTACT_LOCATION
} from '../constants/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore, getNewId } from '../../utils/firebase';

const getUserFromAsyncStorage = async () => {
    const user = await AsyncStorage.getItem(USER_ASYNC_STORAGE);
    return JSON.parse(user);
}

const setUserFromAsyncStorage = async (user) => {
    return AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify(user))
}

export const loginUser = (email, password) => {
    return async dispatch => {
        dispatch({type: USER_PENDING});
        try {
            const userCredencial = await auth.signInWithEmailAndPassword(email, password)
            if (userCredencial.user.uid) {
                const user = await firestore.collection('users').doc(userCredencial.user.uid).get();
                await setUserFromAsyncStorage(user.data());
                dispatch({type: GET_USER, payload: {user: user.data()}});
            }
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const registerUser = (user) => {
    return async dispatch => {
        dispatch({type: USER_PENDING});
        try {
            const userCredencial = await auth.createUserWithEmailAndPassword(user.email, user.password);
            if (userCredencial.user.uid) {
                delete user.password;
                delete user.repeatPassword;
                const userAuthenticated = { ...user, uid: userCredencial.user.uid};
                await firestore.collection('users').doc(userCredencial.user.uid).set(userAuthenticated);
                await setUserFromAsyncStorage(userAuthenticated);
                dispatch({type: GET_USER, payload: {user: userAuthenticated}});
            }
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const logoutUser = () => {
    return async dispatch => {
        try {
            dispatch({type: USER_PENDING});
            await auth.signOut();
            await setUserFromAsyncStorage({});
            dispatch({type: LOGOUT_USER});
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const setError = ({code, message}) => dispatch => dispatch({type: ERROR_USER, payload: {error: {code, message}}});

export const setErrorInNull = () => dispatch => dispatch({type: ERROR_USER, payload: {error: null}});

export const setChanged = () => dispatch => dispatch({type: CHANGED});

const updateUser = async (prop, value) => {
    const user = await getUserFromAsyncStorage()
    const userEdited = { ...user, [prop]: value };
    console.log('user: ', userEdited)
    await setUserFromAsyncStorage(userEdited)
    const docRef = firestore.collection('users').doc(auth.currentUser.uid);
    await docRef.set(userEdited);
}

export const addContact = (contact) => {
    return async dispatch => {
        dispatch({type: USER_PENDING});
        try {
            const newContact = { ...contact, id: getNewId() };
            const user = await getUserFromAsyncStorage();
            const contacts = user.contacts ? user.contacts : [] ;
            contacts.push(newContact);
            await updateUser('contacts', contacts);
            dispatch({type: ADD_CONTACT, payload: {contact: newContact}})
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const updateContact = (contactUpdated) => {
    return async dispatch => {
        dispatch({type: USER_PENDING});
        try {
            const user = await getUserFromAsyncStorage();
            const contacts = user.contacts.map(contact => {
                return contact.id === contactUpdated.id ?
                    {
                        ...contact,
                        name: contactUpdated.name,
                        phone: contactUpdated.phone
                    }
                    :
                    contact
            });
            await updateUser('contacts', contacts);
            dispatch({type: UPDATE_CONTACT, payload: {contact: contactUpdated}})
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const deleteContact = (id) => {
    return async dispatch => {
        dispatch({type: USER_PENDING});
        try {
            const user = await getUserFromAsyncStorage()
            const contacts = user.contacts.filter(contact => contact.id !== id);
            await updateUser('contacts', contacts);
            dispatch({type: DELETE_CONTACT, payload: {id}})
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const saveMessage = (message) => {
    return async dispatch => {
        dispatch({type: USER_PENDING});
        try {
            await updateUser('message', message);
            dispatch({type: SET_MESSAGE, payload: {message}})
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const saveLocation = (location) => {
    return async dispatch => {
        try {
            await updateUser('location', location);
            dispatch({type: SET_LOCATION, payload: {location}})
        } catch (error) {
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const getContactLocation = (userPhone, phone) => {
    return async dispatch => {
        try {
            const users = await firestore.collection('users').get();
            let userFindIt = {};
            users.forEach(user => {
                console.log('user: ', user.data().phone, user.data().phone === phone);
                if(user.data().phone === phone) {
                    userFindIt = user.data();
                }
            })
            console.log('find :', userFindIt)
            if(Object.keys(userFindIt).length > 0) {
                const contact = userFindIt.contacts.filter( contact => contact.phone === userPhone);
                console.log('contact', contact);
                if(contact.length > 0) {
                    console.log('location contact: ', userFindIt.location)
                    dispatch({type: CONTACT_LOCATION, payload: {contactLocation: userFindIt.location}})
                } else {
                    dispatch({type: ERROR_USER, payload: {error: { code: 3, message: 'No tiene permiso para ver la ubicación de ese número'}}})
                }
            } else {
                dispatch({type: ERROR_USER, payload: {error: { code: 4, message: 'No se encontro ningún usuario registrado con ese número'}}})
            }
        } catch (error) {
            console.log(error);
            dispatch({type: ERROR_USER, payload: {error}})
        }
    }
}

export const hideContactLocation = () => dispatch => dispatch({type: HIDE_CONTACT_LOCATION});
