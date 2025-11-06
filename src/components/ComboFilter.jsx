import { useState, useEffect, useRef } from 'react';
import { Filter, Smartphone, X, CheckCircle, Search } from 'lucide-react';

const ComboFilter = ({ combos, onFilterResults, selectedCombo, onComboSelect }) => {
    const [showComboSelector, setShowComboSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Get unique combo names
    const uniqueComboNames = [...new Set(combos.map(combo => combo.comboName))].sort();

    // Filter combo names based on search
    const filteredComboNames = uniqueComboNames.filter(comboName =>
        comboName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowComboSelector(false);
            }
        };

        if (showComboSelector) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showComboSelector]);

    // Get mobile names for selected combo
    const getMobileNamesForCombo = (comboName) => {
        const comboData = combos.find(combo => combo.comboName === comboName);
        return comboData ? comboData.mobileNames || [] : [];
    };

    const handleComboSelect = (comboName) => {
        onComboSelect(comboName);
        setShowComboSelector(false);
        setSearchTerm('');

        // Filter results to show mobiles for this combo
        const mobileNames = getMobileNamesForCombo(comboName);
        onFilterResults(mobileNames);
    };

    const handleClearFilter = () => {
        onComboSelect(null);
        onFilterResults([]);
        setSearchTerm('');
        setShowComboSelector(false);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowComboSelector(false);
            setSearchTerm('');
        }
    };

    const selectedMobileNames = selectedCombo ? getMobileNamesForCombo(selectedCombo) : [];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-visible mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-green-500" />
                        Combo Filter
                    </h3>
                    <span className="text-xs sm:text-sm font-normal text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                        Select a combo to see supported mobiles
                    </span>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
                {/* Combo Selector */}
                <div className="space-y-4">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowComboSelector(!showComboSelector)}
                            className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Smartphone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span className={`truncate ${selectedCombo ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {selectedCombo || 'Select a combo to filter...'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                {selectedCombo && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClearFilter();
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Clear filter"
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                )}
                                <Filter className={`w-4 h-4 transition-transform duration-200 ${showComboSelector ? 'rotate-180 text-blue-500' : 'text-gray-500'
                                    }`} />
                            </div>
                        </button>

                        {/* Dropdown */}
                        {showComboSelector && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                                {/* Search input */}
                                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50/50">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Search combo names..."
                                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm text-gray-900 placeholder-gray-500 bg-white"
                                            autoFocus
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Combo list */}
                                <div className="max-h-72 overflow-y-auto">
                                    {filteredComboNames.length > 0 ? (
                                        <div className="py-2">
                                            {filteredComboNames.map((comboName) => (
                                                <button
                                                    key={comboName}
                                                    onClick={() => handleComboSelect(comboName)}
                                                    className={`w-full text-left px-3 sm:px-4 py-3 hover:bg-blue-50 flex items-center justify-between group transition-all duration-200 border-l-4 ${selectedCombo === comboName
                                                        ? 'border-l-green-500 bg-green-50'
                                                        : 'border-l-transparent hover:border-l-blue-300'
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`font-medium truncate block ${selectedCombo === comboName
                                                            ? 'text-green-700'
                                                            : 'text-gray-900 group-hover:text-blue-700'
                                                            }`}>
                                                            {comboName}
                                                        </span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {getMobileNamesForCombo(comboName).length} mobile{getMobileNamesForCombo(comboName).length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                    {selectedCombo === comboName && (
                                                        <CheckCircle className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-8 text-center text-gray-500">
                                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                            <p className="font-medium">No combos found</p>
                                            <p className="text-sm">Try adjusting your search term</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Combo Info */}
                    {selectedCombo && selectedMobileNames.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Smartphone className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-blue-900 text-lg sm:text-xl truncate">
                                        "{selectedCombo}"
                                    </h4>
                                    <p className="text-blue-700 text-sm">
                                        Supports {selectedMobileNames.length} mobile device{selectedMobileNames.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-semibold flex-shrink-0">
                                    {selectedMobileNames.length} device{selectedMobileNames.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="text-sm font-semibold text-blue-800">
                                    Supported Mobile Devices:
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {selectedMobileNames.map((mobileName, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-blue-200 text-blue-900 px-3 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group hover:scale-[1.02]"
                                        >
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span className="truncate">{mobileName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedCombo && selectedMobileNames.length === 0 && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-yellow-800">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Filter className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-lg block">No mobiles found</span>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        The combo "{selectedCombo}" doesn't have any mobile devices assigned yet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComboFilter;