import './Account.css';

const Account = () => {

    let myStorage = window.localStorage
    let user = JSON.parse(myStorage.getItem('user'))

    return (
        <>
            <section className="account-main-section">
                <div>
                    <div>
                        <h3>Username: {user.userName}</h3>
                        <h3>Email: {user.email}</h3>
                        <h3>{`This user ${user.superUser ? 'has' : 'doesnt have'} super user rights. ${!user.superUser ? 'Please, contact administrator' : ''}`}</h3>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Account;
