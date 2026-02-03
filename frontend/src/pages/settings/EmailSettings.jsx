import PageHeader from '@components/PageHeader'

const EmailSettings = () => (
    <div className="main-content">
        <PageHeader title="Email Settings" breadcrumb={[{ label: 'Settings', path: '/settings/general' }, { label: 'Email' }]} />

        <div className="row">
            <div className="col-lg-8">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">SMTP Configuration</h5>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-4">
                                <label className="form-label">SMTP Host</label>
                                <input type="text" className="form-control" defaultValue="smtp.mailtrap.io" />
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">SMTP User</label>
                                    <input type="text" className="form-control" defaultValue="user123" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">SMTP Password</label>
                                    <input type="password" className="form-control" defaultValue="********" />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">SMTP Port</label>
                                    <input type="number" className="form-control" defaultValue="2525" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Encryption</label>
                                    <select className="form-select">
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Save SMTP Settings</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default EmailSettings
