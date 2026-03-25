'use client';

import { useState, useMemo, useEffect } from 'react';
import { Play, FileText, Unlock, Lock, Crown, Star } from 'lucide-react';

interface Tutorial {
  id: number;
  title: string;
  type: 'video' | 'pdf';
  duration?: string;
  pages?: number;
  url: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

interface CourseLevel {
  level: 'Beginner' | 'Intermediate' | 'Expert';
  description: string;
  badge: string;
  access: string;
  icon: React.ReactNode;
  color: string;
  tutorials: Tutorial[];
}

export default function CoursesContent() {
  const [activeLevel, setActiveLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner');
  const [toturial,setToturial]=useState<Tutorial[]>([])
  const getToturials=()=>{
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/toturials`)
    .then(res=>res.json())
    .then(json=>setToturial(json))
  }

  useEffect(()=>{
    getToturials()
  },[])

  const beginnerTutorials = useMemo(() => 
    toturial.filter(t => t.level === 'Beginner'), 
    [toturial]
);

  const intermediateTutorials = useMemo(() => 
    toturial.filter(t => t.level === 'Intermediate'), 
    [toturial]
);

  const expertTutorials = useMemo(() => 
    toturial.filter(t => t.level === 'Expert'), 
    [toturial]
);

  const courseLevels: CourseLevel[] = [
    {
      level: 'Beginner',
      description: 'Foundational knowledge for complete beginners',
      badge: 'FREE',
      access: 'Available to Everyone (No payment required)',
      icon: <Unlock className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      tutorials: beginnerTutorials
       
    },
    {
      level: 'Intermediate',
      description: 'Builds upon Beginner level + practical trading strategies',
      badge: 'BRONZE / SILVER / GOLD',
      access: 'Requires Bronze, Silver or Gold Package',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-600',
      tutorials:intermediateTutorials 
    },
    {
      level: 'Expert',
      description: 'Professional level strategies + Gold exclusive benefits',
      badge: 'GOLD ONLY',
      access: 'Gold Package Only + 1 Month Free Signals',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600',
      tutorials: expertTutorials
    },
  ];

  const currentLevel = courseLevels.find(l => l.level === activeLevel)!;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Courses & Learning Materials</h1>
        <p className="text-gray-400 mt-2">Manage all video tutorials and PDF documents by access level</p>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex flex-wrap gap-3 bg-gray-900 p-2 rounded-3xl">
        {courseLevels.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => setActiveLevel(lvl.level)}
            className={`flex-1 px-8 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 ${
              activeLevel === lvl.level
                ? 'bg-linear-to-r from-yellow-500 to-orange-600 text-black shadow-xl'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            {lvl.icon}
            {lvl.level}
            <span className="text-xs opacity-75">({lvl.tutorials.length})</span>
          </button>
        ))}
      </div>

      {/* Level Header Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className={`w-24 h-24 rounded-3xl bg-linear-to-br ${currentLevel.color} flex items-center justify-center text-5xl shrink-0`}>
            {currentLevel.level === 'Beginner' ? '🌱' : currentLevel.level === 'Intermediate' ? '📈' : '👑'}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold">{currentLevel.level} Level</h2>
              <span className="px-5 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full">
                {currentLevel.badge}
              </span>
            </div>
            <p className="text-xl text-gray-300 mt-3">{currentLevel.description}</p>
            
            <div className="mt-6 flex items-center gap-3 text-lg">
              <div className="text-yellow-500">{currentLevel.icon}</div>
              <span className="font-medium">{currentLevel.access}</span>
            </div>

            {currentLevel.level === 'Expert' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-5 py-2 rounded-2xl">
                <Crown className="w-5 h-5" /> Gold members also get 1 Month Free Signals after payment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">
          All {currentLevel.level} Materials 
          <span className="text-gray-500 text-base font-normal ml-3">
            ({currentLevel.tutorials.length} resources)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentLevel.tutorials.map((tutorial, i) => (
            <div
              key={i}
              className="group bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-yellow-500/40 transition-all duration-300"
            >
              <div className="relative h-52 bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
                {tutorial.type === 'video' ? (
                  <>
                    <div className="w-20 h-20 bg-black/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-12 h-12 text-white" fill="currentColor" />
                    </div>
                    {tutorial.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/90 px-3 py-1 text-xs rounded-full">
                        {tutorial.duration}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <FileText className="w-20 h-20 text-orange-400 mx-auto" />
                    {tutorial.pages && (
                      <p className="mt-3 text-sm text-gray-400">{tutorial.pages} pages</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[56px]">
                  {tutorial.title}
                </h4>

                <div className="mt-6 flex gap-3">
                  <a
                    href={tutorial.url}
                    target="_blank"
                    className="flex-1 text-center py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl text-sm font-medium transition"
                  >
                    Preview Resource
                  </a>
                  <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-semibold py-3 rounded-2xl transition">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold px-10 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition">
          + Add New {currentLevel.level} Tutorial / Document
        </button>
      </div>
    </div>
  );
}