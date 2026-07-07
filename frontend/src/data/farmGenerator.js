// Refactored to re-export all generated markers and farms from the upgraded farmDatabase.js
// This ensures backward compatibility with zero code breakages.

import { 
  generateFarmsForDistrict as generateFarmsDb,
  stateCodes,
  regionalConfig
} from './farmDatabase'

// Generate procedural farms from our realistic database
export const generateFarmsForDistrict = (stateName, districtName, centerLat, centerLng, count) => {
  return generateFarmsDb(stateName, districtName, centerLat, centerLng, count)
}

// Flat list of all district markers across India for the Leaflet Map
export const getAllDistrictMarkers = () => {
  const markers = []
  
  Object.keys(regionalConfig).forEach((stateName) => {
    const config = regionalConfig[stateName]
    const cropProfile = config.crops.join(', ')
    
    // Retrieve coordinates from original generator state config
    // (We map these district coordinates directly for Leaflet plotting)
    const baseDistricts = originalStatesData[stateName]?.districts || []
    baseDistricts.forEach((dist) => {
      markers.push({
        id: `${stateName}-${dist.name}`,
        state: stateName,
        name: dist.name,
        lat: dist.lat,
        lng: dist.lng,
        status: dist.status,
        moisture: dist.moisture,
        crop: config.crops[0] || 'Wheat', // primary crop representation
        cropProfile: cropProfile
      })
    })
  })
  
  return markers
}

// Coordinate configs for all Indian district markers (re-used to prevent location drifts)
const originalStatesData = {
  "Andhra Pradesh": {
    districts: [
      { name: "Guntur", lat: 16.3067, lng: 80.4365, status: "healthy", moisture: "65%" },
      { name: "Anantapur", lat: 14.6819, lng: 77.6006, status: "critical", moisture: "29%" },
      { name: "Kurnool", lat: 15.8281, lng: 78.0373, status: "moderate", moisture: "48%" },
      { name: "East Godavari", lat: 16.9891, lng: 82.2475, status: "healthy", moisture: "74%" },
      { name: "Krishna", lat: 16.1824, lng: 81.1352, status: "healthy", moisture: "70%" },
      { name: "Nellore", lat: 14.4426, lng: 79.9865, status: "moderate", moisture: "52%" },
      { name: "Chittoor", lat: 13.2172, lng: 79.1003, status: "moderate", moisture: "46%" },
      { name: "West Godavari", lat: 16.7107, lng: 81.1328, status: "healthy", moisture: "72%" }
    ]
  },
  "Arunachal Pradesh": {
    districts: [
      { name: "Papum Pare", lat: 27.1265, lng: 93.7124, status: "healthy", moisture: "80%" },
      { name: "Lohit", lat: 27.9154, lng: 96.1832, status: "healthy", moisture: "78%" },
      { name: "Changlang", lat: 27.1245, lng: 95.7342, status: "moderate", moisture: "58%" },
      { name: "West Kameng", lat: 27.3125, lng: 92.4285, status: "healthy", moisture: "75%" },
      { name: "East Siang", lat: 28.0667, lng: 95.3333, status: "healthy", moisture: "82%" }
    ]
  },
  "Assam": {
    districts: [
      { name: "Dibrugarh", lat: 27.4728, lng: 94.9125, status: "healthy", moisture: "84%" },
      { name: "Jorhat", lat: 26.7509, lng: 94.2037, status: "healthy", moisture: "82%" },
      { name: "Nagaon", lat: 26.3483, lng: 92.6839, status: "moderate", moisture: "54%" },
      { name: "Sonitpur", lat: 26.6528, lng: 92.7925, status: "healthy", moisture: "76%" },
      { name: "Cachar", lat: 24.8333, lng: 92.7789, status: "moderate", moisture: "58%" },
      { name: "Kamrup", lat: 26.3125, lng: 91.5182, status: "healthy", moisture: "70%" },
      { name: "Tinsukia", lat: 27.5000, lng: 95.3667, status: "healthy", moisture: "85%" },
      { name: "Goalpara", lat: 26.1667, lng: 90.6167, status: "moderate", moisture: "52%" }
    ]
  },
  "Bihar": {
    districts: [
      { name: "Patna", lat: 25.5941, lng: 85.1376, status: "critical", moisture: "32%" },
      { name: "Gaya", lat: 24.7955, lng: 85.0004, status: "moderate", moisture: "46%" },
      { name: "Muzaffarpur", lat: 26.1209, lng: 85.3647, status: "healthy", moisture: "68%" },
      { name: "Bhagalpur", lat: 25.2425, lng: 87.0145, status: "moderate", moisture: "50%" },
      { name: "Rohtas", lat: 24.9333, lng: 84.0167, status: "healthy", moisture: "72%" },
      { name: "Purnia", lat: 25.7771, lng: 87.4752, status: "healthy", moisture: "74%" },
      { name: "Begusarai", lat: 25.4167, lng: 86.1333, status: "moderate", moisture: "48%" },
      { name: "East Champaran", lat: 26.6500, lng: 84.9167, status: "healthy", moisture: "70%" }
    ]
  },
  "Chhattisgarh": {
    districts: [
      { name: "Raipur", lat: 21.2514, lng: 81.6296, status: "healthy", moisture: "76%" },
      { name: "Durg", lat: 21.1900, lng: 81.2800, status: "healthy", moisture: "72%" },
      { name: "Bilaspur", lat: 22.0790, lng: 82.1399, status: "moderate", moisture: "54%" },
      { name: "Bastar", lat: 19.1667, lng: 81.8333, status: "healthy", moisture: "78%" },
      { name: "Surguja", lat: 23.1167, lng: 83.2000, status: "moderate", moisture: "50%" },
      { name: "Raigarh", lat: 21.8974, lng: 83.3950, status: "healthy", moisture: "71%" },
      { name: "Dhamtari", lat: 20.7083, lng: 81.5492, status: "healthy", moisture: "75%" },
      { name: "Janjgir", lat: 22.0167, lng: 82.5667, status: "healthy", moisture: "73%" }
    ]
  },
  "Goa": {
    districts: [
      { name: "North Goa", lat: 15.5828, lng: 74.0300, status: "healthy", moisture: "85%" },
      { name: "South Goa", lat: 15.1950, lng: 74.0750, status: "healthy", moisture: "82%" }
    ]
  },
  "Gujarat": {
    districts: [
      { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, status: "critical", moisture: "30%" },
      { name: "Rajkot", lat: 22.3039, lng: 70.8022, status: "moderate", moisture: "44%" },
      { name: "Surat", lat: 21.1702, lng: 72.8311, status: "healthy", moisture: "68%" },
      { name: "Vadodara", lat: 22.3072, lng: 73.1812, status: "moderate", moisture: "48%" },
      { name: "Junagadh", lat: 21.5222, lng: 70.4579, status: "healthy", moisture: "72%" },
      { name: "Anand", lat: 22.5645, lng: 72.9289, status: "healthy", moisture: "74%" },
      { name: "Mehsana", lat: 23.6000, lng: 72.4000, status: "moderate", moisture: "45%" },
      { name: "Banaskantha", lat: 24.2667, lng: 72.4333, status: "critical", moisture: "32%" },
      { name: "Amreli", lat: 21.6000, lng: 71.2167, status: "moderate", moisture: "40%" }
    ]
  },
  "Haryana": {
    districts: [
      { name: "Karnal", lat: 29.6857, lng: 76.9905, status: "healthy", moisture: "76%" },
      { name: "Hisar", lat: 29.1492, lng: 75.7217, status: "moderate", moisture: "45%" },
      { name: "Rohtak", lat: 28.8955, lng: 76.6066, status: "moderate", moisture: "48%" },
      { name: "Sirsa", lat: 29.5333, lng: 75.0333, status: "moderate", moisture: "42%" },
      { name: "Ambala", lat: 30.3782, lng: 76.7767, status: "healthy", moisture: "72%" },
      { name: "Kurukshetra", lat: 29.9667, lng: 76.8167, status: "healthy", moisture: "75%" },
      { name: "Sonipat", lat: 28.9833, lng: 77.0167, status: "healthy", moisture: "70%" },
      { name: "Jind", lat: 29.3167, lng: 76.3167, status: "moderate", moisture: "49%" }
    ]
  },
  "Himachal Pradesh": {
    districts: [
      { name: "Shimla", lat: 31.1048, lng: 77.1734, status: "healthy", moisture: "72%" },
      { name: "Kangra", lat: 32.1001, lng: 76.2701, status: "healthy", moisture: "74%" },
      { name: "Mandi", lat: 31.5892, lng: 76.9182, status: "moderate", moisture: "54%" },
      { name: "Kullu", lat: 31.9579, lng: 77.1095, status: "healthy", moisture: "70%" },
      { name: "Solan", lat: 30.9045, lng: 77.0967, status: "healthy", moisture: "71%" }
    ]
  },
  "Jammu & Kashmir": {
    districts: [
      { name: "Srinagar", lat: 34.0837, lng: 74.7973, status: "healthy", moisture: "75%" },
      { name: "Jammu", lat: 32.7266, lng: 74.8570, status: "moderate", moisture: "48%" },
      { name: "Anantnag", lat: 33.7311, lng: 75.1481, status: "healthy", moisture: "74%" },
      { name: "Baramulla", lat: 34.2000, lng: 74.3500, status: "healthy", moisture: "72%" },
      { name: "Kathua", lat: 32.3833, lng: 75.5167, status: "moderate", moisture: "50%" }
    ]
  },
  "Jharkhand": {
    districts: [
      { name: "Ranchi", lat: 23.3441, lng: 85.3096, status: "healthy", moisture: "62%" },
      { name: "Dhanbad", lat: 23.7957, lng: 86.4304, status: "moderate", moisture: "48%" },
      { name: "Jamshedpur", lat: 22.8046, lng: 86.2029, status: "healthy", moisture: "66%" },
      { name: "Hazaribagh", lat: 23.9979, lng: 85.3667, status: "moderate", moisture: "54%" }
    ]
  },
  "Karnataka": {
    districts: [
      { name: "Chikmagalur", lat: 13.3161, lng: 75.7720, status: "healthy", moisture: "80%" },
      { name: "Hassan", lat: 13.0068, lng: 76.1026, status: "healthy", moisture: "76%" },
      { name: "Mysore", lat: 12.2958, lng: 76.6394, status: "moderate", moisture: "55%" },
      { name: "Belgaum", lat: 15.8497, lng: 74.4977, status: "healthy", moisture: "72%" },
      { name: "Shimoga", lat: 13.9299, lng: 75.5681, status: "healthy", moisture: "78%" },
      { name: "Mandya", lat: 12.5218, lng: 76.8951, status: "moderate", moisture: "50%" },
      { name: "Dharwad", lat: 15.4589, lng: 75.0078, status: "moderate", moisture: "46%" }
    ]
  },
  "Kerala": {
    districts: [
      { name: "Wayanad", lat: 11.6854, lng: 76.1320, status: "healthy", moisture: "88%" },
      { name: "Idukki", lat: 9.8500, lng: 76.9667, status: "healthy", moisture: "85%" },
      { name: "Kottayam", lat: 9.5916, lng: 76.5224, status: "healthy", moisture: "82%" },
      { name: "Palakkad", lat: 10.7867, lng: 76.6547, status: "moderate", moisture: "52%" },
      { name: "Thrissur", lat: 10.5276, lng: 76.2144, status: "healthy", moisture: "78%" }
    ]
  },
  "Madhya Pradesh": {
    districts: [
      { name: "Bhopal", lat: 23.2599, lng: 77.4126, status: "healthy", moisture: "68%" },
      { name: "Indore", lat: 22.7196, lng: 75.8577, status: "moderate", moisture: "52%" },
      { name: "Jabalpur", lat: 23.1815, lng: 79.9864, status: "healthy", moisture: "60%" },
      { name: "Ujjain", lat: 23.1760, lng: 75.7885, status: "moderate", moisture: "48%" },
      { name: "Gwalior", lat: 26.2183, lng: 78.1828, status: "critical", moisture: "32%" }
    ]
  },
  "Maharashtra": {
    districts: [
      { name: "Nagpur", lat: 21.1458, lng: 79.0882, status: "moderate", moisture: "46%" },
      { name: "Amravati", lat: 20.9374, lng: 77.7796, status: "moderate", moisture: "42%" },
      { name: "Yavatmal", lat: 20.3886, lng: 78.1207, status: "critical", moisture: "28%" },
      { name: "Jalgaon", lat: 21.0077, lng: 75.5626, status: "moderate", moisture: "45%" },
      { name: "Nanded", lat: 19.1383, lng: 77.3210, status: "moderate", moisture: "48%" },
      { name: "Nashik", lat: 19.9975, lng: 73.7898, status: "healthy", moisture: "70%" },
      { name: "Kolhapur", lat: 16.7050, lng: 74.2433, status: "healthy", moisture: "75%" },
      { name: "Solapur", lat: 17.6599, lng: 75.9064, status: "critical", moisture: "30%" }
    ]
  },
  "Manipur": {
    districts: [
      { name: "Imphal West", lat: 24.8174, lng: 93.9368, status: "healthy", moisture: "76%" },
      { name: "Thoubal", lat: 24.6333, lng: 94.0167, status: "healthy", moisture: "75%" },
      { name: "Bishnupur", lat: 24.6333, lng: 93.7667, status: "healthy", moisture: "78%" }
    ]
  },
  "Meghalaya": {
    districts: [
      { name: "East Khasi Hills", lat: 25.5689, lng: 91.8831, status: "healthy", moisture: "82%" },
      { name: "West Garo Hills", lat: 25.5167, lng: 90.2167, status: "healthy", moisture: "78%" },
      { name: "Ri Bhoi", lat: 25.9000, lng: 91.8833, status: "healthy", moisture: "80%" }
    ]
  },
  "Mizoram": {
    districts: [
      { name: "Aizawl", lat: 23.7271, lng: 92.7176, status: "healthy", moisture: "75%" },
      { name: "Lunglei", lat: 22.8833, lng: 92.7333, status: "healthy", moisture: "74%" },
      { name: "Champhai", lat: 23.4500, lng: 93.3167, status: "healthy", moisture: "76%" }
    ]
  },
  "Nagaland": {
    districts: [
      { name: "Kohima", lat: 25.6751, lng: 94.1086, status: "healthy", moisture: "74%" },
      { name: "Dimapur", lat: 25.9064, lng: 93.7274, status: "moderate", moisture: "55%" },
      { name: "Mokokchung", lat: 26.3292, lng: 94.5147, status: "healthy", moisture: "78%" }
    ]
  },
  "Odisha": {
    districts: [
      { name: "Cuttack", lat: 20.4625, lng: 85.8792, status: "healthy", moisture: "72%" },
      { name: "Ganjam", lat: 19.3800, lng: 85.0700, status: "moderate", moisture: "52%" },
      { name: "Sambalpur", lat: 21.4669, lng: 83.9812, status: "moderate", moisture: "54%" },
      { name: "Baleswar", lat: 21.4938, lng: 86.9246, status: "healthy", moisture: "74%" },
      { name: "Kalahandi", lat: 20.0760, lng: 83.1649, status: "moderate", moisture: "48%" }
    ]
  },
  "Punjab": {
    districts: [
      { name: "Ludhiana", lat: 30.9010, lng: 75.8573, status: "healthy", moisture: "72%" },
      { name: "Amritsar", lat: 31.6340, lng: 74.8723, status: "healthy", moisture: "74%" },
      { name: "Jalandhar", lat: 31.3260, lng: 75.5762, status: "healthy", moisture: "71%" },
      { name: "Patiala", lat: 30.3398, lng: 76.3869, status: "healthy", moisture: "70%" },
      { name: "Bathinda", lat: 30.2110, lng: 74.9455, status: "moderate", moisture: "52%" },
      { name: "Firozpur", lat: 30.9236, lng: 74.6084, status: "healthy", moisture: "68%" },
      { name: "Gurdaspur", lat: 32.0408, lng: 75.4053, status: "healthy", moisture: "75%" },
      { name: "Sangrur", lat: 30.2290, lng: 75.8412, status: "moderate", moisture: "55%" }
    ]
  },
  "Rajasthan": {
    districts: [
      { name: "Jaipur", lat: 26.9124, lng: 75.7873, status: "critical", moisture: "28%" },
      { name: "Jodhpur", lat: 26.2389, lng: 73.0243, status: "critical", moisture: "24%" },
      { name: "Kota", lat: 25.2138, lng: 75.8648, status: "moderate", moisture: "45%" },
      { name: "Sri Ganganagar", lat: 29.9103, lng: 73.8778, status: "healthy", moisture: "68%" },
      { name: "Alwar", lat: 27.5530, lng: 76.6346, status: "moderate", moisture: "42%" },
      { name: "Barmer", lat: 25.7500, lng: 71.3833, status: "critical", moisture: "20%" },
      { name: "Udaipur", lat: 24.5854, lng: 73.7125, status: "moderate", moisture: "48%" },
      { name: "Hanumangarh", lat: 29.5800, lng: 74.3200, status: "healthy", moisture: "70%" }
    ]
  },
  "Sikkim": {
    districts: [
      { name: "East Sikkim", lat: 27.3116, lng: 88.6128, status: "healthy", moisture: "85%" },
      { name: "West Sikkim", lat: 27.2798, lng: 88.2612, status: "healthy", moisture: "82%" },
      { name: "South Sikkim", lat: 27.1667, lng: 88.4167, status: "healthy", moisture: "84%" }
    ]
  },
  "Tamil Nadu": {
    districts: [
      { name: "Thanjavur", lat: 10.7870, lng: 79.1378, status: "healthy", moisture: "74%" },
      { name: "Coimbatore", lat: 11.0168, lng: 76.9558, status: "moderate", moisture: "54%" },
      { name: "Madurai", lat: 9.9252, lng: 78.1198, status: "moderate", moisture: "48%" },
      { name: "Trichy", lat: 10.7905, lng: 78.7047, status: "healthy", moisture: "70%" },
      { name: "Salem", lat: 11.6643, lng: 78.1460, status: "moderate", moisture: "46%" },
      { name: "Erode", lat: 11.3410, lng: 77.7172, status: "healthy", moisture: "72%" },
      { name: "Vellore", lat: 12.9165, lng: 79.1325, status: "moderate", moisture: "42%" }
    ]
  },
  "Telangana": {
    districts: [
      { name: "Hyderabad", lat: 17.3850, lng: 78.4867, status: "healthy", moisture: "60%" },
      { name: "Warangal", lat: 17.9689, lng: 79.5941, status: "moderate", moisture: "48%" },
      { name: "Karimnagar", lat: 18.4386, lng: 79.1288, status: "healthy", moisture: "64%" },
      { name: "Nizamabad", lat: 18.6725, lng: 78.0941, status: "moderate", moisture: "52%" }
    ]
  },
  "Tripura": {
    districts: [
      { name: "West Tripura", lat: 23.8396, lng: 91.2743, status: "healthy", moisture: "80%" },
      { name: "South Tripura", lat: 23.2333, lng: 91.5000, status: "healthy", moisture: "78%" },
      { name: "Dhalai", lat: 23.8833, lng: 91.8333, status: "healthy", moisture: "82%" }
    ]
  },
  "Uttarakhand": {
    districts: [
      { name: "Dehradun", lat: 30.3165, lng: 78.0322, status: "healthy", moisture: "70%" },
      { name: "Haridwar", lat: 29.9457, lng: 78.1642, status: "moderate", moisture: "55%" },
      { name: "Nainital", lat: 29.3803, lng: 79.4636, status: "healthy", moisture: "75%" },
      { name: "Udham Singh Nagar", lat: 28.9833, lng: 79.5333, status: "healthy", moisture: "78%" }
    ]
  },
  "Uttar Pradesh": {
    districts: [
      { name: "Lakhimpur Kheri", lat: 27.9475, lng: 80.7781, status: "healthy", moisture: "76%" },
      { name: "Varanasi", lat: 25.3176, lng: 82.9739, status: "healthy", moisture: "72%" },
      { name: "Gorakhpur", lat: 26.7606, lng: 83.3731, status: "healthy", moisture: "74%" },
      { name: "Bareilly", lat: 28.3670, lng: 79.4304, status: "moderate", moisture: "52%" },
      { name: "Meerut", lat: 28.9845, lng: 77.7064, status: "healthy", moisture: "71%" },
      { name: "Aligarh", lat: 27.8974, lng: 78.0880, status: "moderate", moisture: "48%" },
      { name: "Jhansi", lat: 25.4484, lng: 78.5685, status: "critical", moisture: "29%" },
      { name: "Prayagraj", lat: 25.4358, lng: 81.8463, status: "moderate", moisture: "50%" }
    ]
  },
  "West Bengal": {
    districts: [
      { name: "Bardhaman", lat: 23.2324, lng: 87.8630, status: "healthy", moisture: "78%" },
      { name: "Murshidabad", lat: 24.1800, lng: 88.2700, status: "healthy", moisture: "72%" },
      { name: "Darjeeling", lat: 27.0410, lng: 88.2627, status: "healthy", moisture: "80%" },
      { name: "Nadia", lat: 23.4700, lng: 88.5600, status: "moderate", moisture: "55%" }
    ]
  },
  "Andaman & Nicobar Islands": {
    districts: [
      { name: "Port Blair", lat: 11.6234, lng: 92.7265, status: "healthy", moisture: "82%" },
      { name: "Car Nicobar", lat: 9.1667, lng: 92.7500, status: "healthy", moisture: "85%" }
    ]
  },
  "Chandigarh": {
    districts: [
      { name: "Chandigarh", lat: 30.7333, lng: 76.7794, status: "healthy", moisture: "72%" }
    ]
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    districts: [
      { name: "Silvassa", lat: 20.2765, lng: 73.0083, status: "healthy", moisture: "70%" },
      { name: "Daman", lat: 20.3974, lng: 72.8328, status: "healthy", moisture: "68%" }
    ]
  },
  "Delhi": {
    districts: [
      { name: "Najafgarh", lat: 28.6090, lng: 76.9855, status: "moderate", moisture: "48%" },
      { name: "Narela", lat: 28.8525, lng: 77.0950, status: "moderate", moisture: "50%" }
    ]
  },
  "Ladakh": {
    districts: [
      { name: "Leh", lat: 34.1526, lng: 77.5771, status: "healthy", moisture: "65%" },
      { name: "Kargil", lat: 34.5539, lng: 76.1349, status: "moderate", moisture: "52%" }
    ]
  },
  "Lakshadweep": {
    districts: [
      { name: "Kavaratti", lat: 10.5667, lng: 72.6333, status: "healthy", moisture: "88%" },
      { name: "Agatti", lat: 10.8500, lng: 72.1833, status: "healthy", moisture: "85%" }
    ]
  },
  "Puducherry": {
    districts: [
      { name: "Puducherry", lat: 11.9416, lng: 79.8083, status: "healthy", moisture: "74%" },
      { name: "Karaikal", lat: 10.9254, lng: 79.8380, status: "moderate", moisture: "52%" }
    ]
  }
}
