import { useState, useEffect } from 'react'
import { client } from '../sanityClient'

export function useSanity(query) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(query).then(result => {
      setData(result)
      setLoading(false)
    })
  }, [query])

  return { data, loading }
}