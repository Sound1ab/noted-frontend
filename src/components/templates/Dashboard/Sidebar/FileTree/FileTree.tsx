import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useFileTree } from '../../../../../hooks/fileTree/useFileTree'
import { useFs } from '../../../../../hooks/fs/useFs'
import { useGit } from '../../../../../hooks/git/useGit'
import { useReadSearch } from '../../../../../hooks/localState/useReadSearch'
import { useActivePath } from '../../../../../hooks/recoil/useActivePath'
import { useFiles } from '../../../../../hooks/recoil/useFiles'
import { useTabs } from '../../../../../hooks/recoil/useTabs'
import { createNodes } from '../../../../../utils/createNodes'
import { List } from '../../../../atoms/List/List'
import { ErrorToast } from '../../../../atoms/Toast/Toast'
import { FileInput } from '../FileInput/FileInput'
import { SearchResults } from './SearchResults/SearchResults'
import { Tree } from './Tree/Tree'
import { TreeSkeleton } from './TreeSkeleton'

interface IFileTree {
  isNewFileOpen: boolean
  closeNewFile: () => void
}

export function FileTree({ isNewFileOpen, closeNewFile }: IFileTree) {
  const search = useReadSearch()
  const [{ openFoldersInPath }, { openFolders }] = useFileTree()
  const [files, setFiles] = useFiles()
  const [
    { clone, stageChanges, getUnstagedChanges, commit, getCommittedChanges },
    { loading: gitLoading },
  ] = useGit()
  const [{ listFiles, writeFile }, { loading: fsLoading, error }] = useFs()
  const [tabs, setTabs] = useTabs()
  const [, setActivePath] = useActivePath()

  if (error) {
    ErrorToast(error.message)
  }

  useEffect(() => {
    if (files && files.length > 0) {
      return
    }

    async function init() {
      await clone?.()

      const files = await listFiles?.()

      setFiles(files)
    }

    init()
  }, [files, clone, setFiles, listFiles])

  if (gitLoading || !files) {
    return <TreeSkeleton />
  }

  async function handleCreate(name: string) {
    const path = `${name}.md`

    openFoldersInPath?.(path)

    await writeFile?.(path, '')

    await stageChanges?.(await getUnstagedChanges?.())

    await commit?.()

    await getCommittedChanges?.()

    setFiles(await listFiles?.())

    tabs.add(path)

    setTabs(new Set(tabs))

    setActivePath(path)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {search ? (
        <SearchResults />
      ) : (
        <>
          {files &&
            createNodes(files, openFolders!).map((node) => (
              <List key={node.name}>
                <Tree key={node.name} node={node} />
              </List>
            ))}
          {isNewFileOpen && (
            <FileInput
              onClickOutside={closeNewFile}
              onSubmit={handleCreate}
              isDisabled={fsLoading!}
            />
          )}
        </>
      )}
    </DndProvider>
  )
}
