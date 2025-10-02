import React from 'react'

function CoreTable({ columns = [], contentLength = 0, children, isLoading = false }) {
    return (
        <div className="card" style={{ padding: 0 }}>
            <div className="table-scroll">
                <table className="core-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key || col.accessor}> <div style={{ textAlign: 'center' }}>{col.header}</div></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {contentLength === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="muted" style={{ textAlign: 'center', padding: '18px' }}>
                                    No data
                                </td>
                            </tr>
                        ) : isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="muted" style={{ textAlign: 'center', padding: '18px' }}>
                                    <span className="loader"></span>
                                </td>
                            </tr>
                        ) : (
                            children
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CoreTable


