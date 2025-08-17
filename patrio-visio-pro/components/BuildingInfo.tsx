import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Building } from '../data/buildings';
import { LocationData } from '../services/LocationService';
import { AIAnalysisResult } from '../services/AIService';

interface BuildingInfoProps {
  building: Building;
  onClose: () => void;
  aiAnalysis?: AIAnalysisResult;
  location?: LocationData;
}

export default function BuildingInfo({ building, onClose, aiAnalysis, location }: BuildingInfoProps) {
  const isRecognizedBuilding = building.name.includes('Procópio Gomes') || 
                               building.name.includes('Barão') || 
                               building.name.includes('Palacete');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'historical': return '#FFD700';
      case 'modern': return '#FF6B6B';
      case 'other': return '#4ECDC4';
      default: return '#95A5A6';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'historical': return '🏛️';
      case 'modern': return '🏢';
      case 'other': return '📦';
      default: return '❓';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'historical': return 'CASARÃO HISTÓRICO';
      case 'modern': return 'EDIFÍCIO MODERNO';
      case 'other': return 'OUTRO OBJETO';
      default: return 'NÃO IDENTIFICADO';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isRecognizedBuilding ? '🎯 ' : ''}{building.name}
            </Text>
            {isRecognizedBuilding && (
              <View style={styles.recognitionBadge}>
                <Text style={styles.recognitionText}>🤖 CASARÃO RECONHECIDO!</Text>
              </View>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Análise de IA */}
          {aiAnalysis && (
            <View style={styles.aiAnalysisContainer}>
              <Text style={styles.sectionTitle}>🤖 Análise de IA</Text>
              
              {/* Status Online/Offline */}
              <View style={styles.analysisStatusContainer}>
                <Text style={styles.analysisStatusIcon}>
                  {aiAnalysis.isOfflineAnalysis ? '📱' : '🌐'}
                </Text>
                <Text style={[styles.analysisStatusText, { 
                  color: aiAnalysis.isOfflineAnalysis ? '#FFD700' : '#00FF00' 
                }]}>
                  {aiAnalysis.isOfflineAnalysis ? 'Análise Offline' : 'Análise Online'}
                </Text>
                {aiAnalysis.isOfflineAnalysis && (
                  <Text style={styles.analysisStatusSubtext}>
                    Funcionando sem internet - IA local inteligente
                  </Text>
                )}
              </View>
              
              {/* Categoria do Objeto */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(aiAnalysis.buildingCategory)}</Text>
                <Text style={[styles.categoryText, { color: getCategoryColor(aiAnalysis.buildingCategory) }]}>
                  {getCategoryText(aiAnalysis.buildingCategory)}
                </Text>
              </View>

              {/* Barra de Confiança */}
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confiança da Análise:</Text>
                <View style={styles.confidenceBar}>
                  <View 
                    style={[
                      styles.confidenceFill, 
                      { width: `${aiAnalysis.confidence}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.confidenceText}>{aiAnalysis.confidence}%</Text>
              </View>

              {/* Detalhes da Análise */}
              <View style={styles.analysisDetails}>
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisLabel}>🏗️ Estilo:</Text>
                  <Text style={styles.analysisValue}>{aiAnalysis.architecturalStyle}</Text>
                </View>
                
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisLabel}>🏛️ Tipo:</Text>
                  <Text style={styles.analysisValue}>{aiAnalysis.buildingType}</Text>
                </View>
                
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisLabel}>📅 Ano Estimado:</Text>
                  <Text style={styles.analysisValue}>
                    {aiAnalysis.estimatedYear > 0 ? aiAnalysis.estimatedYear : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisLabel}>⭐ Valor Histórico:</Text>
                  <Text style={styles.analysisValue}>{aiAnalysis.historicalValue}</Text>
                </View>
              </View>

              {/* Descrição */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{aiAnalysis.description}</Text>
              </View>

              {/* Recomendações */}
              {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>💡 Recomendações:</Text>
                  {aiAnalysis.recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.recommendationBullet}>•</Text>
                      <Text style={styles.recommendationText}>{recommendation}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Informações do Casarão */}
          <View style={styles.buildingInfoContainer}>
            <Text style={styles.sectionTitle}>🏛️ Informações do Casarão</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>{building.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>{building.type}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ano:</Text>
              <Text style={styles.infoValue}>{building.year}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estilo:</Text>
              <Text style={styles.infoValue}>{building.style}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor Histórico:</Text>
              <Text style={styles.infoValue}>{building.historicalValue}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Uso Atual:</Text>
              <Text style={styles.infoValue}>{building.currentUse}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Arquiteto:</Text>
              <Text style={styles.infoValue}>{building.architect}</Text>
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>📝 Descrição</Text>
            <Text style={styles.descriptionText}>{building.description}</Text>
          </View>

          {/* Materiais de Construção */}
          {building.constructionMaterials && building.constructionMaterials.length > 0 && (
            <View style={styles.materialsSection}>
              <Text style={styles.sectionTitle}>🧱 Materiais de Construção</Text>
              <View style={styles.materialsList}>
                {building.constructionMaterials.map((material, index) => (
                  <View key={index} style={styles.materialItem}>
                    <Text style={styles.materialBullet}>•</Text>
                    <Text style={styles.materialText}>{material}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Eventos Históricos */}
          {building.historicalEvents && building.historicalEvents.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={styles.sectionTitle}>📚 Eventos Históricos</Text>
              <View style={styles.eventsList}>
                {building.historicalEvents.map((event, index) => (
                  <View key={index} style={styles.eventItem}>
                    <Text style={styles.eventBullet}>•</Text>
                    <Text style={styles.eventText}>{event}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Localização */}
          {location && (
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>📍 Localização</Text>
              
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>{location.address}</Text>
                <Text style={styles.locationSubtext}>
                  {location.city}, {location.state} - {location.country}
                </Text>
                {location.postalCode && (
                  <Text style={styles.locationSubtext}>CEP: {location.postalCode}</Text>
                )}
              </View>
              
              <View style={styles.coordinatesInfo}>
                <Text style={styles.coordinatesText}>
                  📍 Coordenadas: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: '92%',
    maxHeight: '85%',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    lineHeight: 32,
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  recognitionBadge: {
    backgroundColor: '#00FF00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  recognitionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  aiAnalysisContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 18,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
  },
  confidenceContainer: {
    marginBottom: 15,
  },
  confidenceLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
    textAlign: 'center',
  },
  analysisDetails: {
    marginBottom: 15,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  analysisLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  analysisValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'right',
  },
  descriptionContainer: {
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 17,
    color: '#34495e',
    lineHeight: 26,
    textAlign: 'justify',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  recommendationsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#E8E8E8',
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#2c3e50',
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  buildingInfoContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'right',
  },
  descriptionSection: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  materialsSection: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  materialBullet: {
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
  materialText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsSection: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  eventsList: {
    // No specific styling for list items, they will inherit from materialItem
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
  },
  eventBullet: {
    fontSize: 16,
    color: '#2c3e50',
    marginRight: 8,
  },
  eventText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
  },
  locationSection: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  locationInfo: {
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  locationSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  coordinatesInfo: {
    marginTop: 10,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  analysisStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  analysisStatusIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  analysisStatusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  analysisStatusSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
});
