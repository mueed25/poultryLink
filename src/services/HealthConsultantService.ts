import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getCurrentUser } from './authService';

interface HealthConsultation {
  id: string;
  userId: string | null;
  question: string;
  response: {
    suspectedIssue: string;
    actionPlan: string;
    naturalRemedy: string;
    tip: string;
  };
  createdAt: Date;
  isHelpful?: boolean;
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const analyzeHealthIssue = async (userInput: string): Promise<HealthConsultation['response']> => {
  try {
    const prompt = `You are a Poultry Health Consultant in Nigeria. Based on the farmer's description, provide:
    1. Suspected Issue: The most likely disease or health problem
    2. Action Plan: Immediate steps to take
    3. Natural Remedy: Low-cost, locally available solutions
    4. Tip: General advice to improve poultry health
    
    Farmer's input: ${userInput}
    
    Format your response in clear sections with emojis.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse the response into sections
    const sections = text.split('\n\n').reduce((acc: any, section: string) => {
      if (section.includes('Suspected Issue')) {
        acc.suspectedIssue = section.split(':')[1].trim();
      } else if (section.includes('Action Plan')) {
        acc.actionPlan = section.split(':')[1].trim();
      } else if (section.includes('Natural Remedy')) {
        acc.naturalRemedy = section.split(':')[1].trim();
      } else if (section.includes('Tip')) {
        acc.tip = section.split(':')[1].trim();
      }
      return acc;
    }, {});

    return sections;
  } catch (error) {
    console.error('Error analyzing health issue:', error);
    throw new Error('Failed to analyze health issue. Please try again.');
  }
};

export const saveConsultation = async (consultation: Omit<HealthConsultation, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'healthConsultations'), {
      ...consultation,
      createdAt: new Date()
    });
    return { id: docRef.id, ...consultation };
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

export const updateConsultationFeedback = async (consultationId: string, isHelpful: boolean) => {
  try {
    const docRef = doc(db, 'healthConsultations', consultationId);
    await updateDoc(docRef, { isHelpful });
  } catch (error) {
    console.error('Error updating consultation feedback:', error);
    throw error;
  }
};

export const getAnonymousUsageCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, 'healthConsultations'),
      where('userId', '==', null)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting anonymous usage count:', error);
    return 0;
  }
}; 