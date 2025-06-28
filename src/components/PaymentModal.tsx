import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppValidator } from '../utils/validation';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onPaymentSuccess: (paymentData: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  onPaymentSuccess
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'ecocash' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    // Validate inputs before processing
    const errors: string[] = [];
    
    // Validate network connection
    const networkValidation = AppValidator.validateNetworkForOperation('payment');
    if (!networkValidation.isValid) {
      errors.push(...networkValidation.errors);
    }
    
    // Validate payment amount
    const amountValidation = AppValidator.validatePaymentAmount(amount);
    if (!amountValidation.isValid) {
      errors.push(...amountValidation.errors);
    }
    
    // Validate phone number for mobile payments
    if (paymentMethod === 'mpesa' || paymentMethod === 'ecocash') {
      const country = paymentMethod === 'mpesa' ? 'KE' : 'ZW';
      const phoneValidation = AppValidator.validatePhoneNumber(phoneNumber, country);
      if (!phoneValidation.isValid) {
        errors.push(...phoneValidation.errors);
      }
      
      // Validate PIN
      const pinValidation = AppValidator.validatePaymentPIN(pin);
      if (!pinValidation.isValid) {
        errors.push(...pinValidation.errors);
      }
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentData = {
      method: paymentMethod,
      amount,
      phoneNumber,
      transactionId: `TXN${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onPaymentSuccess(paymentData);
      onClose();
      setIsSuccess(false);
      setPhoneNumber('');
      setPin('');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 glass-button rounded-full flex items-center justify-center mx-auto mb-6 glow-green">
            <Check className="h-10 w-10 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Payment Successful!</h3>
          <p className="text-gray-300">KSH {amount} has been processed successfully</p>
          <div className="flex justify-center mt-4">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{t('makePayment')}</h2>
          <button 
            onClick={onClose} 
            className="glass-button p-2 rounded-full hover-lift text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="glass-button rounded-xl p-4 mb-4">
            <div className="text-sm text-gray-300">{description}</div>
            <div className="text-3xl font-bold text-white">KSH {amount}</div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Payment Method
          </label>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('mpesa')}
              className={`w-full p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 hover-lift ${
                paymentMethod === 'mpesa' 
                  ? 'glass-card glow-green' 
                  : 'glass-button'
              }`}
            >
              <div className="p-2 glass-button rounded-full">
                <Smartphone className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-white">M-Pesa</div>
                <div className="text-sm text-gray-300">Safaricom M-Pesa</div>
              </div>
            </button>
            
            <button
              onClick={() => setPaymentMethod('ecocash')}
              className={`w-full p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 hover-lift ${
                paymentMethod === 'ecocash' 
                  ? 'glass-card glow-blue' 
                  : 'glass-button'
              }`}
            >
              <div className="p-2 glass-button rounded-full">
                <Banknote className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-white">EcoCash</div>
                <div className="text-sm text-gray-300">Econet EcoCash</div>
              </div>
            </button>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 hover-lift ${
                paymentMethod === 'card' 
                  ? 'glass-card glow-orange' 
                  : 'glass-button'
              }`}
            >
              <div className="p-2 glass-button rounded-full">
                <CreditCard className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-white">Bank Card</div>
                <div className="text-sm text-gray-300">Visa/Mastercard</div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {(paymentMethod === 'mpesa' || paymentMethod === 'ecocash') && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={paymentMethod === 'mpesa' ? '+254 7XX XXX XXX' : '+263 7X XXX XXXX'}
                className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {paymentMethod === 'mpesa' ? 'M-Pesa PIN' : 'EcoCash PIN'}
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                maxLength={4}
                className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 glass-button rounded-xl border border-red-400">
            <div className="text-red-400 font-medium mb-2">Please fix the following errors:</div>
            <ul className="text-sm text-red-300 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={3}
                  className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 glass-button rounded-xl font-medium hover-lift text-white"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !phoneNumber || !pin}
            className="flex-1 py-3 glass-card rounded-xl font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed text-white glow-green"
          >
            {isProcessing ? 'Processing...' : `Pay KSH ${amount}`}
          </button>
        </div>

        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
              <span>Processing payment...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;