import { useEffect, useState } from "react";
import "./App.css";
import TableContainer from "./components/TableContainer.jsx";
import MultiSelect from "./components/MultiSelect.jsx";
import { baseUrl, columns, endpointPost, endpointPut } from "./constant";
import useDebounce from "./hooks/useDebounce";
import "./index.css";

function App() {
  const [roleName, setRoleName] = useState("");
  const [selectedModules, setSelectedModules] = useState(["Sale"]);
  const [loading, setLoading] = useState(false);
  const [pickedNames, setPickedNames] = useState([]);
  const [payload, setPayload] = useState({
    permissions: [],
  });
  const [backupData, setBackupData] = useState(null);
  const debouncedRoleName = useDebounce(roleName, 450);

  console.log(payload.permissions, "payload.permissions");

  const getRoleModules = async (e) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/role/fetchtestrole?roleName=${roleName}`
      );
      const data = await response.json();
      !backupData && setBackupData(data || {});
      setSelectedModules(data || {});

      // set the permissions in edit mode.
      let permissions = [];
      data?.modules?.forEach((module) => {
        module.subModules?.forEach((subModule) => {
          subModule?.permissions?.forEach((permission) => {
            if (permission.isAllowed) {
              permissions.push(permission?.permissionId);
            }
          });
        });
      });

      setPayload((prev) => ({
        ...prev,
        permissions: permissions,
      }));
    } catch (error) {
      console.error("Error:", error);
      setSelectedModules(backupData || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (debouncedRoleName) {
    getRoleModules();
    // }
  }, [debouncedRoleName]);

  const shownModules = pickedNames.length
    ? selectedModules?.modules?.filter((m) =>
        pickedNames.includes(m.moduleName)
      )
    : selectedModules?.modules;

  async function togglePermission(permissionId, checked) {
    setPayload((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((p) => p !== permissionId),
    }));
  }

  const handleSubmitRole = async () => {
    setLoading(true);

    if (!roleName) {
      alert("Please enter a role name");
      setLoading(false);
      return;
    }

    try {
      let post = `${baseUrl}${endpointPost}`;
      let edit = `${baseUrl}${endpointPut}/${roleName}`;

      const response = await fetch(
        selectedModules?.name || selectedModules?.roleID ? edit : post,
        {
          method:
            selectedModules?.name || selectedModules?.roleID ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ...payload, name: roleName }),
        }
      );

      const data = await response.json();
      console.log(data, "data");

      data &&
        alert(
          selectedModules?.roleID
            ? "Role updated successfully"
            : "Role created successfully"
        );
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
      setRoleName("");
      setPayload({ permissions: [] });
      setSelectedModules({});
    }
  };

  return (
    <main className="container hero">
      {/* button */}
      <div
        className="margin-bottom"
        style={{
          marginBottom: 30,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button className="btn" onClick={handleSubmitRole}>
          {loading
            ? "loading..."
            : selectedModules?.name || selectedModules?.roleID
            ? "Update Role"
            : "Create Role"}
        </button>
      </div>
      {/* input and multi select */}
      <div className="flex flex-col flex-gap margin-bottom" style={{ gap: 20 }}>
        <div className="flow">
          <input
            id="roleName"
            className="input"
            placeholder="Enter Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>

        <MultiSelect
          options={selectedModules?.modules
            ?.map((m) => m.moduleName)
            .filter(Boolean)}
          defaultValue={[]}
          onChange={(next) => setPickedNames(next)}
          placeholder="Pick modules"
        />
      </div>

      {/* TABLE */}
      <TableContainer
        columns={columns}
        contentLength={shownModules?.length}
        isLoading={loading}
      >
        {shownModules?.map((ele, index) => (
          <tr key={index}>
            {/* Module Name */}
            <td style={{ textAlign: "center" }}>{ele.moduleName}</td>
            {/* Sub Modules */}
            <td style={{ padding: "4px 10px", textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "stretch",
                }}
              >
                {ele.subModules?.map((sub, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sub?.moduleName}
                  </div>
                ))}
              </div>
            </td>
            {/* Permissions */}
            <td>
              <div className="perm-list" style={{ marginTop: 4 }}>
                {ele?.subModules?.map((sub) => (
                  <div
                    key={sub.moduleID}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      fontSize: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {sub?.permissions?.map((permission, idx) => (
                      <label
                        key={idx}
                        className={`perm-pill ${
                          permission.isAllowed ? "active" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          defaultChecked={permission.isAllowed}
                          onChange={(e) =>
                            togglePermission(
                              permission?.permissionId,
                              e.target.checked
                            )
                          }
                        />
                        {permission.actionName}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </TableContainer>
    </main>
  );
}

export default App;
