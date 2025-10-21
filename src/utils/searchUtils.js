// Search utility functions for the mobile combo application

export const searchUtils = {
    // Search types
    SEARCH_TYPES: {
        ALL: 'all',
        COMBO_NAME: 'combo',
        MOBILE_NAME: 'mobile'
    },

    // Sort options
    SORT_OPTIONS: {
        NAME: 'name',
        DATE: 'date',
        COUNT: 'count'
    },

    // Search in combo data
    searchCombos: (combos, searchTerm, searchType = 'all') => {
        if (!searchTerm.trim()) return combos;

        const term = searchTerm.toLowerCase();

        return combos.filter(combo => {
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
    },

    // Sort combos
    sortCombos: (combos, sortBy, sortOrder = 'asc') => {
        return [...combos].sort((a, b) => {
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
    },

    // Highlight search terms in text
    highlightText: (text, searchTerm) => {
        if (!searchTerm.trim() || !text) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
    },

    // Get search suggestions
    getSearchSuggestions: (combos, currentTerm = '') => {
        const suggestions = new Set();
        const term = currentTerm.toLowerCase();

        combos.forEach(combo => {
            // Add combo name suggestions
            if (combo.comboName && combo.comboName.toLowerCase().includes(term)) {
                suggestions.add(combo.comboName);
            }

            // Add mobile name suggestions
            combo.mobileNames?.forEach(mobile => {
                if (mobile && mobile.toLowerCase().includes(term)) {
                    suggestions.add(mobile);
                }
            });
        });

        return Array.from(suggestions).slice(0, 5);
    },

    // Advanced search with multiple criteria
    advancedSearch: (combos, criteria) => {
        const {
            searchTerm = '',
            minMobileCount = 0,
            maxMobileCount = Infinity,
            dateRange = null, // { start: Date, end: Date }
            exactMatch = false
        } = criteria;

        return combos.filter(combo => {
            // Text search
            if (searchTerm.trim()) {
                const term = exactMatch ? searchTerm : searchTerm.toLowerCase();
                const comboMatch = exactMatch
                    ? combo.comboName === term
                    : combo.comboName?.toLowerCase().includes(term);

                const mobileMatch = combo.mobileNames?.some(mobile => {
                    return exactMatch
                        ? mobile === term
                        : mobile?.toLowerCase().includes(term);
                });

                if (!comboMatch && !mobileMatch) return false;
            }

            // Mobile count filter
            const mobileCount = combo.mobileNames?.length || 0;
            if (mobileCount < minMobileCount || mobileCount > maxMobileCount) {
                return false;
            }

            // Date range filter
            if (dateRange && combo.createdAt) {
                const comboDate = new Date(combo.createdAt);
                if (comboDate < dateRange.start || comboDate > dateRange.end) {
                    return false;
                }
            }

            return true;
        });
    },

    // Export search results to different formats
    exportSearchResults: (results, format = 'json') => {
        switch (format) {
            case 'json':
                return JSON.stringify(results, null, 2);
            case 'csv':
                if (results.length === 0) return '';

                const headers = ['Combo Name', 'Mobile Names', 'Mobile Count', 'Created At'];
                const csvRows = [
                    headers.join(','),
                    ...results.map(combo => [
                        `"${combo.comboName || ''}"`,
                        `"${combo.mobileNames?.join('; ') || ''}"`,
                        combo.mobileNames?.length || 0,
                        combo.createdAt ? new Date(combo.createdAt).toLocaleDateString() : ''
                    ].join(','))
                ];
                return csvRows.join('\n');
            case 'text':
                return results.map(combo =>
                    `${combo.comboName}: ${combo.mobileNames?.join(', ') || 'No mobiles'}`
                ).join('\n');
            default:
                return results;
        }
    }
};