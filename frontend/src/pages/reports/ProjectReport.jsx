import PageHeader from '@components/PageHeader'
import StatCard from '@components/StatCard'

const ProjectReport = () => {
    const projectStats = [
        { label: 'Active Projects', value: '42', icon: 'Briefcase', color: 'primary', trend: '+4' },
        { label: 'Completed', value: '128', icon: 'CheckCircle', color: 'success', trend: '+12' },
        { label: 'On Hold', value: '5', icon: 'PauseCircle', color: 'warning', trend: '-2' },
        { label: 'Overdue', value: '3', icon: 'AlertTriangle', color: 'danger', trend: '+1' },
    ]

    return (
        <>
            <PageHeader title="Project Report">
                <button className="btn btn-primary btn-sm">Project Analytics</button>
            </PageHeader>

            <div className="row">
                {projectStats.map((stat, idx) => (
                    <div key={idx} className="col-xxl-3 col-md-6">
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header">
                            <h5 className="card-title">Project Timelines & Milestones</h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-5">
                                <div className="avatar-text avatar-lg bg-soft-info text-info mx-auto mb-4">
                                    <i className="feather-calendar"></i>
                                </div>
                                <h4 className="fw-bold">Gantt Charts</h4>
                                <p className="text-muted">Interactive project timelines will be integrated here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectReport
