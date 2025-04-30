import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 1000);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          style={{
            backgroundImage: 'url("https://png.pngtree.com/thumb_back/fh260/background/20240103/pngtree-metallic-tech-design-a-dynamic-background-with-a-touch-of-metal-image_13897933.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: '20px',
            margin: '20px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <IonAvatar style={{
              width: '150px',
              height: '150px',
              marginBottom: '20px'
            }}>
              <img
                src="https://media.tenor.com/Kw1Dse6ZumEAAAAM/goat-licking.gif"
                alt="User Avatar"
                style={{ width: '100%', height: '100%' }}
              />
            </IonAvatar>

            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>USER LOGIN</h1>

            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              placeholder="Enter Email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              style={{ width: '100%' }}
            />

            <IonInput
              style={{ marginTop: '10px', width: '100%' }}
              fill="outline"
              type="password"
              placeholder="Password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
            >
              <IonInputPasswordToggle slot="end" />
            </IonInput>

            <IonButton onClick={doLogin} expand="block" shape="round" style={{ marginTop: '20px' }}>
              Login
            </IonButton>

            <IonButton routerLink="/it35-lab/register" expand="block" fill="clear" shape="round">
              Don't have an account? Register here
            </IonButton>
          </div>
        </div>

        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
