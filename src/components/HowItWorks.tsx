import { motion } from 'motion/react';
import { BookOpen, Zap, Trophy } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Fast Generation",
      description: "Instantly find the most relevant Hebrew keywords for any GCSE topic."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Smart Learning",
      description: "Our tool uses spaced repetition to help you memorize words faster and more effectively."
    },
    {
      icon: <Trophy className="w-6 h-6 text-green-500" />,
      title: "Mastery Tracking",
      description: "Track your progress and see your vocabulary grow as you master each keyword."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">How It Works</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Designed for students who want to excel in their Hebrew exams. 
            Simple, fast, and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-white rounded-3xl shadow-soft flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
