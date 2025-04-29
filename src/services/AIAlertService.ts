/**
 * This is a mock implementation of an AI service for poultry disease diagnostics
 * and weather alerts. In a real application, this would connect to a backend API.
 */

interface BirdSymptom {
  id: string;
  name: string;
  description: string;
}

interface DiseaseAlert {
  id: string;
  name: string;
  confidence: number; // 0-100 percentage
  description: string;
  possibleCauses: string[];
  recommendations: string[];
  needsVet: boolean;
  urgency: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface SymptomAnalysisRequest {
  symptoms: string[];
  birdType: 'layer' | 'broiler' | 'native';
  birdAge: number;
  affectedCount: number;
  totalBirds: number;
  images?: string[]; // base64 encoded images
  farmLocation?: {
    latitude: number;
    longitude: number;
  };
  additionalInfo?: string;
}

interface DiseaseResult {
  name: string;
  confidence: number;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  possibleCauses: string[];
  recommendations: string[];
  needsVet: boolean;
}

// Mock data for development
const MOCK_SYMPTOMS: BirdSymptom[] = [
  {
    id: 's1',
    name: 'Reduced Egg Production',
    description: 'Birds are laying fewer eggs than normal.'
  },
  {
    id: 's2',
    name: 'Coughing',
    description: 'Birds are making coughing or sneezing sounds.'
  },
  {
    id: 's3',
    name: 'Diarrhea',
    description: 'Birds have watery or abnormal droppings.'
  },
  {
    id: 's4',
    name: 'Lethargy',
    description: 'Birds appear tired, less active than normal.'
  },
  {
    id: 's5',
    name: 'Loss of Appetite',
    description: 'Birds are eating less than normal.'
  },
  {
    id: 's6',
    name: 'Ruffled Feathers',
    description: 'Feathers appear unusually puffed out or disheveled.'
  },
  {
    id: 's7',
    name: 'Respiratory Distress',
    description: 'Birds showing difficulty breathing or labored breathing.'
  },
  {
    id: 's8',
    name: 'Swollen Head',
    description: 'Birds have noticeable swelling around head or face.'
  }
];

// Mock diseases and their recommendations
const MOCK_DISEASES: Record<string, Omit<DiseaseAlert, 'id' | 'confidence' | 'createdAt'>> = {
  'newcastle': {
    name: 'Newcastle Disease',
    description: 'A highly contagious viral infection affecting many bird species.',
    possibleCauses: [
      'Contact with infected birds',
      'Contaminated equipment',
      'Airborne transmission'
    ],
    recommendations: [
      'Isolate affected birds immediately',
      'Contact a veterinarian for proper diagnosis',
      'Implement strict biosecurity measures',
      'Vaccinate healthy birds if recommended'
    ],
    needsVet: true,
    urgency: 'high'
  },
  'infectious_bronchitis': {
    name: 'Infectious Bronchitis',
    description: 'A viral respiratory disease that affects chicken\'s breathing and egg production.',
    possibleCauses: [
      'Highly contagious coronavirus',
      'Airborne transmission',
      'Contaminated equipment'
    ],
    recommendations: [
      'Improve ventilation in poultry houses',
      'Implement proper cleaning and disinfection',
      'Consult a vet for treatment options',
      'Consider vaccination for future prevention'
    ],
    needsVet: true,
    urgency: 'medium'
  },
  'coccidiosis': {
    name: 'Coccidiosis',
    description: 'A parasitic disease affecting the intestinal tract of birds.',
    possibleCauses: [
      'Protozoan parasites in the genus Eimeria',
      'Poor litter management',
      'Overcrowding'
    ],
    recommendations: [
      'Administer anticoccidial medication',
      'Improve litter management',
      'Reduce stocking density',
      'Improve sanitation practices'
    ],
    needsVet: false,
    urgency: 'medium'
  },
  'heat_stress': {
    name: 'Heat Stress',
    description: 'A condition caused by high environmental temperatures affecting bird health.',
    possibleCauses: [
      'High ambient temperature',
      'Poor ventilation',
      'Overcrowding',
      'Inadequate access to fresh water'
    ],
    recommendations: [
      'Provide more shade',
      'Improve ventilation',
      'Ensure constant access to cool, fresh water',
      'Consider adding electrolytes to water during extreme heat'
    ],
    needsVet: false,
    urgency: 'low'
  }
};

class AIAlertService {
  private static instance: AIAlertService;

  private constructor() {
    // Initialize service
    console.log('AIAlertService initialized');
  }

  public static getInstance(): AIAlertService {
    if (!AIAlertService.instance) {
      AIAlertService.instance = new AIAlertService();
    }
    return AIAlertService.instance;
  }

  /**
   * Gets weather alerts for a specific location
   */
  public async getWeatherAlerts(location: Location): Promise<WeatherAlert[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock data - in a real app, this would fetch from a weather API
    const alerts: WeatherAlert[] = [
      {
        id: 'wa1',
        title: 'Heat Wave Warning',
        description: 'Temperatures expected to exceed 35°C over the next 3 days. Poultry birds are at risk of heat stress.',
        timestamp: new Date(),
        severity: 'high',
        recommendations: [
          'Provide adequate shade and ventilation',
          'Ensure constant access to fresh water',
          'Consider adding electrolytes to drinking water',
          'Feed birds during cooler parts of the day',
        ],
      },
    ];
    
    return alerts;
  }

  /**
   * Gets a list of common poultry symptoms
   */
  public getSymptomsList(): { id: string; name: string; description: string }[] {
    return [
      { id: 's1', name: 'Respiratory Distress', description: 'Difficulty breathing, gasping' },
      { id: 's2', name: 'Diarrhea', description: 'Loose, watery droppings' },
      { id: 's3', name: 'Reduced Appetite', description: 'Birds eating less than normal' },
      { id: 's4', name: 'Reduced Egg Production', description: 'Fewer eggs than expected' },
      { id: 's5', name: 'Lethargy', description: 'Birds appear weak or inactive' },
      { id: 's6', name: 'Swollen Eyes', description: 'Inflammation around eyes' },
      { id: 's7', name: 'Coughing/Sneezing', description: 'Respiratory sounds' },
      { id: 's8', name: 'Unusual Droppings', description: 'Color or consistency changes' },
      { id: 's9', name: 'Nasal Discharge', description: 'Fluid from nostrils' },
      { id: 's10', name: 'Swollen Joints', description: 'Inflammation of leg or wing joints' },
    ];
  }

  /**
   * Analyzes symptoms to suggest possible diseases
   */
  public async analyzeSymptoms(request: SymptomAnalysisRequest): Promise<DiseaseResult[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // This is a very simplified mock logic for demonstration purposes
    // In a real app, this would be a call to an AI service or backend API
    
    const hasRespiratoryIssues = request.symptoms.some(s => 
      ['Respiratory Distress', 'Coughing/Sneezing', 'Nasal Discharge'].includes(s)
    );
    
    const hasDigestiveIssues = request.symptoms.some(s => 
      ['Diarrhea', 'Reduced Appetite', 'Unusual Droppings'].includes(s)
    );
    
    const results: DiseaseResult[] = [];
    
    // Mock response based on symptoms
    if (hasRespiratoryIssues) {
      results.push({
        name: 'Newcastle Disease',
        confidence: 68,
        description: 'Newcastle disease is a highly contagious viral infection affecting many species of birds.',
        urgency: 'high',
        possibleCauses: [
          'Viral infection through direct contact with infected birds',
          'Contaminated feed, water, or equipment',
          'Airborne transmission'
        ],
        recommendations: [
          'Isolate affected birds immediately',
          'Contact a veterinarian for proper diagnosis',
          'Ensure biosecurity measures are in place',
          'Consider vaccination for unaffected birds'
        ],
        needsVet: true,
      });
    }
    
    if (hasDigestiveIssues) {
      results.push({
        name: 'Coccidiosis',
        confidence: 75,
        description: 'Coccidiosis is a parasitic disease affecting the intestinal tract of birds.',
        urgency: 'medium',
        possibleCauses: [
          'Protozoan parasites in the genus Eimeria',
          'Poor litter management',
          'Overcrowding',
          'Immunosuppression'
        ],
        recommendations: [
          'Add anticoccidial medication to feed or water',
          'Improve litter management and sanitation',
          'Reduce stocking density if possible',
          'Ensure proper ventilation'
        ],
        needsVet: false,
      });
    }
    
    // If no specific matches, provide a general response
    if (results.length === 0) {
      results.push({
        name: 'Unspecified Condition',
        confidence: 40,
        description: 'The symptoms don\'t clearly match a specific disease pattern.',
        urgency: 'medium',
        possibleCauses: [
          'Nutritional deficiency',
          'Environmental stress',
          'Early stage of multiple possible conditions',
          'Management issues'
        ],
        recommendations: [
          'Monitor birds closely for changes in symptoms',
          'Check feed and water quality',
          'Ensure proper ventilation and temperature',
          'Consult with a veterinarian if symptoms worsen'
        ],
        needsVet: false,
      });
    }
    
    return results;
  }
}

export default AIAlertService; 