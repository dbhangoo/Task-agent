import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Trash2, Send, Mail, RefreshCw, CheckCircle2, Clock, Lightbulb, AlertCircle, Mic } from 'lucide-react';

export default function TaskAgent() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTasks();
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => prev + transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      saveTasks(tasks);
    }
  }, [tasks, mounted]);

  const saveTasks = (tasksToSave) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('task-agent-items', JSON.stringify(tasksToSave));
    }
  };

  const loadTasks = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('task-agent-items');
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    }
  };

  const analyzeWithClaude = async (text) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          system: `You are a task analysis assistant. Analyze the user's input and categorize it. Return ONLY a JSON object (no markdown, no preamble) with this exact structure:
{
  "category": "research" | "task" | "idea" | "urgent",
  "priority": "high" | "medium" | "low",
