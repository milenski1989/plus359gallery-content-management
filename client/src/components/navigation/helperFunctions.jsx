
export const handleLogout = (navigate) => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  navigate('/login');
};