import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SPRING_04, SPRING_06, SPRING_08 } from './lib/spring'
import './fonts.css'
import './index.css'

const r = document.documentElement.style
r.setProperty('--spring-04', SPRING_04)
r.setProperty('--spring-06', SPRING_06)
r.setProperty('--spring-08', SPRING_08)

createRoot(document.getElementById('root')).render(<App />)
