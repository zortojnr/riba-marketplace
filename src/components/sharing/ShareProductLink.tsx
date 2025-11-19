import React, { useState } from 'react';
import { Share2, Copy, Check, Link2, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareProductLinkProps {
  productId: string;
  productName: string;
  businessSlug: string;
  businessName: string;
  onClose: () => void;
}

export const ShareProductLink: React.FC<ShareProductLinkProps> = ({
  productId,
  productName,
  businessSlug,
  businessName,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'whatsapp'>('link');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Generate a secure token for the shared link
  const generateShareToken = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `share-${productId}-${timestamp}-${randomString}`;
  };

  const shareToken = generateShareToken();
  const shareUrl = `${window.location.origin}/store/${businessSlug}/product/${productId}?token=${shareToken}&ref=shared`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Product link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link to clipboard');
    }
  };

  const shareViaEmail = () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const subject = `Check out this product from ${businessName}`;
    const body = `Hi there!\n\nI wanted to share this amazing product with you:\n\n${productName}\n\nYou can view it here: ${shareUrl}\n\n${message ? `Message: ${message}\n\n` : ''}Best regards!`;
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    toast.success('Email draft opened!');
  };

  const shareViaWhatsApp = () => {
    const text = `Check out this product from ${businessName}: ${productName}\n\n${shareUrl}${message ? `\n\n${message}` : ''}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, '_blank');
    toast.success('WhatsApp opened!');
  };

  const handleShare = () => {
    if (shareMethod === 'email') {
      shareViaEmail();
    } else if (shareMethod === 'whatsapp') {
      shareViaWhatsApp();
    } else {
      copyToClipboard();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Product</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Share Method Selection */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setShareMethod('link')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                shareMethod === 'link'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Link2 className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Link</span>
            </button>
            <button
              onClick={() => setShareMethod('email')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                shareMethod === 'email'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mail className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Email</span>
            </button>
            <button
              onClick={() => setShareMethod('whatsapp')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                shareMethod === 'whatsapp'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">WhatsApp</span>
            </button>
          </div>

          {/* Share Content */}
          <AnimatePresence mode="wait">
            {shareMethod === 'link' && (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 p-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {shareMethod === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </motion.div>
            )}

            {shareMethod === 'whatsapp' && (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            onClick={handleShare}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {shareMethod === 'link' ? 'Copy Link' : 
               shareMethod === 'email' ? 'Send Email' : 'Share on WhatsApp'}
            </span>
          </button>

          {/* Info Message */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Customer Access:</strong> Anyone with this link can view the product. 
              They'll need permission from you to make purchases.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};