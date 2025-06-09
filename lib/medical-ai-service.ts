// Medical AI Service for symptom analysis and health recommendations
export class MedicalAIService {
  private emergencyKeywords = [
    "chest pain",
    "heart attack",
    "stroke",
    "difficulty breathing",
    "severe bleeding",
    "unconscious",
    "seizure",
    "severe allergic reaction",
    "poisoning",
    "severe burns",
    "broken bone",
    "head injury",
    "suicide",
    "overdose",
  ]

  isEmergencySymptom(symptom: string): boolean {
    const lowerSymptom = symptom.toLowerCase()
    return this.emergencyKeywords.some((keyword) => lowerSymptom.includes(keyword))
  }

  async analyzeSymptoms(symptom: string): Promise<any> {
    // Simulate AI analysis with realistic medical responses
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

    const analysis = this.generateMedicalAnalysis(symptom)
    return analysis
  }

  private generateMedicalAnalysis(symptom: string): any {
    const lowerSymptom = symptom.toLowerCase()

    // Headache analysis
    if (lowerSymptom.includes("headache") || lowerSymptom.includes("head pain")) {
      return {
        severity: "medium",
        urgencyLevel: "routine",
        possibleCauses: [
          "Tension headache due to stress or muscle tension",
          "Migraine headache with possible triggers",
          "Dehydration or lack of sleep",
          "Eye strain from screen time",
          "Sinus congestion or infection",
        ],
        homeRemedies: [
          "Rest in a quiet, dark room",
          "Apply cold or warm compress to head/neck",
          "Stay hydrated with water",
          "Practice relaxation techniques",
          "Gentle neck and shoulder stretches",
          "Limit screen time and take regular breaks",
        ],
        medicalTreatments: [
          "Over-the-counter pain relievers (acetaminophen, ibuprofen)",
          "Prescription migraine medications if diagnosed",
          "Muscle relaxants for tension headaches",
          "Preventive medications for chronic migraines",
        ],
        estimatedRecovery:
          "Most headaches resolve within 4-24 hours with proper treatment. Chronic headaches may require ongoing management.",
        recommendSeekingCare: false,
        followUpAdvice: [
          "Keep a headache diary to identify triggers",
          "Maintain regular sleep schedule",
          "Stay hydrated throughout the day",
          "Manage stress through relaxation techniques",
        ],
        warningSignsToWatch: [
          "Sudden severe headache unlike any before",
          "Headache with fever, stiff neck, or rash",
          "Headache with vision changes or confusion",
          "Headache after head injury",
        ],
      }
    }

    // Fever analysis
    if (lowerSymptom.includes("fever") || lowerSymptom.includes("temperature")) {
      return {
        severity: "medium",
        urgencyLevel: "routine",
        possibleCauses: [
          "Viral infection (common cold, flu)",
          "Bacterial infection",
          "COVID-19 or other respiratory illness",
          "Urinary tract infection",
          "Food poisoning",
        ],
        homeRemedies: [
          "Rest and get plenty of sleep",
          "Drink fluids to prevent dehydration",
          "Use fever-reducing medications as directed",
          "Cool compress on forehead",
          "Wear light, breathable clothing",
          "Take lukewarm baths",
        ],
        medicalTreatments: [
          "Acetaminophen or ibuprofen for fever reduction",
          "Antibiotics if bacterial infection is confirmed",
          "Antiviral medications if appropriate",
          "IV fluids if severely dehydrated",
        ],
        estimatedRecovery: "Fever typically resolves within 3-7 days depending on the underlying cause.",
        recommendSeekingCare: true,
        followUpAdvice: [
          "Monitor temperature regularly",
          "Isolate if infectious disease is suspected",
          "Return to normal activities gradually",
          "Complete any prescribed antibiotic course",
        ],
        warningSignsToWatch: [
          "Fever above 103°F (39.4°C)",
          "Fever lasting more than 3 days",
          "Difficulty breathing or chest pain",
          "Severe dehydration signs",
          "Persistent vomiting",
        ],
      }
    }

    // Cough analysis
    if (lowerSymptom.includes("cough") || lowerSymptom.includes("coughing")) {
      return {
        severity: "low",
        urgencyLevel: "routine",
        possibleCauses: [
          "Viral upper respiratory infection",
          "Allergies or environmental irritants",
          "Post-nasal drip",
          "Acid reflux (GERD)",
          "Asthma or bronchitis",
        ],
        homeRemedies: [
          "Stay hydrated with warm liquids",
          "Use honey to soothe throat (not for children under 1 year)",
          "Humidify the air with a humidifier",
          "Avoid smoke and other irritants",
          "Elevate head while sleeping",
          "Gargle with warm salt water",
        ],
        medicalTreatments: [
          "Cough suppressants for dry cough",
          "Expectorants to loosen mucus",
          "Bronchodilators for asthma-related cough",
          "Antibiotics if bacterial infection is present",
          "Allergy medications if allergic cause",
        ],
        estimatedRecovery: "Most coughs resolve within 1-3 weeks. Chronic coughs may require further evaluation.",
        recommendSeekingCare: false,
        followUpAdvice: [
          "Avoid known allergens or irritants",
          "Practice good hand hygiene",
          "Consider allergy testing if recurrent",
          "Quit smoking if applicable",
        ],
        warningSignsToWatch: [
          "Cough with blood or pink foam",
          "Severe difficulty breathing",
          "High fever with cough",
          "Cough lasting more than 3 weeks",
          "Chest pain with coughing",
        ],
      }
    }

    // Stomach pain analysis
    if (lowerSymptom.includes("stomach") || lowerSymptom.includes("abdominal") || lowerSymptom.includes("belly")) {
      return {
        severity: "medium",
        urgencyLevel: "routine",
        possibleCauses: [
          "Indigestion or overeating",
          "Gastroenteritis (stomach flu)",
          "Food poisoning",
          "Stress or anxiety",
          "Irritable bowel syndrome (IBS)",
          "Gastritis or peptic ulcer",
        ],
        homeRemedies: [
          "Rest and avoid solid foods temporarily",
          "Stay hydrated with clear fluids",
          "Apply heat pad to abdomen",
          "Try the BRAT diet (bananas, rice, applesauce, toast)",
          "Avoid dairy, caffeine, and spicy foods",
          "Practice stress reduction techniques",
        ],
        medicalTreatments: [
          "Antacids for acid-related pain",
          "Anti-diarrheal medications if needed",
          "Proton pump inhibitors for ulcers",
          "Antibiotics if bacterial infection confirmed",
          "Prescription medications for chronic conditions",
        ],
        estimatedRecovery:
          "Acute stomach pain typically resolves within 24-48 hours. Chronic conditions may require ongoing management.",
        recommendSeekingCare: true,
        followUpAdvice: [
          "Gradually reintroduce normal foods",
          "Identify and avoid trigger foods",
          "Eat smaller, more frequent meals",
          "Manage stress levels",
        ],
        warningSignsToWatch: [
          "Severe, sudden abdominal pain",
          "Pain with fever and vomiting",
          "Blood in vomit or stool",
          "Signs of dehydration",
          "Pain that worsens over time",
        ],
      }
    }

    // Generic analysis for unspecified symptoms
    return {
      severity: "low",
      urgencyLevel: "routine",
      possibleCauses: [
        "Viral infection or common illness",
        "Stress or lifestyle factors",
        "Minor injury or strain",
        "Allergic reaction",
        "Nutritional deficiency",
      ],
      homeRemedies: [
        "Get adequate rest and sleep",
        "Stay well hydrated",
        "Eat a balanced, nutritious diet",
        "Practice stress management",
        "Apply ice or heat as appropriate",
        "Gentle exercise or stretching",
      ],
      medicalTreatments: [
        "Over-the-counter pain relievers if needed",
        "Topical treatments for skin conditions",
        "Antihistamines for allergic reactions",
        "Specific medications based on diagnosis",
      ],
      estimatedRecovery: "Most minor symptoms resolve within a few days to a week with proper self-care.",
      recommendSeekingCare: false,
      followUpAdvice: [
        "Monitor symptoms for changes",
        "Maintain healthy lifestyle habits",
        "Follow up if symptoms persist",
        "Keep a symptom diary if recurring",
      ],
      warningSignsToWatch: [
        "Symptoms that worsen rapidly",
        "Development of fever or severe pain",
        "Difficulty breathing or swallowing",
        "Signs of infection or allergic reaction",
      ],
    }
  }
}

export const medicalAIService = new MedicalAIService()
