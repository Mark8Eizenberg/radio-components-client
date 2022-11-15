import AdminPanel from '../components/AdminPanel'
import OperationReport from '../components/OperationReport'
import RadioComponents from '../components/RadioComponents'
import Home from '../components/Home'

const userRoles = [
    { id: 1, role: "Admin" },
    { id: 2, role: "User" },
    { id: 3, role: "Viewer" }
];

const userRolesName = {
    1: "Admin",
    2: "User",
    3: "Viewer"
}

export const userRolesLinks = {
    1: [
        { name: 'Головна', link:'/', element: <Home/>  }, 
        { name: 'Звіти', link: '/reports' , element: <OperationReport/> }, 
        { name: 'Керування аккаунтами', link: '/admin-panel', element: <AdminPanel/> },
        { name: 'Редагування компонентів', link: '/radiocomponents-editor', element: <RadioComponents/>},
    ],
    2: [
        { name: 'Головна', link:'/', element: <Home/>  }, 
        { name: 'Звіти', link: '/reports' , element: <OperationReport/> }, 
        { name: 'Редагування компонентів', link: '/radiocomponents-editor', element: <RadioComponents/>},
    ],
    3: [
        { name: 'Головна', link:'/', element: <Home/>  }, 
        { name: 'Звіти', link: '/reports' , element: <OperationReport/> }, 
    ],
}

export function getUserRoleName(id){
    return userRolesName[id] ?? "Unknown";
}

export default userRoles;