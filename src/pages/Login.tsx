import React, { useState } from 'react';
import { 
  IonButton,
  IonButtons,
  IonContent, 
  IonHeader, 
  IonInput, 
  IonMenuButton, 
  IonPage, 
  IonText, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonList, 
  useIonRouter,
  IonAvatar,
  IonAlert,
  IonLabel,
  IonModal,
} from '@ionic/react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [showRegister, setShowRegister] = useState(false); // Track whether the registration form is visible
  const [showAlert, setShowAlert] = useState(false); // Control the alert visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Control login success modal visibility
  const [username, setUsername] = useState(''); // Track username input
  const [password, setPassword] = useState(''); // Track password input
  const [loginError, setLoginError] = useState(false); // Control login error visibility
  
  // Track registration data
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');

  // Predefined valid credentials for validation (this could be from an API in real apps)
  const validUsername = 'user123';
  const validPassword = 'password123';

  const doLogin = () => {
    // Use the registered credentials for login
    if (username === registeredUsername && password === registeredPassword) {
      setShowSuccessModal(true); // Show success modal
      setLoginError(false); // Clear any previous error
    } else {
      setLoginError(true); // Show error if credentials are incorrect
    }
  };

  const toggleRegisterForm = () => {
    setShowRegister(!showRegister); // Toggle the registration form visibility
  };

  const handleRegister = () => {
    // Store the registration data
    setRegisteredUsername(username);
    setRegisteredPassword(password);
    setShowAlert(true); // Show the alert when user clicks the register button
  };

  const handleAlertConfirm = () => {
    setShowAlert(false); // Hide the alert
    setShowRegister(false); // Hide the registration form and go back to the login form
    setUsername(''); // Clear username input
    setPassword(''); // Clear password input
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false); // Close the success modal
    // Navigate to the new page after login success
    navigation.push('/it35-lab/app', 'forward', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-text-center">
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          
          <IonAvatar style={{ marginBottom: '20px' }}>
            <img alt="Silhouette of a person's head" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNt-Vy_I4LN6JZhvwnJpxoetaJP321ospbf_fxhzPABPv1k67JLDsQbammchNbmtep_H1RVS0-rq9_qqdpO8vYgA" />
          </IonAvatar>

          {/* Conditionally render the login form or register form */}
          {!showRegister && (
            <div style={{ width: '80%' }}>
              <IonList>
                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={username} 
                    onIonChange={(e) => setUsername(e.detail.value!)} 
                  >
                    <div slot="label">
                      Username<IonText color="danger">(Required)</IonText>
                    </div>
                  </IonInput>
                </IonItem>

                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={password} 
                    type="password" 
                    onIonChange={(e) => setPassword(e.detail.value!)} 
                  >
                    <div slot="label">
                      Password<IonText color="danger">(Required)</IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonList>

              {/* Display error if login fails */}
              {loginError && (
                <IonText color="danger">
                  <p>Incorrect username or password. Please try again.</p>
                </IonText>
              )}

              <IonButton onClick={doLogin} expand="full" style={{ marginTop: '20px', width: '80%' }}>
                Login
              </IonButton>

              <IonButton 
                onClick={toggleRegisterForm} 
                expand="full" 
                style={{ marginTop: '10px', width: '80%' }}
                color="secondary"
              >
                Create Account
              </IonButton>
            </div>
          )}

          {/* Conditionally rendered Register Form */}
          {showRegister && (
            <div style={{ marginTop: '20px', width: '80%' }}>
              <IonList>
                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={username} 
                    onIonChange={(e) => setUsername(e.detail.value!)} 
                  >
                    <div slot="label">
                      Email<IonText color="danger"></IonText>
                    </div>
                  </IonInput>
                </IonItem>

                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={username} 
                    onIonChange={(e) => setUsername(e.detail.value!)} 
                  >
                    <div slot="label">
                      Username<IonText color="danger"></IonText>
                    </div>
                  </IonInput>
                </IonItem>

                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={password} 
                    type="password" 
                    onIonChange={(e) => setPassword(e.detail.value!)} 
                  >
                    <div slot="label">
                      Password<IonText color="danger"></IonText>
                    </div>
                  </IonInput>
                </IonItem>

                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={password} 
                    type="password" 
                    onIonChange={(e) => setPassword(e.detail.value!)} 
                  >
                    <div slot="label">
                      Confirm Password<IonText color="danger"></IonText>
                    </div>
                  </IonInput>
                </IonItem>
              </IonList>

              <IonButton 
                onClick={handleRegister} 
                expand="full" 
                style={{ marginTop: '20px' }} 
                color="primary"
              >
                Register
              </IonButton>

              <IonButton 
                onClick={toggleRegisterForm} 
                expand="full" 
                style={{ marginTop: '10px', width: '80%' }}
                color="secondary"
              >
                Back to Login
              </IonButton>
            </div>
          )}
        </div>

        {/* Alert Confirmation when Registration is Successful */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Account Created"
          message="You have successfully created an account. Please log in."
          buttons={[{
            text: 'OK',
            handler: handleAlertConfirm
          }]}
        />

        {/* Success Modal after Successful Login */}
        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
          <IonContent className="ion-padding">
            <h2>Login Successful!</h2>
            <IonButton expand="full" onClick={handleSuccessModalClose}>
              Go to Dashboard
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Login;
