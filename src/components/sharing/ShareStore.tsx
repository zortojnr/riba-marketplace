import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Link,
  FileText,
  Facebook,
  Twitter,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface ShareStoreProps {
  storeName: string;
  storeUrl: string;
  themeColor?: string;
}

interface ShareMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const shareMethods: ShareMethod[] = [
  {
    id: 'qr',
    name: 'QR Code',
    icon: QrCode,
    description: 'Generate a scannable QR code for your store'
  },
  {
    id: 'flyer',
    name: 'Digital Flyer',
    icon: FileText,
    description: 'Create a beautiful promotional flyer'
  },
  {
    id: 'link',
    name: 'Short Link',
    icon: Link,
    description: 'Get a short, shareable link'
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: Share2,
    description: 'Share directly to social platforms'
  }
];

export const ShareStore: React.FC<ShareStoreProps> = ({ 
  storeName, 
  storeUrl, 
  themeColor = '#3B82F6' 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [flyerGenerated, setFlyerGenerated] = useState(false);
  const [shortLink, setShortLink] = useState('');

  const generateQRCode = () => {
    // Simulate QR code generation
    setTimeout(() => {
      setQrCodeGenerated(true);
      toast.success('QR Code generated successfully!');
    }, 1000);
  };

  const generateFlyer = () => {
    // Simulate flyer generation
    setTimeout(() => {
      setFlyerGenerated(true);
      toast.success('Digital flyer created successfully!');
    }, 1500);
  };

  const generateShortLink = () => {
    // Simulate short link generation
    const short = `riba.store/${storeName.toLowerCase().replace(/\s+/g, '-')}`;
    setShortLink(short);
    toast.success('Short link generated!');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const downloadQRCode = () => {
    toast.success('QR Code downloaded!');
  };

  const downloadFlyer = () => {
    toast.success('Flyer downloaded!');
  };

  const shareOnSocial = (platform: string) => {
    const text = `Check out ${storeName} on RIBA!`;
    const url = storeUrl;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const renderQRCodeContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code</h3>
        <p className="text-gray-600">Customers can scan this code to visit your store</p>
      </div>
      
      {!qrCodeGenerated ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg mb-4">
            <QrCode className="h-16 w-16 text-gray-400" />
          </div>
          <button
            onClick={generateQRCode}
            className="btn btn-primary"
          >
            Generate QR Code
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center w-48 h-48 bg-white border-2 border-gray-200 rounded-lg p-4 mx-auto mb-4"
            style={{ borderColor: themeColor }}
          >
            {/* Simulated QR Code */}
            <div className="w-full h-full bg-black grid grid-cols-8 gap-px p-2">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${
                    Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={downloadQRCode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={() => copyToClipboard(storeUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFlyerContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Flyer</h3>
        <p className="text-gray-600">Create a beautiful promotional flyer for your store</p>
      </div>
      
      {!flyerGenerated ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-32 h-40 bg-gray-100 rounded-lg mb-4">
            <FileText className="h-16 w-16 text-gray-400" />
          </div>
          <button
            onClick={generateFlyer}
            className="btn btn-primary"
          >
            Create Flyer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Flyer Preview */}
          <div 
            className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center"
            style={{ borderColor: themeColor }}
          >
            <div className="mb-4">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{storeName}</h4>
              <p className="text-gray-600 mb-4">Visit our online store!</p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <QrCode className="h-20 w-20 text-gray-800 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">Scan to visit our store</p>
              <p className="text-xs text-gray-400 mt-2">{storeUrl}</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={downloadFlyer}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Flyer
            </button>
            <button
              onClick={() => copyToClipboard(storeUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLinkContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Short Link</h3>
        <p className="text-gray-600">Get a short, memorable link for your store</p>
      </div>
      
      {!shortLink ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg mb-4">
            <Link className="h-16 w-16 text-gray-400" />
          </div>
          <button
            onClick={generateShortLink}
            className="btn btn-primary"
          >
            Generate Short Link
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-gray-900">{shortLink}</span>
              <button
                onClick={() => copyToClipboard(shortLink)}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => copyToClipboard(storeUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy Original Link
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSocialContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media</h3>
        <p className="text-gray-600">Share your store on social platforms</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => shareOnSocial('facebook')}
          className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Facebook className="h-5 w-5" />
          <span>Share on Facebook</span>
        </button>
        
        <button
          onClick={() => shareOnSocial('twitter')}
          className="flex items-center gap-3 p-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Twitter className="h-5 w-5" />
          <span>Share on Twitter</span>
        </button>
        
        <button
          onClick={() => shareOnSocial('whatsapp')}
          className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Share on WhatsApp</span>
        </button>
      </div>
      
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => copyToClipboard(storeUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy Link
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMethod) {
      case 'qr':
        return renderQRCodeContent();
      case 'flyer':
        return renderFlyerContent();
      case 'link':
        return renderLinkContent();
      case 'social':
        return renderSocialContent();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Share Your Store</h2>
        </div>
        
        {!selectedMethod && (
          <p className="text-gray-600">
            Choose how you want to share your store with customers
          </p>
        )}
      </div>
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!selectedMethod ? (
            <motion.div
              key="methods"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {shareMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className="p-6 text-left border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {renderContent()}
              
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedMethod(null)}
                  className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 border bg-transparent hover:bg-gray-100 text-gray-700 border-transparent text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sharing options
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};