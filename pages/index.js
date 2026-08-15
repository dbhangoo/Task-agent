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
      const systemPrompt = 'You are a task analysis assistant. Analyze the user input and categorize it. Return ONLY a JSON object with: category (research/task/idea/urgent), priority (high/medium/low), suggestedDeadline (today/this week/next week/flexible), summary (one sentence), reasoning (brief explanation).';
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          system: systemPrompt,
          messages: [
            { role: 'user', content: text }
          ],
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        const responseText = data.content[0].text;
        return JSON.parse(responseText);
      }
    } catch (error) {
      console.error('Claude API error:', error);
      alert('Error: Make sure your API key is set in Vercel environment variables.');
      return null;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
    }
  };

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setLoading(true);
    const analysis = await analyzeWithClaude(input);

    if (analysis) {
      const newTask = {
        id: Date.now(),
        rawInput: input,
        timestamp: new Date().toLocaleString(),
        ...analysis,
        completed: false,
      };
      setTasks([newTask, ...tasks]);
      setInput('');
    }
    setLoading(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const generateSummary = () => {
    const now = new Date().toLocaleString();
    let summary = 'Task Summary — ' + now + '\n\n';

    const categories = ['urgent', 'task', 'research', 'idea'];
    for (const cat of categories) {
      const catTasks = tasks.filter(t => t.category === cat);
      if (catTasks.length > 0) {
        summary += cat.toUpperCase() + '\n';
        catTasks.forEach(t => {
          const status = t.completed ? '✓' : '◦';
          summary += status + ' ' + t.summary + '\n   (' + t.priority + ' priority, due ' + t.suggestedDeadline + ')\n';
        });
        summary += '\n';
      }
    }

    return summary;
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);

  const getCategoryIcon = (category) => {
    const icons = {
      urgent: <AlertCircle className="w-4 h-4" />,
      task: <CheckCircle2 className="w-4 h-4" />,
      research: <Lightbulb className="w-4 h-4" />,
      idea: <Lightbulb className="w-4 h-4" />
    };
    return icons[category];
  };

  const getCategoryColor = (category) => {
    const colors = {
      urgent: 'text-red-600 bg-red-50',
      task: 'text-blue-600 bg-blue-50',
      research: 'text-amber-600 bg-amber-50',
      idea: 'text-slate-600 bg-slate-50'
    };
    return colors[category];
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Task Capture Agent</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-2">Task Capture</h1>
            <p className="text-slate-600 text-sm">Quickly capture ideas, research, and tasks. Claude categorizes and suggests deadlines.</p>
          </div>

          <form onSubmit={handleCapture} className="mb-8">
            <div className={isListening ? 'bg-white rounded-lg shadow-sm border border-blue-400 ring-2 ring-blue-100 overflow-hidden transition' : 'bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition'}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's on your mind? A research topic, task, idea, or something urgent... (or use the microphone)"
                className="w-full p-4 focus:outline-none resize-none text-slate-800"
                rows="3"
              />
              <div className="bg-slate-50 px-4 py-3 flex gap-2 items-center">
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Capture
                </button>

                {speechSupported ? (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={isListening ? 'flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition bg-blue-500 text-white hover:bg-blue-600' : 'flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition bg-slate-200 text-slate-700 hover:bg-slate-300'}
                    title={isListening ? 'Stop recording' : 'Start recording'}
                  >
                    {isListening ? (
                      <>
                        <Mic className="w-4 h-4 animate-pulse" />
                        Recording...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Speak
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-xs text-slate-500">Speech not supported</div>
                )}
              </div>
            </div>
          </form>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'urgent', 'task', 'research', 'idea'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={filter === cat ? 'px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition bg-slate-900 text-white' : 'px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition bg-white text-slate-700 border border-slate-200 hover:border-slate-300'}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <button
              onClick={() => {
                const summary = generateSummary();
                navigator.clipboard.writeText(summary);
                alert('Summary copied to clipboard!');
              }}
              className="flex items-center gap-2 text-slate-700 text-sm font-medium hover:text-slate-900 p-2 rounded hover:bg-white transition"
            >
              <Mail className="w-4 h-4" />
              Copy Email Summary
            </button>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">No items yet. Start capturing to see them here.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={task.completed ? 'bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition opacity-60' : 'bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition'}
                >
                  <div className="flex gap-3 items-start">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="mt-1 flex-shrink-0 text-slate-400 hover:text-slate-600"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-slate-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 items-start mb-2">
                        <div className={'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ' + getCategoryColor(task.category) + ' flex-shrink-0'}>
                          {getCategoryIcon(task.category)}
                          {task.category}
                        </div>
                        <div className={'text-xs font-medium px-2 py-1 rounded flex-shrink-0 ' + (task.priority === 'high' ? 'bg-red-50 text-red-700' : task.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700')}>
                          {task.priority}
                        </div>
                      </div>

                      <p className={task.completed ? 'text-slate-900 line-through' : 'text-slate-900'}>{task.summary}</p>
                      <p className="text-xs text-slate-500 mt-2">Due: {task.suggestedDeadline}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {tasks.length > 0 && (
            <div className="mt-8 text-center text-xs text-slate-500">
              <p>{tasks.length} items • {tasks.filter(t => t.completed).length} completed</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
