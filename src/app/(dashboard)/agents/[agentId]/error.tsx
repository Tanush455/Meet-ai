"use client"

import ErrorState from '@/components/ErrorState'
import React from 'react'

function ErrorPage() {
  return (
    <div>
        <ErrorState title="Error" description="Something went wrong." />
    </div>
  )
}

export default ErrorPage