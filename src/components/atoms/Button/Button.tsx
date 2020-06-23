import React, { ReactNode } from 'react'
import { css } from 'styled-components'

import { styled } from '../../../theme'
import { Icon } from '..'

const Style = styled.button<Pick<IButton, 'isActive' | 'isLoading'>>`
  position: relative;
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme, isActive }) =>
    isActive
      ? theme.colors.background.tertiary
      : theme.colors.background.secondary};
  border-radius: 5px;
  box-shadow: inset 0px 0px 1px 1px ${({ theme }) => theme.colors.border};

  &[disabled] {
    cursor: not-allowed;
  }

  > * {
    color: ${({ theme, isActive }) =>
      isActive ? theme.colors.accent : theme.colors.text.primary};
    ${({ isLoading }) =>
      isLoading
        ? css`
            animation: spin 2s ease-in-out infinite;
          `
        : ''}
  }

  &:disabled {
    > * {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      opacity: 0.6;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`

interface IButton {
  isActive?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  children?: ReactNode
  onClick: () => void
  className?: string
  ariaLabel?: string
  title?: string
}

interface IButtonLink {
  isActive?: boolean
  isDisabled?: boolean
  children?: ReactNode
  className?: string
  ariaLabel?: string
  href: string
}

export function Button({
  isActive = false,
  isDisabled = false,
  children,
  onClick,
  className,
  ariaLabel,
  title,
  isLoading = false,
}: IButton) {
  return (
    <Style
      isActive={isActive}
      isLoading={isLoading}
      disabled={isDisabled}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      as="button"
    >
      {isLoading ? <Icon size="sm" icon="spinner" prefix="fa" /> : children}
    </Style>
  )
}

export function ButtonLink({
  isActive = false,
  children,
  className,
  ariaLabel,
  href,
}: IButtonLink) {
  return (
    <Style
      isActive={isActive}
      className={className}
      aria-label={ariaLabel}
      as="a"
      href={href}
      target="_self"
    >
      {children}
    </Style>
  )
}
