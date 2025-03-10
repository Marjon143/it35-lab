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
  IonInputPasswordToggle,
  IonToast
} from '@ionic/react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Control the alert visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFillInfoModal, setShowFillInfoModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(''); // Track confirm password input

  // Predefined valid credentials for validation
  const validUsername = 'user123';
  const validPassword = 'password123';

  const doLogin = () => {
    if (!username || !password) {
      setShowFillInfoModal(true);
    } else {
      if (username === registeredUsername && password === registeredPassword) {
        setShowSuccessModal(true);
        setLoginError(false);
        setShowToast(true);
      } else {
        setLoginError(true);
      }
    }
  };

  const toggleRegisterForm = () => {
    setShowRegister(!showRegister);
  };

  const handleRegister = () => {
    // Validate if all fields are filled in the registration form
    if (!username || !password || !confirmPassword) {
      setShowAlert(true); // Show the alert if any field is empty
    } else if (password !== confirmPassword) {
      setShowAlert(true); // Show the alert if passwords don't match
    } else {
      // Store the registration data
      setRegisteredUsername(username);
      setRegisteredPassword(password);
      setShowAlert(true); // Show the alert after successful registration
    }
  };

  const handleAlertConfirm = () => {
    // Check if all fields are properly filled before navigating
    if (username && password && confirmPassword && password === confirmPassword) {
      // If valid, go back to the login page
      setShowRegister(false);
      setUsername('');
      setPassword('');
      setConfirmPassword(''); // Clear confirm password input
      navigation.push('/login', 'back', 'replace');
    }
    setShowAlert(false); // Close the alert regardless of the result
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.push('/it35-lab/app', 'forward', 'replace');
  };

  const handleFillInfoModalClose = () => {
    setShowFillInfoModal(false);
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
            <img alt="Silhouette of a person's head" src="" />
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
                    type={showPassword ? 'text' : 'password'} // Toggle password visibility
                    onIonChange={(e) => setPassword(e.detail.value!)} 
                  >
                    <div slot="label">
                      Password<IonText color="danger">(Required)</IonText>
                    </div>
                    <IonInputPasswordToggle slot="end" onClick={() => setShowPassword(!showPassword)} />
                  </IonInput>
                </IonItem>
              </IonList>

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
                    type={showPassword ? 'text' : 'password'} 
                    onIonChange={(e) => setPassword(e.detail.value!)} 
                  >
                    <div slot="label">
                      Password<IonText color="danger"></IonText>
                    </div>
                    <IonInputPasswordToggle slot="end" onClick={() => setShowPassword(!showPassword)} />
                  </IonInput>
                </IonItem>

                <IonItem>
                  <IonInput 
                    labelPlacement="floating" 
                    value={confirmPassword} 
                    type={showPassword ? 'text' : 'password'} 
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)} 
                  >
                    <div slot="label">
                      Confirm Password<IonText color="danger"></IonText>
                    </div>
                    <IonInputPasswordToggle slot="end" onClick={() => setShowPassword(!showPassword)} />
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
                style={{ marginTop: '10px' }} 
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
          header="Please Fill in All Fields"
          message="All fields are required. Please fill in all fields."
          buttons={[{
            text: 'OK',
            handler: handleAlertConfirm
          }]}/>

        {/* Success Modal after Successful Login */}
        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
          <IonContent className="ion-padding">
            <h2>Login Successful!</h2>
            <IonButton expand="full" onClick={handleSuccessModalClose}>
              Go to Dashboard
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal asking to fill in information */}
        <IonModal isOpen={showFillInfoModal} onDidDismiss={handleFillInfoModalClose}>
          <IonContent className="ion-padding">
            <h2>Please Fill in All Fields</h2>
            <IonButton expand="full" onClick={handleFillInfoModalClose}>
              Close
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Toast Message for successful login */}
        <IonToast
          isOpen={showToast}
          message="Login successful! Redirecting to the dashboard..."
          onDidDismiss={() => setShowToast(false)}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
