// AgriX India Agriculture Data System - Dedicated Realistic Farm Database

export const stateCodes = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jammu & Kashmir": "JK",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OD",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",
  "Andaman & Nicobar Islands": "AN",
  "Chandigarh": "CH",
  "Dadra & Nagar Haveli and Daman & Diu": "DD",
  "Delhi": "DL",
  "Ladakh": "LA",
  "Lakshadweep": "LD",
  "Puducherry": "PY"
}

// Region-specific configurations for all states/UTs
export const regionalConfig = {
  "Punjab": {
    crops: ["Wheat", "Rice (Paddy)", "Maize", "Cotton", "Sugarcane"],
    soil: "Alluvial Soil",
    farmerNames: ["Harpreet Singh", "Gurpreet Kaur", "Baldev Singh", "Jaswant Singh", "Manpreet Kaur", "Satnam Singh", "Amrit Kaur", "Gurbaksh Singh"]
  },
  "Haryana": {
    crops: ["Wheat", "Rice (Paddy)", "Mustard", "Bajra"],
    soil: "Alluvial Soil",
    farmerNames: ["Sandeep Malik", "Sunita Dahiya", "Jagdeep Singh", "Preeti Sheoran", "Rajendra Hooda", "Vikram Chahal", "Aarti Sangwan", "Dharampal Phogat"]
  },
  "Uttar Pradesh": {
    crops: ["Sugarcane", "Wheat", "Rice (Paddy)", "Potato", "Pulses"],
    soil: "Alluvial Soil",
    farmerNames: ["Rajesh Kumar", "Sunil Yadav", "Anita Devi", "Ramesh Patel", "Savita Singh", "Manoj Tiwari", "Karan Maurya", "Preeti Verma"]
  },
  "Bihar": {
    crops: ["Rice", "Maize", "Wheat", "Lentils"],
    soil: "Alluvial Soil",
    farmerNames: ["Mukesh Kumar", "Savitri Devi", "Ram Naresh Prasad", "Chinta Devi", "Pappu Singh", "Dinesh Mahto", "Radha Kumari", "Arvind Paswan"]
  },
  "Maharashtra": {
    crops: ["Cotton", "Soybean", "Sugarcane", "Tur", "Jowar"],
    soil: "Black Soil",
    farmerNames: ["Ganesh Shinde", "Sunita Patil", "Vilas More", "Ananda Kadam", "Vaishali Gawde", "Sanjay Deshmukh", "Pooja Pawar", "Rahul Chavan"]
  },
  "Gujarat": {
    crops: ["Cotton", "Groundnut", "Bajra", "Castor"],
    soil: "Black Soil",
    farmerNames: ["Mahesh Patel", "Kiranben Patel", "Mansukhbhai Vasava", "Hetal Patel", "Rajesh Patel", "Arvindbhai Rathod", "Dakshaben Solanki", "Dinesh Shah"]
  },
  "Rajasthan": {
    crops: ["Bajra", "Mustard", "Gram", "Wheat", "Guar"],
    soil: "Sandy Soil",
    farmerNames: ["Om Prakash", "Kamla Devi", "Ram Chandra", "Shanti Lal", "Bhanwar Singh", "Sita Ram Gurjar", "Chanda Kanwar", "Manish Meena"]
  },
  "Madhya Pradesh": {
    crops: ["Soybean", "Wheat", "Gram", "Rice"],
    soil: "Black Soil",
    farmerNames: ["Shivraj Lodhi", "Kiran Bai", "Ramswaroop Sharma", "Radheshyam Patel", "Anita Chouhan", "Gopal Patidar", "Shyam Sundar", "Ranu Tomar"]
  },
  "Chhattisgarh": {
    crops: ["Rice", "Maize", "Pulses"],
    soil: "Red Clay Soil",
    farmerNames: ["Ramlal Sahu", "Sunita Netam", "Devendra Yadav", "Phulbaso Devi", "Vishnu Baghel", "Santosh Dhruw", "Kanti Markam", "Gautam Kanwar"]
  },
  "West Bengal": {
    crops: ["Rice", "Jute", "Potato"],
    soil: "Alluvial Soil",
    farmerNames: ["Joydeb Sen", "Mamata Das", "Subir Sarkar", "Rina Bhowmick", "Anupam Roy", "Tapati Banerjee", "Biplab Chatterjee", "Sujata Halder"]
  },
  "Odisha": {
    crops: ["Rice", "Groundnut", "Pulses"],
    soil: "Red Soil",
    farmerNames: ["Balaram Jena", "Sabitri Sahu", "Rabindra Naik", "Gitanjali Pradhan", "Manoj Panda", "Pratap Mohanty", "Minati Dehury", "Sarat Behera"]
  },
  "Assam": {
    crops: ["Tea", "Rice", "Jute"],
    soil: "Forest Soil",
    farmerNames: ["Monoj Gogoi", "Dipali Saikia", "Pradip Das", "Runu Bora", "Bipul Sarma", "Anjana Kalita", "Tarun Baruah", "Nirmali Talukdar"]
  },
  "Arunachal Pradesh": {
    crops: ["Rice", "Maize", "Millets"],
    soil: "Forest Soil",
    farmerNames: ["Tashi Wangchu", "Yompi Bagra", "Tokong Pertin", "Rinchin Kharu", "Nabam Tuki", "Likha Soni", "Ojing Dolo", "Dani Yubbe"]
  },
  "Sikkim": {
    crops: ["Large Cardamom", "Maize", "Rice"],
    soil: "Forest Soil",
    farmerNames: ["Tshering Lepcha", "Pemba Sherpa", "Dechen Bhutia", "Mingma Tamang", "Pema Lhamu", "Phurba Subba", "Karma Gyatso", "Yangchen Rai"]
  },
  "Himachal Pradesh": {
    crops: ["Apple", "Maize", "Wheat"],
    soil: "Mountain Soil",
    farmerNames: ["Ramesh Thakur", "Asha Devi", "Rajender Singh", "Meena Kumari", "Satish Sharma", "Vipin Chandel", "Suman Rana", "Kewal Ram"]
  },
  "Uttarakhand": {
    crops: ["Rice", "Wheat", "Millets", "Apple"],
    soil: "Alluvial Soil",
    farmerNames: ["Deepa Negi", "Harish Rawat", "Sunita Joshi", "Bipin Chandra", "Kamla Bisht", "Devendra Bhandari", "Sarojini Devi", "Suresh Uniyal"]
  },
  "Jammu & Kashmir": {
    crops: ["Apple", "Saffron", "Walnut", "Maize"],
    soil: "Mountain Soil",
    farmerNames: ["Ghulam Nabi", "Fatima Begum", "Abdul Rashid", "Bashir Ahmed", "Dilshad", "Mohammad Lone", "Zahida Parveen", "Muzaffar Shah"]
  },
  "Tamil Nadu": {
    crops: ["Rice", "Sugarcane", "Banana", "Cotton", "Groundnut"],
    soil: "Red Soil",
    farmerNames: ["R. Kumar", "Lakshmi Ammal", "Murugan", "K. Selvam", "Meenakshi", "S. Mani", "Rajeswari", "P. Ganesan"]
  },
  "Kerala": {
    crops: ["Rubber", "Coconut", "Banana", "Pepper", "Coffee"],
    soil: "Laterite Soil",
    farmerNames: ["Joseph Mathew", "Anil Nair", "Mariamma John", "Shaji Thomas", "Sreejith K.", "Kunjumon", "Bindu Mol", "Vinu Kurian"]
  },
  "Karnataka": {
    crops: ["Coffee", "Ragi", "Maize", "Sugarcane", "Arecanut"],
    soil: "Red Soil",
    farmerNames: ["Shivappa", "Manjunath Gowda", "Basavaraj", "Shanthamma", "Siddaramaiah", "Ramesh Hegde", "Girijamma", "Chennappa"]
  },
  "Telangana": {
    crops: ["Cotton", "Rice", "Maize", "Tur"],
    soil: "Red Soil",
    farmerNames: ["N. Reddi", "K. Rama Rao", "Anitha", "Yadagiri", "Mallesh", "Saritha Goud", "Bhikshapathi", "Lalitha"]
  },
  "Goa": {
    crops: ["Coconut", "Cashew", "Paddy"],
    soil: "Laterite Soil",
    farmerNames: ["Caetano Fernandes", "Maria D'Souza", "Rajesh Naik", "Shrikant Parab", "Fatima Rodrigues", "Anand Gawas", "Sonia Faria", "Vasco Mascarenhas"]
  },
  "Tripura": {
    crops: ["Rubber", "Rice", "Pineapple"],
    soil: "Red Soil",
    farmerNames: ["Subodh Debbarma", "Swapna Roy", "Joydeb Tripura", "Rupa Sarkar", "Biplab Das", "Animesh Reang", "Sulata Jamatia", "Pradip Sen"]
  },
  "Mizoram": {
    crops: ["Rice", "Maize", "Orange"],
    soil: "Forest Soil",
    farmerNames: ["Lalthanzuala", "Lalrinmawii", "R. Lalrema", "Zothanpuii", "Vanlalruata", "Laltlanthanga", "C. Lalduhawma", "Lalhmingliani"]
  },
  "Nagaland": {
    crops: ["Rice", "Maize", "Millets"],
    soil: "Forest Soil",
    farmerNames: ["Kezhaleo", "Neiphiu", "Amenla", "Toshi Ao", "Vikheli", "Kekhrie", "Sentila", "Nise Meru"]
  },
  "Manipur": {
    crops: ["Rice", "Maize", "Pulses"],
    soil: "Forest Soil",
    farmerNames: ["Ibotombi Singh", "Tombi Devi", "Sanahanbi Devi", "R.K. Meghen", "Chaoba Singh", "Surchandra", "Ibobi Luwang", "Ningol Kamala"]
  },
  "Meghalaya": {
    crops: ["Potato", "Maize", "Ginger"],
    soil: "Forest Soil",
    farmerNames: ["P. Sangma", "Mary Lyngdoh", "K. Marbaniang", "John Kharshiing", "Grace Syiem", "Balseng Marak", "Ibapynhun", "Tengsim Shira"]
  }
}

// Region-specific and Season-specific agricultural mapping database for India
export const regionalSeasonalCrops = {
  "Punjab": {
    "Kharif": ["Rice (Paddy)", "Maize", "Cotton", "Sugarcane"],
    "Rabi": ["Wheat", "Mustard", "Barley", "Gram"],
    "Zaid": ["Moong Dal", "Sunflower", "Vegetables"]
  },
  "Haryana": {
    "Kharif": ["Rice (Paddy)", "Maize", "Cotton", "Bajra"],
    "Rabi": ["Wheat", "Mustard", "Barley", "Gram"],
    "Zaid": ["Moong Dal", "Cucumber", "Vegetables"]
  },
  "Uttar Pradesh": {
    "Kharif": ["Sugarcane", "Rice (Paddy)", "Maize", "Pulses"],
    "Rabi": ["Wheat", "Potato", "Mustard", "Gram"],
    "Zaid": ["Watermelon", "Moong Dal", "Vegetables"]
  },
  "Bihar": {
    "Kharif": ["Rice (Paddy)", "Maize", "Jute", "Lentils"],
    "Rabi": ["Wheat", "Mustard", "Potato", "Gram"],
    "Zaid": ["Watermelon", "Moong Dal", "Vegetables"]
  },
  "Maharashtra": {
    "Kharif": ["Cotton", "Soybean", "Sugarcane", "Tur", "Jowar"],
    "Rabi": ["Wheat", "Gram", "Safflower", "Jowar"],
    "Zaid": ["Groundnut", "Sunflower", "Vegetables"]
  },
  "Gujarat": {
    "Kharif": ["Cotton", "Groundnut", "Bajra", "Castor"],
    "Rabi": ["Wheat", "Mustard", "Gram", "Cumin"],
    "Zaid": ["Moong Dal", "Sesame", "Vegetables"]
  },
  "Rajasthan": {
    "Kharif": ["Bajra", "Guar", "Maize", "Groundnut"],
    "Rabi": ["Mustard", "Wheat", "Gram", "Barley"],
    "Zaid": ["Moong Dal", "Watermelon", "Vegetables"]
  },
  "Madhya Pradesh": {
    "Kharif": ["Soybean", "Rice (Paddy)", "Maize", "Tur"],
    "Rabi": ["Wheat", "Gram", "Mustard", "Linseed"],
    "Zaid": ["Moong Dal", "Sesame", "Vegetables"]
  },
  "Chhattisgarh": {
    "Kharif": ["Rice (Paddy)", "Maize", "Groundnut"],
    "Rabi": ["Wheat", "Gram", "Linseed", "Mustard"],
    "Zaid": ["Moong Dal", "Vegetables"]
  },
  "West Bengal": {
    "Kharif": ["Rice (Paddy)", "Jute", "Maize"],
    "Rabi": ["Wheat", "Potato", "Mustard", "Lentils"],
    "Zaid": ["Watermelon", "Moong Dal", "Sesame"]
  },
  "Odisha": {
    "Kharif": ["Rice (Paddy)", "Maize", "Ragi"],
    "Rabi": ["Gram", "Mustard", "Potato", "Groundnut"],
    "Zaid": ["Moong Dal", "Sesame", "Vegetables"]
  },
  "Assam": {
    "Kharif": ["Rice (Paddy)", "Tea", "Jute"],
    "Rabi": ["Mustard", "Potato", "Pulses", "Wheat"],
    "Zaid": ["Vegetables", "Maize"]
  },
  "Arunachal Pradesh": {
    "Kharif": ["Rice (Paddy)", "Maize", "Millets"],
    "Rabi": ["Wheat", "Mustard", "Potato", "Barley"],
    "Zaid": ["Vegetables", "Ginger"]
  },
  "Sikkim": {
    "Kharif": ["Large Cardamom", "Maize", "Rice (Paddy)"],
    "Rabi": ["Wheat", "Mustard", "Potato", "Barley"],
    "Zaid": ["Vegetables", "Ginger"]
  },
  "Himachal Pradesh": {
    "Kharif": ["Apple", "Maize", "Paddy"],
    "Rabi": ["Wheat", "Barley", "Mustard", "Potato"],
    "Zaid": ["Vegetables", "Tomato"]
  },
  "Uttarakhand": {
    "Kharif": ["Rice (Paddy)", "Millets", "Apple"],
    "Rabi": ["Wheat", "Mustard", "Potato", "Barley"],
    "Zaid": ["Vegetables", "Ginger"]
  },
  "Jammu & Kashmir": {
    "Kharif": ["Apple", "Saffron", "Maize", "Paddy"],
    "Rabi": ["Wheat", "Barley", "Mustard", "Walnut"],
    "Zaid": ["Vegetables", "Moong"]
  },
  "Tamil Nadu": {
    "Kharif": ["Rice (Paddy)", "Sugarcane", "Banana", "Cotton", "Groundnut"],
    "Rabi": ["Rice (Thaladi)", "Groundnut", "Pulses", "Millets"],
    "Zaid": ["Sesame", "Vegetables", "Watermelon"]
  },
  "Kerala": {
    "Kharif": ["Rubber", "Coconut", "Banana", "Pepper", "Coffee"],
    "Rabi": ["Rice (Mundakan)", "Pulses", "Sweet Potato", "Vegetables"],
    "Zaid": ["Sesame", "Vegetables"]
  },
  "Karnataka": {
    "Kharif": ["Coffee", "Ragi", "Maize", "Sugarcane", "Arecanut"],
    "Rabi": ["Wheat", "Gram", "Mustard", "Sunflower"],
    "Zaid": ["Moong Dal", "Groundnut", "Vegetables"]
  },
  "Telangana": {
    "Kharif": ["Cotton", "Rice (Paddy)", "Maize", "Tur"],
    "Rabi": ["Wheat", "Bengal Gram", "Groundnut", "Mustard"],
    "Zaid": ["Sesame", "Moong Dal", "Vegetables"]
  },
  "Goa": {
    "Kharif": ["Coconut", "Cashew", "Rice (Paddy)"],
    "Rabi": ["Pulses", "Groundnut", "Vegetables"],
    "Zaid": ["Sesame", "Vegetables"]
  },
  "Tripura": {
    "Kharif": ["Rubber", "Rice (Paddy)", "Pineapple"],
    "Rabi": ["Potato", "Mustard", "Pulses"],
    "Zaid": ["Sesame", "Vegetables"]
  },
  "Mizoram": {
    "Kharif": ["Rice (Paddy)", "Maize", "Orange"],
    "Rabi": ["Pulses", "Potato", "Mustard"],
    "Zaid": ["Sesame", "Vegetables"]
  },
  "Nagaland": {
    "Kharif": ["Rice (Paddy)", "Maize", "Millets"],
    "Rabi": ["Pulses", "Potato", "Mustard"],
    "Zaid": ["Sesame", "Vegetables"]
  },
  "Manipur": {
    "Kharif": ["Rice (Paddy)", "Maize", "Pulses"],
    "Rabi": ["Potato", "Mustard", "Wheat"],
    "Zaid": ["Sesame", "Vegetables"]
  },
  "Meghalaya": {
    "Kharif": ["Potato", "Maize", "Ginger"],
    "Rabi": ["Wheat", "Mustard", "Pulses"],
    "Zaid": ["Sesame", "Vegetables"]
  }
}

export const getCurrentSeason = (dateInput = new Date()) => {
  const date = new Date(dateInput)
  const month = date.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec
  // Kharif: June (5) to October (9)
  // Rabi: November (10) to March (2)
  // Zaid: April (3) to May (4)
  if (month >= 5 && month <= 9) {
    return 'Kharif'
  } else if (month >= 10 || month <= 2) {
    return 'Rabi'
  } else {
    return 'Zaid'
  }
}

export const getRealisticGrowthStage = (crop, season, month = new Date().getMonth()) => {
  // crop lifecycle stages: "Seedling", "Vegetative Growth", "Early Flowering", "Harvest Ready"
  if (season === 'Kharif') {
    if (month === 5) return 'Seedling' // June
    if (month === 6 || month === 7) return 'Vegetative Growth' // July, August
    if (month === 8) return 'Early Flowering' // September
    return 'Harvest Ready' // October & onwards
  } else if (season === 'Rabi') {
    if (month === 10 || month === 11) return 'Seedling' // Nov, Dec
    if (month === 0 || month === 1) return 'Vegetative Growth' // Jan, Feb
    if (month === 2) return 'Early Flowering' // March
    return 'Harvest Ready' // April
  } else {
    // Zaid
    if (month === 3) return 'Seedling' // April
    if (month === 4) return 'Early Flowering' // May
    return 'Harvest Ready' // June
  }
}

// Procedural village selector based on district names
export const getVillageForDistrict = (districtName, idx, seed) => {
  const customVillages = {
    "ludhiana": ["Bhattian", "Raikot", "Samrala", "Jagraon", "Doraha", "Sahnewal"],
    "guntur": ["Amaravati", "Tenali", "Chebrolu", "Mangalagiri", "Bapatla", "Ponnur"],
    "jaipur": ["Sanganer", "Chomu", "Amber", "Shahpura", "Bassi", "Kanakpura"],
    "ahmedabad": ["Sanand", "Viramgam", "Dholka", "Bavla", "Dhandhuka", "Mandal"],
    "patna": ["Danapur", "Khagaul", "Maner", "Phulwari Sharif", "Fatuha", "Bakhtiyarpur"],
    "raipur": ["Abhanpur", "Arang", "Tilda", "Birgaon", "Mandir Hasaud", "Mana"],
    "north goa": ["Mapusa", "Bicholim", "Valpoi", "Pernem", "Calangute", "Aldona"],
    "south goa": ["Margao", "Ponda", "Canacona", "Quepem", "Sanguem", "Curchorem"],
    "srinagar": ["Ganderbal", "Harwan", "Nishat", "Shalimar", "Khonmoh", "Pampore"],
    "anantapur": ["Dharmavaram", "Gooty", "Kalyandurg", "Kadiri", "Rayadurg", "Hindupur"]
  }

  const normalized = districtName.toLowerCase().trim()
  if (customVillages[normalized]) {
    const list = customVillages[normalized]
    return list[idx % list.length]
  }

  // Procedure fallback lists using stable seeded index offsets
  const prefixes = ["Ram", "Kalyan", "Mohan", "Shiv", "Gopal", "Krishna", "Govind", "Dev", "Hari", "Raj", "Vijay", "Anand", "Prem", "Lal", "Suraj", "Kishan", "Bal", "Bhim", "Dharam"]
  const suffixes = ["pur", "nagar", "gaon", "palli", "gudi", "khed", "ur", "abad", "ghat", "ganj", "was", "oli", "hali", "patnam", "pura"]
  
  const pIdx = (seed + idx * 7) % prefixes.length
  const sIdx = (seed + idx * 11) % suffixes.length
  return `${prefixes[pIdx]}${suffixes[sIdx]}`
}

const waterSources = ["Canal Gravity Feed", "Tube Well", "River Lift System", "Drip Irrigation", "Rain-fed", "Farm Pond"]
const growthStages = ["Seedling", "Vegetative Growth", "Early Flowering", "Harvest Ready"]
const irrigationMethods = ["Drip Irrigation", "Micro Sprinkler", "Flood Basin", "Bypass Valve Pulse"]
const colors = {
  healthy: '#10b981',
  moderate: '#f59e0b',
  critical: '#ef4444'
}

// Procedural generator representing the unique farm database layer
export const generateFarmsForDistrict = (stateName, districtName, centerLat, centerLng, count) => {
  const farms = []
  
  // Seed random generator based on district name to yield stable results
  let seed = 0
  for (let i = 0; i < districtName.length; i++) {
    seed += districtName.charCodeAt(i)
  }
  const random = () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  const config = regionalConfig[stateName] || {
    crops: ["Barley", "Rice (Paddy)"],
    soil: "Alluvial Soil",
    farmerNames: ["Rajesh Patel", "Kamla Devi", "Manoj Singh", "Savita Sahu"]
  }

  const stateCode = stateCodes[stateName] || "AG"

  for (let i = 1; i <= count; i++) {
    // Coordinate offsets (up to 4km radius)
    const angle = random() * 2 * Math.PI
    const radius = 0.005 + random() * 0.012
    
    const latOffset = Math.sin(angle) * radius
    const lngOffset = Math.cos(angle) * radius
    
    const baseLat = centerLat + latOffset
    const baseLng = centerLng + lngOffset
    
    // Polygon geometry bounds
    const w = 0.002 + random() * 0.0035
    const h = 0.002 + random() * 0.0025
    
    const coordinates = [
      [baseLat, baseLng],
      [baseLat + h, baseLng],
      [baseLat + h, baseLng + w],
      [baseLat, baseLng + w]
    ]

    const statusVal = random()
    let status = "healthy"
    let ndvi = (0.62 + random() * 0.23).toFixed(2)
    let moisture = `${Math.round(62 + random() * 18)}%`

    if (statusVal > 0.75) {
      status = "critical"
      ndvi = (0.12 + random() * 0.20).toFixed(2)
      moisture = `${Math.round(15 + random() * 14)}%`
    } else if (statusVal > 0.45) {
      status = "moderate"
      ndvi = (0.35 + random() * 0.23).toFixed(2)
      moisture = `${Math.round(35 + random() * 20)}%`
    }

    const farmerName = config.farmerNames[(i - 1) % config.farmerNames.length]
    const village = getVillageForDistrict(districtName, i - 1, seed)

    const currentSeason = getCurrentSeason()
    const cropsList = regionalSeasonalCrops[stateName]?.[currentSeason] || config.crops
    const crop = cropsList[(i - 1) % cropsList.length]
    const growthStage = getRealisticGrowthStage(crop, currentSeason)

    // Area sizes based on segments: small (0.5-2ha), medium (2-5ha), large (5-15ha)
    const sizeType = random()
    let area = 1.2
    if (sizeType > 0.8) {
      area = (5.0 + random() * 8.5).toFixed(1) // Large
    } else if (sizeType > 0.3) {
      area = (2.0 + random() * 2.8).toFixed(1) // Medium
    } else {
      area = (0.5 + random() * 1.4).toFixed(1) // Small
    }

    const waterSource = waterSources[Math.floor(random() * waterSources.length)]
    const irrigationMethod = irrigationMethods[Math.floor(random() * irrigationMethods.length)]
    const createdDate = `2024-${String(Math.floor(2 + random() * 4)).padStart(2, '0')}-${String(Math.floor(10 + random() * 18)).padStart(2, '0')}`

    farms.push({
      id: `AGX-${stateCode}-${String(i).padStart(3, '0')}`,
      name: `${village} Field Plot #${i}`,
      farmerName,
      village,
      district: districtName,
      state: stateName,
      crop,
      area,
      season: currentSeason,
      soilType: config.soil,
      waterSource,
      growthStage,
      irrigationMethod,
      createdDate,
      status,
      moisture,
      ndvi,
      coordinates,
      lat: baseLat,
      lng: baseLng,
      style: {
        color: colors[status],
        fillColor: colors[status],
        fillOpacity: 0.3,
        weight: 1.8
      }
    })
  }

  return farms
}
