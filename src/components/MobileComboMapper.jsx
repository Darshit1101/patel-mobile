import { useState, useEffect } from 'react';
import { Filter, Smartphone, X, CheckCircle, Search, List, Info } from 'lucide-react';

const MobileComboMapper = ({ combos }) => {
    const [showMapper, setShowMapper] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMobile, setSelectedMobile] = useState(null);

    // Get all unique mobile names from all combos
    const getAllMobileNames = () => {
        const mobileSet = new Set();
        combos.forEach(combo => {
            if (combo.mobileNames) {
                combo.mobileNames.forEach(mobile => mobileSet.add(mobile));
            }
        });
        return Array.from(mobileSet).sort();
    };

    // Get combos that support a specific mobile
    const getCombosForMobile = (mobileName) => {
        return combos.filter(combo =>
            combo.mobileNames && combo.mobileNames.includes(mobileName)
        );
    };

    const allMobiles = getAllMobileNames();
    const filteredMobiles = allMobiles.filter(mobile =>
        mobile.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const supportingCombos = selectedMobile ? getCombosForMobile(selectedMobile) : [];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <List className="w-5 h-5 text-purple-500" />
                        Mobile-Combo Mapper
                        <span className="text-sm font-normal text-gray-600">
                            Find which combos support each mobile
                        </span>
                    </h3>
                    <button
                        onClick={() => setShowMapper(!showMapper)}
                        className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 ${showMapper
                                ? 'bg-purple-50 border-purple-300 text-purple-700'
                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                            }`}
                    >
                        {showMapper ? 'Hide Mapper' : 'Show Mapper'}
                    </button>
                </div>
            </div>

            {showMapper && (
                <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Mobile Selection */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-purple-500" />
                                Select Mobile ({allMobiles.length} total)
                            </h4>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search mobile names..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Mobile List */}
                            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg shadow-inner bg-gray-50">
                                {filteredMobiles.length > 0 ? (
                                    <div className="p-2">
                                        {filteredMobiles.map((mobile) => (
                                            <button
                                                key={mobile}
                                                onClick={() => setSelectedMobile(mobile === selectedMobile ? null : mobile)}
                                                className={`w-full text-left px-4 py-3 mb-2 rounded-lg border transition-all duration-200 ${selectedMobile === mobile
                                                        ? 'bg-purple-100 border-purple-300 shadow-md transform scale-[1.02]'
                                                        : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-medium ${selectedMobile === mobile ? 'text-purple-900' : 'text-gray-900'
                                                        }`}>
                                                        {mobile}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${selectedMobile === mobile
                                                                ? 'bg-purple-200 text-purple-800'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {getCombosForMobile(mobile).length} combo{getCombosForMobile(mobile).length !== 1 ? 's' : ''}
                                                        </span>
                                                        {selectedMobile === mobile && (
                                                            <CheckCircle className="w-5 h-5 text-purple-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-8 text-center text-gray-500">
                                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        <p className="font-medium">No mobiles found</p>
                                        <p className="text-sm">Try adjusting your search term</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Supporting Combos */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-purple-500" />
                                Supporting Combos
                            </h4>

                            {selectedMobile ? (
                                <div className="space-y-3">
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info className="w-4 h-4 text-purple-600" />
                                            <span className="font-medium text-purple-900">
                                                "{selectedMobile}" is supported by:
                                            </span>
                                        </div>
                                        <div className="text-sm text-purple-700">
                                            {supportingCombos.length} combo{supportingCombos.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    {supportingCombos.length > 0 ? (
                                        <div className="space-y-3 max-h-80 overflow-y-auto">
                                            {supportingCombos.map((combo) => (
                                                <div
                                                    key={combo._id}
                                                    className="bg-white border border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-purple-300"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="font-semibold text-gray-900 text-lg">
                                                            {combo.comboName}
                                                        </div>
                                                        <div className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                                                            {combo.mobileNames ? combo.mobileNames.length : 0} devices
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                                            Supported Devices:
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {combo.mobileNames && combo.mobileNames.map((mobile, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`text-sm px-3 py-1 rounded-full font-medium transition-all duration-200 ${mobile === selectedMobile
                                                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                        }`}
                                                                >
                                                                    {mobile}
                                                                    {mobile === selectedMobile && (
                                                                        <span className="ml-2">★</span>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="font-medium text-lg">No combos support this mobile</p>
                                            <p className="text-sm">This mobile device is not included in any combo yet</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <List className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p>Select a mobile to see supporting combos</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileComboMapper;