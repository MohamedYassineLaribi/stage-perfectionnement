import PageHeader from '@components/PageHeader'

const GeneralSettings = () => (
    <div className="main-content">
        <PageHeader title="General Settings" breadcrumb={[{ label: 'Settings', path: '/settings/general' }, { label: 'General' }]} />

        <div className="row">
            <div className="col-lg-8">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">General Configuration</h5>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">System Name</label>
                                    <input type="text" className="form-control" defaultValue="CRM App" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">System Email</label>
                                    <input type="email" className="form-control" defaultValue="admin@duralux.com" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Logo</label>
                                <input type="file" className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default GeneralSettings
