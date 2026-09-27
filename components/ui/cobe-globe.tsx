"use client"

import { useCallback, useEffect, useRef } from "react"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"
import createGlobe from "cobe"

export interface GlobeMarker {
  id: string
  location: [number, number]
  label: string
  labelOffset?: [number, number]
}

export interface GlobeArc {
  id: string
  from: [number, number]
  to: [number, number]
  label?: string
  color?: [number, number, number]
  active?: boolean
}

interface GlobeProps {
  markers?: GlobeMarker[]
  arcs?: GlobeArc[]
  className?: string
  markerColor?: [number, number, number]
  baseColor?: [number, number, number]
  arcColor?: [number, number, number]
  glowColor?: [number, number, number]
  dark?: number
  mapBrightness?: number
  markerSize?: number
  markerElevation?: number
  arcWidth?: number
  arcHeight?: number
  speed?: number
  theta?: number
  scale?: number
  diffuse?: number
  mapPointCount?: number
}

function greatCirclePosition(
  from: [number, number],
  to: [number, number],
  progress: number,
): [number, number] {
  const radians = Math.PI / 180
  const [lat1, lon1] = from.map((value) => value * radians)
  const [lat2, lon2] = to.map((value) => value * radians)
  const start = [
    Math.cos(lat1) * Math.cos(lon1),
    Math.cos(lat1) * Math.sin(lon1),
    Math.sin(lat1),
  ]
  const end = [
    Math.cos(lat2) * Math.cos(lon2),
    Math.cos(lat2) * Math.sin(lon2),
    Math.sin(lat2),
  ]
  const dot = Math.max(-1, Math.min(1, start.reduce((sum, value, i) => sum + value * end[i], 0)))
  const angle = Math.acos(dot)
  if (angle < 0.000001) return from

  const sinAngle = Math.sin(angle)
  const a = Math.sin((1 - progress) * angle) / sinAngle
  const b = Math.sin(progress * angle) / sinAngle
  const point = start.map((value, i) => value * a + end[i] * b)
  const latitude = Math.atan2(point[2], Math.hypot(point[0], point[1])) / radians
  const longitude = Math.atan2(point[1], point[0]) / radians
  return [latitude, longitude]
}

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.94, 0.95, 0.97],
  baseColor = [0.28, 0.29, 0.3],
  arcColor = [0.82, 0.85, 0.88],
  glowColor = [0.86, 0.88, 0.9],
  dark = 1,
  mapBrightness = 6,
  markerSize = 0.032,
  markerElevation = 0.02,
  arcWidth = 0.55,
  arcHeight = 0.24,
  speed = 0.00065,
  theta = 0.2,
  scale = 1.22,
  diffuse = 1.2,
  mapPointCount = 16000,
}: GlobeProps) {
  const dataRef = useRef({ markers, arcs })
  dataRef.current = { markers, arcs }
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const origin = pointerInteracting.current
    if (!origin) return

    dragOffset.current = {
      phi: (event.clientX - origin.x) / 300,
      theta: (event.clientY - origin.y) / 1000,
    }

    const now = Date.now()
    if (lastPointer.current) {
      const elapsed = Math.max(now - lastPointer.current.t, 1)
      const maxVelocity = 0.15
      velocity.current = {
        phi: Math.max(-maxVelocity, Math.min(maxVelocity, ((event.clientX - lastPointer.current.x) / elapsed) * 0.3)),
        theta: Math.max(-maxVelocity, Math.min(maxVelocity, ((event.clientY - lastPointer.current.y) / elapsed) * 0.08)),
      }
    }
    lastPointer.current = { x: event.clientX, y: event.clientY, t: now }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId = 0
    let currentWidth = 0
    let phi = -0.35
    let previousFrame = 0
    let flightProgress = 0.58

    const draw = (frameTime: number) => {
      if (!globe) return
      const elapsed = previousFrame ? Math.min(frameTime - previousFrame, 48) : 16.67
      previousFrame = frameTime

      if (!isPausedRef.current && !reducedMotion) {
        phi += speed * (elapsed / 16.67)
        flightProgress = (flightProgress + elapsed / 11000) % 1
        if (Math.abs(velocity.current.phi) > 0.0001 || Math.abs(velocity.current.theta) > 0.0001) {
          phiOffsetRef.current += velocity.current.phi
          thetaOffsetRef.current += velocity.current.theta
          velocity.current.phi *= 0.95
          velocity.current.theta *= 0.95
        }
        const thetaMin = -0.4
        const thetaMax = 0.4
        if (thetaOffsetRef.current < thetaMin) thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
        else if (thetaOffsetRef.current > thetaMax) thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
      }

      const pulse = reducedMotion ? 0.5 : 0.5 + Math.sin(frameTime / 940) * 0.5
      const silverLift = 0.86 + pulse * 0.14
      const currentMarkers = dataRef.current.markers
      const currentArcs = dataRef.current.arcs
      const airportMarkers = currentMarkers.map((marker) => ({
        location: marker.location,
        size: markerSize,
        id: marker.id,
      }))
      const activeLeg = currentArcs.find((arc) => arc.active) ?? currentArcs[0]
      const routeGlow = activeLeg?.color ?? arcColor
      const colorChannels = routeGlow.map((channel) => Math.round(channel * 255))
      canvas.style.filter = `drop-shadow(0 0 ${5 + pulse * 5}px rgba(${colorChannels.join(",")}, ${0.1 + pulse * 0.12}))`
      const movingMarkers = currentArcs.filter((arc) => arc.active).map((arc, index) => {
        const progress = (flightProgress + index * 0.38) % 1
        const color = arc.color ?? routeGlow
        return {
          location: greatCirclePosition(arc.from, arc.to, progress),
          size: markerSize * (1.18 + pulse * 0.62),
          color: color.map((channel) => Math.min(1, channel * (0.96 + pulse * 0.16))) as [number, number, number],
        }
      })

      const routeLines = currentArcs.flatMap((arc, index) => {
        const progress = (flightProgress + index * 0.38) % 1
        const basePulse = (arc.active ? 0.9 : 0.82) + Math.sin(frameTime / 710 + index * 1.3) * 0.08
        const baseStrength = arc.active ? 0.66 : 0.5
        const glintStrength = arc.active ? 1.02 + pulse * 0.12 : 0.82 + pulse * 0.1
        const baseColor = arc.color?.map((channel) => channel * basePulse * baseStrength) as [number, number, number] | undefined
        const glintColor = arc.color?.map((channel) => Math.min(1, channel * glintStrength)) as [number, number, number] | undefined
        const glintEnd = Math.min(progress + (arc.active ? 0.075 : 0.055), 1)

        return [
          { from: arc.from, to: arc.to, id: `${arc.id}-base`, color: baseColor },
          {
            from: greatCirclePosition(arc.from, arc.to, progress),
            to: greatCirclePosition(arc.from, arc.to, glintEnd),
            id: `${arc.id}-glint`,
            color: glintColor,
          },
        ]
      })

      globe.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
        scale,
        dark,
        mapBrightness,
        markerColor,
        baseColor,
        arcColor: [arcColor[0] * silverLift, arcColor[1] * silverLift, arcColor[2] * silverLift],
        glowColor: routeGlow.map((channel) => Math.min(1, channel * (0.86 + pulse * 0.14))) as [number, number, number],
        arcWidth: arcWidth * (0.82 + pulse * 0.56),
        arcHeight,
        markerElevation,
        markers: [...airportMarkers, ...movingMarkers],
        arcs: routeLines,
      })
      animationId = requestAnimationFrame(draw)
    }

    const initialize = (width: number) => {
      if (width < 1 || !canvas) return
      if (globe && Math.abs(width - currentWidth) < 2) return
      if (globe) {
        cancelAnimationFrame(animationId)
        globe.destroy()
        globe = null
      }
      currentWidth = width
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width,
          height: width,
          phi,
          theta,
          scale,
          dark,
          diffuse,
          mapSamples: mapPointCount,
          mapBrightness,
          baseColor,
          markerColor,
          glowColor,
          markerElevation,
          markers: dataRef.current.markers.map((marker) => ({
            location: marker.location,
            size: markerSize,
            id: marker.id,
          })),
          arcs: dataRef.current.arcs.map((arc) => ({ from: arc.from, to: arc.to, id: arc.id })),
          arcColor,
          arcWidth,
          arcHeight,
          opacity: 0.96,
        })
        canvas.removeAttribute("data-globe-error")
        canvas.style.opacity = "1"
        animationId = requestAnimationFrame(draw)
      } catch {
        canvas.setAttribute("data-globe-error", "true")
      }
    }

    const observer = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0]?.contentRect.width ?? 0)
      initialize(width)
    })
    observer.observe(canvas)
    initialize(Math.floor(canvas.getBoundingClientRect().width))

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationId)
      globe?.destroy()
    }
  }, [markerColor, baseColor, arcColor, glowColor, dark, mapBrightness, markerSize, markerElevation, arcWidth, arcHeight, speed, theta, scale, diffuse, mapPointCount])

  return (
    <div className={`cobe-globe ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive globe. Route connections update automatically."
        onPointerDown={handlePointerDown}
        style={{ width: "100%", height: "100%", cursor: "grab", opacity: 0, filter: "drop-shadow(0 0 8px rgba(190, 211, 238, .2))", transition: "opacity 1.2s ease, filter .5s ease", borderRadius: "50%", touchAction: "none" }}
      />
      {markers.filter((marker) => marker.label).map((marker) => (
        <div
          key={marker.id}
          className="cobe-globe-label"
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${marker.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: `calc(-50% + ${marker.labelOffset?.[0] ?? 0}px) ${marker.labelOffset?.[1] ?? 0}px`,
            marginBottom: 9,
            padding: "5px 9px",
            background: "rgba(10, 11, 12, .9)",
            color: "#f1f2f3",
            fontSize: "9px",
            letterSpacing: ".065em",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: `var(--cobe-visible-${marker.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 7px))`,
            transition: "opacity .7s, filter .7s",
          } as CSSProperties}
        >
          {marker.label}
        </div>
      ))}
      {arcs.filter((arc) => arc.label).map((arc) => (
        <div
          key={arc.id}
          className="cobe-globe-label cobe-globe-arc-label"
          style={{
            position: "absolute",
            positionAnchor: `--cobe-arc-${arc.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 6,
            padding: "3px 7px",
            background: "rgba(232, 234, 236, .94)",
            color: "#17191b",
            fontSize: "7px",
            letterSpacing: ".04em",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: `var(--cobe-visible-arc-${arc.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-arc-${arc.id}, 0)) * 7px))`,
            transition: "opacity .7s, filter .7s",
          } as CSSProperties}
        >
          {arc.label}
        </div>
      ))}
    </div>
  )
}
