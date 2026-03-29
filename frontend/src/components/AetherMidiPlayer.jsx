import React, { useEffect, useRef, useState } from 'react'
import MidiPlayer from 'midi-player-js'
import Soundfont from 'soundfont-player'
import { Play, Square, Download, Activity, Disc3 } from 'lucide-react'

export function AetherMidiPlayer({ midiBase64, onNoteOn, onNoteOff, onAudioData, instrumentName = 'acoustic_grand_piano', reverbLevel = 0, delayLevel = 0, filterCutoff = 20000 }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const Player = useRef(null)
    const instrumentLead = useRef(null)
    const instrumentBass = useRef(null)
    const analyser = useRef(null)
    const dataArray = useRef(null)
    const animationRef = useRef(null)

    // Recording state refs
    const mediaRecorder = useRef(null)
    const audioChunks = useRef([])
    const destNode = useRef(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recordedUrl, setRecordedUrl] = useState(null)

    // FX Node Refs for live updating
    const reverbGainRef = useRef(null)
    const echoGainRef = useRef(null)
    const filterNodeRef = useRef(null)

    useEffect(() => {
        let active = true;
        const AudioContext = window.AudioContext || window.webkitAudioContext
        const ac = new AudioContext()

        // Create Master FX Chain Nodes
        const masterGain = ac.createGain()
        masterGain.connect(ac.destination)

        // WebAudio recording destination node
        destNode.current = ac.createMediaStreamDestination()
        masterGain.connect(destNode.current)

        // Initialize MediaRecorder wrapper over our synthesized stream
        try {
            mediaRecorder.current = new MediaRecorder(destNode.current.stream, { mimeType: 'audio/webm' })
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.current.push(e.data)
            }
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
                const url = URL.createObjectURL(audioBlob)
                setRecordedUrl(url)
            }
        } catch (e) { console.error("MediaRecorder init failed", e) }

        // Setup the FFT Analyser for Visual Equalizer
        analyser.current = ac.createAnalyser()
        analyser.current.fftSize = 64 // 32 frequency bins
        dataArray.current = new Uint8Array(analyser.current.frequencyBinCount)
        masterGain.connect(analyser.current)

        // Biquad Filter Node
        filterNodeRef.current = ac.createBiquadFilter()
        filterNodeRef.current.type = 'lowpass'
        filterNodeRef.current.frequency.value = filterCutoff
        filterNodeRef.current.connect(masterGain)

        const delayNode = ac.createDelay(5.0)
        const delayFeedback = ac.createGain()
        delayNode.delayTime.value = 0.4 // 400ms echo
        delayNode.connect(delayFeedback)
        delayFeedback.connect(delayNode)
        delayNode.connect(filterNodeRef.current)

        // Super simple impulse response synthesis for Reverb Convolver
        const convolver = ac.createConvolver()
        const length = ac.sampleRate * 2.5 // 2sec decay
        const impulse = ac.createBuffer(2, length, ac.sampleRate)
        for (let i = 0; i < 2; i++) {
            const channel = impulse.getChannelData(i)
            for (let j = 0; j < length; j++)
                channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 3)
        }
        convolver.buffer = impulse
        convolver.connect(filterNodeRef.current)

        // Wet/Dry FX Mixs
        reverbGainRef.current = ac.createGain()
        reverbGainRef.current.gain.value = reverbLevel
        reverbGainRef.current.connect(convolver)

        echoGainRef.current = ac.createGain()
        echoGainRef.current.gain.value = delayLevel
        echoGainRef.current.connect(delayNode)

        // Load Both Instruments
        Promise.all([
            Soundfont.instrument(ac, instrumentName, { destination: filterNodeRef.current }),
            Soundfont.instrument(ac, 'electric_bass_finger', { destination: filterNodeRef.current })
        ]).then(([leadInst, bassInst]) => {
            if (!active) return;
            instrumentLead.current = leadInst
            instrumentBass.current = bassInst

            // Stop previous player if exists
            if (Player.current) Player.current.stop();

            Player.current = new MidiPlayer.Player(function (event) {
                if (event.name === 'Note on' && event.velocity > 0) {
                    let audioNode = null;

                    // Track 2 is index 1 (Bass)
                    if (event.track === 2) {
                        audioNode = bassInst.play(event.noteName, ac.currentTime, { gain: event.velocity / 100 })
                    } else {
                        audioNode = leadInst.play(event.noteName, ac.currentTime, { gain: event.velocity / 100 })
                    }

                    if (audioNode) {
                        // Route note output into our FX chains
                        audioNode.connect(reverbGainRef.current)
                        audioNode.connect(echoGainRef.current)
                    }
                    // Trigger Visual Feedback
                    if (onNoteOn) onNoteOn(event.noteNumber)
                } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
                    if (onNoteOff) onNoteOff(event.noteNumber)
                }
            })

            Player.current.on('playing', () => {
                setProgress(100 - Player.current.getTick() / Player.current.getTotalTicks() * 100)
            })

            Player.current.on('fileLoaded', () => {
                setProgress(0)
                setIsPlaying(false)
            })

            Player.current.on('endOfFile', () => {
                setIsPlaying(false)
                setProgress(0)
            })

            // If midi data was already loaded, reload it into the new player
            if (midiBase64) {
                try {
                    const cleanBase64 = midiBase64.replace(/^data:audio\/midi;base64,/, "")
                    Player.current.loadDataUri('data:audio/midi;base64,' + cleanBase64)
                } catch {
                    // Ignore parse errors on empty init
                }
            }
        })

        return () => {
            active = false;
            if (Player.current) Player.current.stop()
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [instrumentName])

    // Live update FX Nodes without disrupting the Audio Context
    useEffect(() => {
        if (reverbGainRef.current) reverbGainRef.current.gain.setTargetAtTime(reverbLevel, 0, 0.1)
        if (echoGainRef.current) echoGainRef.current.gain.setTargetAtTime(delayLevel, 0, 0.1)
        if (filterNodeRef.current) filterNodeRef.current.frequency.setTargetAtTime(filterCutoff, 0, 0.1)
    }, [reverbLevel, delayLevel, filterCutoff])

    // FFT Animation Loop to push data upwards to App.jsx
    useEffect(() => {
        const loop = () => {
            if (analyser.current && dataArray.current && isPlaying && onAudioData) {
                analyser.current.getByteFrequencyData(dataArray.current)
                onAudioData(Array.from(dataArray.current))
            }
            animationRef.current = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [isPlaying, onAudioData])

    // Load new MIDI data when it arrives
    useEffect(() => {
        if (midiBase64 && Player.current) {
            // midiBase64 should be a pure base64 string without data:audio/midi;base64, prefix for the player
            try {
                const cleanBase64 = midiBase64.replace(/^data:audio\/midi;base64,/, "")
                Player.current.loadDataUri('data:audio/midi;base64,' + cleanBase64)
            } catch (e) {
                console.error("Failed to load MIDI data into player", e)
            }
        }
    }, [midiBase64])

    const handlePlayPause = () => {
        if (!Player.current || !midiBase64) return

        if (isPlaying) {
            Player.current.pause()
            if (isRecording && mediaRecorder.current) {
                mediaRecorder.current.pause()
            }
        } else {
            Player.current.play()
            setRecordedUrl(null)
            if (isRecording && mediaRecorder.current) {
                if (mediaRecorder.current.state === "inactive") {
                    audioChunks.current = []
                    mediaRecorder.current.start()
                } else if (mediaRecorder.current.state === "paused") {
                    mediaRecorder.current.resume()
                }
            }
        }
        setIsPlaying(!isPlaying)
    }

    const handleStop = () => {
        if (!Player.current) return
        Player.current.stop()
        setIsPlaying(false)
        setProgress(0)

        // Stop recording and bounce file
        if (isRecording && mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
            mediaRecorder.current.stop()
            setIsRecording(false) // Toggle recording off automatically after bounce
        }
    }

    const handleToggleRecord = () => {
        setIsRecording(!isRecording)
        // Auto-Play if we press record while stopped
        if (!isPlaying && !isRecording) {
            handlePlayPause()
        }
    }

    return (
        <div className="aether-panel player-panel">
            <div className="player-header">
                <div className="status-group">
                    <Activity size={20} className={`status-icon ${isPlaying ? 'active pulsing' : ''}`} />
                    <span className="status-text">AUDIO SYNTHESIS</span>
                </div>
                <div className="player-timer">{Math.round(100 - progress)}%</div>
            </div>

            {/* Progress Track */}
            <div className="progress-track">
                <div 
                    className="progress-fill" 
                    style={{ width: `${100 - progress}%` }}
                ></div>
            </div>

            {/* Transport Controls */}
            <div className="transport-controls">

                {/* Direct Audio Capture (Bounce) */}
                <button
                    onClick={handleToggleRecord}
                    disabled={!midiBase64}
                    className={`transport-btn record-btn ${isRecording ? 'recording' : ''}`}
                    title="Direct Audio Capture (Bounce)"
                >
                    <Disc3 size={20} className={isRecording ? 'animate-spin' : ''} />
                    {isRecording && <div className="record-pulse"></div>}
                </button>

                <button
                    onClick={handleStop}
                    disabled={!midiBase64}
                    className="transport-btn stop-btn"
                    title="Stop Simulation"
                >
                    <Square size={20} fill="currentColor" />
                </button>

                <button
                    onClick={handlePlayPause}
                    disabled={!midiBase64}
                    className="aether-btn-primary play-pause-btn"
                    title={isPlaying ? 'Pause' : 'Initialize Playback'}
                >
                    <Play size={24} fill="currentColor" style={{ marginLeft: isPlaying ? '0' : '4px' }} />
                </button>

                <a
                    href={midiBase64 || '#'}
                    download="Aether_Composition.mid"
                    className={`transport-btn download-btn ${!midiBase64 ? 'disabled' : ''}`}
                    title="Download MIDI Stream"
                >
                    <Download size={20} />
                </a>
            </div>

            {/* Bounce Export Feedback */}
            {recordedUrl && (
                <div className="bounce-feedback animate-fade-in">
                    <div className="feedback-message">
                        <div className="feedback-dot"></div>
                        <span>AUDIO BOUNCE COMPLETE</span>
                    </div>
                    <a
                        href={recordedUrl}
                        download={`Aether_Export.webm`}
                        className="aether-btn save-bounce-btn"
                    >
                        Save .webm
                    </a>
                </div>
            )}

            <style>{`
                .player-panel {
                    width: 100%;
                    padding: 1.5rem;
                    background: rgba(0, 0, 0, 0.4);
                }

                .player-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .status-group {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .status-icon {
                    color: var(--aether-text-muted);
                    transition: all var(--duration-fast);
                }

                .status-icon.active { color: var(--aether-cyan); }
                .status-icon.pulsing { animation: telemetry-pulse 1.5s ease-in-out infinite; }

                .status-text {
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    color: white;
                }

                .player-timer {
                    font-family: monospace;
                    font-size: 0.875rem;
                    color: var(--aether-cyan);
                    font-weight: 700;
                }

                .progress-track {
                    width: 100%;
                    height: 4px;
                    background: var(--aether-glass-white);
                    border-radius: var(--rounded-full);
                    margin-bottom: 2rem;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(to right, var(--aether-cyan), var(--aether-violet));
                    box-shadow: 0 0 10px var(--aether-cyan-glow);
                    transition: width 0.2s linear;
                }

                .transport-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                }

                .transport-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--aether-text-muted);
                    cursor: pointer;
                    transition: all var(--duration-fast);
                }

                .transport-btn:hover {
                    background: var(--aether-glass);
                    border-color: var(--aether-border);
                    color: white;
                    transform: translateY(-2px);
                }

                .transport-btn.disabled {
                    opacity: 0.3;
                    pointer-events: none;
                }

                .record-btn.recording {
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                    background: rgba(239, 68, 68, 0.1);
                    position: relative;
                }

                .record-pulse {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    animation: pulse 1s infinite;
                }

                .play-pause-btn {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 30px var(--aether-cyan-glow);
                }

                .bounce-feedback {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background: rgba(74, 222, 128, 0.05);
                    border: 1px solid rgba(74, 222, 128, 0.3);
                    border-radius: var(--rounded-md);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .feedback-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #4ade80;
                    letter-spacing: 0.05em;
                }

                .feedback-dot {
                    width: 6px;
                    height: 6px;
                    background: currentColor;
                    border-radius: 50%;
                    animation: telemetry-pulse 1s infinite;
                }

                .save-bounce-btn {
                    background: #4ade80;
                    color: black;
                    padding: 0.5rem 1.25rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    border: none;
                }

                .save-bounce-btn:hover {
                    background: #86efac;
                    transform: scale(1.05);
                }

                @keyframes telemetry-pulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.6; }
                }
            `}</style>
        </div>
    )
}
