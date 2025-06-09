// Medical API Service for symptom analysis and health recommendations

interface MedicalAnalysisResult {
  possibleCauses: string[]
  homeRemedies: string[]
  medicalTreatments: string[]
  estimatedRecovery: string
  severity: "low" | "medium" | "high"
  recommendSeekingCare: boolean
}

interface SymptomData {
  symptom: string
  keywords: string[]
  analysis: MedicalAnalysisResult
}

export class MedicalAPIService {
  private apiKey: string
  private baseUrl: string
  private symptomDatabase: SymptomData[]

  constructor() {
    // In production, these would come from environment variables
    this.apiKey = process.env.MEDICAL_API_KEY || ""
    this.baseUrl = "https://api.infermedica.com/v3"

    // Comprehensive symptom database for offline analysis
    this.symptomDatabase = [
      {
        symptom: "headache",
        keywords: ["headache", "head pain", "migraine", "head ache", "cranial pain"],
        analysis: {
          possibleCauses: [
            "Tension headache from stress or poor posture",
            "Dehydration and electrolyte imbalance",
            "Eye strain from prolonged screen time",
            "Sinus congestion or infection",
            "Lack of sleep or irregular sleep patterns",
            "Caffeine withdrawal",
            "Hormonal changes",
            "High blood pressure",
          ],
          homeRemedies: [
            "Apply cold or warm compress to head and neck area",
            "Stay well hydrated - drink 8-10 glasses of water daily",
            "Practice relaxation techniques like deep breathing",
            "Get adequate sleep (7-9 hours nightly)",
            "Limit screen time and take regular breaks",
            "Gentle neck and shoulder stretches",
            "Try peppermint or lavender essential oils",
            "Maintain regular meal times to avoid blood sugar drops",
          ],
          medicalTreatments: [
            "Over-the-counter pain relievers (acetaminophen, ibuprofen)",
            "Prescription triptans for migraines",
            "Muscle relaxants for tension headaches",
            "Preventive medications for chronic headaches",
            "Physical therapy for posture-related headaches",
            "Stress management counseling",
            "Botox injections for chronic migraines",
            "Blood pressure management if hypertension is present",
          ],
          estimatedRecovery:
            "Most tension headaches resolve within 2-4 hours with proper treatment. Migraines may last 4-72 hours. Chronic headaches require ongoing management.",
          severity: "medium",
          recommendSeekingCare: false,
        },
      },
      {
        symptom: "fever",
        keywords: ["fever", "high temperature", "hot", "chills", "feverish", "pyrexia"],
        analysis: {
          possibleCauses: [
            "Viral infection (common cold, flu, COVID-19)",
            "Bacterial infection (strep throat, UTI, pneumonia)",
            "Inflammatory conditions or autoimmune disorders",
            "Heat exhaustion or heat stroke",
            "Medication side effects or drug reactions",
            "Vaccination response",
            "Cancer or blood disorders (rare)",
            "Dehydration",
          ],
          homeRemedies: [
            "Rest and avoid strenuous activities",
            "Stay hydrated with water, clear broths, and electrolyte solutions",
            "Use fever-reducing medications as directed (acetaminophen, ibuprofen)",
            "Apply cool, damp cloths to forehead and wrists",
            "Wear light, breathable clothing",
            "Take lukewarm baths or showers",
            "Use a fan or cool environment",
            "Eat light, easily digestible foods",
          ],
          medicalTreatments: [
            "Antipyretic medications (acetaminophen, ibuprofen, aspirin)",
            "Antibiotics if bacterial infection is confirmed",
            "Antiviral medications for specific viral infections",
            "IV fluids for severe dehydration",
            "Hospitalization for high fever (>103°F/39.4°C)",
            "Treatment of underlying conditions",
            "Cooling blankets in severe cases",
            "Blood tests to identify infection source",
          ],
          estimatedRecovery:
            "Fever typically resolves in 3-5 days depending on underlying cause. Viral fevers usually last 3-4 days, bacterial infections may require 5-7 days with treatment.",
          severity: "medium",
          recommendSeekingCare: true,
        },
      },
      {
        symptom: "stomach pain",
        keywords: ["stomach pain", "abdominal pain", "belly ache", "stomach ache", "gastric pain", "tummy pain"],
        analysis: {
          possibleCauses: [
            "Indigestion or overeating",
            "Food poisoning or foodborne illness",
            "Gastritis or stomach inflammation",
            "Stress-related stomach upset",
            "Viral gastroenteritis (stomach flu)",
            "Acid reflux or GERD",
            "Lactose intolerance or food allergies",
            "Peptic ulcers",
            "Appendicitis (if severe, right-sided)",
            "Gallbladder issues",
          ],
          homeRemedies: [
            "Follow BRAT diet (bananas, rice, applesauce, toast)",
            "Stay hydrated with clear fluids and electrolyte solutions",
            "Apply gentle heat pad to stomach area",
            "Avoid dairy, fatty, and spicy foods temporarily",
            "Try ginger tea or ginger supplements for nausea",
            "Eat small, frequent meals instead of large ones",
            "Practice stress reduction techniques",
            "Avoid NSAIDs which can irritate stomach lining",
          ],
          medicalTreatments: [
            "Antacids for acid-related pain",
            "H2 blockers or proton pump inhibitors for acid reduction",
            "Anti-diarrheal medications if needed",
            "Probiotics to restore healthy gut bacteria",
            "Prescription medications for H. pylori if ulcers present",
            "Antibiotics for bacterial infections",
            "Anti-nausea medications",
            "Surgery for severe conditions like appendicitis",
          ],
          estimatedRecovery:
            "Mild stomach pain from indigestion usually resolves within 24-48 hours. Gastroenteritis typically lasts 1-3 days. Chronic conditions require ongoing management.",
          severity: "low",
          recommendSeekingCare: false,
        },
      },
      {
        symptom: "cough",
        keywords: ["cough", "coughing", "persistent cough", "dry cough", "wet cough", "hacking cough"],
        analysis: {
          possibleCauses: [
            "Viral upper respiratory infection (common cold)",
            "Bacterial respiratory infection",
            "Allergies or environmental irritants",
            "Asthma or bronchospasm",
            "Acid reflux (GERD)",
            "Post-nasal drip from sinusitis",
            "Smoking or secondhand smoke exposure",
            "Medication side effects (ACE inhibitors)",
            "Pneumonia or bronchitis",
            "COVID-19 or other viral infections",
          ],
          homeRemedies: [
            "Stay well hydrated to thin mucus secretions",
            "Use honey (1-2 teaspoons) to soothe throat irritation",
            "Try warm salt water gargles",
            "Use a humidifier or breathe steam from hot shower",
            "Elevate head while sleeping",
            "Avoid irritants like smoke and strong odors",
            "Try herbal teas with ginger, chamomile, or licorice root",
            "Suck on throat lozenges or hard candies",
          ],
          medicalTreatments: [
            "Cough suppressants (dextromethorphan) for dry cough",
            "Expectorants (guaifenesin) to help clear mucus",
            "Bronchodilators for asthma-related cough",
            "Antibiotics if bacterial infection is confirmed",
            "Inhaled corticosteroids for inflammatory conditions",
            "Antihistamines for allergy-related cough",
            "Proton pump inhibitors if GERD is the cause",
            "Prescription cough medications for severe cases",
          ],
          estimatedRecovery:
            "Viral coughs typically resolve in 7-10 days. Bacterial infections improve within 3-5 days of antibiotic treatment. Chronic coughs may require ongoing management.",
          severity: "low",
          recommendSeekingCare: false,
        },
      },
      {
        symptom: "chest pain",
        keywords: ["chest pain", "chest discomfort", "heart pain", "chest tightness", "chest pressure"],
        analysis: {
          possibleCauses: [
            "Muscle strain or costochondritis",
            "Acid reflux or GERD",
            "Anxiety or panic attacks",
            "Respiratory infections",
            "Heart attack (myocardial infarction) - EMERGENCY",
            "Angina (reduced blood flow to heart)",
            "Pulmonary embolism - EMERGENCY",
            "Pneumonia or pleurisy",
            "Aortic dissection - EMERGENCY",
          ],
          homeRemedies: [
            "Rest and avoid strenuous activities",
            "Apply heat or cold to chest muscles if strain suspected",
            "Practice deep breathing and relaxation techniques",
            "Avoid triggers like spicy foods if GERD suspected",
            "Take antacids if heartburn is present",
            "Maintain good posture",
            "Gentle stretching exercises",
          ],
          medicalTreatments: [
            "IMMEDIATE EMERGENCY CARE if severe, crushing, or radiating pain",
            "EKG and cardiac enzymes to rule out heart attack",
            "Chest X-ray to evaluate lungs",
            "Anti-inflammatory medications for muscle strain",
            "Proton pump inhibitors for GERD",
            "Anxiety medications if panic-related",
            "Cardiac catheterization if heart disease suspected",
            "Blood thinners if clot suspected",
          ],
          estimatedRecovery:
            "Muscle-related chest pain resolves in 1-2 weeks. GERD-related pain improves with treatment in days. SEEK IMMEDIATE CARE for cardiac symptoms.",
          severity: "high",
          recommendSeekingCare: true,
        },
      },
      {
        symptom: "sore throat",
        keywords: ["sore throat", "throat pain", "scratchy throat", "throat irritation", "pharyngitis"],
        analysis: {
          possibleCauses: [
            "Viral infection (common cold, flu)",
            "Bacterial infection (strep throat)",
            "Allergies or environmental irritants",
            "Dry air or mouth breathing",
            "Acid reflux (GERD)",
            "Smoking or secondhand smoke",
            "Vocal strain from shouting or singing",
            "Post-nasal drip",
          ],
          homeRemedies: [
            "Gargle with warm salt water (1/2 tsp salt in 8oz water)",
            "Stay well hydrated with warm liquids",
            "Use throat lozenges or hard candies",
            "Try honey and warm tea",
            "Use a humidifier to add moisture to air",
            "Rest your voice and avoid shouting",
            "Avoid irritants like smoke and alcohol",
            "Eat soft, soothing foods like ice cream or popsicles",
          ],
          medicalTreatments: [
            "Throat culture or rapid strep test",
            "Antibiotics if strep throat is confirmed",
            "Pain relievers (acetaminophen, ibuprofen)",
            "Topical anesthetics (throat sprays)",
            "Corticosteroids for severe inflammation",
            "Antacids if GERD is suspected",
            "Antihistamines for allergy-related symptoms",
          ],
          estimatedRecovery:
            "Viral sore throats typically resolve in 5-7 days. Strep throat improves within 24-48 hours of antibiotic treatment.",
          severity: "low",
          recommendSeekingCare: false,
        },
      },
      {
        symptom: "back pain",
        keywords: ["back pain", "backache", "lower back pain", "upper back pain", "spine pain"],
        analysis: {
          possibleCauses: [
            "Muscle strain or sprain",
            "Poor posture or ergonomics",
            "Herniated or bulging disc",
            "Arthritis or degenerative disc disease",
            "Sciatica",
            "Spinal stenosis",
            "Osteoporosis and compression fractures",
            "Kidney infection or stones",
            "Fibromyalgia",
          ],
          homeRemedies: [
            "Rest for 1-2 days, then gentle movement",
            "Apply ice for first 48-72 hours, then heat",
            "Over-the-counter pain relievers (ibuprofen, acetaminophen)",
            "Gentle stretching exercises",
            "Maintain good posture",
            "Use ergonomic chairs and proper lifting techniques",
            "Try yoga or tai chi for flexibility",
            "Sleep on a medium-firm mattress",
          ],
          medicalTreatments: [
            "Physical therapy and targeted exercises",
            "Prescription muscle relaxants",
            "Stronger pain medications if needed",
            "Steroid injections for inflammation",
            "Chiropractic adjustments",
            "Massage therapy",
            "Surgery for severe cases (disc herniation, stenosis)",
            "Nerve blocks or radiofrequency ablation",
          ],
          estimatedRecovery:
            "Acute muscle strain typically improves in 1-2 weeks. Disc issues may take 4-6 weeks. Chronic conditions require ongoing management.",
          severity: "medium",
          recommendSeekingCare: false,
        },
      },
      {
        symptom: "fatigue",
        keywords: ["fatigue", "tired", "exhaustion", "lethargy", "no energy", "weakness"],
        analysis: {
          possibleCauses: [
            "Lack of sleep or poor sleep quality",
            "Stress, anxiety, or depression",
            "Anemia or iron deficiency",
            "Thyroid disorders (hypothyroidism)",
            "Vitamin deficiencies (B12, D)",
            "Chronic fatigue syndrome",
            "Viral infections (mono, COVID-19)",
            "Medication side effects",
            "Heart or lung conditions",
            "Diabetes or blood sugar issues",
          ],
          homeRemedies: [
            "Improve sleep hygiene and maintain regular sleep schedule",
            "Stay hydrated and eat balanced meals",
            "Moderate exercise (even short walks can help)",
            "Stress management techniques (meditation, deep breathing)",
            "Limit caffeine and alcohol",
            "Take short power naps (20-30 minutes)",
            "Consider iron-rich foods if anemia suspected",
            "Vitamin B12 and D supplements if deficient",
          ],
          medicalTreatments: [
            "Blood tests to check for anemia, thyroid issues, vitamin levels",
            "Sleep study if sleep apnea suspected",
            "Therapy for depression or anxiety",
            "Hormone replacement for thyroid issues",
            "Treatment of underlying conditions",
            "Medication adjustments if side effects suspected",
            "Cognitive behavioral therapy for chronic fatigue",
            "Referral to specialists based on findings",
          ],
          estimatedRecovery:
            "Recovery depends on underlying cause. Sleep-related fatigue may improve in days with better habits. Medical conditions require specific treatment timeframes.",
          severity: "medium",
          recommendSeekingCare: true,
        },
      },
    ]
  }

  async analyzeSymptoms(symptomDescription: string): Promise<MedicalAnalysisResult> {
    try {
      console.log("Analyzing symptoms:", symptomDescription)

      // Check for emergency symptoms first
      if (this.isEmergencySymptom(symptomDescription)) {
        return {
          possibleCauses: ["EMERGENCY MEDICAL CONDITION SUSPECTED"],
          homeRemedies: ["Seek immediate medical attention"],
          medicalTreatments: ["Emergency medical evaluation required"],
          estimatedRecovery: "Requires immediate medical assessment",
          severity: "high",
          recommendSeekingCare: true,
        }
      }

      // First try to match with our comprehensive database
      const matchedSymptom = this.findMatchingSymptom(symptomDescription)

      if (matchedSymptom) {
        console.log("Found matching symptom in database:", matchedSymptom.symptom)
        return matchedSymptom.analysis
      }

      // If API key is available, try external API
      if (this.apiKey) {
        try {
          const apiResult = await this.callExternalMedicalAPI(symptomDescription)
          if (apiResult) {
            return apiResult
          }
        } catch (apiError) {
          console.log("External API failed:", apiError)
        }
      }

      // Fallback to AI-powered analysis
      return this.generateAIAnalysis(symptomDescription)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      return this.getGenericAnalysis()
    }
  }

  private findMatchingSymptom(description: string): SymptomData | null {
    const lowerDescription = description.toLowerCase()

    for (const symptomData of this.symptomDatabase) {
      if (symptomData.keywords.some((keyword) => lowerDescription.includes(keyword))) {
        return symptomData
      }
    }

    return null
  }

  private async callExternalMedicalAPI(symptoms: string): Promise<MedicalAnalysisResult | null> {
    // This would integrate with a real medical API
    // For now, we'll simulate an API call
    console.log("Calling external medical API...")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, we would make an actual API call here
    // For now, return null to indicate API is not available
    return null
  }

  private generateAIAnalysis(symptoms: string): MedicalAnalysisResult {
    console.log("Generating AI-powered medical analysis")

    // This is a simplified AI analysis based on common patterns
    const commonSymptoms = symptoms.toLowerCase()

    let severity: "low" | "medium" | "high" = "low"
    let recommendSeekingCare = false

    // Check for high-severity indicators
    const highSeverityKeywords = [
      "chest pain",
      "difficulty breathing",
      "severe pain",
      "blood",
      "unconscious",
      "heart attack",
      "stroke",
      "emergency",
      "can't breathe",
      "choking",
    ]

    const mediumSeverityKeywords = [
      "fever",
      "persistent",
      "worsening",
      "severe",
      "intense",
      "unbearable",
      "days",
      "week",
    ]

    if (highSeverityKeywords.some((keyword) => commonSymptoms.includes(keyword))) {
      severity = "high"
      recommendSeekingCare = true
    } else if (mediumSeverityKeywords.some((keyword) => commonSymptoms.includes(keyword))) {
      severity = "medium"
      recommendSeekingCare = true
    }

    return {
      possibleCauses: [
        "Various factors could contribute to your symptoms",
        "Viral or bacterial infection",
        "Stress or lifestyle factors",
        "Environmental triggers or allergies",
        "Underlying health conditions that may need evaluation",
      ],
      homeRemedies: [
        "Get adequate rest and sleep (7-9 hours)",
        "Stay well hydrated with water and clear fluids",
        "Eat nutritious, balanced meals",
        "Practice stress management and relaxation techniques",
        "Monitor symptoms and note any patterns or triggers",
        "Avoid known irritants or allergens",
        "Maintain good hygiene practices",
      ],
      medicalTreatments: [
        "Consult with a healthcare provider for proper diagnosis",
        "Keep a detailed symptom diary with timing and triggers",
        "Follow up if symptoms persist, worsen, or new symptoms develop",
        "Consider preventive measures based on identified triggers",
        "Discuss any medications or supplements you're taking",
        "Get appropriate screening tests if recommended",
      ],
      estimatedRecovery:
        severity === "high"
          ? "Seek immediate medical attention - recovery time depends on underlying condition"
          : severity === "medium"
            ? "Recovery typically takes 3-7 days with proper care, but consult a healthcare provider"
            : "Most mild symptoms resolve within 1-3 days with self-care, but monitor for changes",
      severity,
      recommendSeekingCare,
    }
  }

  private getGenericAnalysis(): MedicalAnalysisResult {
    return {
      possibleCauses: [
        "Unable to analyze symptoms at this time",
        "Multiple factors could be involved",
        "Professional medical evaluation recommended",
      ],
      homeRemedies: ["Rest and stay hydrated", "Monitor your symptoms", "Practice good self-care"],
      medicalTreatments: [
        "Consult with a healthcare provider",
        "Seek professional medical advice",
        "Consider urgent care if symptoms worsen",
      ],
      estimatedRecovery: "Recovery time varies - please consult a healthcare provider for personalized advice",
      severity: "medium",
      recommendSeekingCare: true,
    }
  }

  // Emergency symptom checker
  isEmergencySymptom(symptoms: string): boolean {
    const emergencyKeywords = [
      "chest pain",
      "difficulty breathing",
      "can't breathe",
      "choking",
      "severe bleeding",
      "unconscious",
      "heart attack",
      "stroke",
      "severe head injury",
      "poisoning",
      "overdose",
      "suicide",
      "severe allergic reaction",
      "anaphylaxis",
    ]

    const lowerSymptoms = symptoms.toLowerCase()
    return emergencyKeywords.some((keyword) => lowerSymptoms.includes(keyword))
  }
}

// Export singleton instance
export const medicalAPIService = new MedicalAPIService()
