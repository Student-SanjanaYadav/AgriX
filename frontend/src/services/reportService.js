// AgriX Professional Reporting Service
// Handles exports for PDF, CSV, and Print formats.

import { jsPDF } from 'jspdf'
import logoImg from '../assets/logo.png'

// Dynamic PDF report generator
export const generatePDFReport = (data, lang = 'en') => {
  if (!data) return
  
  const isHi = lang === 'hi'
  const tLabel = (key, defaultVal) => {
    const translationsHi = {
      "PRECISION WATER INTELLIGENCE REPORT": "परिशुद्ध जल आसूचना रिपोर्ट",
      "Empowering Smarter Irrigation Through AI, Geospatial & Predictive Analytics": "एआई, भू-स्थानिक और पूर्वानुमानित विश्लेषण के माध्यम से स्मार्ट सिंचाई को सशक्त बनाना",
      "Generated:": "तैयार किया गया:",
      "System: Live Satellite Sync": "सिस्टम: लाइव सैटेलाइट सिंक",
      "PRECISION TELEMETRY DIAGNOSTIC PROFILE": "परिशुद्ध टेलीमेट्री नैदानिक विवरण",
      "Farm / Field ID:": "खेत / फ़ील्ड आईडी:",
      "Region State:": "राज्य:",
      "District Hub:": "जिला केंद्र:",
      "Active Crop Profile:": "सक्रिय फसल विवरण:",
      "Field Size Area:": "खेत का क्षेत्रफल:",
      "Soil Profile Silt:": "मिट्टी का प्रकार:",
      "NDVI Vegetation Index:": "NDVI वनस्पति सूचकांक:",
      "Soil Moisture VWC:": "मिट्टी की नमी VWC:",
      "Climate Conditions:": "जलवायु परिस्थितियां:",
      "AI INTELLIGENCE DIAGNOSTIC DECISION": "एआई इंटेलिजेंस नैदानिक निर्णय",
      "Crop Health Rating:": "फसल स्वास्थ्य रेटिंग:",
      "AI Recommendation:": "एआई सुझाव:",
      "Action Plan:": "कार्य योजना:",
      "Expected Impact:": "अपेक्षित प्रभाव:",
      "Scenario Calibration:": "परिदृश्य सारांश:",
      "Water Saving Estimate:": "जल बचत अनुमान:",
      "AgriX Geospatial Precision Irrigation Platform. Dynamically synchronized with Sentinel-2 datasets.": "AgriX भू-स्थानिक परिशुद्ध सिंचाई मंच। Sentinel-2 डेटासेट के साथ गतिशील रूप से सिंक्रनाइज़।",
      "Version 4.2.0 (Stable-Prod)": "संस्करण 4.2.0 (स्थिर-उत्पाद)",
      "Hectares": "हेक्टेयर",
      "Alluvial Soil": "जलोढ़ मिट्टी",
      "Clay Loam": "चिकनी मिट्टी",
      "Sandy Loam": "रेतीली दोमट मिट्टी",
      "Sandy Soil": "रेतीली मिट्टी",
      "Laterite Soil": "लेटराइट मिट्टी",
      "Red Soil": "लाल मिट्टी",
      "Black Soil": "काली मिट्टी"
    }
    return isHi && translationsHi[key] ? translationsHi[key] : (defaultVal || key)
  }

  const doc = new jsPDF()
  const img = new Image()
  img.src = logoImg
  
  img.onload = () => {
    // 1. Header background banner
    doc.setFillColor(5, 8, 22) // #050816 Dark navy
    doc.rect(0, 0, 210, 45, 'F')

    // Draw logo image
    doc.addImage(img, 'PNG', 15, 8, 30, 30)

    // 2. AgriX Branding
    doc.setTextColor(16, 185, 129) // #10b981 Emerald
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('AgriX', 50, 20)

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(tLabel('PRECISION WATER INTELLIGENCE REPORT'), 50, 27)
    doc.text(tLabel('Empowering Smarter Irrigation Through AI, Geospatial & Predictive Analytics'), 50, 33)

    // Timestamp
    doc.setTextColor(148, 163, 184) // Slate-400
    doc.setFontSize(8)
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    doc.text(`${tLabel('Generated:')} ${timestampStr} (IST)`, 140, 20)
    doc.text(tLabel('System: Live Satellite Sync'), 140, 25)

    // 3. Document Details Section
    doc.setTextColor(5, 8, 22)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(tLabel('PRECISION TELEMETRY DIAGNOSTIC PROFILE'), 15, 60)

    doc.setDrawColor(226, 232, 240) // light gray
    doc.setLineWidth(0.5)
    doc.line(15, 64, 195, 64)

    const details = [
      { label: tLabel('Farm / Field ID:'), value: data.farmId || data.id || 'N/A' },
      { label: tLabel('Region State:'), value: data.state || 'N/A' },
      { label: tLabel('District Hub:'), value: data.district || 'N/A' },
      { label: tLabel('Active Crop Profile:'), value: data.crop || 'N/A' },
      { label: tLabel('Field Size Area:'), value: `${data.area || 'N/A'} ${tLabel('Hectares')}` },
      { label: tLabel('Soil Profile Silt:'), value: tLabel(data.soilType, data.soilType) },
      { label: tLabel('NDVI Vegetation Index:'), value: data.ndvi || '0.74' },
      { label: tLabel('Soil Moisture VWC:'), value: data.moisture || 'N/A' },
      { label: tLabel('Climate Conditions:'), value: data.weather || '32°C, Partly Cloudy' }
    ]

    let y = 72
    details.forEach((item) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105) // Slate-600
      doc.text(item.label, 15, y)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(15, 23, 42) // Slate-900
      doc.text(item.value.toString(), 70, y)
      y += 8
    })

    doc.line(15, y, 195, y)
    y += 10

    // 4. AI Recommendations Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(5, 8, 22)
    doc.text(tLabel('AI INTELLIGENCE DIAGNOSTIC DECISION'), 15, y)
    y += 8

    // Crop Health status string
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)
    doc.text(tLabel('Crop Health Rating:'), 15, y)

    const healthStatusRaw = data.status || 'healthy'
    const healthStatus = healthStatusRaw.toUpperCase()
    if (healthStatus === 'HEALTHY') doc.setTextColor(16, 185, 129)
    else if (healthStatus === 'MODERATE') doc.setTextColor(245, 158, 11)
    else doc.setTextColor(239, 68, 68)
    
    let statusStr = healthStatus
    if (isHi) {
      statusStr = healthStatusRaw === 'healthy' ? 'स्वस्थ' : healthStatusRaw === 'moderate' ? 'मध्यम' : 'गंभीर'
    }

    doc.setFont('helvetica', 'bold')
    doc.text(statusStr, 70, y)
    y += 8

    // AI recommendation text blocks
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(tLabel('AI Recommendation:'), 15, y)
    y += 5
    
    doc.setFont('helvetica', 'oblique')
    doc.setTextColor(51, 65, 85) // Slate-700
    const recommendationText = data.recommendation || (
      data.status === 'healthy' 
        ? 'Vegetation indicators meet targeted VWC profiles. High satellite correlation indexes. No dry-spots mapped. Evapotranspiration rates are normal.' 
        : data.status === 'moderate'
          ? 'Moderate soil moisture dehydration detected. evaporation anomalies are scattered. Scheduling a 12-minute pulse valve flow override is suggested.'
          : 'Volumetric soil moisture levels show severe deficits. Core temperature sensors report evaporation spikes. Trigger emergency flow valve overrides immediately.'
    )
    const splitRecommendation = doc.splitTextToSize(recommendationText, 175)
    doc.text(splitRecommendation, 15, y)
    y += (splitRecommendation.length * 5) + 4

    // Action Plan block
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(tLabel('Action Plan:'), 15, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    const actionText = data.actionPlan || 'Calibrate localized sprinkler timer cycles. Repeat satellite thermal scans.'
    const splitAction = doc.splitTextToSize(actionText, 175)
    doc.text(splitAction, 15, y)
    y += (splitAction.length * 5) + 4

    // Expected Impact block
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(tLabel('Expected Impact:'), 15, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    const impactText = data.expectedImpact || 'Optimizes ground moisture absorption, saving evaporation loss.'
    const splitImpact = doc.splitTextToSize(impactText, 175)
    doc.text(splitImpact, 15, y)
    y += (splitImpact.length * 5) + 4

    // Scenario summary block
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(tLabel('Scenario Calibration:'), 15, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    doc.text(data.scenarioSummary || 'Standard historical climate dataset parameters.', 70, y)
    y += 8

    // Water Saving Estimate
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(tLabel('Water Saving Estimate:'), 15, y)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 148, 136) // Teal-600
    doc.text(data.waterSaving || '22% Flow Conservation Index', 70, y)

    // Draw final decorative line
    doc.setDrawColor(226, 232, 240)
    doc.line(15, y + 6, 195, y + 6)

    // Footer
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(tLabel('AgriX Geospatial Precision Irrigation Platform. Dynamically synchronized with Sentinel-2 datasets.'), 15, 282)
    doc.text(tLabel('Version 4.2.0 (Stable-Prod)'), 160, 282)

    doc.save(`AgriX-Telemetry-${data.farmId || data.id || 'Report'}.pdf`)
    window.dispatchEvent(new CustomEvent('farmNotification', { 
      detail: { 
        title: 'PDF Report Compiled', 
        desc: `Precision telemetry report for ${data.id || data.farmId || 'Active Field'} downloaded successfully.`, 
        type: 'report' 
      } 
    }))
  }
}

// Generate CSV Report
export const generateCSVReport = (data, lang = 'en') => {
  if (!data) return

  const isHi = lang === 'hi'
  const rows = [
    [isHi ? "पैरामीटर" : "Parameter", isHi ? "मान" : "Value"],
    [isHi ? "रिपोर्ट आईडी" : "Report ID", data.farmId || data.id || 'N/A'],
    [isHi ? "राज्य" : "State", data.state || 'N/A'],
    [isHi ? "जिला" : "District", data.district || 'N/A'],
    [isHi ? "फसल विवरण" : "Crop Profile", data.crop || 'N/A'],
    [isHi ? "खेत का क्षेत्रफल (हेक्टेयर)" : "Field Area (ha)", data.area || 'N/A'],
    [isHi ? "मिट्टी का प्रकार" : "Soil Profile Silt", data.soilType || 'Alluvial Soil'],
    [isHi ? "NDVI सूचकांक" : "NDVI Index", data.ndvi || '0.74'],
    [isHi ? "मिट्टी की नमी VWC" : "Soil Moisture VWC", data.moisture || 'N/A'],
    [isHi ? "जलवायु औसत" : "Climate Averages", data.weather || '32 C, Cloudy'],
    [isHi ? "एआई फसल रेटिंग" : "AI Crop Rating", data.status || 'N/A'],
    [isHi ? "जल बचत अनुमान" : "Water Saving Estimate", data.waterSaving || 'N/A'],
    [isHi ? "एआई सुझाव" : "AI Recommendation", data.recommendation || 'N/A'],
    [isHi ? "कार्य योजना" : "Action Plan", data.actionPlan || 'N/A'],
    [isHi ? "अपेक्षित प्रभाव" : "Expected Impact", data.expectedImpact || 'N/A'],
    [isHi ? "परिदृश्य सारांश" : "Scenario Summary", data.scenarioSummary || 'N/A'],
    [isHi ? "तैयार किया गया तिथि" : "Generated On", new Date().toLocaleString()]
  ]

  const csvContent = "data:text/csv;charset=utf-8," 
    + rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `AgriX-Telemetry-${data.farmId || data.id || 'Report'}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.dispatchEvent(new CustomEvent('farmNotification', { 
    detail: { 
      title: 'CSV Report Downloaded', 
      desc: `Raw telemetry spreadsheet for ${data.id || data.farmId || 'Active Field'} saved successfully.`, 
      type: 'report' 
    } 
  }))
}

// Trigger browser print layout for report profile
export const printReport = (data, lang = 'en') => {
  if (!data) return

  const isHi = lang === 'hi'
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>AgriX Telemetry Report - ${data.farmId || data.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-between: space-between; align-items: center; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
          .subtitle { font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 5px; }
          .meta-info { text-align: right; font-size: 11px; color: #64748b; }
          .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          th { font-weight: bold; color: #475569; width: 35%; }
          .recommendation-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; font-style: italic; color: #15803d; font-size: 13px; }
          .highlight { font-weight: bold; color: #10b981; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${isHi ? 'AgriX परिशुद्ध रिपोर्ट' : 'AgriX Precision Report'}</div>
            <div class="subtitle">${isHi ? 'स्थानिक निर्णय इंटेलिजेंस प्लेटफॉर्म' : 'Spatial Decision Intelligence Platform'}</div>
          </div>
          <div class="meta-info">
            <div>${isHi ? 'रिपोर्ट आईडी' : 'Report ID'}: ${data.farmId || data.id}</div>
            <div>${isHi ? 'तैयार किया गया' : 'Generated'}: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div class="section-title">${isHi ? 'टेलीमेट्री नैदानिक विवरण' : 'Telemetry Diagnostic Profile'}</div>
        <table>
          <tr><th>${isHi ? 'खेत / फ़ील्ड आईडी' : 'Farm / Field ID'}</th><td>${data.farmId || data.id}</td></tr>
          <tr><th>${isHi ? 'राज्य' : 'Region State'}</th><td>${data.state || 'N/A'}</td></tr>
          <tr><th>${isHi ? 'जिला केंद्र' : 'District Hub'}</th><td>${data.district || 'N/A'}</td></tr>
          <tr><th>${isHi ? 'सक्रिय फसल विवरण' : 'Active Crop Profile'}</th><td>${data.crop || 'N/A'}</td></tr>
          <tr><th>${isHi ? 'खेत का क्षेत्रफल' : 'Field Size Area'}</th><td>${data.area || 'N/A'} ${isHi ? 'हेक्टेयर' : 'Hectares'}</td></tr>
          <tr><th>${isHi ? 'मिट्टी का प्रकार' : 'Soil Profile Silt'}</th><td>${data.soilType || 'Alluvial Soil'}</td></tr>
          <tr><th>${isHi ? 'NDVI वनस्पति सूचकांक' : 'NDVI Vegetation Index'}</th><td>${data.ndvi || '0.74'}</td></tr>
          <tr><th>${isHi ? 'मिट्टी की नमी VWC' : 'Soil Moisture VWC'}</th><td>${data.moisture || 'N/A'}</td></tr>
          <tr><th>${isHi ? 'जलवायु परिस्थितियां' : 'Climate Conditions'}</th><td>${data.weather || 'N/A'}</td></tr>
          <tr><th>${isHi ? 'एआई फसल स्वास्थ्य रेटिंग' : 'AI Crop Health Rating'}</th><td class="highlight">${isHi ? (data.status === 'healthy' ? 'स्वस्थ' : data.status === 'moderate' ? 'मध्यम' : 'गंभीर') : (data.status ? data.status.toUpperCase() : 'N/A')}</td></tr>
        </table>

        <div class="section-title">${isHi ? 'एआई नैदानिक निर्णय' : 'AI Diagnostic Decision'}</div>
        <div class="recommendation-box">
          <strong>${isHi ? 'एआई सुझाव' : 'AI Recommendation'}:</strong> ${data.recommendation || 'N/A'}
        </div>

        <div style="margin-top: 15px; font-size: 13px;">
          <p><strong>${isHi ? 'कार्य योजना' : 'Action Plan'}:</strong> ${data.actionPlan || 'N/A'}</p>
          <p><strong>${isHi ? 'अपेक्षित प्रभाव' : 'Expected Impact'}:</strong> ${data.expectedImpact || 'N/A'}</p>
          <p><strong>${isHi ? 'परिदृश्य सारांश' : 'Scenario Summary'}:</strong> ${data.scenarioSummary || 'N/A'}</p>
          <p><strong>${isHi ? 'जल बचत अनुमान' : 'Water Saving Estimate'}:</strong> <span class="highlight">${data.waterSaving || 'N/A'}</span></p>
        </div>

        <div class="footer">
          ${isHi ? 'AgriX भू-स्थानिक परिशुद्ध मंच। यह दस्तावेज़ गतिशील रूप से Sentinel-2 डेटासेट के साथ सिंक्रनाइज़ है। संस्करण 4.2.0 (स्थिर-उत्पाद)।' : 'AgriX Geospatial Precision Platform. This document is dynamically synchronized with Sentinel-2 datasets. Version 4.2.0 (Stable-Prod).'}
        </div>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
    window.dispatchEvent(new CustomEvent('farmNotification', { 
      detail: { 
        title: 'Report Print Triggered', 
        desc: `Print layout compilation sent for ${data.id || data.farmId || 'Active Field'}.`, 
        type: 'report' 
      } 
    }))
  }, 350)
}
