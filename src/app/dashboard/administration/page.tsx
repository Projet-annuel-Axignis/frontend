import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashBoardHeader from "@/components/dashboard/DashBoardHeader";
import { AdminPanelSettings } from "@mui/icons-material";

const AdminPage = () => {
  return (
    <ProtectedRoute
      allowedRoles={['ADMINISTRATOR']}
    >
      {/* Header */}
      <DashBoardHeader
        title="Administration"
        icon={<AdminPanelSettings />}
      />

    </ProtectedRoute>
  )
}

export default AdminPage