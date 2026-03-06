import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - User
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminFoods from './pages/admin/AdminFoods';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* User Routes */}
                        <Route path="/" element={<UserLayout />}>
                            <Route index element={<Home />} />
                            <Route path="restaurant/:id" element={<RestaurantDetails />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="orders" element={<Orders />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="restaurants" element={<AdminRestaurants />} />
                            <Route path="restaurants/:id/foods" element={<AdminFoods />} />
                            <Route path="orders" element={<AdminOrders />} />
                        </Route>

                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
