import { Dashboard } from "./Dashboard"
import { HueCycleHealth } from "./HueCycleHealth"

const HueCycleDashboard = () => {
  return (
    <div className="grid grid-cols-7 gap-1 mb-6">
      <Dashboard />
      <HueCycleHealth />
    </div>
  )
}

export default HueCycleDashboard
