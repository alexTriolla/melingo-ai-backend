export const RegexLettersSpacesAndNumbers = /^[-\w\u0590-\u05fe ]+$/i;

export const RegexValidCognitoPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.{}\[\]()?\-\"!@#%&/\\,><':;|_~`+=])[A-Za-z\d\^$*.{}\[\]()?\-\"!@#%&/\\,><':;|_~`+=]{8,}$/;
