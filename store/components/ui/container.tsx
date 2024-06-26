import React from 'react'

interface IContainer {
  children: React.ReactNode
}

function Container({ children }: IContainer) {
  return <div className='mx-auto max-w-5xl 2xl:max-w-7xl'>{children}</div>
}

export default Container
