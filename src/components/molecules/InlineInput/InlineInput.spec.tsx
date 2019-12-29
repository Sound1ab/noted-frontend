import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, fireEvent, render } from '../../../test-utils'
import { MockProvider } from '../../utility'
import { InlineInput } from './InlineInput'

jest.mock('../../../hooks/Repo/useCreateRepo')

afterEach(cleanup)

describe('InlineInput', () => {
  const value = 'MOCK_VALUE'
  const clickOutsideCallback = jest.fn()
  const handleOnChange = jest.fn()
  const inputAriaLabel = 'MOCK_INPUT_ARIA_LABEL'
  const onSubmit = jest.fn()
  const formAriaLabel = 'MOCK_WRAPPER_ARIA_LABEL'
  const icon = <div>MOCK_ICON</div>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should fire callback when user clicks off input', async () => {
    const { container } = await render(
      <MockProvider>
        <InlineInput
          value={value}
          clickOutsideCallback={clickOutsideCallback}
          handleOnChange={handleOnChange}
          inputAriaLabel={inputAriaLabel}
          onSubmit={onSubmit}
          formAriaLabel={formAriaLabel}
          icon={icon}
        />
      </MockProvider>
    )

    await fireEvent.mouseDown(container)

    expect(clickOutsideCallback).toBeCalled()
  })

  it('should focus the input when first rendered', async () => {
    const { getByLabelText } = await render(
      <MockProvider>
        <InlineInput
          value={value}
          clickOutsideCallback={clickOutsideCallback}
          handleOnChange={handleOnChange}
          inputAriaLabel={inputAriaLabel}
          onSubmit={onSubmit}
          formAriaLabel={formAriaLabel}
          icon={icon}
        />
      </MockProvider>
    )

    expect(getByLabelText(inputAriaLabel)).toHaveFocus()
  })

  it('should display icon if passed as prop', async () => {
    const { getByText } = await render(
      <MockProvider>
        <InlineInput
          value={value}
          clickOutsideCallback={clickOutsideCallback}
          handleOnChange={handleOnChange}
          inputAriaLabel={inputAriaLabel}
          onSubmit={onSubmit}
          formAriaLabel={formAriaLabel}
          icon={icon}
        />
      </MockProvider>
    )

    expect(getByText('MOCK_ICON')).toBeDefined()
  })
})