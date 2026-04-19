import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TweaksProvider } from './context/TweaksContext.jsx'
import { AudioPlayerProvider } from './context/AudioPlayerContext.jsx'
import Home from './pages/Home.jsx'
import Roster from './pages/Roster.jsx'
import Releases from './pages/Releases.jsx'
import About from './pages/About.jsx'
import Events from './pages/Events.jsx'
import Journal from './pages/Journal.jsx'
import Shop from './pages/Shop.jsx'
import Contact from './pages/Contact.jsx'
import Project from './pages/Project.jsx'
import GlitchLayers from './components/GlitchLayers.jsx'
import TweaksPanel from './components/TweaksPanel.jsx'
import GlitchTick from './components/GlitchTick.jsx'

export default function App() {
  return (
    <BrowserRouter basename="/oi-website">
      <TweaksProvider>
        <AudioPlayerProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <GlitchLayers />
        <GlitchTick />
        <TweaksPanel />
        </AudioPlayerProvider>
      </TweaksProvider>
    </BrowserRouter>
  )
}
