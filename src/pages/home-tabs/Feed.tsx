import React from 'react';
import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle 
} from '@ionic/react';

const Feed: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: '20px', 
          }}
        >
          <IonCard>
            <img alt="Silhouette of mountains" src="https://nationaltoday.com/wp-content/uploads/2020/02/doggy-date-night.jpg" />
            <IonCardHeader>
              <IonCardTitle>Tanly</IonCardTitle>
              <IonCardSubtitle>Cutie</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              pagka lovely sa doggy
            </IonCardContent>
          </IonCard>

          {}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
