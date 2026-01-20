'use client'

/**
 * Character List Component
 *
 * Displays a grid of character cards with add, edit, and delete functionality.
 * Shows empty state when no characters exist.
 */

import { useState } from 'react'
import { Character } from '@/lib/schemas'
import { useGameStore } from '@/lib/store/gameStore'
import { CharacterCard } from './CharacterCard'
import { CharacterForm } from './CharacterForm'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export function CharacterList() {
  const characters = useGameStore((state) => state.characters)
  const deleteCharacter = useGameStore((state) => state.deleteCharacter)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>()
  const [deletingCharacter, setDeletingCharacter] = useState<Character | undefined>()

  // Sort characters alphabetically by name
  const sortedCharacters = [...characters].sort((a, b) => a.name.localeCompare(b.name))

  const handleAddClick = () => {
    setEditingCharacter(undefined)
    setIsFormOpen(true)
  }

  const handleEditClick = (character: Character) => {
    setEditingCharacter(character)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (character: Character) => {
    setDeletingCharacter(character)
  }

  const confirmDelete = () => {
    if (deletingCharacter) {
      deleteCharacter(deletingCharacter.id)
      setDeletingCharacter(undefined)
    }
  }

  const cancelDelete = () => {
    setDeletingCharacter(undefined)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingCharacter(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Characters</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          + Add Character
        </button>
      </div>

      {/* Character Grid or Empty State */}
      {sortedCharacters.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">🎲</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Characters Yet</h3>
          <p className="text-gray-500 mb-6">Create your first character to get started!</p>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Create First Character</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Character Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingCharacter ? 'Edit Character' : 'Create New Character'}
            </h3>
            <CharacterForm
              character={editingCharacter}
              onClose={handleFormClose}
              onSuccess={handleFormClose}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingCharacter && (
        <ConfirmDialog
          title="Delete Character"
          message={`Are you sure you want to delete ${deletingCharacter.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDangerous={true}
        />
      )}
    </div>
  )
}
