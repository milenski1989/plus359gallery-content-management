interface LoginBody {
    email: string;
    password: string;
}

interface SignupBody {
    email: string,
    password: string
    userName: string
}

export {
    LoginBody,
    SignupBody
}