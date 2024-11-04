import AddNewUser from './AddNewUser';
import DeleteUsers from './DeleteUsers';
import TabsWrapper from '../reusable/TabsWrapper';

function UsersManagement() {
  
    return <>
        <TabsWrapper 
            labels={['Add A New User', 'Delete Users']}
            components={[AddNewUser, DeleteUsers]}
        />
    </>
    
}

export default UsersManagement