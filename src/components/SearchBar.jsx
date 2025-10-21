import { useState, useEffect } from 'react';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';

const SearchBar = ({
    combos,
    onFilteredResults,
    placeholder = "Search combos or mobile names...",
    showAdvancedFilters = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'count'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [showFilters, setShowFilters] = useState(false);

    // Real-time search effect
    useEffect(() => {
        const filteredCombos = filterAndSortCombos();
        onFilteredResults(filteredCombos);
    }, [searchTerm, sortBy, sortOrder, combos]);

    const filterAndSortCombos = () => {
        if (!combos) return [];

        // Filter based on search term
        let filtered = combos.filter(combo => {
            const comboNameMatch = combo.comboName?.toLowerCase().includes(searchTerm.toLowerCase());
            const mobileNameMatch = combo.mobileNames?.some(mobile =>
                mobile?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return comboNameMatch || mobileNameMatch;
        });

        // Sort the filtered results
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.comboName?.toLowerCase() || '';
                    bValue = b.comboName?.toLowerCase() || '';
                    break;
                case 'date':
                    aValue = new Date(a.createdAt || 0);
                    bValue = new Date(b.createdAt || 0);
                    break;
                case 'count':
                    aValue = a.mobileNames?.length || 0;
                    bValue = b.mobileNames?.length || 0;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            {/* Main Search Bar */}
            <div className="p-4">
                <div className="relative flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={placeholder}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {showAdvancedFilters && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 ${showFilters
                                ? 'bg-blue-50 border-blue-300 text-blue-600'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search Results Info */}
                {searchTerm && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            Found {filterAndSortCombos().length} result(s) for "{searchTerm}"
                        </span>
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && showFilters && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                            >
                                <option value="name" className="text-black">Name</option>
                                <option value="date" className="text-black">Date Created</option>
                                <option value="count" className="text-black">Mobile Count</option>
                            </select>
                        </div>

                        <button
                            onClick={toggleSortOrder}
                            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-white transition-colors text-black bg-white"
                        >
                            {sortOrder === 'asc' ? (
                                <>
                                    <SortAsc className="w-4 h-4 text-black" />
                                    Ascending
                                </>
                            ) : (
                                <>
                                    <SortDesc className="w-4 h-4 text-black" />
                                    Descending
                                </>
                            )}
                        </button>

                        <div className="text-sm text-gray-600">
                            Total: {combos?.length || 0} combo(s)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;