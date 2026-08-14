'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { useDemoChat } from '@/hooks/useChat';

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  webkitAudioContext?: typeof AudioContext;
};

export function useVoiceAgent(isOpen: boolean) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [micVolume, setMicVolume] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { messages } = useChatStore();
  const { sendMessage } = useDemoChat();

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpokenMessageIdRef = useRef<string | null>(null);
  const isOpenRef = useRef(isOpen);
  const isMicMutedRef = useRef(isMicMuted);
  const isSpeakerMutedRef = useRef(isSpeakerMuted);
  const voiceStateRef = useRef<VoiceState>('idle');
  const sendMessageRef = useRef(sendMessage);
  const speechTokenRef = useRef(0);

  const setState = useCallback((nextState: VoiceState) => {
    voiceStateRef.current = nextState;
    setVoiceState(nextState);
  }, []);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  useEffect(() => {
    isSpeakerMutedRef.current = isSpeakerMuted;
  }, [isSpeakerMuted]);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const startRecognition = useCallback(() => {
    if (!isOpenRef.current || isMicMutedRef.current || voiceStateRef.current !== 'listening') return;
    try {
      recognitionRef.current?.start();
    } catch {
      // Calling start while recognition is already active raises InvalidStateError.
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if (isSpeakerMutedRef.current || !('speechSynthesis' in window)) {
      setState('listening');
      startRecognition();
      return;
    }

    const token = ++speechTokenRef.current;
    // Do not let browser recognition pick up Sahayam's synthesized response.
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) =>
      voice.lang.startsWith('en') && /Natural|Google|Samantha|Karen/i.test(voice.name)
    ) ?? voices.find((voice) => voice.lang.startsWith('en')) ?? null;

    setState('speaking');
    utterance.onend = utterance.onerror = () => {
      if (token !== speechTokenRef.current || !isOpenRef.current) return;
      setState('listening');
      startRecognition();
    };
    window.speechSynthesis.speak(utterance);
  }, [setState, startRecognition]);

  useEffect(() => {
    if (!isOpen || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'agent' && lastMessage.id !== lastSpokenMessageIdRef.current) {
      lastSpokenMessageIdRef.current = lastMessage.id;
      speakText(lastMessage.text);
    }
  }, [isOpen, messages, speakText]);

  const setupAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isOpenRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      mediaStreamRef.current = stream;
      setHasPermission(true);

      const AudioContextConstructor = window.AudioContext || (window as SpeechWindow).webkitAudioContext;
      if (!AudioContextConstructor) return;
      const audioContext = new AudioContextConstructor();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(samples);
        const average = samples.reduce((total, sample) => total + sample, 0) / samples.length;
        setMicVolume(Math.min(Math.round((average / 128) * 100), 100));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (error) {
      console.error('Unable to access the microphone:', error);
      setHasPermission(false);
    }
  }, []);

  const setupRecognition = useCallback(() => {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition
      ?? (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setState('listening');
    recognition.onresult = (event) => {
      let interim = '';
      let finalTranscript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalTranscript += result[0].transcript;
        else interim += result[0].transcript;
      }
      setInterimTranscript(interim);

      if (finalTranscript.trim()) {
        setInterimTranscript('');
        setState('thinking');
        recognitionRef.current?.stop();
        speechTokenRef.current += 1;
        window.speechSynthesis?.cancel();
        void sendMessageRef.current(finalTranscript.trim(), true);
      }
    };
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
    };
    recognition.onend = () => startRecognition();
    recognitionRef.current = recognition;
    // An initial greeting may already be playing while mic permission resolves.
    // Wait for that speech turn to finish before opening recognition.
    if (voiceStateRef.current === 'speaking' || voiceStateRef.current === 'thinking') return;
    setState('listening');
    startRecognition();
  }, [setState, startRecognition]);

  useEffect(() => {
    if (!isOpen) return;
    const initialize = async () => {
      await setupAudio();
      if (isOpenRef.current) setupRecognition();
    };
    void initialize();

    return () => {
      speechTokenRef.current += 1;
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      void audioContextRef.current?.close();
      audioContextRef.current = null;
      window.speechSynthesis?.cancel();
      setMicVolume(0);
      setInterimTranscript('');
      setState('idle');
    };
  }, [isOpen, setState, setupAudio, setupRecognition]);

  const toggleMicMute = () => {
    const nextMuted = !isMicMutedRef.current;
    isMicMutedRef.current = nextMuted;
    setIsMicMuted(nextMuted);
    mediaStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    if (nextMuted) recognitionRef.current?.stop();
    else {
      setState('listening');
      startRecognition();
    }
  };

  const toggleSpeakerMute = () => {
    const nextMuted = !isSpeakerMutedRef.current;
    isSpeakerMutedRef.current = nextMuted;
    setIsSpeakerMuted(nextMuted);
    if (nextMuted) {
      speechTokenRef.current += 1;
      window.speechSynthesis?.cancel();
      setState('listening');
      startRecognition();
    }
  };

  return {
    voiceState,
    micVolume,
    isMicMuted,
    isSpeakerMuted,
    interimTranscript,
    hasPermission,
    toggleMicMute,
    toggleSpeakerMute,
  };
}
