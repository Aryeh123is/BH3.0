import { motion } from 'motion/react';
import { BookOpen, Zap, Trophy } from 'lucide-react';

interface HowItWorksProps {
  language: string;
  isModal?: boolean;
}

export function HowItWorks({ language, isModal = false }: HowItWorksProps) {
  const languageName = language === 'spanish' ? 'Spanish' : 'Hebrew';

  const steps = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Exam Board Verified",
      description: `Every word is pulled directly from the Edexcel and AQA specifications—these words will 100% appear in your GCSE exams.`
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "AI-Powered Learning",
      description: "Our smart algorithm uses AI-driven spaced repetition (SRS) to lock these mandatory keywords into your long-term memory."
    },
    {
      icon: <Trophy className="w-6 h-6 text-green-500" />,
      title: "Grade 9 Mastery",
      description: "Track your progress and ensure you've mastered every single word required for the highest possible grade."
    }
  ];

  return (
    <section className={`${isModal ? 'py-4' : 'py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900'} transition-colors duration-300`}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className={`text-center ${isModal ? 'mb-8' : 'mb-16'}`}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Guaranteed Exam Success</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Designed specifically for the {languageName} exam boards. 
            Official specification vocabulary, mastered with AI.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${isModal ? 'gap-6' : 'gap-12'}`}>
          {steps.map((step, idx) => (
            <motion.div
              key={`how-step-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
