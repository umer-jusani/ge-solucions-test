export const columns = [
    { header: 'Module', accessor: 'moduleName' },
    { header: 'Sub Modules', accessor: 'moduleID' },
    { header: 'Permissions', accessor: 'moduleID' },
]

export let baseUrl = "https://api.test.helpinglab.com/api"
export let endpointPost = `/Role/addtestrole`
export let endpointPut = `/Role/modifytestrole`