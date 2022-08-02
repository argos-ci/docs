import React, { useEffect, useState } from 'react'
import { x } from '@xstyled/styled-components'
import { Code } from 'smooth-doc/components'

const CopyButton = ({ code }) => {
  const [text, setText] = useState('copy')

  useEffect(() => {
    if (text === 'copied!') {
      const timer = setTimeout(() => setText('copy'), 1500)
      return () => clearTimeout(timer)
    }
  }, [text])

  async function handleClick() {
    // eslint-disable-next-line no-undef
    navigator.clipboard.writeText(code.replace(/^\s*\$/, '').trim()).then(
      () => setText('copied!'),
      () => setText('error'),
    )
  }

  return (
    <x.button
      backgroundColor="blockquote-background"
      color={{
        _: 'control-placeholder',
        hover: 'control-border-hover',
        active: 'control-border-active',
      }}
      border
      transition="300ms"
      px={2}
      pb={1}
      pt="2px"
      borderRadius="6px 6px 0 0"
      position="absolute"
      top="-22px"
      right="0px"
      outline={{ focus: 'none' }}
      onClick={handleClick}
    >
      {text}
    </x.button>
  )
}

export const Snippet = ({ children, ...options }) => {
  console.log({ children })
  return (
    <x.div position="relative">
      <CopyButton code={children} />
      <Code as={Code} {...options}>
        {children}
      </Code>
    </x.div>
  )
}
