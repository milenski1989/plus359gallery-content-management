import TabsWrapper from '../reusable/TabsWrapper'
import StoragesManagement from './StoragesManagement'
import UsersManagement from './UsersManagement'
function AdminPanel() {
     
  return <>
    <TabsWrapper 
      labels={['Storages', 'Users']}
      components={[StoragesManagement, UsersManagement]}
    /> 
  </>
}

export default AdminPanel