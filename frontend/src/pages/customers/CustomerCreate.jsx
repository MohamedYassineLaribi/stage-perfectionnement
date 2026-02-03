const CustomerCreate = () => {
    return (
        <div className="page-content">
            <div className="container-fluid">
                <h3>Create Customer</h3>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-primary">Create Customer</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerCreate
