/**
 * Billing Cancelled Page
 * Shown when user cancels the checkout process
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function BillingCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-sm border-orange-200">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-orange-100 rounded-full">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Checkout Cancelled</h1>
            <p className="text-gray-600">
              No worries! You can always upgrade to Pro later to unlock premium features and enhance your Spanish learning experience.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/pro" className="block">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Try Pro Again
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button 
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}