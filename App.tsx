import {useEffect, useState} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
} from 'react-native-vision-camera';

export default function Index() {
  const [hasPermission, setHasPermission] =
    useState<CameraPermissionStatus>('not-determined');

  useEffect(() => {
    Camera.requestCameraPermission().then(p => {
      if (p === 'granted') {
        setHasPermission('granted');
      }
    });
  }, []);

  const device = useCameraDevice('back');

  if (!hasPermission) {
    return Camera.requestCameraPermission();
  }
  
  return (
 <View style={StyleSheet.absoluteFill}>
      {!hasPermission && <Text >No Camera Permission.</Text>}
      {hasPermission && device != null && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
      )}
    </View>  );
}
