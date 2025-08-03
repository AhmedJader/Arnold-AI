// app/userinput/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  sex: string;
  age: string;
  fitnessLevel: string;
  workoutFrequency: string;
  primaryGoals: string[];
  preferredWorkoutTypes: string[];
  availableTime: string;
  injuries: string;
  equipment: string[];
}

export default function UserInputPage(): React.JSX.Element {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    sex: '',
    age: '',
    fitnessLevel: '',
    workoutFrequency: '',
    primaryGoals: [],
    preferredWorkoutTypes: [],
    availableTime: '',
    injuries: '',
    equipment: []
  });

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const handleSubmit = (): void => {
    console.log('Form data:', formData);
    // Handle form submission - could send to API first if needed
    router.push('/muscles');
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800 opacity-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-800/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neutral-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Tell Us About You
          </h1>
          <p className="text-lg text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            Help us create your personalized fitness journey
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Sex Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Sex</label>
            <div className="grid grid-cols-2 gap-4">
              {['Male', 'Female'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange('sex', option)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    formData.sex === option
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('age', e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-400 focus:border-white/30 focus:outline-none transition-all duration-300"
              placeholder="Enter your age"
              min="13"
              max="100"
            />
          </div>

          {/* Fitness Level */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Fitness Level</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleInputChange('fitnessLevel', level)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    formData.fitnessLevel === level
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Workout Frequency */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">How often do you want to workout?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['2-3 times/week', '4-5 times/week', '6-7 times/week', 'Daily'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => handleInputChange('workoutFrequency', freq)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 text-sm ${
                    formData.workoutFrequency === freq
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Goals */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Primary Goals (Select all that apply)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Weight Loss', 'Muscle Gain', 'Strength', 'Endurance', 'Flexibility', 'General Health'].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleMultiSelect('primaryGoals', goal)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    formData.primaryGoals.includes(goal)
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Workout Types */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Preferred Workout Types</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Cardio', 'Weight Training', 'Bodyweight', 'Yoga', 'HIIT', 'Sports'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleMultiSelect('preferredWorkoutTypes', type)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    formData.preferredWorkoutTypes.includes(type)
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Available Time */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Time available per workout</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['15-30 min', '30-45 min', '45-60 min', '60+ min'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleInputChange('availableTime', time)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    formData.availableTime === time
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Available */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Equipment Available</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['No Equipment', 'Basic (Dumbbells)', 'Home Gym', 'Full Gym Access', 'Resistance Bands', 'Yoga Mat'].map((equipment) => (
                <button
                  key={equipment}
                  type="button"
                  onClick={() => handleMultiSelect('equipment', equipment)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    formData.equipment.includes(equipment)
                      ? 'bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
          </div>

          {/* Injuries/Limitations */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-neutral-200">Any injuries or physical limitations?</label>
            <textarea
              value={formData.injuries}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('injuries', e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-400 focus:border-white/30 focus:outline-none transition-all duration-300 resize-none"
              placeholder="Describe any injuries, limitations, or areas to avoid (optional)"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex items-center justify-center px-10 py-4 rounded-full text-white font-medium bg-gradient-to-r from-neutral-800/80 to-neutral-600/80 hover:from-neutral-600/80 hover:to-neutral-600 transition-all duration-300 hover:scale-105 shadow-2xl backdrop-blur-lg border border-white/10 hover:border-white/20 group"
            >
              <span className="relative z-10">Create My Fitness Plan</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral-700/50 to-neutral-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-sm bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-600">
            Your information is secure and will only be used to personalize your fitness experience
          </p>
        </div>
      </div>
    </div>
  );
}