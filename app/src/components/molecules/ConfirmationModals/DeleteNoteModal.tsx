import React, { useState } from 'react'
import { useStore } from '../../../hooks'
import { useDeleteFile } from '../../../hooks/file/useDeleteFile'
import { resetNotebook } from '../../../store'
import { Modal } from '../../atoms'

interface IDeleteNoteModal {
  isOpen: boolean
  onRequestClose: () => void
}

export function DeleteNoteModal({ isOpen, onRequestClose }: IDeleteNoteModal) {
  const [state, dispatch] = useStore()
  const [loading, setLoading] = useState(false)
  const deleteFile = useDeleteFile(
    state.user.username,
    state.notebook.activeNotebook
  )

  async function handleDeleteNote() {
    if (!state.notebook.activeNote) {
      return
    }

    setLoading(true)
    try {
      await deleteFile({
        variables: {
          input: {
            filename: state.notebook.activeNote,
            repo: state.notebook.activeNotebook,
            username: state.user.username,
          },
        },
      })
      dispatch(resetNotebook({ note: true }))
      onRequestClose()
    } catch {
      alert('There was an issue deleting your note, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      onContinue={handleDeleteNote}
      title="Delete Note"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      loading={loading}
    >
      <span>Please confirm you wish to delete a note.</span>
    </Modal>
  )
}