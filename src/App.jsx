import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import SearchModal from './components/SearchModal'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Story from './components/Story'
import ScrollReveal from './components/ScrollReveal'
import BackgroundMusic from './components/BackgroundMusic'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  return (
    <Router>
      <CartProvider>
        <SearchProvider>
          <div className="app">
            <ScrollToTop />
            <ScrollReveal />
            <Navbar />
            <SearchModal />
            <CartDrawer />
            <BackgroundMusic />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/our-story" element={<Story />} />
              <Route path="*" element={<Story />} />
            </Routes>
          </div>
        </SearchProvider>
      </CartProvider>
    </Router>
  )
}

export default App
