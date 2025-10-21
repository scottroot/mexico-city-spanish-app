'use client'

import React from "react";
import Link from "next/link";
import { Crown, CreditCard } from "lucide-react";
import { useBilling } from "../../../hooks/useBilling";

interface GoProButtonProps {
  user: any;
}

const ManageBillingButton: React.FC<GoProButtonProps> = ({ user }) => {
  const { hasAccess, loading: billingLoading, manageBilling } = useBilling();

  if (!user || billingLoading) return null;

  return (
    <button
      onClick={() => manageBilling()}
      className="flex items-center justify-center xl:justify-start gap-3 w-auto xl:w-full hover:bg-gray-50 xl:hover:bg-transparent rounded-lg xl:rounded-full p-2 xl:p-0 transition-all duration-200"
      title="Manage Billing"
    >
      <CreditCard className="w-5 h-5 xl:w-6 xl:h-8 text-gray-500 hover:text-gray-700" />
      <span className="hidden xl:block text-sm font-medium text-gray-700">Manage Billing</span>
    </button>
  );
};

const GoProButton: React.FC<GoProButtonProps> = ({ user }) => {
  const { hasAccess, loading: billingLoading, manageBilling } = useBilling();

  if (!user || billingLoading || hasAccess) return null;


  return (
    <Link
      href="/pro"
      className="group flex items-center gap-3 transition-all duration-200
      w-auto justify-center xl:w-full xl:justify-start xl:rounded-full xl:p-0 "
      title="Go Pro"
      aria-label="Go Pro"
    >
      <div className="flex items-center justify-center w-10 h-10">
        <Crown className="w-full text-gray-500 group-hover:text-yellow-600" />
      </div>
      <span className="hidden xl:block text-sm font-medium text-gray-700 group-hover:text-yellow-600">Go Pro</span>
    </Link>
  );
};

export default GoProButton;
