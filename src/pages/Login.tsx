import React from 'react';
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
  IonInputPasswordToggle,
  IonAvatar,
  IonLabel
} from '@ionic/react';

const Login: React.FC = () => {
  const navigation = useIonRouter();

  const doLogin = () => {
    navigation.push('/it35-lab/app', 'forward', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-text-center">
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          
          {}
          <IonAvatar style={{ marginBottom: '20px' }}>
            <img alt="Silhouette of a person's head" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNt-Vy_I4LN6JZhvwnJpxoetaJP321ospbf_fxhzPABPv1k67JLDsQbammchNbmtep_H1RVS0-rq9_qqdpO8vYgA" />
          </IonAvatar>

          <IonList style={{ width: '80%' }}>
            {}
            <IonItem>
              <IonInput labelPlacement="floating" value="hi@ionic.io">
                <div slot="label">
                  Username<IonText color="danger">(Required)</IonText>
                </div>
              </IonInput>
            </IonItem>

            {}
            <IonItem>
              <IonInput type="password" label="Password" value="NeverGonnaGiveYouUp">
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
          </IonList>

          {}
          <IonButton onClick={() => doLogin()} expand="full" style={{ marginTop: '20px', width: '80%' }}>
            Login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
