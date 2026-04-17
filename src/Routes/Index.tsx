import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/constants/navbar';
import Ads from '../pages/Ads';
import Footer from '../components/constants/footer';
import Users from '../pages/Users';
import Categories from '../pages/Categories';
import NewSubcategory from '../pages/NewSubcategory';
import NewCategory from '../pages/NewCategory';
import { ToastContainer } from 'react-toastify';
import NotFoundPage from '../pages/404';
import AdDetail from '../pages/AdDetail';
import Register from '../pages/Register';
import LoginPage from '../pages/Loginpage';
import SingleUser from '../pages/SingleUser';
import Messages from '../pages/messages';
import Packages from '../pages/packages';
import Notifications from '../pages/notifications';
import PrivateRoute from '../components/Private';
import MainAds from '../pages/MainAds';
import InquiriesPage from '../pages/Inquiries';
import MainAdPage from '../pages/Main';
import DashboardPage from '../pages/dashboardPage';
import EditSubcategoryPage from '../pages/EditSubcategories';
import EditCategoryPage from '../pages/EditCategoryPage';
import MarketplaceDashboard from '../pages/MarketplaceDashboard';
import VendorsPage from '../pages/VendorsPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
import AdminReviewsPage from '../pages/AdminReviewsPage';
import AdminPackagesPage from '../pages/AdminPackagesPage';
import AdminLocationsPage from '../pages/AdminLocationsPage';
import AdminInvoicesPage from '../pages/AdminInvoicesPage';
import AdminUsersPage from '../pages/AdminUsersPage';
// import MainAd from '../components/MainAd';

const Index = () => {
    return (
        <div className="">
            {/* <Navbar
                SetShowLogin={function (): void {
                    throw new Error('Function not implemented.');
                }}
                SetShowAdsForm={function (): void {
                    throw new Error('Function not implemented.');
                }}
            /> */}

            <Navbar />
            <div className="id" id="root">
                <Routes>
                    <Route
                        path="/ads"
                        element={
                            <PrivateRoute>
                                <Ads />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <PrivateRoute>
                                <Users />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/inquiries"
                        element={
                            <PrivateRoute>
                                <InquiriesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/main_ads"
                        element={
                            <PrivateRoute>
                                <MainAds />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <PrivateRoute>
                                <Categories />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/new-category"
                        element={
                            <PrivateRoute>
                                <NewCategory />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/subcategories/:id"
                        element={
                            <PrivateRoute>
                                <EditSubcategoryPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/categories/:id"
                        element={
                            <PrivateRoute>
                                <EditCategoryPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <PrivateRoute>
                                <Messages />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <PrivateRoute>
                                <Notifications />
                            </PrivateRoute>
                        }
                    />
                    NewCategory
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/packages" element={<PrivateRoute>{<Packages />}</PrivateRoute>} />
                    <Route path="/marketplace" element={<PrivateRoute><MarketplaceDashboard /></PrivateRoute>} />
                    <Route path="/vendors" element={<PrivateRoute><VendorsPage /></PrivateRoute>} />
                    <Route path="/admin-products" element={<PrivateRoute><AdminProductsPage /></PrivateRoute>} />
                    <Route path="/orders" element={<PrivateRoute><AdminOrdersPage /></PrivateRoute>} />
                    <Route path="/reviews" element={<PrivateRoute><AdminReviewsPage /></PrivateRoute>} />
                    <Route path="/admin-packages" element={<PrivateRoute><AdminPackagesPage /></PrivateRoute>} />
                    <Route path="/locations" element={<PrivateRoute><AdminLocationsPage /></PrivateRoute>} />
                    <Route path="/invoices" element={<PrivateRoute><AdminInvoicesPage /></PrivateRoute>} />
                    <Route path="/all-users" element={<PrivateRoute><AdminUsersPage /></PrivateRoute>} />
                    <Route
                        path="/new-subcategory"
                        element={
                            <PrivateRoute>
                                <NewSubcategory />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/details/:id"
                        element={
                            <PrivateRoute>
                                <AdDetail />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users/:id"
                        element={
                            <PrivateRoute>
                                <SingleUser />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/main/:id"
                        element={
                            <PrivateRoute>
                                <MainAdPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <PrivateRoute>
                                <NotFoundPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/register"
                        element={
                            <PrivateRoute>
                                <Register />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
            <ToastContainer position="top-center" />

            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Index;
