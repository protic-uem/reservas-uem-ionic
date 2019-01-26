export const createNewToken = (email:string, senha:string) => 
{
   return {
        "query": `mutation createNewToken($email: String!, $senha: String!) {
                    createToken(email: $email, senha: $senha) { 
                        token
                    }
                    }`,
        "variables": {
        "email": email,
        "senha": senha
        }
    }
};

export const deleteToken = () => 
{
   return {
        "query": `mutation deleteToken() {
                    deleteToken() { 
                        token
                    }
                    }`
    }
};