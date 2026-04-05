// Central auth hook — reads token, role, name from localStorage
const useAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || 'customer';
    const name = localStorage.getItem('name') || 'User';
    const isAuthenticated = !!token;

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        window.location.href = '/login';
    };

    return { token, role, name, isAuthenticated, logout };
};

export default useAuth;
