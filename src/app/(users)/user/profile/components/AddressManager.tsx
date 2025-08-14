'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Navigation, 
  Home,
  Check
} from 'lucide-react';
import { useProfileStore } from '../../../../stores/profileStore';
import { Address, profileService } from '../../../../apiService/profileService';

type AddressManagerProps = {
    className?: string;
};

type AddressFormData = Omit<Address, 'id' | 'created_at' | 'updated_at'>;

export const AddressManager: React.FC<AddressManagerProps> = ({ className = '' }) => {
  const { addresses, fetchAddresses, createAddress, updateAddress, deleteAddress, addressesLoading } = useProfileStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pinCodeLoading, setPinCodeLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address_line1?.trim()) {
      newErrors.address_line1 = 'Address line 1 is required';
    } else if (formData.address_line1.length > 255) {
      newErrors.address_line1 = 'Address line 1 must be less than 255 characters';
    }

    if (formData.address_line2 && formData.address_line2.length > 255) {
      newErrors.address_line2 = 'Address line 2 must be less than 255 characters';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.length > 100) {
      newErrors.city = 'City must be less than 100 characters';
    }

    if (!formData.state?.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.length > 100) {
      newErrors.state = 'State must be less than 100 characters';
    }

    if (!formData.postal_code?.trim()) {
      newErrors.postal_code = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Postal code must be 6 digits';
    }

    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required';
    } else if (formData.country.length > 100) {
      newErrors.country = 'Country must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const fetchLocationFromPincode = async (pincode: string) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return;
    
    setPinCodeLoading(true);
    try {
      const response = await profileService.getLocationFromPincode(pincode);
      if (response.Status === 'Success' && response.PostOffice?.[0]) {
        const location = response.PostOffice[0];
        setFormData(prev => ({
          ...prev,
          city: location.District,
          state: location.State,
          country: location.Country,
        }));
        setErrors(prev => ({ ...prev, postal_code: '', city: '', state: '' }));
      } else {
        setErrors(prev => ({ ...prev, postal_code: 'Invalid postal code' }));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setErrors(prev => ({ ...prev, postal_code: 'Failed to fetch location details' }));
    } finally {
      setPinCodeLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const coords = await profileService.getCurrentLocation();
      const address = await profileService.reverseGeocode(coords.latitude, coords.longitude);
      
      if (address?.address) {
        const addr = address.address;
        setFormData(prev => ({
          ...prev,
          address_line1: `${addr.house_number || ''} ${addr.road || ''}`.trim(),
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          postal_code: addr.postcode || '',
          country: addr.country || 'India',
        }));
      }
    } catch (error: any) {
      console.error('Error getting current location:', error);
      alert(error.message || 'Failed to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      is_default: false,
    });
    setErrors({});
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (address: Address) => {
    setFormData({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country || 'India',
      is_default: address.is_default || false,
    });
    setEditingId(address.id!);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    let success = false;
    if (isAdding) {
      success = await createAddress(formData);
    } else if (editingId) {
      success = await updateAddress(editingId, formData);
    }

    if (success) {
      setIsAdding(false);
      setEditingId(null);
      resetForm();
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Address Management</h2>
            <p className="text-sm text-gray-500">Manage your delivery addresses</p>
          </div>
        </div>
        
        {!isFormOpen && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Add/Edit Form */}
        {isFormOpen && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isAdding ? 'Add New Address' : 'Edit Address'}
            </h3>
            
            <div className="space-y-4">
              {/* Location Helper Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {locationLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  Use Current Location
                </button>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) => handleInputChange('address_line1', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.address_line1 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="House/Building number, Street name"
                />
                {errors.address_line1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.address_line1}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.address_line2 || ''}
                  onChange={(e) => handleInputChange('address_line2', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.address_line2 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Landmark, Area (optional)"
                />
                {errors.address_line2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.address_line2}</p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('postal_code', value);
                      if (value.length === 6) {
                        fetchLocationFromPincode(value);
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.postal_code ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="6-digit postal code"
                    maxLength={6}
                  />
                  {pinCodeLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
                )}
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.state ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.country ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Country"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              {/* Default Address */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => handleInputChange('is_default', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={addressesLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {addressesLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isAdding ? 'Add Address' : 'Update Address'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={addressesLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses added</h3>
              <p className="text-gray-500 mb-4">Add your first address to get started</p>
              {!isFormOpen && (
                <button
                  onClick={startAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              )}
            </div>
          ) : (
            addresses.map((address: Address) => (
              <div
                key={address.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          <Check className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">{address.address_line1}</p>
                    {address.address_line2 && (
                      <p className="text-gray-600">{address.address_line2}</p>
                    )}
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.postal_code}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => startEdit(address)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
