"use client"

import { ArrowUp, Mic, MicOff, Volume2, VolumeX, Plus, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { SentientSphere } from "@/components/sentient-sphere"
import { voiceLevel } from "@/lib/voice-level"
import ReactMarkdown from "react-markdown"

type Msg = { id: string; role: "user" | "assistant"; content: string }

const QUICK = [
  "What does the GM in your name stand for?",
  "Walk me through the governed loop.",
  "What is F.A.M. grounding?",
]

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function ChatArea() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speakOn, setSpeakOn] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Feed the playing audio's amplitude into the shared level the sphere reads.
  function startMeter(a: HTMLAudioElement) {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
      if (!AC) return
      if (!ctxRef.current) ctxRef.current = new AC()
      const ctx = ctxRef.current
      void ctx.resume?.()
      const src = ctx.createMediaElementSource(a)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      analyser.connect(ctx.destination)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        voiceLevel.value = Math.min(1, Math.sqrt(sum / data.length) * 2.4)
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      // Web Audio unavailable or element already sourced — skip reactivity, audio still plays.
    }
  }

  function stopMeter() {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    voiceLevel.value = 0
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    stopMeter()
    setPlayingId(null)
  }

  // Gesture-tied playback: called from a click (reliable) or best-effort after a stream.
  async function speak(text: string, id: string) {
    try {
      if (playingId === id) {
        stopAudio()
        return
      }
      stopAudio()
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok || res.status === 204) return // no key / unavailable → stay silent
      const blob = await res.blob()
      if (!blob.size) return
      const a = new Audio(URL.createObjectURL(blob))
      audioRef.current = a
      a.onended = () => {
        stopMeter()
        setPlayingId((cur) => (cur === id ? null : cur))
      }
      setPlayingId(id)
      startMeter(a)
      await a.play().catch(() => {
        stopMeter()
        setPlayingId(null)
      })
    } catch {
      setPlayingId(null)
    }
  }

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next = [...messages, { id: uid(), role: "user" as const, content }]
    setMessages(next)
    setInput("")
    if (taRef.current) taRef.current.style.height = "auto"
    setLoading(true)
    const asstId = uid()
    setMessages((m) => [...m, { id: asstId, role: "assistant", content: "" }])
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      })
      if (!res.body) throw new Error("no stream")
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let acc = ""
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value, { stream: true })
        acc += chunk
        setMessages((m) => m.map((mm) => (mm.id === asstId ? { ...mm, content: mm.content + chunk } : mm)))
      }
      if (speakOn && acc.trim()) speak(acc, asstId) // best-effort autoplay; tap the ▶ to be sure
    } catch {
      setMessages((m) =>
        m.map((mm) => (mm.id === asstId ? { ...mm, content: "GM Louis is unreachable right now." } : mm)),
      )
    } finally {
      setLoading(false)
    }
  }

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert("Voice input needs Chrome or Edge.")
      return
    }
    const rec = new SR()
    rec.lang = "en-US"
    rec.interimResults = false
    rec.maxAlternatives = 1
    setListening(true)
    rec.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript || ""
      if (t) send(t)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.start()
  }

  const empty = messages.length === 0

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Sentient sphere — the living centerpiece, behind everything */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 flex items-center justify-center transition-opacity duration-700 ${
          empty ? "opacity-90" : "opacity-30"
        }`}
      >
        <div className="aspect-square w-[min(86vw,640px)]">
          <SentientSphere />
        </div>
      </div>
      {/* legibility scrim */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,0.7)_100%)]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl tracking-tight">GM Louis</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:inline">
            Agentic Governance Management
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-accent/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent sm:inline-block">
            governed · cited
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={speakOn ? "Mute GM Louis" : "Unmute GM Louis"}
            onClick={() => {
              setSpeakOn((v) => !v)
              stopAudio()
            }}
          >
            {speakOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          {!empty && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              onClick={() => {
                stopAudio()
                setMessages([])
              }}
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex flex-1 flex-col items-center overflow-hidden">
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="fade-in-up mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent/90">
              Agentic Governance Management
            </p>
            <h1
              className="fade-in-up font-display text-4xl font-medium tracking-tight sm:text-5xl md:text-7xl"
              style={{ animationDelay: "0.05s" }}
            >
              I&rsquo;m GM Louis.
            </h1>
            <p
              className="fade-in-up mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.12s" }}
            >
              The <span className="text-foreground">GM</span> is for{" "}
              <span className="text-foreground">Governance Management</span> — I practice{" "}
              <span className="text-foreground">agentic governance management</span>: an enterprise operations
              agent that runs under the Compass-BlackBox IQ contract, reasoning over Microsoft&rsquo;s F.A.M.
              grounding and logging every decision to a vault the human owns.
            </p>
            <div className="fade-in-up mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.2s" }}>
              {QUICK.map((q) => (
                <button
                  key={q}
                  data-cursor-hover
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-background/40 px-4 py-2 font-mono text-xs tracking-wide text-foreground/80 backdrop-blur-sm transition-colors hover:border-accent/60 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-secondary/70 px-4 py-3 text-foreground backdrop-blur-sm"
                        : "rounded-2xl rounded-bl-sm border border-border/60 bg-background/55 px-4 py-3 text-foreground/90 backdrop-blur-md"
                    }`}
                  >
                    {m.content ? (
                      m.role === "assistant" ? (
                        <div className="group">
                          <div className="text-[15px] leading-relaxed [&_code]:rounded [&_code]:bg-black/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-accent [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              data-cursor-hover
                              onClick={() => speak(m.content, m.id)}
                              aria-label={playingId === m.id ? "Stop" : "Play GM Louis' voice"}
                              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
                            >
                              {playingId === m.id ? (
                                <>
                                  <Square className="h-3 w-3 fill-current" />
                                  <span className="flex items-end gap-[2px] h-4">
                                    <span className="eq-bar" style={{ animationDelay: "0s" }} />
                                    <span className="eq-bar" style={{ animationDelay: "0.15s" }} />
                                    <span className="eq-bar" style={{ animationDelay: "0.3s" }} />
                                    <span className="eq-bar" style={{ animationDelay: "0.45s" }} />
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3.5 w-3.5" />
                                  speak
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        m.content
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                        reasoning
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>
        )}

        {/* Input — lifted off the bottom so it tucks under the sphere */}
        <div className="w-full max-w-3xl px-4 pb-12 md:px-6 md:pb-24">
          <div className="rounded-2xl border border-border bg-background/60 p-3 backdrop-blur-xl transition-colors focus-within:border-accent/50">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                const el = e.target
                el.style.height = "auto"
                el.style.height = Math.min(el.scrollHeight, 160) + "px"
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Ask GM Louis…"
              rows={1}
              className="max-h-40 min-h-[40px] w-full resize-none border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                F.A.M. grounded · vault-logged
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 ${listening ? "text-destructive" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="Voice input"
                  onClick={startListening}
                >
                  {listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  disabled={loading || !input.trim()}
                  onClick={() => send(input)}
                  className="h-9 w-9 rounded-full bg-accent text-accent-foreground shadow-lg transition-colors hover:bg-accent/85 disabled:opacity-40"
                  aria-label="Send"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Agents propose · humans promote — grounding is rented, memory is owned
          </p>
        </div>
      </div>
    </main>
  )
}
