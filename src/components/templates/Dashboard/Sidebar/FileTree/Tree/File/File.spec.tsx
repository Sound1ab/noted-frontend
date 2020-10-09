import { useApolloClient } from '@apollo/react-hooks'
import React from 'react'

import { useDeleteFile, useFileTree } from '../../../../../../../hooks'
import {
  fileNodeOne,
  resolvers,
} from '../../../../../../../schema/mockResolvers'
import { fireEvent, render } from '../../../../../../../test-utils'
import { MockProvider } from '../../../../../../providers'
import { File } from './File'

jest.mock('../../../../../../../hooks/utils/useFileTree')
jest.mock('../../../../../../../hooks/file/useDeleteFile')
jest.mock('@apollo/react-hooks', () => {
  const originalModule = jest.requireActual('@apollo/react-hooks')

  return {
    ...originalModule,
    useApolloClient: jest.fn(),
  }
})

describe('File', () => {
  const onClick = jest.fn()

  const deleteFile = jest.fn()

  const writeData = jest.fn()

  const activePath = 'MOCK_ACTIVE_PATH'

  beforeEach(() => {
    jest.resetAllMocks()
    ;(useDeleteFile as jest.Mock).mockImplementation(() => [
      deleteFile,
      { error: undefined },
    ])
    ;(useApolloClient as jest.Mock).mockReturnValue({
      writeData,
    })
    ;(useFileTree as jest.Mock).mockReturnValue({
      activePath,
      onClick,
    })
  })

  it('should update the currentPath with clicked node path', async () => {
    const { getByText } = await render(
      <MockProvider mockResolvers={resolvers}>
        <File node={fileNodeOne} level={1} />
      </MockProvider>
    )

    await fireEvent.click(getByText('MOCK_FILE_PATH_1.md'))

    expect(writeData).toBeCalledWith({
      data: { currentPath: fileNodeOne.path },
    })
  })

  it('should call onClick with path', async () => {
    const { getByText } = await render(
      <MockProvider mockResolvers={resolvers}>
        <File node={fileNodeOne} level={1} />
      </MockProvider>
    )

    await fireEvent.click(getByText('MOCK_FILE_PATH_1.md'))

    expect(onClick).toBeCalledWith(fileNodeOne.path)
  })

  it('should show and hide inline file input when renaming file', async () => {
    const { getByLabelText } = await render(
      <MockProvider mockResolvers={resolvers}>
        <div aria-label="outside">
          <File node={fileNodeOne} level={1} />
        </div>
      </MockProvider>
    )

    await fireEvent.click(getByLabelText('MOCK_FILE_PATH_1.md actions'))

    await fireEvent.click(getByLabelText('Rename'))

    expect(getByLabelText('Input file name')).toBeInTheDocument()
  })

  it('should open file dropdown menu', async () => {
    const { getByLabelText, getByText } = await render(
      <MockProvider mockResolvers={resolvers}>
        <File node={fileNodeOne} level={1} />
      </MockProvider>
    )

    await fireEvent.click(getByLabelText('MOCK_FILE_PATH_1.md actions'))

    expect(getByText('Delete file')).toBeInTheDocument()
  })

  it('should call deleteFile when selected from file dropdown', async () => {
    const { getByLabelText } = await render(
      <MockProvider mockResolvers={resolvers}>
        <File node={fileNodeOne} level={1} />
      </MockProvider>
    )

    await fireEvent.click(getByLabelText('MOCK_FILE_PATH_1.md actions'))

    await fireEvent.click(getByLabelText('Delete file'))

    expect(deleteFile).toBeCalled()
  })

  it('should show alert if deleteFile returns an error', async () => {
    ;(useDeleteFile as jest.Mock).mockImplementation(() => [
      async () => Promise.reject(),
    ])

    const alert = jest.fn()
    ;(global as any).alert = alert

    const { getByLabelText } = await render(
      <MockProvider>
        <File node={fileNodeOne} level={1} />
      </MockProvider>
    )

    await fireEvent.click(getByLabelText('MOCK_FILE_PATH_1.md actions'))

    await fireEvent.click(getByLabelText('Delete file'))

    expect(alert).toBeCalledWith('Could not delete file. Please try again.')
  })
})
