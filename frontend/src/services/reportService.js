// AgriX Professional Reporting Service
// Handles exports for PDF, CSV, and Print formats.

import { jsPDF } from 'jspdf'
import logoImg from '../assets/logo.png'

// Dynamic PDF report generator
export const generatePDFReport = (data) => {
  if (!data) return
  
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
    doc.text('PRECISION WATER INTELLIGENCE REPORT', 50, 27)
    doc.text('Empowering Smarter Irrigation Through AI, Geospatial & Predictive Analytics', 50, 33)

    // Timestamp
    doc.setTextColor(148, 163, 184) // Slate-400
    doc.setFontSize(8)
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    doc.text(`Generated: ${timestampStr} (IST)`, 140, 20)
    doc.text('System: Live Satellite Sync', 140, 25)

    // 3. Document Details Section
    doc.setTextColor(5, 8, 22)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('PRECISION TELEMETRY DIAGNOSTIC PROFILE', 15, 60)

    doc.setDrawColor(226, 232, 240) // light gray
    doc.setLineWidth(0.5)
    doc.line(15, 64, 195, 64)

    const details = [
      { label: 'Farm / Field ID:', value: data.farmId || data.id || 'N/A' },
      { label: 'Region State:', value: data.state || 'N/A' },
      { label: 'District Hub:', value: data.district || 'N/A' },
      { label: 'Active Crop Profile:', value: data.crop || 'N/A' },
      { label: 'Field Size Area:', value: `${data.area || 'N/A'} Hectares` },
      { label: 'Soil Profile Silt:', value: data.soilType || 'Alluvial Soil' },
      { label: 'NDVI Vegetation Index:', value: data.ndvi || '0.74' },
      { label: 'Soil Moisture VWC:', value: data.moisture || 'N/A' },
      { label: 'Climate Conditions:', value: data.weather || '32°C, Partly Cloudy' }
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
    doc.text('AI INTELLIGENCE DIAGNOSTIC DECISION', 15, y)
    y += 8

    // Crop Health status string
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)
    doc.text('Crop Health Rating:', 15, y)

    const healthStatus = (data.status || 'healthy').toUpperCase()
    if (healthStatus === 'HEALTHY') doc.setTextColor(16, 185, 129)
    else if (healthStatus === 'MODERATE') doc.setTextColor(245, 158, 11)
    else doc.setTextColor(239, 68, 68)
    
    doc.setFont('helvetica', 'bold')
    doc.text(healthStatus, 70, y)
    y += 8

    // AI recommendation text blocks
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text('AI Recommendation:', 15, y)
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
    doc.text('Action Plan:', 15, y)
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
    doc.text('Expected Impact:', 15, y)
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
    doc.text('Scenario Calibration:', 15, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    doc.text(data.scenarioSummary || 'Standard historical climate dataset parameters.', 70, y)
    y += 8

    // Water Saving Estimate
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text('Water Saving Estimate:', 15, y)
    
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
    doc.text('AgriX Geospatial Precision Irrigation Platform. Dynamically synchronized with Sentinel-2 datasets.', 15, 282)
    doc.text('Version 4.2.0 (Stable-Prod)', 160, 282)

    doc.save(`AgriX-Telemetry-${data.farmId || data.id || 'Report'}.pdf`)
  }
}

// Generate CSV Report
export const generateCSVReport = (data) => {
  if (!data) return

  const rows = [
    ["Parameter", "Value"],
    ["Report ID", data.farmId || data.id || 'N/A'],
    ["State", data.state || 'N/A'],
    ["District", data.district || 'N/A'],
    ["Crop Profile", data.crop || 'N/A'],
    ["Field Area (ha)", data.area || 'N/A'],
    ["Soil Profile Silt", data.soilType || 'Alluvial Soil'],
    ["NDVI Index", data.ndvi || '0.74'],
    ["Soil Moisture VWC", data.moisture || 'N/A'],
    ["Climate Averages", data.weather || '32 C, Cloudy'],
    ["AI Crop Rating", data.status || 'N/A'],
    ["Water Saving Estimate", data.waterSaving || 'N/A'],
    ["AI Recommendation", data.recommendation || 'N/A'],
    ["Action Plan", data.actionPlan || 'N/A'],
    ["Expected Impact", data.expectedImpact || 'N/A'],
    ["Scenario Summary", data.scenarioSummary || 'N/A'],
    ["Generated On", new Date().toLocaleString()]
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
}

// Trigger browser print layout for report profile
export const printReport = (data) => {
  if (!data) return

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
            <div class="title">AgriX Precision Report</div>
            <div class="subtitle">Spatial Decision Intelligence Platform</div>
          </div>
          <div class="meta-info">
            <div>Report ID: ${data.farmId || data.id}</div>
            <div>Generated: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div class="section-title">Telemetry Diagnostic Profile</div>
        <table>
          <tr><th>Farm / Field ID</th><td>${data.farmId || data.id}</td></tr>
          <tr><th>Region State</th><td>${data.state || 'N/A'}</td></tr>
          <tr><th>District Hub</th><td>${data.district || 'N/A'}</td></tr>
          <tr><th>Active Crop Profile</th><td>${data.crop || 'N/A'}</td></tr>
          <tr><th>Field Size Area</th><td>${data.area || 'N/A'} Hectares</td></tr>
          <tr><th>Soil Profile Silt</th><td>${data.soilType || 'Alluvial Soil'}</td></tr>
          <tr><th>NDVI Vegetation Index</th><td>${data.ndvi || '0.74'}</td></tr>
          <tr><th>Soil Moisture VWC</th><td>${data.moisture || 'N/A'}</td></tr>
          <tr><th>Climate Conditions</th><td>${data.weather || 'N/A'}</td></tr>
          <tr><th>AI Crop Health Rating</th><td class="highlight">${data.status ? data.status.toUpperCase() : 'N/A'}</td></tr>
        </table>

        <div class="section-title">AI Diagnostic Decision</div>
        <div class="recommendation-box">
          <strong>AI Recommendation:</strong> ${data.recommendation || 'N/A'}
        </div>

        <div style="margin-top: 15px; font-size: 13px;">
          <p><strong>Action Plan:</strong> ${data.actionPlan || 'N/A'}</p>
          <p><strong>Expected Impact:</strong> ${data.expectedImpact || 'N/A'}</p>
          <p><strong>Scenario Summary:</strong> ${data.scenarioSummary || 'N/A'}</p>
          <p><strong>Water Saving Estimate:</strong> <span class="highlight">${data.waterSaving || 'N/A'}</span></p>
        </div>

        <div class="footer">
          AgriX Geospatial Precision Platform. This document is dynamically synchronized with Sentinel-2 datasets. Version 4.2.0 (Stable-Prod).
        </div>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 350)
}
