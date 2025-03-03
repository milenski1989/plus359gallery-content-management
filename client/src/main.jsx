import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
const Login = lazy(() => import('./components/authentication/Login.jsx'))
const HomePage = lazy(() => import('./components/home/HomePage.jsx'))
const Upload = lazy(() => import('./components/upload/Upload.jsx'))
const PdfMaker = lazy(() => import('./components/pdf/PdfMaker.jsx'))
const AdminPanel = lazy(() => import('./components/admin panel/AdminPanel.jsx'))
const StoragesManagement = lazy(() => import('./components/admin panel/StoragesManagement.jsx'))
const Account = lazy(() => import('./components/account/Account.jsx'))
const EditPage = lazy(() => import('./components/EditPage.jsx'))
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { ThemeProvider, createTheme } from '@mui/material'
import { EntriesProvider } from './components/contexts/EntriesContext.jsx';
import App from './App.jsx';
import NavigationLayout from './components/navigation/NavigationLayout.jsx';
import GalleryContent from './components/gallery/GalleryContent.jsx';
import './index.css';


const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '0.5rem 1.2rem',
                    textTransform: 'capitalize',
                    fontSize: '1rem',
                },
            },
        },
        MuiMasonry: {
            styleOverrides: {
                root: {
                    margin: 0
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                listbox: {
                    backgroundColor: '#FFFFFF',
                    '& .MuiAutocomplete-option': {
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: '#E0E0E0',
                            color: '#FFFFFF',
                        },
                    },
                    '& .MuiAutocomplete-option[aria-selected="true"]': {
                        backgroundColor: '#40C7F3',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#40C7F3',
                            color: '#FFFFFF',
                        },
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#E0E0E0',
                        color: '#FFFFFF',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#40C7F3',
                        color: '#FFFFFF',
                    },
                },
            },
        },
    },
});


const routes  = [
    {path: '/', element: <Suspense fallback=''><HomePage/></Suspense>},
    {path: '/upload', element: <Suspense fallback=''><Upload/></Suspense>},
    {path: '/gallery/:name', element: <Suspense fallback=''><GalleryContent/></Suspense>},
    {path: '/pdf', element: <Suspense fallback=''><PdfMaker/></Suspense>},
    {path: '/admin-panel', element: <Suspense fallback=''><AdminPanel/></Suspense>},
    {path: '/storages-management', element: <Suspense fallback=''><StoragesManagement/></Suspense>},
    {path: '/account', element: <Suspense fallback=''><Account/></Suspense>},
    {path: '/edit-page', element: <Suspense fallback=''><EditPage/></Suspense>}  
]

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<App/>}>
                <Route exact path="/login" element={<Suspense fallback=''><Login/></Suspense>} />
                <Route element={<NavigationLayout/>}>
                    <Route element={<ProtectedRoute/>}>
                        {routes.map(({path, element, children}) => (
                            <Route key={path} path={path} element={element}> 
                                { children?.map(({path, element}, index) => (
                                    <Route key={index} path={path} element={element} />
                                ))}
                            </Route>
                        ))}
                    </Route>
                </Route>
              
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/logout" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<p className='flex justify-center mt-'>Page not found: 404!</p>} />
            </Route>
        </Route>
    )
)

root.render(
    <ThemeProvider theme={theme}>
        <EntriesProvider>
            <RouterProvider router={router}/> 
        </EntriesProvider>
    </ThemeProvider>
);


