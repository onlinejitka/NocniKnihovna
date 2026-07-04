import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

const RIDDLES_DATA = {
  '3-5': [
    {
      question: 'Maličké je to, rádo sýr to jí, kočka se na to hnedka vyrojí. Co je to?',
      options: ['Zajíc', 'Myška', 'Medvěd', 'Pejsek'],
      answer: 'Myška'
    },
    {
      question: 'Červená je, sladká je, na sluníčku v trávě zraje. Trháme ji do pusinky. Co je to?',
      options: ['Švestka', 'Okurka', 'Jahůdka', 'Mrkev'],
      answer: 'Jahůdka'
    }
  ],
  '6-9': [
    {
      question: 'Sedí panenka v komoře, rozpuštěné zelené vlasy má nahoře a její oranžové tělo je schované v zemi. Co je to?',
      options: ['Cibule', 'Brambora', 'Mrkev', 'Řepa'],
      answer: 'Mrkev'
    },
    {
      question: 'Zuby má a nekouše, do vlásků se rád pouští, aby je učesal. Co je to?',
      options: ['Kartáček', 'Hřeben', 'Nůžky', 'Pila'],
      answer: 'Hřeben'
    }
  ],
  '10+': [
    {
      question: 'Čím víc z ní ubíráš a kopeš do hloubky, tím větší začíná být. Co je to?',
      options: ['Hora', 'Díra', 'Zeď', 'Písek'],
      answer: 'Díra'
    }
  ]
};

export default function Hadanky() {
  const [riddleAge, setRiddleAge] = useState('3-5');
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentRiddles = RIDDLES_DATA[riddleAge] || [];
  const currentRiddle = currentRiddles[currentRiddleIndex];

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === currentRiddle.answer) setScore(score + 1);
  };

  const handleNextRiddle = () => {
    setSelectedAnswer(null);
    if (currentRiddleIndex + 1 < currentRiddles.length) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = (age) => {
    setRiddleAge(age);
    setCurrentRiddleIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div class="max-w-2xl mx-auto bg-slate-900/30 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-amber-400 flex items-center justify-center space-x-2">
          <span>✨</span> <span>Pohádkové hádanky</span>
        </h2>
        <p class="text-slate-400 text-sm mt-1">Procvičte hlavičky před spaním</p>
      </div>

      <div class="flex justify-center flex-wrap gap-2 mb-8">
        {[
          { id: '3-5', label: 'Mňauíci (3–5 let)' },
          { id: '6-9', label: 'Zkoumalové (6–9 let)' },
          { id: '10+', label: 'Chytrolíni (10+ let)' }
        ].map(cat => (
          <button key={cat.id} onClick={() => resetQuiz(cat.id)} class={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${riddleAge === cat.id ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {currentRiddle ? (!quizFinished ? (
        <div class="space-y-6">
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span>Hádanka {currentRiddleIndex + 1} z {currentRiddles.length}</span>
            <span>Skóre: {score}</span>
          </div>
          <div class="bg-slate-950/40 p-6 rounded-xl border border-slate-800/80 text-center min-h-[100px] flex items-center justify-center">
            <p class="text-lg md:text-xl font-medium text-slate-200 italic leading-relaxed">"{currentRiddle.question}"</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRiddle.options.map((option, idx) => {
              let btnStyle = "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800";
              let icon = null;
              if (selectedAnswer !== null) {
                if (option === currentRiddle.answer) {
                  btnStyle = "bg-green-500/20 text-green-300 border-green-500/50 font-bold";
                  icon = <CheckCircle2 size={16} class="text-green-400" />;
                } else if (option === selectedAnswer) {
                  btnStyle = "bg-red-500/20 text-red-300 border-red-500/50";
                  icon = <XCircle size={16} class="text-red-400" />;
                } else {
                  btnStyle = "bg-slate-900/40 text-slate-600 border-transparent opacity-50";
                }
              }
              return (
                <button key={idx} disabled={selectedAnswer !== null} onClick={() => handleAnswerClick(option)} class={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}>
                  <span>{option}</span> {icon}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <button onClick={handleNextRiddle} class="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg">
              {currentRiddleIndex + 1 === currentRiddles.length ? 'Vyhodnotit 🎉' : 'Další hádanka →'}
            </button>
          )}
        </div>
      ) : (
        <div class="text-center py-8 space-y-6">
          <div class="inline-flex bg-amber-400/10 text-amber-400 p-4 rounded-full"><Award size={48} /></div>
          <div>
            <h3 class="text-2xl font-bold text-amber-300">Skvělá práce!</h3>
            <p class="text-2xl font-black text-white mt-4 bg-slate-950/50 inline-block px-6 py-2 rounded-full border border-slate-800">{score} / {currentRiddles.length} správně</p>
          </div>
          <button onClick={() => resetQuiz(riddleAge)} class="w-full bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl font-semibold transition">Hrát znovu 🔄</button>
        </div>
      )) : <div class="text-center text-slate-500">Zatím tu žádné hádanky pro tento věk nejsou.</div>}
    </div>
  );
}
