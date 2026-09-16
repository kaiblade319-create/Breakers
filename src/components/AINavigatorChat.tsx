import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { PatientProfile, Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  CornerDownLeft, 
  RefreshCw,
  Lightbulb,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface AINavigatorChatProps {
  profile: PatientProfile;
  language: Language;
  onNavigateTab: (tabId: string) => void;
}

export const AINavigatorChat: React.FC<AINavigatorChatProps> = ({
  profile,
  language,
  onNavigateTab
}) => {
  const t = TRANSLATIONS[language];
  const getWelcomeText = (lang: Language, p: PatientProfile) => {
    if (lang === 'hi') {
      return `नमस्ते! मैं आपका FinCare (फिनकेयर) AI वित्तीय सहायक हूँ। ${p.name} (${p.disease}) के उपचार खर्च को कम करने, सरकारी योजनाओं (आयुष्मान भारत / MJPJAY), बीमा दावों और अस्पताल रियायत के लिए मैं आपकी सहायता के लिए तैयार हूँ। आप मुझसे कोई भी सवाल पूछ सकते हैं।`;
    }
    if (lang === 'mr') {
      return `नमस्कार! मी तुमचा FinCare (फिनकेअर) AI सहाय्यक आहे. ${p.name} (${p.disease}) यांच्या उपचाराचा खर्च कमी करण्यासाठी, शासकीय योजना (MJPJAY / PM-JAY), विमा दावे आणि रुग्णालय सवलतीबद्दल मी मार्गदर्शन करण्यास तयार आहे।`;
    }
    return `Hello! I am your FinCare AI Financial Assistant. I have analyzed ${p.name}'s profile (${p.disease}, estimated cost ₹${p.estimatedCost.toLocaleString('en-IN')}). I can guide you on combining Ayushman Bharat / MJPJAY, private insurance, hospital trust waivers, and resolving claim queries.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      sender: 'navigator',
      text: getWelcomeText(language, profile),
      timestamp: 'Just now',
      source: 'gemini',
      suggestedActions: [
        'Check Scheme Eligibility',
        'Verify Missing Documents',
        'TPA Pre-Auth Query Help'
      ]
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial greeting if user switches language or preset before chatting
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'init_msg') {
        return [{
          ...prev[0],
          text: getWelcomeText(language, profile)
        }];
      }
      return prev;
    });
  }, [language, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/navigator/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          patientProfile: profile,
          language,
          history: messages.slice(-4)
        })
      });

      const data = await response.json();
      const replyText = data.reply || 'I am ready to help navigate your healthcare financial support options.';

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'navigator',
        text: replyText,
        timestamp: 'Just now',
        source: data.source || 'gemini'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'navigator',
        text: 'Unable to reach navigator service right now. Please ensure server is active.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    t.aiPrompt1,
    t.aiPrompt2,
    t.aiPrompt3,
    t.aiPrompt4
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Empathetic Healthcare Financial Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t.aiAssistantTitle}
            </h2>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              {t.aiAssistantSubtitle}
            </p>
          </div>

          <div className="text-xs bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-slate-300">
            <div>Active Context: <strong className="text-white">{profile.name}</strong></div>
            <div className="text-emerald-400 font-semibold">{profile.disease}</div>
            <div>Income: ₹{(profile.annualIncome/100000).toFixed(1)}L • Cost: ₹{(profile.estimatedCost/100000).toFixed(1)}L</div>
          </div>
        </div>

        {/* Quick Question Prompt Chips */}
        <div className="mt-5 pt-4 border-t border-indigo-900/80">
          <div className="text-xs text-slate-300 font-medium mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Click to ask standard healthcare scenarios (from document):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                disabled={loading}
                className="text-left px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700/80 transition-all text-ellipsis max-w-full sm:max-w-md truncate shadow-2xs"
              >
                💬 {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                {/* Message bubble */}
                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed min-w-0 max-w-full ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-[11px] font-semibold text-slate-700">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        FinCare Intelligence
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-800 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isUser ? (
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  ) : (
                    <div className="markdown-body text-slate-800 space-y-2 overflow-x-auto [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_h3]:font-bold [&_h3]:text-sm [&_h4]:font-semibold [&_h4]:text-xs [&_table]:w-full [&_table]:block [&_table]:overflow-x-auto [&_th]:border [&_th]:p-1.5 [&_td]:border [&_td]:p-1.5">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}

                  {msg.suggestedActions && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            if (action.includes('Document')) onNavigateTab('documents');
                            else if (action.includes('Scheme')) onNavigateTab('support_map');
                            else onNavigateTab('insurance');
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{action}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[80%] mr-auto items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 sm:p-4 text-xs text-slate-500 shadow-xs flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce shrink-0"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100 shrink-0"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200 shrink-0"></span>
                <span className="truncate sm:whitespace-normal">Analyzing schemes, TPA guidelines, and patient financial rules...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-600 outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <span>{t.send}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
