import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import OfferCreate from './pages/OfferCreate'; // Import OfferCreate
import Settings from './pages/Settings'; // Import Settings
import UserList from './pages/admin/UserList';
import RoleList from './pages/admin/RoleList';
import PermissionList from './pages/admin/PermissionList';
import CRMConfigModule from './pages/admin/CRMConfigModule';
import ArticleList from './pages/articles/ArticleList';
import ArticleForm from './pages/articles/ArticleForm';
import ContactList from './pages/contacts/ContactList';
import ContactForm from './pages/contacts/ContactForm';
import OfferList from './pages/offers/OfferList';
import OfferView from './pages/offers/OfferView';
import OrderList from './pages/orders/OrderList';
import OrderView from './pages/orders/OrderView';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceView from './pages/invoices/InvoiceView';
import ActivityList from './pages/activities/ActivityList';
import Leads from './pages/leads/Leads';
import Reports from './pages/reports/Reports';
import SalesReport from './pages/reports/SalesReport';
import LeadsReport from './pages/reports/LeadsReport';
import OfferReport from './pages/reports/OfferReport';
import InvoiceReport from './pages/reports/InvoiceReport';
import ActivityReport from './pages/reports/ActivityReport';
import Proposals from './pages/proposals/Proposals';
import Customers from './pages/customers/Customers';
import CustomerCreate from './pages/customers/CustomerCreate';
import CustomerView from './pages/customers/CustomerView';
import Analytics from './pages/Analytics';
import Calendar from './pages/activities/Calendar';
import AutomationRules from './pages/settings/AutomationRules';
import LeadView from './pages/leads/LeadView';
import LeadCreate from './pages/leads/LeadCreate';
import InvoiceCreate from './pages/payment/InvoiceCreate';
import ProjectReport from './pages/reports/ProjectReport';
import TimesheetsReport from './pages/reports/TimesheetsReport';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;

    // Flexible role detection
    const getRoleName = (r) => {
        if (!r) return 'Admin'; // Default to Admin if no role
        if (typeof r === 'string') return r;
        if (typeof r === 'object' && r.name) return r.name;
        return 'Admin';
    };
    const roleName = getRoleName(user?.role).toLowerCase();
    const isAdmin = roleName === 'admin' || roleName === 'administrateur';

    return isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="offers" element={<OfferList />} />
                <Route path="offers/create" element={<OfferCreate />} />
                <Route path="offers/view/:id" element={<OfferView />} />
                <Route path="offers/edit/:id" element={<OfferCreate />} />

                <Route path="orders" element={<OrderList />} />
                <Route path="orders/view/:id" element={<OrderView />} />

                <Route path="invoices" element={<InvoiceList />} />
                <Route path="invoices/view/:id" element={<InvoiceView />} />

                <Route path="proposals" element={<Proposals />} />

                <Route path="reports" element={<Reports />} />
                <Route path="reports/sales" element={<SalesReport />} />
                <Route path="reports/leads" element={<LeadsReport />} />
                <Route path="reports/offers" element={<OfferReport />} />
                <Route path="reports/invoices" element={<InvoiceReport />} />
                <Route path="reports/activities" element={<ActivityReport />} />
                <Route path="reports/projects" element={<ProjectReport />} />
                <Route path="reports/timesheets" element={<TimesheetsReport />} />

                <Route path="contacts" element={<ContactList />} />
                <Route path="contacts/create" element={<ContactForm />} />
                <Route path="contacts/edit/:id" element={<ContactForm />} />

                <Route path="customers" element={<Customers />} />
                <Route path="customers/create" element={<CustomerCreate />} />
                <Route path="customers/view/:id" element={<CustomerView />} />
                <Route path="customers/edit/:id" element={<CustomerCreate />} />

                <Route path="articles" element={<ArticleList />} />
                <Route path="articles/create" element={<ArticleForm />} />
                <Route path="articles/edit/:id" element={<ArticleForm />} />

                <Route path="activities" element={<ActivityList />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="leads" element={<Leads />} />
                <Route path="leads/create" element={<LeadCreate />} />
                <Route path="leads/view/:id" element={<LeadView />} />
                <Route path="leads/edit/:id" element={<LeadCreate />} />

                <Route path="analytics" element={<Analytics />} />
                <Route path="automations" element={<AutomationRules />} />

                <Route path="invoices/create" element={<InvoiceCreate />} />

                {/* Admin & Settings */}
                <Route path="users" element={<AdminRoute><UserList /></AdminRoute>} />
                <Route path="roles" element={<AdminRoute><RoleList /></AdminRoute>} />
                <Route path="permissions" element={<AdminRoute><PermissionList /></AdminRoute>} />
                <Route path="typeactivities" element={<AdminRoute><CRMConfigModule type="activityTypes" title="Types d'Activités" description="Gérez les catégories d'interactions commerciales." icon="Activity" /></AdminRoute>} />
                <Route path="statuses" element={<AdminRoute><CRMConfigModule type="offerStatuses" title="Statuts Offres / Ordres" description="Définissez le cycle de vie de vos devis et commandes." icon="FileText" /></AdminRoute>} />
                <Route path="typeoffers" element={<AdminRoute><CRMConfigModule type="offerTypes" title="Types d'Offres" description="Catégorisez vos propositions commerciales." icon="Tag" /></AdminRoute>} />

                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
