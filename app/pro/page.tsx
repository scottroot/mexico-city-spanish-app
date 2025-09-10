/**
 * Pro Landing Page
 * Explains Pro subscription benefits and provides checkout button
 */

'use client';

import React from 'react';
import { Crown, Check, Star, Zap, Headphones, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBilling } from '@/hooks/useBilling';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-orange-500" />,
    title: "Unlimited Practice",
    description: "Access to all games, quizzes, and exercises without limits"
  },
  {
    icon: <Headphones className="h-6 w-6 text-orange-500" />,
    title: "Premium Audio",
    description: "High-quality pronunciation guides and native speaker audio"
  },
  {
    icon: <BookOpen className="h-6 w-6 text-orange-500" />,
    title: "Advanced Stories",
    description: "Exclusive intermediate and advanced reading materials"
  },
  {
    icon: <Trophy className="h-6 w-6 text-orange-500" />,
    title: "Progress Tracking",
    description: "Detailed analytics and personalized learning insights"
  }
];

const benefits = [
  "Unlimited access to all premium content",
  "Advanced grammar and vocabulary tools",
  "Exclusive intermediate and advanced stories",
  "Premium pronunciation practice with AI feedback",
  "Detailed progress tracking and analytics",
  "Priority customer support",
  "Ad-free learning experience",
  "Offline content access"
];

export default function ProLandingPage() {
  const { goPro, loading } = useBilling();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full shadow-lg">
                <Crown className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Unlock Your
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> Spanish Potential</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Take your Spanish learning to the next level with Pro. Get unlimited access to premium content, 
              advanced tools, and personalized learning experiences designed for serious learners.
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold text-gray-700">$3.99/month</span>
              <span className="text-gray-500">• Cancel anytime</span>
            </div>

            <Button 
              onClick={() => goPro()}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Start Pro Today
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Master Spanish
            </h2>
            <p className="text-lg text-gray-600">
              Pro gives you access to advanced tools and content designed for serious learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's Included in Pro
            </h2>
            <p className="text-lg text-gray-600">
              Get unlimited access to all premium features
            </p>
          </div>

          <Card className="p-8 bg-white/80 backdrop-blur-sm border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Spanish Learning?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of learners who have unlocked their potential with Pro
          </p>
          
          <Button 
            onClick={() => goPro()}
            disabled={loading}
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Start Your Pro Journey
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
          
          <p className="text-orange-100 text-sm mt-4">
            Cancel anytime • No long-term commitment
          </p>
        </div>
      </div>
    </div>
  );
}
