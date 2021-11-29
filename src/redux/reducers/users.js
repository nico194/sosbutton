import {
    USER_PENDING,
    GET_USER,
    ERROR_USER,
    LOGOUT_USER,
    CHANGED,
    SET_LOCATION,
    SET_MESSAGE,
    ADD_CONTACT,
    UPDATE_CONTACT,
    DELETE_CONTACT,
    CONTACT_LOCATION,
    HIDE_CONTACT_LOCATION
} from '../constants/users';

const initialState = {
    loading: false,
    error: null,
    uid: '',
    name: '',
    email: '',
    phone: '',
    contacts: [],
    message: '',
    activeFollowLocation: false,
    location: {},
    contactLocation: {},
    region: {},
    logged: false,
    token: '',
    changed: false
}

const usersReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case USER_PENDING:
            return {
                ...state,
                loading: true
            }
        case ERROR_USER: {
            return {
                ...state,
                loading: false,
                error: payload.error
            }
        }
        case GET_USER: {
            return {
                ...state,
                loading: false,
                uid: payload.user.uid,
                name: payload.user.name,
                email: payload.user.email,
                phone: payload.user.phone,
                contacts: payload.user.contacts ? payload.user.contacts : [],
                message: payload.user.message ? payload.user.message : '',
                location: payload.user.location ? payload.user.location : {},
                error: null,
                logged: true
            }
        }
        case LOGOUT_USER: 
            return state = initialState;
        case ADD_CONTACT: {
            return {
                ...state,
                loading: false,
                changed: true,
                contacts: [ ...state.contacts, payload.contact]
            }
        }
        case UPDATE_CONTACT: {
            return {
                ...state,
                loading: false,
                changed: true,
                contacts: state.contacts.map( contact => {
                    return contact.id === payload.contact.id ?
                        {
                            ...contact,
                            name: payload.contact.name,
                            phone: payload.contact.phone
                        }
                        :
                        contact
                })
            }
        }
        case DELETE_CONTACT: {
            return {
                ...state,
                loading: false,
                changed: true,
                contacts: state.contacts.filter( contact => contact.id !== payload.id)
            }
        }
        case SET_MESSAGE: {
            return {
                ...state,
                loading: false,
                changed: true,
                message: payload.message,
                error: null
            }
        }
        case SET_LOCATION: {
            return {
                ...state,
                activeFollowLocation: true,
                changed: true,
                location: payload.location,
                error: null
            }
        }
        case CONTACT_LOCATION: {
            return {
                ...state,
                contactLocation: payload.contactLocation,
                changed: true,
                error: null
            }
        }
        case HIDE_CONTACT_LOCATION: {
            return {
                ...state,
                contactLocation: {},
                error: null
            }
        }
        case CHANGED: {
            return {
                ...state,
                changed: false
            }
        }
        default:
            return state
    }
}

export default usersReducer;