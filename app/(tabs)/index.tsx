import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Camera, useCameraDevice, useCameraPermission,
  useMicrophonePermission } from 'react-native-vision-camera'
import * as MediaLibrary from 'expo-media-library';
export default function HomeScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission()
  const {hasPermission:hasMicPermission,requestPermission:requestMicPermission} = useMicrophonePermission();
  const [permission,setPermission] = useState(Boolean);
  
  useEffect(()=>{
    (async()=>{
      const status = await requestPermission();
      const statusMic = await requestMicPermission();
      if(status && statusMic){
        setPermission(true);
      }
      const {status:statusMediaLibrary} = await MediaLibrary.requestPermissionsAsync();
      if(statusMediaLibrary!=='granted') return;
    })
  },[])
  const startRecording = () => {
    if (!cameraRef.current || !device) return;
    setIsRecording(true);
  
    cameraRef.current.startRecording({
      onRecordingFinished: (video) => {
        setIsRecording(false);
        setVideoUri(video.path);
        setModalVisible(true);
      },
      onRecordingError: (error) => {
        console.log(error);
      }
    });
  };
  
  const stopRecording = async () => {
    if(cameraRef.current){
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }
  const handleSaveVideo = async () =<{
    if(videoUri){
      try{
        await MediaLibrary.createAssetAsync(videoUri);
      }catch(error){
        console.log(error)
      }
    }
  }
  return (
    <View style={styles.container}>
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
    <TouchableOpacity
    onPressIn={startRecording}
    onPressOut={stopRecording}
    />
    <Video
      source={{
        uri: videoUri
      }}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      shouldPlay
      isLooping
      resizeMode={ResizeMode.COVER}
      style={{ width: 300, height: 300 }}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  step: {
    fontSize: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
