import PageHeader from '@components/PageHeader'
import StatCard from '@components/StatCard'

const TimesheetsReport = () => {
    const timesheetStats = [
        { label: 'Total Hours', value: '1,240h', icon: 'Clock', color: 'primary', trend: '+45h' },
        { label: 'Billable Hours', value: '980h', icon: 'DollarSign', color: 'success', trend: '+12h' },
        { label: 'Non-Billable', value: '260h', icon: 'Coffee', color: 'warning', trend: '+5h' },
        { label: 'Avg Per User', value: '38h/wk', icon: 'User', color: 'info', trend: '+1.5h' },
    ]

    return (
        <>
            <PageHeader title="Timesheets Report">
                <button className="btn btn-primary btn-sm">Logging History</button>
            </PageHeader>

            <div className="row">
                {timesheetStats.map((stat, idx) => (
                    <div key={idx} className="col-xxl-3 col-md-6">
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header">
                            <h5 className="card-title">Weekly Timesheet Activity</h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-5">
                                <div className="avatar-text avatar-lg bg-soft-warning text-warning mx-auto mb-4">
                                    <i className="feather-activity"></i>
                                </div>
                                <h4 className="fw-bold">Activity Logs</h4>
                                <p className="text-muted">Breakdown of hours by project and team member will be visualized here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TimesheetsReport
