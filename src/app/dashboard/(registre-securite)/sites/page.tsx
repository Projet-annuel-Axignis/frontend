import DashBoardHeader from "@/components/dashboard/DashBoardHeader";
import BusinessIcon from '@mui/icons-material/Business';

const SitesPage = () => {
  return (
    <>
      {/* Header */}
      <DashBoardHeader
        title="Sites"
        icon={<BusinessIcon />}
      />
    </>
  )
}

export default SitesPage