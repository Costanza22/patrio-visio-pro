import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AIService } from '../services/AIService';
import { LocationService, LocationData } from '../services/LocationService';
import { Building } from '../data/buildings';

interface CameraViewProps {
  onObjectDetected: (buildingInfo: Building, aiAnalysis: any, location: LocationData) => void;
}

export default function CameraView({ onObjectDetected }: CameraViewProps) {
  const [detectionCount, setDetectionCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isInHistoricalArea, setIsInHistoricalArea] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    initializeLocation();
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (isWeb) {
      setHasPermission(true);
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(permissionResult.status === 'granted');
    } catch (error) {
      console.error('Erro ao solicitar permissão da câmera:', error);
      setHasPermission(false);
    }
  };

  const initializeLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        const isHistorical = LocationService.isInHistoricalArea(location.latitude, location.longitude);
        setIsInHistoricalArea(isHistorical);
      } else {
        const demoLocation = LocationService.getDemoLocation();
        setCurrentLocation(demoLocation);
        setIsInHistoricalArea(true);
      }
    } catch (error) {
      console.error('Erro ao inicializar localização:', error);
      const demoLocation = LocationService.getDemoLocation();
      setCurrentLocation(demoLocation);
      setIsInHistoricalArea(true);
    }
  };

  const takePicture = async () => {
    if (isWeb) {
      simulateImageSelection();
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // TODO: Atualizar para ImagePicker.MediaType.Images quando a nova API estiver disponível
      // Por enquanto, usando a API antiga que funciona com a versão atual
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeImage(result.assets[0].uri);
      } else {
        setIsAnalyzing(false);
      }
      
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
      setIsAnalyzing(false);
    }
  };

  const selectImageFromGallery = async () => {
    try {
      setIsAnalyzing(true);
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
        setIsAnalyzing(false);
        return;
      }

      // TODO: Atualizar para ImagePicker.MediaType.Images quando a nova API estiver disponível
      // Por enquanto, usando a API antiga que funciona com a versão atual
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeImage(result.assets[0].uri);
      } else {
        setIsAnalyzing(false);
      }
      
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
      setIsAnalyzing(false);
    }
  };

  const simulateImageSelection = async () => {
    await analyzeImage('simulated_image_uri');
  };

  const analyzeImage = async (imageUri: string) => {
    if (!currentLocation) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
      setIsAnalyzing(false);
      return;
    }
    
    try {
      const aiAnalysis = await AIService.analyzeImage(imageUri);
      await AIService.saveAnalysis(imageUri, aiAnalysis, currentLocation);
      const simulatedBuilding = createBuildingFromAnalysis(aiAnalysis, currentLocation);
      
      setDetectionCount(prev => prev + 1);
      onObjectDetected(simulatedBuilding, aiAnalysis, currentLocation);
      
    } catch (error) {
      console.error('Erro na análise:', error);
      Alert.alert('Erro', 'Não foi possível analisar a imagem');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createBuildingFromAnalysis = (analysis: any, location: LocationData): Building => {
    return {
      id: Date.now().toString(),
      type: 'casarão',
      name: `Casarão ${analysis.architecturalStyle}`,
      year: analysis.estimatedYear,
      style: analysis.architecturalStyle,
      description: analysis.description,
      address: location.address,
      historicalValue: analysis.confidence > 80 ? 'Alto' : 'Médio',
      currentUse: analysis.buildingType,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      architect: 'Detectado por IA',
      constructionMaterials: ['Detectado automaticamente'],
      historicalEvents: [`Análise realizada em ${new Date().toLocaleDateString()}`],
    };
  };

  // Renderização para web
  if (isWeb) {
    return (
      <View style={styles.container}>
        <View style={styles.webContainer}>
          {/* Status de localização */}
          <View style={styles.locationStatus}>
            <Text style={styles.locationStatusText}>
              📍 {currentLocation?.city || 'Localizando...'}
            </Text>
            <Text style={styles.locationStatusSubtext}>
              {isInHistoricalArea ? '✅ Área histórica detectada' : '⚠️ Fora de área histórica'}
            </Text>
          </View>

          {/* Área da câmera */}
          <View style={styles.cameraArea}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.cameraText}>Câmera Inteligente</Text>
            <Text style={styles.cameraSubtext}>
              Versão Web - Clique em Detectar para analisar uma imagem
            </Text>
          </View>
          
          {/* Alvo de foco */}
          <View style={styles.focusArea}>
            <View style={styles.focusFrame}>
              <Text style={styles.focusText}>Centralize o casarão na área</Text>
            </View>
          </View>

          {/* Controles */}
          <View style={styles.webControls}>
            <TouchableOpacity 
              style={[styles.webButton, isAnalyzing && styles.webButtonDisabled]} 
              onPress={takePicture}
              disabled={isAnalyzing}>
              <Text style={styles.webButtonText}>
                {isAnalyzing ? '⏳ Analisando...' : '🔍 Detectar com IA'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.webHelpText}>
              <Text style={styles.webHelpTextContent}>
                Selecione uma imagem para análise inteligente de arquitetura
              </Text>
            </View>

            {currentLocation && (
              <View style={styles.webLocationInfo}>
                <Text style={styles.webLocationInfoText}>
                  📍 {currentLocation.address}
                </Text>
                <Text style={styles.webLocationInfoSubtext}>
                  {currentLocation.city}, {currentLocation.state} - {currentLocation.country}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Renderização para mobile
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
          <ActivityIndicator size="large" color="#00FF00" />
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Sem acesso à câmera</Text>
          <Text style={styles.permissionSubtext}>
            É necessário permitir o acesso à câmera para usar este app
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
            <Text style={styles.permissionButtonText}>Permitir Acesso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status de localização */}
      <View style={styles.locationStatus}>
        <Text style={styles.locationStatusText}>
          📍 {currentLocation?.city || 'Localizando...'}
        </Text>
        <Text style={styles.locationStatusSubtext}>
          {isInHistoricalArea ? '✅ Área histórica detectada' : '⚠️ Fora de área histórica'}
        </Text>
      </View>

      {/* Área da câmera */}
      <View style={styles.cameraArea}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraText}>Câmera Ativa</Text>
        <Text style={styles.cameraSubtext}>
          Aponte para um casarão histórico
        </Text>
      </View>
      
      {/* Alvo de foco */}
      <View style={styles.focusArea}>
        <View style={styles.focusFrame}>
          <Text style={styles.focusText}>Centralize o casarão na área</Text>
        </View>
      </View>

      {/* Controles modernos */}
      <View style={styles.modernControls}>
        {/* Botão principal */}
        <TouchableOpacity 
          style={[styles.mainButton, isAnalyzing && styles.mainButtonDisabled]} 
          onPress={takePicture}
          disabled={isAnalyzing}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>📸</Text>
            <Text style={styles.mainButtonText}>
              {isAnalyzing ? '⏳ Analisando...' : 'Tirar Foto e Analisar'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botão secundário */}
        <TouchableOpacity 
          style={[styles.secondaryButton, isAnalyzing && styles.secondaryButtonDisabled]} 
          onPress={selectImageFromGallery}
          disabled={isAnalyzing}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>📁</Text>
            <Text style={styles.secondaryButtonText}>
              Selecionar da Galeria
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Texto de ajuda */}
        <View style={styles.helpText}>
          <Text style={styles.helpTextContent}>
            📸 Tire uma foto ou 📁 selecione uma imagem da galeria para análise
          </Text>
        </View>

        {/* Informações de localização */}
        {currentLocation && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationInfoText}>
              📍 {currentLocation.address}
            </Text>
            <Text style={styles.locationInfoSubtext}>
              {currentLocation.city}, {currentLocation.state} - {currentLocation.country}
            </Text>
          </View>
        )}
      </View>

      {/* Indicador de análise */}
      {isAnalyzing && (
        <View style={styles.analyzingOverlay}>
          <ActivityIndicator size="large" color="#00FF00" />
          <Text style={styles.analyzingText}>Analisando imagem...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  
  // Container web
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  // Status de localização
  locationStatus: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    zIndex: 10,
  },
  locationStatusText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationStatusSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Área da câmera
  cameraArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraIcon: {
    fontSize: 80,
    color: '#fff',
    marginBottom: 10,
  },
  cameraText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cameraSubtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Área de foco
  focusArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  focusFrame: {
    width: 200,
    height: 150,
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buildingTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  buildingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  focusText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  // Casa histórica
  historicalHouse: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  roof: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roofTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B4513',
    borderStyle: 'solid',
  },
  facade: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    padding: 8,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  upperFloor: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  balcony: {
    width: 70,
    height: 35,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  balconyRailing: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  flowerBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 5,
  },
  flowerBox: {
    width: 8,
    height: 8,
    backgroundColor: '#FF69B4',
    borderRadius: 4,
  },
  lowerFloor: {
    alignItems: 'center',
  },
  arches: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  arch: {
    width: 18,
    height: 12,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  
  // Controles web
  webControls: {
    alignItems: 'center',
  },
  webButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 20,
  },
  webButtonDisabled: {
    backgroundColor: '#666',
    borderColor: '#999',
  },
  webButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webHelpText: {
    marginBottom: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  webHelpTextContent: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  webLocationInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  webLocationInfoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  webLocationInfoSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Controles modernos mobile
  modernControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 15,
    minWidth: 280,
  },
  mainButtonDisabled: {
    backgroundColor: '#666',
    borderColor: '#999',
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 20,
    minWidth: 240,
  },
  secondaryButtonDisabled: {
    backgroundColor: '#666',
    borderColor: '#999',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  
  // Texto de ajuda
  helpText: {
    marginBottom: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  helpTextContent: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 8,
  },
  helpTextSubtext: {
    color: '#00FF00',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Informações de localização
  locationInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  locationInfoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationInfoSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Container de permissão
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Overlay de análise
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
