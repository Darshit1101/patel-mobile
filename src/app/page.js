'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ComboForm from '@/components/ComboForm';
import ComboList from '@/components/ComboList';
import SearchBar from '@/components/SearchBar';
import SearchModal from '@/components/SearchModal';
import ComboFilter from '@/components/ComboFilter';
import MobileComboMapper from '@/components/MobileComboMapper';

export default function Home() {
  const [combos, setCombos] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [filteredMobiles, setFilteredMobiles] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await fetch('/api/combos');
      const result = await response.json();
      if (result.success) {
        setCombos(result.data);
        setFilteredCombos(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching combos:', error);
      setLoading(false);
    }
  };

  // Combo CRUD operations
  const handleComboSubmit = async (formData) => {
    try {
      const url = editingCombo ? `/api/combos/${editingCombo._id}` : '/api/combos';
      const method = editingCombo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCombos();
        setEditingCombo(null);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting combo:', error);
      alert('Error submitting combo');
    }
  };

  const handleComboEdit = (combo) => {
    setEditingCombo(combo);
  };

  const handleComboDelete = async (comboId) => {
    if (!confirm('Are you sure you want to delete this combo?')) return;

    try {
      const response = await fetch(`/api/combos/${comboId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchCombos();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting combo:', error);
      alert('Error deleting combo');
    }
  };

  const handleSearchResults = (filtered) => {
    setFilteredCombos(filtered);
  };

  const handleComboFilterResults = (mobileNames) => {
    setFilteredMobiles(mobileNames);
  };

  const handleComboSelect = (comboName) => {
    setSelectedCombo(comboName);
  };

  const handleSelectFromModal = (combo) => {
    setEditingCombo(combo);
    setShowSearchModal(false);
  };

  // Keyboard shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Patel Mobile Management System
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your mobile phone combos with multiple mobile names
              </p>
            </div>
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Search className="w-4 h-4" />
              Quick Search
              <kbd className="px-1.5 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ComboForm
            combo={editingCombo}
            onSubmit={handleComboSubmit}
            onCancel={() => setEditingCombo(null)}
            isEditing={!!editingCombo}
          />

          {/* Combo Filter */}
          <ComboFilter
            combos={combos}
            onFilterResults={handleComboFilterResults}
            selectedCombo={selectedCombo}
            onComboSelect={handleComboSelect}
          />

          {/* Mobile-Combo Mapper */}
          <MobileComboMapper combos={combos} />

          {/* Search Bar */}
          <SearchBar
            combos={combos}
            onFilteredResults={handleSearchResults}
            showAdvancedFilters={true}
            placeholder="Search by combo name or mobile name..."
          />

          <ComboList
            combos={filteredCombos}
            onEdit={handleComboEdit}
            onDelete={handleComboDelete}
            loading={loading}
            selectedCombo={selectedCombo}
            filteredMobiles={filteredMobiles}
          />
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        combos={combos}
        onSelectCombo={handleSelectFromModal}
      />
    </div>
  );
}
