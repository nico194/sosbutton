export const getErrorMessate = (code, message) => {
    switch (code) {
        case 'auth/wrong-password':
            return 'El email o la contraseña son incorrectos. Por favor, intente nuevamente.';
        case 'auth/invalid-email':
            return 'El formato del email no es el correcto.';
        case 'auth/user-not-found':
            return 'No hay ningún registro de usuario que corresponda a este identificador. Es posible que se haya eliminado al usuario.'
        case 'auth/weak-password':
            return 'La contraseña debe terner al menos 6 caracteres.'
        case 'auth/email-already-in-use':
            return 'La dirección de correo electrónico ya está siendo utilizada por otra cuenta.'
        default:
            return message;
    }
}