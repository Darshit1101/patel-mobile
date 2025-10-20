'use client';

import { useState, useEffect } from 'react';
import ComboForm from '@/components/ComboForm';
import ComboList from '@/components/ComboList';

export default function Home() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Patel Mobile Management System
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your mobile phone combos with multiple mobile names
            </p>
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
          <ComboList
            combos={combos}
            onEdit={handleComboEdit}
            onDelete={handleComboDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
