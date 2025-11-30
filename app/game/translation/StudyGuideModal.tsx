'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'


interface StudyGuideModalProps {
  quizId: string | null;      // Modal auto-opens when quizId is provided
  onComplete: () => void;     // Called when user closes modal
}

export default function StudyGuideModal({ quizId, onComplete }: StudyGuideModalProps) {
  const [studyGuide, setStudyGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Fetch study guide from database when quizId changes
  useEffect(() => {
    if (!quizId) {
      setStudyGuide(null);
      return;
    }

    const fetchStudyGuide = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/translation/quizzes/${quizId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const data = await response.json();
        setStudyGuide(data.quiz.study_guide);
      } catch (error) {
        console.error('Error fetching study guide:', error);
        toast.error('Failed to load study guide');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyGuide();
  }, [quizId]);

  const isOpen = !!quizId;

  const handleClose = () => {
    setStudyGuide(null);
    setEmailSent(false);
    onComplete();
  };

  const handleEmailStudyGuide = async () => {
    if (!quizId) return;

    setIsSendingEmail(true);

    try {
      const response = await fetch('/api/translation/email-study-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailSent(true);
      toast.success('Study guide sent to your email!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative pointer-events-auto"
            >
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="border-b px-6 py-4 sticky top-0 bg-white rounded-t-lg z-10">
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold pr-8">Your Study Guide 📚</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on your quiz mistakes, here are key takeaways to help you improve
                    </p>
                  </div>

                  {/* Content */}
                  <div className="px-6 py-4">
                    {studyGuide ? (
                      // <div
                      //   className="prose prose-sm max-w-none bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400"
                      //   dangerouslySetInnerHTML={{ __html: studyGuide }}
                      // />
                      <div 
                      // className="prose [&_ol]:list-decimal[&_ol]:ml-6 [&_ul]:list-disc [&_ul]:ml-6 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg max-w-none bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400"
                      className="prose prose-sm lg:prose-lg max-w-none bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{studyGuide}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No study guide available for this quiz.</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t px-6 py-4 flex flex-col sm:flex-row gap-2 sm:justify-end bg-white rounded-b-lg sticky bottom-0">
                    <Button
                      onClick={handleEmailStudyGuide}
                      disabled={isSendingEmail || emailSent || !studyGuide}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {isSendingEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : emailSent ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Email Sent ✓
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Email Me This
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleClose}
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
