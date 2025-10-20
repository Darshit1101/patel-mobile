import { useState, useEffect } from 'react';
import {
    Smartphone,
    Edit3,
    Plus,
    Trash2,
    Save,
    Sparkles,
    ArrowLeft,
    Check,
    AlertTriangle,
    Loader2
} from 'lucide-react';

const ComboForm = ({ combo, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        comboName: '',
        mobileNames: ['']
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (combo && isEditing) {
            setFormData({
                comboName: combo.comboName || '',
                mobileNames: combo.mobileNames && combo.mobileNames.length > 0 ? combo.mobileNames : ['']
            });
        }
    }, [combo, isEditing]);

    const handleComboNameChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, comboName: value }));

        // Clear combo name error when user starts typing
        if (errors.comboName) {
            setErrors(prev => ({ ...prev, comboName: '' }));
        }
    };

    const handleMobileNameChange = (index, value) => {
        const newMobileNames = [...formData.mobileNames];
        newMobileNames[index] = value;
        setFormData(prev => ({ ...prev, mobileNames: newMobileNames }));

        // Clear mobile names error when user starts typing
        if (errors.mobileNames) {
            setErrors(prev => ({ ...prev, mobileNames: '' }));
        }
    };

    const addMobileField = () => {
        setFormData(prev => ({
            ...prev,
            mobileNames: [...prev.mobileNames, '']
        }));
    };

    const removeMobileField = (index) => {
        if (formData.mobileNames.length > 1) {
            const newMobileNames = formData.mobileNames.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, mobileNames: newMobileNames }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.comboName.trim()) {
            newErrors.comboName = 'Combo name is required';
        }

        const validMobileNames = formData.mobileNames.filter(name => name && name.trim());
        if (validMobileNames.length === 0) {
            newErrors.mobileNames = 'At least one mobile name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // Filter out empty mobile names before submitting
            const cleanedData = {
                ...formData,
                mobileNames: formData.mobileNames.filter(name => name && name.trim())
            };

            await onSubmit(cleanedData);
            if (!isEditing) {
                setFormData({ comboName: '', mobileNames: [''] });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 sm:px-8 sm:py-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        {isEditing ? <Edit3 size={20} /> : <Smartphone size={20} />}
                    </div>
                    {isEditing ? 'Edit Combo' : 'Create New Combo'}
                </h3>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                    {isEditing ? 'Update your mobile combo details' : 'Add a new mobile combination to your collection'}
                </p>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Combo Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="comboName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Combo Name
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="comboName"
                                name="comboName"
                                value={formData.comboName}
                                onChange={handleComboNameChange}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder-grey text-black ${errors.comboName
                                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                                    : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white hover:border-gray-300'
                                    }`}
                                placeholder="Enter the combo name"
                            />
                            {formData.comboName && (
                                <div className="absolute right-3 top-3 text-green-500">
                                    <Check size={18} />
                                </div>
                            )}
                        </div>
                        {errors.comboName && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                                <AlertTriangle size={16} />
                                {errors.comboName}
                            </div>
                        )}
                    </div>

                    {/* Mobile Names Fields */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Mobile Devices
                            <span className="text-red-500">*</span>
                            <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {formData.mobileNames.filter(name => name.trim()).length} device(s)
                            </span>
                        </label>

                        <div className="space-y-3">
                            {formData.mobileNames.map((mobileName, index) => (
                                <div key={index} className="group">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={mobileName}
                                                onChange={(e) => handleMobileNameChange(index, e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 placeholder-grey text-black ${errors.mobileNames
                                                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                                                    : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white hover:border-gray-300'
                                                    }`}
                                                placeholder={`Enter mobile device (e.g., iPhone 15 Pro Max, Samsung Galaxy S24 Ultra)`}
                                            />
                                            <div className="absolute left-12 top-3 w-px h-4 bg-gray-300"></div>
                                            {mobileName.trim() && (
                                                <div className="absolute right-3 top-3 text-green-500">
                                                    <Check size={18} />
                                                </div>
                                            )}
                                        </div>

                                        {formData.mobileNames.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMobileField(index)}
                                                className="w-full sm:w-auto px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
                                                title="Remove this mobile"
                                            >
                                                <Trash2 size={18} />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addMobileField}
                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            Add Another Mobile
                        </button>

                        {errors.mobileNames && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                <AlertTriangle size={16} />
                                {errors.mobileNames}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {isEditing ? <Save size={20} /> : <Sparkles size={20} />}
                                    {isEditing ? 'Update Combo' : 'Create Combo'}
                                </>
                            )}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 sm:flex-none px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 flex items-center justify-center gap-2 font-medium border border-gray-200 hover:border-gray-300"
                            >
                                <ArrowLeft size={18} />
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComboForm;