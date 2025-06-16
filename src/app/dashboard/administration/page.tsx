import ProtectedRoute from "@/components/auth/ProtectedRoute"

const AdminPage = () => {
  return (
    <ProtectedRoute
      allowedRoles={['ADMINISTRATOR']}
    >
      <div>AdminPage</div>
    </ProtectedRoute>
  )
}

export default AdminPage