import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CameraView from './components/CameraView';
import BuildingInfo from './components/BuildingInfo';
import { Building } from './data/buildings';
import { LocationData } from './services/LocationService';

export default function App() {
  const [detectedBuilding, setDetectedBuilding] = useState<Building | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const handleObjectDetected = (
    buildingInfo: Building, 
    analysis: any, 
    location: LocationData
  ) => {
    setDetectedBuilding(buildingInfo);
    setAiAnalysis(analysis);
    setCurrentLocation(location);
    setIsCameraActive(false);
  };

  const handleCloseBuildingInfo = () => {
    setDetectedBuilding(null);
    setAiAnalysis(null);
    setCurrentLocation(null);
    setIsCameraActive(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />
      
      {isCameraActive && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Patrio Visio Pro</Text>
          <Text style={styles.headerSubtitle}>IA para Reconhecimento de Casarões Históricos</Text>
        </View>
      )}

      {isCameraActive ? (
        <CameraView onObjectDetected={handleObjectDetected} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Análise Concluída</Text>
          <Text style={styles.placeholderSubtext}>
            Toque em "Voltar" para continuar explorando ou analisar outro casarão
          </Text>
          {aiAnalysis && (
            <View style={styles.analysisSummary}>
              <Text style={styles.analysisSummaryTitle}>Resumo da Análise:</Text>
              <Text style={styles.analysisSummaryText}>
                🏛️ Estilo: {aiAnalysis.architecturalStyle}
              </Text>
              <Text style={styles.analysisSummaryText}>
                📅 Período: {aiAnalysis.estimatedYear}
              </Text>
              <Text style={styles.analysisSummaryText}>
                🎯 Confiança: {Math.round(aiAnalysis.confidence)}%
              </Text>
            </View>
          )}
        </View>
      )}

      {detectedBuilding && (
        <BuildingInfo 
          building={detectedBuilding} 
          onClose={handleCloseBuildingInfo}
          aiAnalysis={aiAnalysis}
          location={currentLocation}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 40,
  },
  placeholderText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  analysisSummary: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  analysisSummaryTitle: {
    fontSize: 18,
    color: '#00FF00',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  analysisSummaryText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
});
