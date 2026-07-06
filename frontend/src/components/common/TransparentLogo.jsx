import React, { useState, useEffect } from 'react'

const TransparentLogo = ({ src, className, alt = "AgriX Logo" }) => {
  const [processedSrc, setProcessedSrc] = useState(src)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      
      // Loop through all pixels and make near-white pixels transparent,
      // and dark blue text pixels light slate-100 white for dark mode contrast.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i+1]
        const b = data[i+2]
        
        // 1. Make near-white background transparent
        if (r > 230 && g > 230 && b > 230) {
          data[i+3] = 0 // Alpha = 0
          continue
        }
        
        // 2. Recolor dark text to high-contrast white
        // Filter out green pixels (leaves) by checking if Green is dominant
        const isGreen = (g > r + 20) && (g > b + 20)
        
        if (!isGreen && r < 90 && g < 110 && b < 140) {
          data[i] = 241   // R
          data[i+1] = 245 // G
          data[i+2] = 249 // B
        }
      }
      
      ctx.putImageData(imgData, 0, 0)
      setProcessedSrc(canvas.toDataURL('image/png'))
    }
  }, [src])

  return (
    <img 
      src={processedSrc} 
      className={`${className} transition-opacity duration-300`} 
      alt={alt} 
    />
  )
}

export default TransparentLogo
