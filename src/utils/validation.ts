// Validation utilities for AgriMaster app

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AppValidator {
  
  // Validate phone number for payment systems
  static validatePhoneNumber(phone: string, country: 'KE' | 'ZW' = 'KE'): ValidationResult {
    const errors: string[] = [];
    
    if (!phone || phone.trim() === '') {
      errors.push('Phone number is required');
      return { isValid: false, errors };
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    
    if (country === 'KE') {
      // Kenyan phone number validation
      const kenyanPattern = /^(\+254|254|0)?[17]\d{8}$/;
      if (!kenyanPattern.test(cleanPhone)) {
        errors.push('Invalid Kenyan phone number format. Use +254XXXXXXXXX or 07XXXXXXXX');
      }
    } else if (country === 'ZW') {
      // Zimbabwean phone number validation
      const zimbabweanPattern = /^(\+263|263|0)?7[1-9]\d{7}$/;
      if (!zimbabweanPattern.test(cleanPhone)) {
        errors.push('Invalid Zimbabwean phone number format. Use +263XXXXXXXXX or 07XXXXXXXX');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate payment PIN
  static validatePaymentPIN(pin: string): ValidationResult {
    const errors: string[] = [];
    
    if (!pin || pin.trim() === '') {
      errors.push('PIN is required');
      return { isValid: false, errors };
    }

    if (pin.length !== 4) {
      errors.push('PIN must be exactly 4 digits');
    }

    if (!/^\d{4}$/.test(pin)) {
      errors.push('PIN must contain only numbers');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate crop data
  static validateCropData(cropData: any): ValidationResult {
    const errors: string[] = [];
    
    if (!cropData.name || cropData.name.trim() === '') {
      errors.push('Crop name is required');
    }

    if (!cropData.area || cropData.area <= 0) {
      errors.push('Crop area must be greater than 0');
    }

    if (!cropData.plantDate) {
      errors.push('Plant date is required');
    } else {
      const plantDate = new Date(cropData.plantDate);
      const today = new Date();
      if (plantDate > today) {
        errors.push('Plant date cannot be in the future');
      }
    }

    if (cropData.health !== undefined && (cropData.health < 0 || cropData.health > 100)) {
      errors.push('Health score must be between 0 and 100');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate livestock data
  static validateLivestockData(livestockData: any): ValidationResult {
    const errors: string[] = [];
    
    if (!livestockData.type || livestockData.type.trim() === '') {
      errors.push('Livestock type is required');
    }

    if (!livestockData.count || livestockData.count <= 0) {
      errors.push('Livestock count must be greater than 0');
    }

    if (!Number.isInteger(livestockData.count)) {
      errors.push('Livestock count must be a whole number');
    }

    if (livestockData.lastCheckup) {
      const checkupDate = new Date(livestockData.lastCheckup);
      const today = new Date();
      if (checkupDate > today) {
        errors.push('Last checkup date cannot be in the future');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate payment amount
  static validatePaymentAmount(amount: number, maxAmount?: number): ValidationResult {
    const errors: string[] = [];
    
    if (!amount || amount <= 0) {
      errors.push('Payment amount must be greater than 0');
    }

    if (amount > 1000000) {
      errors.push('Payment amount cannot exceed KSH 1,000,000');
    }

    if (maxAmount && amount > maxAmount) {
      errors.push(`Payment amount cannot exceed KSH ${maxAmount.toLocaleString()}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate email address
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || email.trim() === '') {
      errors.push('Email address is required');
      return { isValid: false, errors };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push('Invalid email address format');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate user profile data
  static validateUserProfile(userData: any): ValidationResult {
    const errors: string[] = [];
    
    if (!userData.name || userData.name.trim() === '') {
      errors.push('Name is required');
    }

    if (userData.name && userData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!userData.location || userData.location.trim() === '') {
      errors.push('Location is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate network connection for critical operations
  static validateNetworkForOperation(operationType: 'payment' | 'sync' | 'backup'): ValidationResult {
    const errors: string[] = [];
    
    if (!navigator.onLine) {
      errors.push('Internet connection is required for this operation');
      return { isValid: false, errors };
    }

    // Check connection quality for critical operations
    const connection = (navigator as any).connection;
    if (connection) {
      const slowConnections = ['slow-2g', '2g'];
      if (operationType === 'payment' && slowConnections.includes(connection.effectiveType)) {
        errors.push('Stable internet connection required for payments. Please try again when you have better connectivity.');
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}

// Export validation functions for easy use
export const {
  validatePhoneNumber,
  validatePaymentPIN,
  validateCropData,
  validateLivestockData,
  validatePaymentAmount,
  validateEmail,
  validateUserProfile,
  validateNetworkForOperation
} = AppValidator;