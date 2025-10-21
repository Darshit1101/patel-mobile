import { useState, useEffect, useMemo } from 'react';

export const useSearch = (data = [], searchFields = []) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({});

    const filteredAndSortedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let filtered = [...data];

        // Apply search filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(item => {
                return searchFields.some(field => {
                    const value = getNestedValue(item, field);
                    if (Array.isArray(value)) {
                        return value.some(v =>
                            String(v).toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    }
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }

        // Apply additional filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                filtered = filtered.filter(item => {
                    const itemValue = getNestedValue(item, key);
                    if (Array.isArray(value)) {
                        return value.includes(itemValue);
                    }
                    return itemValue === value;
                });
            }
        });

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = getNestedValue(a, sortBy);
            let bValue = getNestedValue(b, sortBy);

            // Handle different data types
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (Array.isArray(aValue)) {
                aValue = aValue.length;
                bValue = bValue.length;
            }

            if (aValue instanceof Date) {
                aValue = aValue.getTime();
                bValue = bValue.getTime();
            }

            let comparison = 0;
            if (aValue > bValue) comparison = 1;
            if (aValue < bValue) comparison = -1;

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [data, searchTerm, sortBy, sortOrder, filters, searchFields]);

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    };

    const highlightText = (text, search) => {
        if (!search.trim() || !text) return text;

        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
    };

    const clearSearch = () => {
        setSearchTerm('');
        setFilters({});
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const removeFilter = (key) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    return {
        // State
        searchTerm,
        sortBy,
        sortOrder,
        filters,

        // Computed
        filteredData: filteredAndSortedData,
        hasActiveFilters: searchTerm.trim() !== '' || Object.keys(filters).length > 0,
        resultCount: filteredAndSortedData.length,

        // Actions
        setSearchTerm,
        setSortBy,
        setSortOrder,
        setFilters,
        updateFilter,
        removeFilter,
        clearSearch,

        // Utilities
        highlightText
    };
};

export const useRecentSearches = (key = 'recentSearches', maxItems = 5) => {
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Failed to parse recent searches:', error);
                localStorage.removeItem(key);
            }
        }
    }, [key]);

    const addSearch = (searchTerm) => {
        if (!searchTerm.trim()) return;

        const newRecentSearches = [
            searchTerm,
            ...recentSearches.filter(s => s !== searchTerm)
        ].slice(0, maxItems);

        setRecentSearches(newRecentSearches);
        localStorage.setItem(key, JSON.stringify(newRecentSearches));
    };

    const removeSearch = (searchTerm) => {
        const filtered = recentSearches.filter(s => s !== searchTerm);
        setRecentSearches(filtered);
        localStorage.setItem(key, JSON.stringify(filtered));
    };

    const clearSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(key);
    };

    return {
        recentSearches,
        addSearch,
        removeSearch,
        clearSearches
    };
};