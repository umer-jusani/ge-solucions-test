import React, { useEffect, useMemo, useRef, useState } from 'react'

function MultiSelect({
    options = [], // array of strings
    defaultValue = [], // initial selected values (optional)
    onChange,     // (nextArray) => void
    placeholder = ''
}) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(Array.isArray(defaultValue) ? defaultValue : [])
    const [query, setQuery] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const inputRef = useRef(null)
    const optionRefs = useRef([])
    const containerRef = useRef(null)

    useEffect(() => {
        onChange?.(selected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        optionRefs.current = []
    }, [query, options])

    useEffect(() => {
        if (focusedIndex >= 0 && optionRefs.current[focusedIndex] && open) {
            optionRefs.current[focusedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [focusedIndex, open])

    const remaining = useMemo(() => {
        const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
        const base = options.filter(o => !selected.includes(o))
        if (words.length === 0) return base
        return base.filter(o => words.every(w => String(o).toLowerCase().includes(w)))
    }, [options, selected, query])

    function add(item) {
        if (!selected.includes(item)) {
            setSelected(prev => [...prev, item])
        }
        setOpen(false)
    }

    function remove(item) {
        setSelected(prev => prev.filter(v => v !== item))
    }

    function clear() {
        setSelected([])
        setQuery('')
        setFocusedIndex(-1)
    }

    return (
        <div ref={containerRef} className="dropdown">
            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', padding: '8px 10px' }} onClick={() => setOpen(true)}>
                {selected.length === 0 && <span className="muted">{placeholder}</span>}
                {selected.map(name => (
                    <div key={name} className="chip removable" onClick={() => remove(name)} style={{ flex: '0 0 auto' }}>
                        <span>{name}</span>
                        <span className="x">×</span>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder={placeholder}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocusedIndex(0); }}
                    onKeyDown={(e) => {
                        if (!open) return
                        if (e.key === 'ArrowDown') {
                            setFocusedIndex(prev => prev < remaining.length - 1 ? prev + 1 : 0)
                        } else if (e.key === 'ArrowUp') {
                            setFocusedIndex(prev => prev > 0 ? prev - 1 : remaining.length - 1)
                        } else if (e.key === 'Enter') {
                            if (remaining[focusedIndex]) add(remaining[focusedIndex])
                        } else if (e.key === 'Escape') {
                            setOpen(false)
                        }
                    }}
                    style={{ flex: '0 0 160px', minWidth: 160, background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
                />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button type="button" aria-label="Clear" onClick={clear} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>×</button>
                    <button type="button" aria-label="Toggle menu" onClick={() => setOpen(v => !v)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>▾</button>
                </div>
            </div>
            {open && (
                <div className="dropdown-menu" style={{ maxHeight: 300, overflowY: 'auto', minWidth: 260 }}>
                    {remaining.length === 0 ? (
                        <div className="menu-item muted">No more options</div>
                    ) : (
                        remaining.map((name, index) => (
                            <span
                                key={`${name}-${index}`}
                                ref={(el) => (optionRefs.current[index] = el)}
                                className="menu-item"
                                style={index === focusedIndex ? { borderColor: 'rgba(124, 92, 255, 0.45)', background: 'rgba(124, 92, 255, 0.08)' } : undefined}
                                onClick={() => add(name)}
                            >
                                {name}
                            </span>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default MultiSelect


