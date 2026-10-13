import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ShieldAlert } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
  tag?: 'PAPER FINDING' | 'SIMULATION OBSERVATION' | 'RESEARCH HYPOTHESIS';
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedElectrode,
    amplitude,
    spatialSpread,
    pulseRate,
    pulseWidth,
    refractoryDuration,
    metrics,
    modelType,
  } = useSimulation();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello! I am your BIO-CI Neural Engineering Copilot. Current lab state: Electrode ${selectedElectrode < 10 ? '0' + selectedElectrode : selectedElectrode} active at ${amplitude} µA with ${spatialSpread}% spread and ${pulseRate} pps (${modelType} model). How can I assist your investigation?`,
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickQuestions = [
    'What happens if I increase current spread?',
    'Why are more fibers activated?',
    'Which parameter is causing poor neural selectivity?',
    'What is the difference between the simplified and biologically inspired models?',
    'What experiment should I run next?',
  ];

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = { role: 'user', text: queryText };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput('');

    setTimeout(() => {
      let reply = '';
      let tag: Message['tag'] = 'SIMULATION OBSERVATION';

      const lower = queryText.toLowerCase();

      if (lower.includes('increase current spread') || (lower.includes('current spread') && lower.includes('what happens'))) {
        tag = 'SIMULATION OBSERVATION';
        reply = `In our current volume conduction simulation at ${spatialSpread}% spread, increasing spread expands the activation width from ${metrics.spatialActivationWidth} mm outwards. Electrical current shunts broadly through the perilymph, recruiting neighboring fibers associated with flanking electrodes (e.g. E06 and E08), directly reducing neural selectivity from ${metrics.neuralSelectivity} downwards.`;
      } else if (lower.includes('more fibers activated') || lower.includes('why are more fibers')) {
        tag = 'SIMULATION OBSERVATION';
        reply = `Fiber recruitment is governed by the extracellular electric potential gradient V(r). At your current amplitude of ${amplitude} µA, the suprathreshold field radius reaches ~${metrics.estimatedSpread} mm, activating ~${metrics.nearbyFibers} fibers. Decreasing current amplitude or narrowing spatial spread to tripolar mode would confine recruitment to only local auditory nerve fibers.`;
      } else if (lower.includes('poor neural selectivity') || lower.includes('causing poor')) {
        tag = 'PAPER FINDING';
        reply = `The primary determinant of low neural selectivity is Broad Spatial Current Spread (${spatialSpread}% in this run). In literature (Cohen et al., 2006; Bierer, 2010), monopolar ground configurations allow current to travel longitudinally across multiple cochlear turns before reaching the extracochlear ground, generating massive channel crosstalk. Switching to focused bipolar or tripolar configurations recovers spatial selectivity.`;
      } else if (lower.includes('difference between the simplified') || lower.includes('simplified and biologically')) {
        tag = 'PAPER FINDING';
        reply = `The simplified point-neuron literature model assumes deterministic firing with zero refractory state, firing on 100% of stimulus pulses. In contrast, the BIO-CI biological model incorporates: 1) Sodium channel inactivation (ARP ~0.7ms, RRP ~${refractoryDuration}ms), 2) Microscopic stochastic gating jitter (~0.41ms), and 3) Slow potassium adaptation currents w(t) that decay continuous pulse trains.`;
      } else if (lower.includes('experiment should i run') || lower.includes('what experiment')) {
        tag = 'RESEARCH HYPOTHESIS';
        reply = `Hypothesis Recommendation: Run a 'Tripolar vs Monopolar Formant Discrimination Benchmark'. Keep Electrode ${selectedElectrode} at ${amplitude} µA, but reduce spatial spread from ${spatialSpread}% down to 25%. Compare the downstream SNN phoneme decoding accuracy and temporal precision to test if spatial sharpening overcomes refractory rate suppression.`;
      } else {
        tag = 'RESEARCH HYPOTHESIS';
        reply = `Under your active settings (${amplitude} µA, ${spatialSpread}% spread, ${pulseRate} pps), the simulated temporal fidelity is ${metrics.temporalFidelity} with ${metrics.spikeTimingPrecision} ms timing precision. In future differentiable models, these multi-channel spike times can directly drive SNN phonetic decoders. Note: This observation is a computational simulation output, not clinical diagnostic data.`;
      }

      setMessages([...nextMsgs, { role: 'assistant', text: reply, tag }]);
    }, 400);
  };

  const getTagStyle = (tag?: Message['tag']) => {
    switch (tag) {
      case 'PAPER FINDING':
        return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'SIMULATION OBSERVATION':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'RESEARCH HYPOTHESIS':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1324] border border-[#23355e] rounded-2xl max-w-2xl w-full p-5 shadow-2xl relative flex flex-col h-[580px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18233c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 text-cyan-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Research Assistant</h3>
              <p className="text-[11px] text-slate-400">
                Context-aware biophysical exploration advisor with scientific taxonomy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#152342] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-[#101b33] border border-[#1d2d4f] text-slate-200 rounded-bl-none space-y-1.5'
                }`}
              >
                {m.tag && (
                  <span
                    className={`inline-block text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${getTagStyle(
                      m.tag
                    )}`}
                  >
                    {m.tag}
                  </span>
                )}
                <p className="text-slate-200">{m.text}</p>
              </div>
              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center shrink-0 text-white mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendQuery(q)}
              className="px-2.5 py-1 rounded-full bg-[#111c33] hover:bg-[#172545] border border-[#1f3056] text-[10px] text-cyan-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-[#18233c] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(input)}
            placeholder="Ask a scientific query about current stimulation, spread, or refractoriness..."
            className="flex-1 bg-[#10192e] text-xs text-white rounded-xl px-3.5 py-2.5 border border-[#1e2f52] focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleSendQuery(input)}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors shrink-0 shadow-md cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
