import { useEffect, useState } from 'react'

export default function useDebounce(value, delay = 450) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const id = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(id)
    }, [value, delay])

    return debouncedValue
}


