import { useState, useEffect } from 'react';
import { Search, X, Filter, Calendar, Smartphone, Hash, Clock } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, combos, onSelectCombo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState('all'); // 'all', 'combo', 'mobile'
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const filtered = combos.filter(combo => {
            const term = searchTerm.toLowerCase();

            switch (searchType) {
                case 'combo':
                    return combo.comboName?.toLowerCase().includes(term);
                case 'mobile':
                    return combo.mobileNames?.some(mobile =>
                        mobile?.toLowerCase().includes(term)
                    );
                case 'all':
                default:
                    return combo.comboName?.toLowerCase().includes(term) ||
                        combo.mobileNames?.some(mobile =>
                            mobile?.toLowerCase().includes(term)
                        );
            }
        });

        // Add search highlighting
        const highlightedResults = filtered.map(combo => ({
            ...combo,
            highlightedComboName: highlightText(combo.comboName, searchTerm),
            highlightedMobileNames: combo.mobileNames?.map(mobile =>
                highlightText(mobile, searchTerm)
            )
        }));

        setSearchResults(highlightedResults);
    }, [searchTerm, searchType, combos]);

    const highlightText = (text, search) => {
        if (!search.trim() || !text) return text;

        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
    };

    const handleSearch = (term) => {
        setSearchTerm(term);

        // Add to recent searches
        if (term.trim()) {
            const newRecentSearches = [
                term,
                ...recentSearches.filter(s => s !== term)
            ].slice(0, 5);

            setRecentSearches(newRecentSearches);
            localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
        }
    };

    const handleSelectCombo = (combo) => {
        onSelectCombo(combo);
        onClose();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Search Combos</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b border-gray-200">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Type to search combos and mobiles..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                            autoFocus
                        />
                    </div>

                    {/* Search Type Filters */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSearchType('all')}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${searchType === 'all'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Filter className="w-4 h-4 inline mr-1" />
                            All
                        </button>
                        <button
                            onClick={() => setSearchType('combo')}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${searchType === 'combo'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Hash className="w-4 h-4 inline mr-1" />
                            Combo Names
                        </button>
                        <button
                            onClick={() => setSearchType('mobile')}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${searchType === 'mobile'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Smartphone className="w-4 h-4 inline mr-1" />
                            Mobile Names
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                    {searchTerm.trim() === '' ? (
                        // Recent Searches
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Recent Searches
                                </h3>
                                {recentSearches.length > 0 && (
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            {recentSearches.length > 0 ? (
                                <div className="space-y-2">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSearchTerm(search)}
                                            className="block w-full text-left p-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"
                                        >
                                            <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No recent searches</p>
                            )}
                        </div>
                    ) : searchResults.length > 0 ? (
                        // Search Results
                        <div className="p-4 space-y-3">
                            <p className="text-sm text-gray-600 mb-3">
                                Found {searchResults.length} result(s) for "{searchTerm}"
                            </p>
                            {searchResults.map((combo) => (
                                <div
                                    key={combo._id}
                                    onClick={() => handleSelectCombo(combo)}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4
                                                className="font-medium text-gray-900 mb-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: combo.highlightedComboName
                                                }}
                                            />
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {combo.highlightedMobileNames?.map((mobile, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                                                        dangerouslySetInnerHTML={{ __html: mobile }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Smartphone className="w-3 h-3" />
                                                    {combo.mobileNames?.length || 0} devices
                                                </span>
                                                {combo.createdAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(combo.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // No Results
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-500 text-sm">
                                Try adjusting your search term or filter options
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
                    Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> to close
                </div>
            </div>
        </div>
    );
};

export default SearchModal;