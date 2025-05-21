import React, { useRef } from 'react';
import { Button, StyleSheet, Text, View,  } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function App() {
    const device = useCameraDevice('back');
    const {hasPermission} = useCameraPermission();
  // Take photo
  const camera = useRef<Camera>(null);

  const takePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      const result = await fetch(`file://${photo.path}`)
      const data = await result.blob();
      console.log('Photo data:', data);

      // setPhotoPath('file://' + photo.path); // Android needs `file://` prefix
    }
  };
    if (!hasPermission) {
      Camera.requestCameraPermission();
    }
    if (device == null) {
      return <Text>Error: No Camera Device</Text>;
    }
    return (
    <View style={styles.container}>
      
        <Camera ref={camera} style={StyleSheet.absoluteFill} photo={true} device={device} isActive={true} />
        <Button title="Take Photo" onPress={takePhoto} />

    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });