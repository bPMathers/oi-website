import { createContext, useContext, useRef, useState, useEffect, useCallback, useMemo } from 'react'

const BASE = import.meta.env.BASE_URL || '/'
const AUDIO_FILES = [
  `${BASE}JDEM-CALQ-2025-Extrait1.mp3`,
  `${BASE}JDEM-CALQ-2025-Extrait3.mp3`,
  `${BASE}JDEM-CALQ-2025-Extrait4.mp3`,
]

/** Deterministic-ish pick so the same instance always gets the same file within a session */
function pickFile(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return AUDIO_FILES[Math.abs(h) % AUDIO_FILES.length]
}

const AudioPlayerContext = createContext(null)

/**
 * Global provider — owns a single <Audio> element.
 * Each instance ID is assigned a random file. When an instance becomes active,
 * the Audio element loads its file. Peaks are decoded per-file and cached.
 */
export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [activeId, setActiveId] = useState(null)
  const activeSrcRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const peaksCacheRef = useRef({})                   // src → Float32Array
  const durationsCacheRef = useRef({})               // src → seconds
  const [peaksForActive, setPeaksForActive] = useState(null)
  const [fileDurations, setFileDurations] = useState({})  // triggers re-render when durations load
  const instanceSrcMap = useRef({})                  // id → src

  // Create Audio element once
  useEffect(() => {
    const el = new Audio()
    el.preload = 'metadata'
    el.crossOrigin = 'anonymous'
    audioRef.current = el

    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => setDuration(el.duration)
    const onEnded = () => { setPlaying(false); setCurrentTime(0) }

    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('ended', onEnded)

    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('ended', onEnded)
      el.pause()
    }
  }, [])

  // Decode peaks for a source and cache them
  const decodePeaks = useCallback(async (src) => {
    if (peaksCacheRef.current[src]) return peaksCacheRef.current[src]
    try {
      const resp = await fetch(src)
      const buf = await resp.arrayBuffer()
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const audio = await ctx.decodeAudioData(buf)
      const raw = audio.getChannelData(0)
      const buckets = 200
      const step = Math.floor(raw.length / buckets)
      const out = new Float32Array(buckets)
      let max = 0
      for (let i = 0; i < buckets; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) sum += Math.abs(raw[i * step + j])
        out[i] = sum / step
        if (out[i] > max) max = out[i]
      }
      if (max > 0) for (let i = 0; i < buckets; i++) out[i] /= max
      ctx.close()
      peaksCacheRef.current[src] = out
      // Cache duration from the decoded buffer
      if (!durationsCacheRef.current[src]) {
        durationsCacheRef.current[src] = audio.duration
        setFileDurations(prev => ({ ...prev, [src]: audio.duration }))
      }
      return out
    } catch {
      return null
    }
  }, [])

  // Pre-decode peaks for all files on mount
  useEffect(() => {
    AUDIO_FILES.forEach(src => {
      decodePeaks(src)
    })
  }, [decodePeaks])

  /** Resolve (or assign) a file for an instance ID */
  const getSrcForId = useCallback((id) => {
    if (!instanceSrcMap.current[id]) {
      instanceSrcMap.current[id] = pickFile(id)
    }
    return instanceSrcMap.current[id]
  }, [])

  /** Load a source into the Audio element if not already loaded */
  const loadSrc = useCallback((src) => {
    const el = audioRef.current
    if (!el) return
    if (activeSrcRef.current !== src) {
      el.src = src
      el.load()
      activeSrcRef.current = src
    }
  }, [])

  const playInstance = useCallback((id) => {
    const src = getSrcForId(id)
    const el = audioRef.current
    if (!el) return
    if (activeId !== id) {
      loadSrc(src)
      el.currentTime = 0
      setCurrentTime(0)
    }
    setActiveId(id)
    setPeaksForActive(peaksCacheRef.current[src] || null)
    el.play()
    setPlaying(true)
    // Async update peaks if not cached yet
    decodePeaks(src).then(p => { if (p) setPeaksForActive(p) })
  }, [activeId, getSrcForId, loadSrc, decodePeaks])

  const pauseInstance = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  const toggleInstance = useCallback((id) => {
    const src = getSrcForId(id)
    const el = audioRef.current
    if (!el) return
    if (activeId === id && !el.paused) {
      el.pause()
      setPlaying(false)
    } else {
      if (activeId !== id) {
        loadSrc(src)
        el.currentTime = 0
        setCurrentTime(0)
      }
      setActiveId(id)
      setPeaksForActive(peaksCacheRef.current[src] || null)
      el.play()
      setPlaying(true)
      decodePeaks(src).then(p => { if (p) setPeaksForActive(p) })
    }
  }, [activeId, getSrcForId, loadSrc, decodePeaks])

  const seek = useCallback((fraction) => {
    const el = audioRef.current
    if (!el || !el.duration) return
    el.currentTime = fraction * el.duration
    setCurrentTime(el.currentTime)
  }, [])

  const restart = useCallback((id) => {
    const src = getSrcForId(id)
    const el = audioRef.current
    if (!el) return
    loadSrc(src)
    setActiveId(id)
    setPeaksForActive(peaksCacheRef.current[src] || null)
    el.currentTime = 0
    setCurrentTime(0)
    el.play()
    setPlaying(true)
    decodePeaks(src).then(p => { if (p) setPeaksForActive(p) })
  }, [getSrcForId, loadSrc, decodePeaks])

  /** Switch to the next audio file for a given instance */
  const nextTrack = useCallback((id) => {
    const currentSrc = getSrcForId(id)
    const idx = AUDIO_FILES.indexOf(currentSrc)
    const nextIdx = (idx + 1) % AUDIO_FILES.length
    const nextSrc = AUDIO_FILES[nextIdx]
    instanceSrcMap.current[id] = nextSrc
    const el = audioRef.current
    if (!el) return
    loadSrc(nextSrc)
    setActiveId(id)
    setPeaksForActive(peaksCacheRef.current[nextSrc] || null)
    el.currentTime = 0
    setCurrentTime(0)
    el.play()
    setPlaying(true)
    decodePeaks(nextSrc).then(p => { if (p) setPeaksForActive(p) })
  }, [getSrcForId, loadSrc, decodePeaks])

  /** Switch to the previous audio file for a given instance */
  const prevTrack = useCallback((id) => {
    const currentSrc = getSrcForId(id)
    const idx = AUDIO_FILES.indexOf(currentSrc)
    const prevIdx = (idx - 1 + AUDIO_FILES.length) % AUDIO_FILES.length
    const prevSrc = AUDIO_FILES[prevIdx]
    instanceSrcMap.current[id] = prevSrc
    const el = audioRef.current
    if (!el) return
    loadSrc(prevSrc)
    setActiveId(id)
    setPeaksForActive(peaksCacheRef.current[prevSrc] || null)
    el.currentTime = 0
    setCurrentTime(0)
    el.play()
    setPlaying(true)
    decodePeaks(prevSrc).then(p => { if (p) setPeaksForActive(p) })
  }, [getSrcForId, loadSrc, decodePeaks])

  /** Get peaks for any instance (active or not) — used by Waveform */
  const getPeaksForId = useCallback((id) => {
    const src = getSrcForId(id)
    return peaksCacheRef.current[src] || null
  }, [getSrcForId])

  /** Get file duration for any instance — available as soon as decode completes */
  const getDurationForId = useCallback((id) => {
    const src = getSrcForId(id)
    return durationsCacheRef.current[src] || 0
  }, [getSrcForId])

  const value = useMemo(() => ({
    activeId, playing, currentTime, duration, peaksForActive, fileDurations,
    playInstance, pauseInstance, toggleInstance, seek, restart,
    nextTrack, prevTrack,
    getPeaksForId, getSrcForId, getDurationForId,
  }), [activeId, playing, currentTime, duration, peaksForActive, fileDurations,
    playInstance, pauseInstance, toggleInstance, seek, restart,
    nextTrack, prevTrack,
    getPeaksForId, getSrcForId, getDurationForId])

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

/**
 * Hook for a specific player instance.
 * @param {string} id — unique identifier for this player instance
 */
export function useAudioPlayer(id) {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider')

  const isActive = ctx.activeId === id
  const instancePlaying = isActive && ctx.playing

  // Get peaks: use active peaks if this is the active instance, else from cache
  const peaks = isActive ? ctx.peaksForActive : ctx.getPeaksForId(id)

  const toggle = useCallback(() => ctx.toggleInstance(id), [ctx, id])
  const play = useCallback(() => ctx.playInstance(id), [ctx, id])
  const pause = useCallback(() => ctx.pauseInstance(), [ctx])
  const restart = useCallback(() => ctx.restart(id), [ctx, id])
  const next = useCallback(() => ctx.nextTrack(id), [ctx, id])
  const prev = useCallback(() => ctx.prevTrack(id), [ctx, id])

  return {
    playing: instancePlaying,
    currentTime: isActive ? ctx.currentTime : 0,
    duration: isActive ? ctx.duration : ctx.getDurationForId(id),
    peaks,
    seek: ctx.seek,
    toggle,
    play,
    pause,
    restart,
    next,
    prev,
  }
}
