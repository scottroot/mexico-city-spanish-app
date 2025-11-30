'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, BookOpen, Globe, Utensils, Briefcase, Home, MessageSquare, Heart, Clock } from 'lucide-react';
import { VerbGroup } from '../verb-groups';

interface PresetGroupSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  groups: VerbGroup[];
  selectedGroupId?: string;
  onSelectGroup: (group: VerbGroup) => void;
}

// Map group IDs to icons
const groupIcons: Record<string, React.ReactNode> = {
  'top-25': <BookOpen className="w-5 h-5" />,
  'top-50': <BookOpen className="w-5 h-5" />,
  'top-100': <BookOpen className="w-5 h-5" />,
  'travel': <Globe className="w-5 h-5" />,
  'food': <Utensils className="w-5 h-5" />,
  'work': <Briefcase className="w-5 h-5" />,
  'daily-routine': <Clock className="w-5 h-5" />,
  'communication': <MessageSquare className="w-5 h-5" />,
  'household': <Home className="w-5 h-5" />,
  'emotions': <Heart className="w-5 h-5" />,
};

// Map categories to colors
const categoryColors: Record<VerbGroup['category'], string> = {
  frequency: 'bg-blue-100 text-blue-800 border-blue-300',
  thematic: 'bg-green-100 text-green-800 border-green-300',
  level: 'bg-purple-100 text-purple-800 border-purple-300',
};

export default function PresetGroupSelector({
  isOpen,
  onClose,
  groups,
  selectedGroupId,
  onSelectGroup,
}: PresetGroupSelectorProps) {
  if (!isOpen) return null;

  // Group by category
  const frequencyGroups = groups.filter(g => g.category === 'frequency');
  const thematicGroups = groups.filter(g => g.category === 'thematic');
  const levelGroups = groups.filter(g => g.category === 'level');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Preset Verb Group
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[65vh] overflow-y-auto">
          {/* Frequency Groups */}
          {frequencyGroups.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Most Common Verbs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {frequencyGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => onSelectGroup(group)}
                    icon={groupIcons[group.id]}
                    colorClass={categoryColors[group.category]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Thematic Groups */}
          {thematicGroups.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Thematic Groups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {thematicGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => onSelectGroup(group)}
                    icon={groupIcons[group.id]}
                    colorClass={categoryColors[group.category]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Level Groups */}
          {levelGroups.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                By Level
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {levelGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => onSelectGroup(group)}
                    icon={groupIcons[group.id]}
                    colorClass={categoryColors[group.category]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {selectedGroupId
                ? `Selected: ${groups.find(g => g.id === selectedGroupId)?.name}`
                : 'No group selected'}
            </span>
            <Button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Group Card Component
interface GroupCardProps {
  group: VerbGroup;
  isSelected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  colorClass: string;
}

function GroupCard({ group, isSelected, onSelect, icon, colorClass }: GroupCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-lg border-2 text-left transition-all
        ${isSelected
          ? 'border-orange-500 bg-orange-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      )}

      {/* Icon and Title */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorClass} border`}>
          {icon || <BookOpen className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{group.name}</h4>
          <Badge variant="secondary" className="mt-1 text-xs">
            {group.verbs.length} verbs
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-2">
        {group.description}
      </p>
    </button>
  );
}
