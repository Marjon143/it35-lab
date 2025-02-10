import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';

function Example() {
  return (
    <IonCard>
      <img alt="Silhouette of mountains" src="https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg" />
      <IonCardHeader>
        <IonCardTitle>Tanly</IonCardTitle>
        <IonCardSubtitle>Gwapo</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>Weehh</IonCardContent>
    </IonCard>
  );
}
export default Example;