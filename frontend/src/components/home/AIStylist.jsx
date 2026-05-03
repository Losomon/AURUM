import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

const STYLE_QUESTIONS = [
  {
    id: 'occasion',
    question: 'What is the occasion?',
    options: ['Evening Event', 'Business Meeting', 'Weekend Casual', 'Travel'],
  },
  {
    id: 'mood',
    question: 'What is your mood today?',
    options: ['Bold & Confident', 'Soft & Romantic', 'Sharp & Minimal', 'Relaxed & Free'],
  },
  {
    id: 'palette',
    question: 'Your colour instinct?',
    options: ['Dark & Moody', 'Neutral & Earthy', 'Crisp Whites', 'Rich Jewel Tones'],
  },
];

const CATEGORY_MAP = {
  'Evening Event': 'dresses',
  'Business Meeting': 'tops',
  'Weekend Casual': 'bottoms',
  'Travel': 'outerwear',
};

export default function AIStylist({ products = [] }) {
  const [step, setStep] = useState(0); // 0 = intro, 1-3 = questions, 4 = result
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = async (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < STYLE_QUESTIONS.length) {
      setStep(step + 1);
    }

    if (step === STYLE_QUESTIONS.length - 1) {
      // Last answer — generate recommendation
      setLoading(true);
      setStep(4);

      const preferredCategory = CATEGORY_MAP[newAnswers.occasion] || 'tops';
      const poolProducts = products.filter(p => p.category === preferredCategory).slice(0, 3);
      const fallbackProducts = products.slice(0, 3);
      const suggestedProducts = poolProducts.length >= 2 ? poolProducts : fallbackProducts;

      try {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `You are AURUM's luxury AI stylist. The customer answered:
- Occasion: ${newAnswers.occasion}
- Mood: ${newAnswers.mood}
- Colour palette: ${newAnswers.palette}

Write a short, elegant styling recommendation (2-3 sentences max). Speak in the voice of a high-end personal stylist — refined, confident, warm. Do not use bullet points. Mention the occasion and colour palette subtly. End with one specific style tip.`,
          response_json_schema: {
            type: 'object',
            properties: {
              recommendation: { type: 'string' },
              style_tip: { type: 'string' },
            },
          },
        });

        setResult({
          recommendation: res.recommendation,
          style_tip: res.style_tip,
          products: suggestedProducts,
        });
      } catch (e) {
        setResult({
          recommendation: `For your ${newAnswers.occasion?.toLowerCase()}, we recommend leading with ${newAnswers.palette?.toLowerCase()} tones — grounded and deliberate. Let the fabric speak.`,
          style_tip: 'One statement piece. Everything else, quiet.',
          products: suggestedProducts,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setLoading(false);
  };

  const currentQ = STYLE_QUESTIONS[step - 1];
  const progress = step === 0 ? 0 : (step / STYLE_QUESTIONS.length) * 100;

  return (
    <section className="py-24 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — label + intro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3">AI-Powered</p>
            <h2 className="font-heading text-3xl md:text-5xl mb-6 leading-tight">
              Your Personal<br />
              <span className="text-primary italic">Stylist</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mb-8">
              Answer three questions. Receive a curated editorial recommendation — crafted by AURUM's AI stylist around your occasion, mood, and palette.
            </p>

            {/* Decorative lines */}
            <div className="flex flex-col gap-2">
              {['Occasion-aware curation', 'Mood-matched palette', 'Stylist-grade voice'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span className="font-body text-xs text-muted-foreground tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — interactive card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div
              className="relative rounded-2xl border border-border/40 bg-card overflow-hidden"
              style={{ minHeight: 380 }}
            >
              {/* Gold top bar */}
              <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Progress bar */}
              {step > 0 && step < 4 && (
                <div className="h-0.5 bg-secondary">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {/* INTRO */}
                  {step === 0 && (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex flex-col items-center text-center py-8"
                    >
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6"
                      >
                        <Sparkles className="w-6 h-6 text-primary" />
                      </motion.div>
                      <h3 className="font-heading text-2xl mb-3">Meet Your Stylist</h3>
                      <p className="font-body text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
                        Three questions. One perfectly curated look.
                      </p>
                      <button
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all group"
                      >
                        Begin <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {/* QUESTIONS */}
                  {step >= 1 && step <= STYLE_QUESTIONS.length && (
                    <motion.div
                      key={`q-${step}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                        {step} of {STYLE_QUESTIONS.length}
                      </p>
                      <h3 className="font-heading text-xl mb-6">{currentQ?.question}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {currentQ?.options.map((opt) => (
                          <motion.button
                            key={opt}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAnswer(currentQ.id, opt)}
                            className="p-4 text-left rounded-xl border border-border/40 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
                            <span className="font-body text-xs text-foreground/80 group-hover:text-foreground tracking-wide leading-relaxed">{opt}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* LOADING */}
                  {step === 4 && loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-7 h-7 text-primary" />
                      </motion.div>
                      <p className="font-body text-xs text-muted-foreground mt-4 tracking-wider">Curating your look…</p>
                    </motion.div>
                  )}

                  {/* RESULT */}
                  {step === 4 && !loading && result && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="font-body text-[9px] tracking-[0.3em] uppercase text-primary">AURUM Stylist</span>
                      </div>
                      <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">
                        {result.recommendation}
                      </p>
                      <p className="font-body text-xs text-primary italic mb-6">"{result.style_tip}"</p>

                      {/* Suggested products */}
                      {result.products.length > 0 && (
                        <div className="mb-6">
                          <p className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Curated For You</p>
                          <div className="flex gap-3">
                            {result.products.slice(0, 3).map((p) => (
                              <Link key={p.id} to={`/product?id=${p.id}`} className="flex-1 group">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary mb-1.5">
                                  {p.image_url
                                    ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    : <div className="w-full h-full bg-secondary" />
                                  }
                                </div>
                                <p className="font-body text-[9px] text-muted-foreground truncate">{p.name}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Start Over
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom gold shimmer */}
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}