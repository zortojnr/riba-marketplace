import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Utensils, 
  ShoppingBag, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Store as StoreIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { OnboardingHeader } from '@/components/layout/OnboardingHeader';
import { supabase } from '@/lib/supabase';

// Validation schemas for each step
const businessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(['food', 'products', 'services']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
});

const contactInfoSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

const storeSetupSchema = z.object({
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  slug: z.string().min(3, 'Store URL must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Store URL can only contain lowercase letters, numbers, and hyphens'),
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please select a valid color'),
});

type BusinessInfoData = z.infer<typeof businessInfoSchema>;
type ContactInfoData = z.infer<typeof contactInfoSchema>;
type StoreSetupData = z.infer<typeof storeSetupSchema>;

type OnboardingStep = 'business' | 'contact' | 'store' | 'complete';

const STEPS = {
  BUSINESS: 'business' as const,
  CONTACT: 'contact' as const,
  STORE: 'store' as const,
  COMPLETE: 'complete' as const,
};

const businessTypes = [
  { value: 'food', label: 'Food & Restaurant', icon: Utensils, description: 'Restaurants, cafes, food vendors' },
  { value: 'products', label: 'Products & Retail', icon: ShoppingBag, description: 'Physical products, merchandise' },
  { value: 'services', label: 'Services', icon: Briefcase, description: 'Professional services, consultations' },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(STEPS.BUSINESS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form hooks for each step
  const businessForm = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: '',
      businessType: undefined,
      description: '',
    },
  });

  const contactForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      website: '',
    },
  });

  const storeForm = useForm<StoreSetupData>({
    resolver: zodResolver(storeSetupSchema),
    defaultValues: {
      storeName: '',
      slug: '',
      themeColor: '#3B82F6',
    },
  });

  const steps = [
    { key: 'business', title: 'Business Information', icon: Building2 },
    { key: 'contact', title: 'Contact Details', icon: MapPin },
    { key: 'store', title: 'Store Setup', icon: StoreIcon },
    { key: 'complete', title: 'Complete', icon: CheckCircle },
  ];

  const handleNextStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 'business':
        isValid = await businessForm.trigger();
        if (isValid) setCurrentStep('contact');
        break;
      case 'contact':
        isValid = await contactForm.trigger();
        if (isValid) setCurrentStep('store');
        break;
      case 'store':
        isValid = await storeForm.trigger();
        if (isValid) {
          await handleCompleteOnboarding();
        }
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'contact':
        setCurrentStep('business');
        break;
      case 'store':
        setCurrentStep('contact');
        break;
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!user) {
      toast.error('You must be signed in to create a store.');
      return;
    }

    setIsSubmitting(true);
    try {
      const business = businessForm.getValues();
      const contact = contactForm.getValues();
      const store = storeForm.getValues();

      const { data: existing, error: lookupError } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', store.slug)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existing) {
        storeForm.setError('slug', {
          type: 'manual',
          message: 'That store URL is taken. Please choose another.',
        });
        setCurrentStep(STEPS.STORE);
        return;
      }

      const { error: insertError } = await supabase.from('stores').insert({
        owner_id: user.id,
        name: store.storeName,
        business_name: business.businessName,
        business_type: business.businessType,
        description: business.description,
        phone: contact.phone,
        address: contact.address,
        city: contact.city,
        state: contact.state,
        website: contact.website || null,
        slug: store.slug,
        theme_color: store.themeColor,
      });

      if (insertError) {
        if (insertError.code === '23505') {
          storeForm.setError('slug', {
            type: 'manual',
            message: 'That store URL is taken. Please choose another.',
          });
          setCurrentStep(STEPS.STORE);
          return;
        }
        throw insertError;
      }

      toast.success('Store setup completed successfully!');
      setCurrentStep(STEPS.COMPLETE);

      // Redirect to the dashboard; there are no products yet, so the public
      // storefront isn't a useful first stop.
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'business':
        return (
          <motion.div
            key="business"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  {...businessForm.register('businessName')}
                  type="text"
                  className="input input--with-icon pr-4 py-3 w-full placeholder-gray-500"
                  placeholder="Enter your business name"
                />
              </div>
              {businessForm.formState.errors.businessName && (
                <p className="mt-2 text-sm text-red-600">
                  {businessForm.formState.errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Business Type *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {businessTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary-300 hover:bg-primary-50"
                    >
                      <input
                        type="radio"
                        {...businessForm.register('businessType')}
                        value={type.value}
                        className="sr-only"
                      />
                      <Icon className="h-6 w-6 text-gray-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        businessForm.watch('businessType') === type.value
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-gray-300'
                      }`}>
                        {businessForm.watch('businessType') === type.value && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              {businessForm.formState.errors.businessType && (
                <p className="mt-2 text-sm text-red-600">
                  {businessForm.formState.errors.businessType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                {...businessForm.register('description')}
                rows={4}
                className="input resize-none w-full"
                placeholder="Tell us about your business..."
              />
              {businessForm.formState.errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {businessForm.formState.errors.description.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {businessForm.watch('description')?.length || 0}/500 characters
              </p>
            </div>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    {...contactForm.register('phone')}
                    type="tel"
                    className="input input--with-icon pr-4 py-3 w-full placeholder-gray-500"
                  placeholder="Enter phone number"
                  />
                </div>
                {contactForm.formState.errors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {contactForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    {...contactForm.register('website')}
                    type="url"
                    className="input input--with-icon pr-4 py-3 w-full placeholder-gray-500"
                  placeholder="https://yoursite.com"
                  />
                </div>
                {contactForm.formState.errors.website && (
                  <p className="mt-2 text-sm text-red-600">
                    {contactForm.formState.errors.website.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <textarea
                {...contactForm.register('address')}
                rows={3}
                className="input resize-none w-full"
                placeholder="Enter your business address..."
              />
              {contactForm.formState.errors.address && (
                <p className="mt-2 text-sm text-red-600">
                  {contactForm.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...contactForm.register('city')}
                  type="text"
                  className="input px-4 py-3 w-full"
                  placeholder="Enter city"
                />
                {contactForm.formState.errors.city && (
                  <p className="mt-2 text-sm text-red-600">
                    {contactForm.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...contactForm.register('state')}
                  type="text"
                  className="input px-4 py-3 w-full"
                  placeholder="Enter state"
                />
                {contactForm.formState.errors.state && (
                  <p className="mt-2 text-sm text-red-600">
                    {contactForm.formState.errors.state.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'store':
        return (
          <motion.div
            key="store"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <div className="relative">
                <StoreIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  {...storeForm.register('storeName')}
                  type="text"
                  className="input input--with-icon pr-4 py-3 w-full placeholder-gray-500"
                  placeholder="Enter your store name"
                />
              </div>
              {storeForm.formState.errors.storeName && (
                <p className="mt-2 text-sm text-red-600">
                  {storeForm.formState.errors.storeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store URL *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  riba.store/
                </span>
                <input
                  {...storeForm.register('slug')}
                  type="text"
                  className="input rounded-l-none flex-1 w-full"
                  placeholder="your-store-name"
                />
              </div>
              {storeForm.formState.errors.slug && (
                <p className="mt-2 text-sm text-red-600">
                  {storeForm.formState.errors.slug.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This will be your store's web address
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color *
              </label>
              <div className="flex items-center gap-4">
                <input
                  {...storeForm.register('themeColor')}
                  type="color"
                  className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  {...storeForm.register('themeColor')}
                  type="text"
                  className="input flex-1 w-full"
                  placeholder="#3B82F6"
                />
              </div>
              {storeForm.formState.errors.themeColor && (
                <p className="mt-2 text-sm text-red-600">
                  {storeForm.formState.errors.themeColor.message}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup Complete!
              </h2>
              <p className="text-gray-600">
                Your store is ready. Redirecting to your dashboard...
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (currentStep === STEPS.COMPLETE) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {renderStepContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-8">
      <OnboardingHeader />
      <div className="max-w-4xl mx-auto pt-20">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.key === currentStep;
              const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary-600 text-white shadow-lg' :
                      isCompleted ? 'bg-green-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-primary-600' :
                      isCompleted ? 'text-green-600' :
                      'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-1 mx-4 mt-6 transition-all ${
                      isCompleted ? 'bg-green-600' :
                      step.key === currentStep ? 'bg-primary-300' :
                      'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Set Up Your Business
              </h1>
              <p className="text-gray-600">
                {currentStep === STEPS.BUSINESS && 'Tell us about your business'}
                {currentStep === STEPS.CONTACT && 'How can customers reach you?'}
                {currentStep === STEPS.STORE && 'Create your online store'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {(currentStep as OnboardingStep) !== STEPS.COMPLETE && (
            <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-between">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === STEPS.BUSINESS}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              
              <button
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === STEPS.STORE ? 'Complete Setup' : 'Continue'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip onboarding for now
          </Link>
        </div>
      </div>
    </div>
  );
};