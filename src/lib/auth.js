export function logout() {
    localStorage.removeItem('farmbe_role');
    localStorage.removeItem('farmbe_user');
    window.location.href = '/';
}

export function isAuthenticated() {
    return !!localStorage.getItem('farmbe_role') && !!localStorage.getItem('farmbe_user');
}
