import React, {useRef} from 'react';
import {Button, Text, Card, Modal, Portal} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

type PredictionsArray = {
  label: string;
  confidence: number;
};

type ReturnData = {
  prediction: PredictionsArray[];
};

export default function Index() {
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();
  // Take photo
  const camera = useRef<Camera>(null);
  const [visible, setVisible] = React.useState(false);
  const [predictedTarot, setPredictedTarot] = React.useState<ReturnData>();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const uploadImage = async (filePath: string) => {
    const formData = new FormData();

    formData.append('image', {
      uri: filePath,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any); // Required in React Native

    try {
      const response = await fetch(
        'https://tarot-ai-server-production.up.railway.app/predict',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.text(); // or .json() depending on your server
        throw new Error(
          `Server responded with status ${response.status}: ${errorData}`,
        );
      }

      const data = await response.json();
      if (data !== null) {
        console.log('data', data);
        setPredictedTarot(data.predictions || data);
        showModal();
      }
      // Should contain prediction results
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const takePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      const result = await fetch(`file://${photo.path}`);
      const data = await result.blob();
      console.log('Photo data:', data);
      uploadImage(`file://${photo.path}`);
    }
  };

  const getTarotText = (text: string) => {
    if (predictedTarot !== undefined && predictedTarot.prediction !== undefined && predictedTarot.prediction[0] !== undefined ){
        if (text === 'label') {return predictedTarot.prediction[0].label;}
        if (text === 'confidence')  {return predictedTarot.prediction[0].confidence;}
    }
  }

  const getTarotConfidencePercentage = () => {
   if (predictedTarot !== undefined && predictedTarot.prediction !== undefined && predictedTarot.prediction[0] !== undefined ){
    return `${Math.trunc(predictedTarot.prediction[0].confidence * 100)}%`;
   }
  }

  if (!hasPermission) {
    Camera.requestCameraPermission();
  }
  if (device == null) {
    return <Text>Error: No Camera Device</Text>;
  }
  return (
    <View
      style={
        styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        photo={true}
        device={device}
        isActive={true}
      />
      <TouchableOpacity style={styles.button} onPress={takePhoto}/>
      
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <Card style={{height: 200, margin: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           <Text variant="headlineSmall"> {getTarotText('label')}</Text>
           <Text variant="headlineSmall" style={{textAlign: 'center'}}> {getTarotConfidencePercentage()}</Text>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
    backgroundColor: '#231123',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
  button: {
    width: 80,
    height: 80,
    zIndex: 5,
    position: 'absolute',
    bottom: 40,
    boxShadow:'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#FFF8C2',
    backgroundColor: 'white',
  }
});
